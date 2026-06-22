'use client';

import { useState, useEffect, useRef } from 'react';
import { db, storage, auth } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, getDoc, setDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 
  const [activeTab, setActiveTab] = useState('company'); 

  // 1. 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  // 2. 로그인 함수
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('로그인 실패! 이메일이나 비밀번호를 확인해주세요.');
    }
  };

  // 3. 로그아웃 함수
  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await signOut(auth);
    }
  };

  if (loading) return <div style={{ height: '100vh', backgroundColor: '#0F172A' }}></div>;

  if (!user) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#FFF', fontFamily: "'Noto Sans KR', sans-serif" }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#FF9000' }}>🔒 관리자 보안 접속</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
          <input 
            type="email" 
            placeholder="관리자 이메일 (예: admin@...)" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={loginInputStyle}
            required
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={loginInputStyle}
            required
          />
          <button type="submit" style={{ padding: '15px', backgroundColor: '#FF9000', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: '#F5F5F5' }}>
      {/* 사이드바 메뉴 */}
      <div style={{ width: '250px', backgroundColor: '#333', color: '#FFF', padding: '30px 20px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '40px', color: '#FF9000' }}>관리자 센터</h1>
        <MenuButton label="메인 페이지 설정" active={activeTab === 'main_config'} onClick={() => setActiveTab('main_config')} />
        <MenuButton label="업체 등록/관리" active={activeTab === 'company'} onClick={() => setActiveTab('company')} />
        <MenuButton label="배너 이미지 관리" active={activeTab === 'banner'} onClick={() => setActiveTab('banner')} />
        <MenuButton label="공지/방법 관리" active={activeTab === 'write'} onClick={() => setActiveTab('write')} />
        <MenuButton label="이용후기 관리" active={activeTab === 'review'} onClick={() => setActiveTab('review')} />
        
        <div style={{ marginTop: 'auto', borderTop: '1px solid #555', paddingTop: '20px' }}>
          <div style={{ fontSize: '12px', color: '#CCC', marginBottom: '10px' }}>{user.email}님 접속중</div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', backgroundColor: '#FF4444', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>로그아웃</button>
        </div>
      </div>
      
      {/* 메인 컨텐츠 영역 */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'main_config' && <MainConfigManager />}
        {activeTab === 'company' && <CompanyManager />}
        {activeTab === 'banner' && <BannerManager />}
        {activeTab === 'write' && <PostManager />} 
        {activeTab === 'review' && <ReviewManager />}
      </div>
    </div>
  );
}

const loginInputStyle = { padding: '15px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#FFF', outline: 'none', fontSize: '16px' };

function MenuButton({ label, active, onClick }: any) {
  return (
    <div onClick={onClick} style={{ padding: '15px', marginBottom: '10px', backgroundColor: active ? '#FF9000' : 'transparent', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s', color: active ? '#000' : '#FFF' }}>{label}</div>
  );
}

// 1. 메인 페이지 설정
function MainConfigManager() {
  const [statusText, setStatusText] = useState('');
  const [qnaList, setQnaList] = useState<{question: string, answer: string}[]>([]);
  const [newQ, setNewQ] = useState({ question: '', answer: '' });

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    const docRef = doc(db, 'site_config', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.statusMessages) setStatusText(data.statusMessages.join('\n'));
      if (data.qna) setQnaList(data.qna);
    }
  };

  const saveStatus = async () => {
    const messages = statusText.split('\n').filter(t => t.trim() !== '');
    await setDoc(doc(db, 'site_config', 'main'), { statusMessages: messages }, { merge: true });
    alert('실시간 상태 바 저장 완료!');
  };

  const addQna = async () => {
    if (!newQ.question || !newQ.answer) return;
    const updated = [...qnaList, newQ];
    setQnaList(updated);
    await setDoc(doc(db, 'site_config', 'main'), { qna: updated }, { merge: true });
    setNewQ({ question: '', answer: '' });
  };

  const deleteQna = async (index: number) => {
    const updated = qnaList.filter((_, i) => i !== index);
    setQnaList(updated);
    await setDoc(doc(db, 'site_config', 'main'), { qna: updated }, { merge: true });
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>메인 페이지 설정</h2>
      <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
        <h3>상단 실시간 운영 바 (한 줄에 하나씩 입력)</h3>
        <textarea value={statusText} onChange={e => setStatusText(e.target.value)} style={{ width: '100%', height: '150px', padding: '10px', borderRadius: '5px', border: '1px solid #DDD', marginBottom: '10px' }} placeholder="예: [실시간] 루나 서버 500억 매입 완료" />
        <button onClick={saveStatus} style={btnStyle}>저장하기</button>
      </div>
      <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '15px' }}>
        <h3>하단 Q&A 관리</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input placeholder="질문 (Q)" value={newQ.question} onChange={e => setNewQ({...newQ, question: e.target.value})} style={{ ...inputStyle, flex: 1 }} />
          <input placeholder="답변 (A)" value={newQ.answer} onChange={e => setNewQ({...newQ, answer: e.target.value})} style={{ ...inputStyle, flex: 2 }} />
          <button onClick={addQna} style={{ ...btnStyle, width: '100px', padding: '10px' }}>추가</button>
        </div>
        {qnaList.map((q, i) => (
          <div key={i} style={{ borderBottom: '1px solid #EEE', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontWeight: 'bold', color: '#FF9000' }}>Q. {q.question}</div><div>A. {q.answer}</div></div>
            <button onClick={() => deleteQna(i)} style={{ backgroundColor: '#FF4444', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. 업체 관리
function CompanyManager() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [kakaoUrl, setKakaoUrl] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const fetchItems = async () => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setName(''); setDesc(''); setKakaoUrl(''); setIsPremium(false);
    setEditId(null); setEditImageUrl('');
    formRef.current?.reset();
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setName(item.name || '');
    setDesc(item.desc || '');
    setKakaoUrl(item.kakaoUrl || '');
    setIsPremium(item.isPremium || false);
    setEditImageUrl(item.imageUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !desc) return alert("업체명과 설명을 입력해주세요.");
    setLoading(true);
    try {
      const file = e.target.image.files[0];
      let imageUrl = editImageUrl;
      if (file) {
        const imgRef = ref(storage, `companies/${Date.now()}`);
        await uploadBytes(imgRef, file);
        imageUrl = await getDownloadURL(imgRef);
      }
      if (editId) {
        if (!imageUrl) return alert("이미지가 필요합니다.");
        await setDoc(doc(db, 'items', editId), { name, price: desc, desc, kakaoUrl, imageUrl, isPremium }, { merge: true });
        alert("수정 완료!");
      } else {
        if (!file) return alert("이미지를 선택해주세요.");
        await addDoc(collection(db, 'items'), { name, price: desc, desc, kakaoUrl, imageUrl, isPremium, createdAt: serverTimestamp() });
        alert("등록 완료!");
      }
      resetForm(); fetchItems();
    } catch (err) { alert(editId ? "수정 실패" : "등록 실패"); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("삭제하시겠습니까?")) { await deleteDoc(doc(db, 'items', id)); fetchItems(); }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>업체 등록 및 관리</h2>
      <form ref={formRef} onSubmit={handleSubmit} style={{ backgroundColor: editId ? '#FFF8EE' : '#FFF', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: editId ? '2px solid #FF9000' : 'none' }}>
        {editId && (
          <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#FF9000', fontSize: '16px' }}>
            ✏️ 수정 모드 — {name}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input placeholder="업체명" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <input placeholder="설명/가격" value={desc} onChange={e => setDesc(e.target.value)} style={inputStyle} />
          <input placeholder="카톡 링크" value={kakaoUrl} onChange={e => setKakaoUrl(e.target.value)} style={inputStyle} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} /> 프리미엄 등록</label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          {editId && editImageUrl && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '5px' }}>현재 이미지 (새 파일 선택 시 교체됨)</div>
              <img src={editImageUrl} alt="현재 이미지" style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>
          )}
          <input type="file" name="image" accept="image/*" />
          <div style={{ marginTop: '10px', fontSize: '13px', fontWeight: 'bold' }}>
            {isPremium ? (
              <span style={{ color: '#FF9000' }}>📢 프리미엄 권장 사이즈: 760 x 360 px (약 2:1 비율)</span>
            ) : (
              <span style={{ color: '#555' }}>📢 일반 업체 권장 사이즈: 500 x 280 px (세로형)</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} style={{...btnStyle, marginTop:'15px'}}>
            {loading ? (editId ? "수정 중..." : "등록 중...") : (editId ? "✅ 수정하기" : "등록하기")}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} style={{...btnStyle, marginTop:'15px', backgroundColor:'#888', width:'120px', fontSize:'15px'}}>취소</button>
          )}
        </div>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {items.map(item => (
          <div key={item.id} style={{ backgroundColor: '#FFF', padding: '15px', borderRadius: '10px', border: editId === item.id ? '2px solid #FF9000' : '1px solid #DDD' }}>
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />}
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.isPremium ? '⭐ ' : ''}{item.name}</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>{item.desc}</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleEdit(item)} style={{ flex: 1, padding: '5px 0', backgroundColor: '#FF9000', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>수정</button>
              <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '5px 0', backgroundColor: '#FF4444', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. 배너 관리
function BannerManager() {
  const handleBannerUpdate = async (e: any, type: string) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      let docId = '';
      if (type === '홈 (메인)') docId = 'home_main';
      else if (type === '공지사항') docId = 'notice_main';
      else if (type === '거래방법') docId = 'howto_main';
      else if (type === '이용후기') docId = 'review_main';
      
      const imgRef = ref(storage, `banners/${docId}_${Date.now()}`);
      await uploadBytes(imgRef, file);
      const imageUrl = await getDownloadURL(imgRef);

      await setDoc(doc(db, 'banners', docId), { 
        type, 
        imageUrl, 
        createdAt: serverTimestamp() 
      });

      alert(`${type} 배너가 성공적으로 변경되었습니다!`);
    } catch (err) { 
      console.error(err);
      alert("업로드 실패"); 
    }
  };
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>배너 관리</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {['홈 (메인)', '공지사항', '거래방법', '이용후기'].map((menu, idx) => (
          <div key={idx} style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '15px' }}>
            <h3>{menu} 배너</h3>
            <p style={{ fontSize: '12px', color: '#FF9000', marginBottom: '10px' }}>
              {menu.includes('홈') ? '💡 권장: 1200 x 320 px (PC)' : '💡 권장: 1200 x 300 px (서브)'}
            </p>
            <input type="file" onChange={(e) => handleBannerUpdate(e, menu)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. 게시글 관리
function PostManager() {
  const [activeCollection, setActiveCollection] = useState('notices');
  const [noticeCategory, setNoticeCategory] = useState('공지사항'); 
  const [howtoCategory, setHowtoCategory] = useState('거래 방법');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchPosts = async () => {
    const q = query(collection(db, activeCollection), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { fetchPosts(); }, [activeCollection]);

  const handleImageInsert = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const imgRef = ref(storage, `${activeCollection}/${Date.now()}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      // ★ 여기가 수정되었습니다! (alt 추가됨)
      const imgTag = `\n<img src="${url}" alt="메이플스토리 정보 이미지" style="width: 100%; max-width: 800px; margin: 10px 0; border-radius: 10px;" />\n`;
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        setContent(content.substring(0, start) + imgTag + content.substring(end));
      } else { setContent(prev => prev + imgTag); }
    } catch (err) { alert("사진 실패"); }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!title || !content) return alert("내용을 입력하세요.");
    if (confirm("등록하시겠습니까?")) {
      setLoading(true);
      const finalCategory = activeCollection === 'notices' ? noticeCategory : howtoCategory;
      await addDoc(collection(db, activeCollection), {
        title, content, category: finalCategory, 
        isPinned: activeCollection === 'notices' ? isPinned : false,
        createdAt: serverTimestamp()
      });
      alert("등록 완료!"); setTitle(''); setContent(''); setIsPinned(false); fetchPosts(); setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm("삭제하시겠습니까?")) { await deleteDoc(doc(db, activeCollection, id)); fetchPosts(); }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>게시글 관리</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveCollection('notices')} style={tabStyle(activeCollection === 'notices')}>📢 공지사항 관리</button>
        <button onClick={() => setActiveCollection('howto')} style={tabStyle(activeCollection === 'howto')}>📘 거래방법 관리</button>
      </div>

      <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '15px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>새 글 작성</h3>
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>카테고리:</span>
            {activeCollection === 'notices' ? (
              <select value={noticeCategory} onChange={(e) => setNoticeCategory(e.target.value)} style={selectStyle}>
                <option value="공지사항">공지사항</option>
                <option value="메이플 패치">메이플 패치</option>
                <option value="이벤트">이벤트</option>
                <option value="시세측정 기준">시세측정 기준</option>
              </select>
            ) : (
              <select value={howtoCategory} onChange={(e) => setHowtoCategory(e.target.value)} style={selectStyle}>
                <option value="거래 방법">거래 방법</option>
                <option value="거래 주의 사항">거래 주의 사항</option>
              </select>
            )}
          </div>
          {activeCollection === 'notices' && (
             <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'bold', color: '#FF9000' }}>
               <input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} /> 📌 상단 고정
             </label>
          )}
        </div>
        <div style={{ marginBottom: '15px' }}><input placeholder="제목" value={title} onChange={e => setTitle(e.target.value)} style={{ ...inputStyle, width: '100%' }} /></div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ backgroundColor: '#FF9000', color: '#FFF', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
            📷 사진 추가 <input type="file" hidden onChange={handleImageInsert} />
          </label>
          {loading && <span> 업로드 중...</span>}
        </div>
        <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} placeholder="내용 작성" style={{ width: '100%', height: '400px', padding: '20px', border: '1px solid #DDD' }} />
        <button onClick={handleSubmit} style={{ ...btnStyle, marginTop: '20px' }}>등록하기</button>
      </div>

      <h3>등록된 글 목록</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#FFF', padding: '15px', borderRadius: '10px', border: '1px solid #DDD' }}>
            <div>{post.isPinned && '📌'} <span style={{color:'#FF9000', fontWeight:'bold'}}>[{post.category}]</span> {post.title}</div>
            <button onClick={() => handleDelete(post.id)} style={{ backgroundColor: '#FF4444', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. 후기 관리
function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);
  const fetchReviews = async () => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setReviews(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { fetchReviews(); }, []);
  const handleDelete = async (id: string) => {
    if (confirm("삭제?")) { await deleteDoc(doc(db, 'reviews', id)); fetchReviews(); }
  };
  return (
    <div>
      <h3>이용후기 관리</h3>
      {reviews.map((r) => (
        <div key={r.id} style={{ padding: '15px', borderBottom: '1px solid #EEE', backgroundColor: '#FFF', marginBottom:'5px' }}>
          <b>{r.title}</b> ({r.author}) <button onClick={() => handleDelete(r.id)} style={{ float:'right', backgroundColor: '#FF4444', color: '#FFF', border:'none', padding:'3px 10px' }}>삭제</button>
        </div>
      ))}
    </div>
  );
}

const inputStyle = { padding: '12px', border: '1px solid #DDD', borderRadius: '8px', outline: 'none' };
const selectStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #DDD', width: '200px' };
const btnStyle = { width: '100%', padding: '15px', backgroundColor: '#FF9000', color: '#FFF', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' };
const tabStyle = (isActive: boolean) => ({ padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: isActive ? '#333' : '#E0E0E0', color: isActive ? '#FFF' : '#333' });