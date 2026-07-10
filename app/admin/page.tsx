'use client';

import { useState, useEffect, useRef } from 'react';
import { db, storage, auth } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, getDoc, setDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { marked } from 'marked';

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
  const [kakaoUrl, setKakaoUrl] = useState('');
  const [currentKakaoUrl, setCurrentKakaoUrl] = useState('');

  useEffect(() => {
    const fetchBannerData = async () => {
      const docSnap = await getDoc(doc(db, 'banners', 'home_main'));
      if (docSnap.exists()) {
        setCurrentKakaoUrl(docSnap.data().kakaoUrl || '');
        setKakaoUrl(docSnap.data().kakaoUrl || '');
      }
    };
    fetchBannerData();
  }, []);

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

      const updateData: any = {
        type,
        imageUrl,
        createdAt: serverTimestamp()
      };

      if (docId === 'home_main' && kakaoUrl) {
        updateData.kakaoUrl = kakaoUrl;
      }

      await setDoc(doc(db, 'banners', docId), updateData, { merge: true });

      alert(`${type} 배너가 성공적으로 변경되었습니다!`);
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    }
  };

  const updateKakaoLink = async () => {
    try {
      await setDoc(doc(db, 'banners', 'home_main'), { kakaoUrl }, { merge: true });
      setCurrentKakaoUrl(kakaoUrl);
      alert('카카오톡 링크가 업데이트되었습니다!');
    } catch (err) {
      alert('업데이트 실패');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>배너 관리</h2>

      {/* 메인 배너 카카오톡 링크 설정 */}
      <div style={{ backgroundColor: '#FFF8EE', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '2px solid #FF9000' }}>
        <h3 style={{ marginBottom: '15px', color: '#FF9000' }}>💬 메인 배너 카카오톡 링크 설정</h3>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>메인 대문의 "카톡 문의하기" 버튼에 연결될 카카오톡 링크를 설정하세요.</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="예: https://open.kakao.com/o/..."
            value={kakaoUrl}
            onChange={(e) => setKakaoUrl(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={updateKakaoLink} style={{ padding: '12px 24px', backgroundColor: '#FF9000', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            저장
          </button>
        </div>
        {currentKakaoUrl && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            현재 링크: <a href={currentKakaoUrl} target="_blank" style={{ color: '#FF9000' }}>{currentKakaoUrl}</a>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {['홈 (메인)', '공지사항', '거래방법', '이용후기'].map((menu, idx) => (
          <div key={idx} style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '15px' }}>
            <h3>{menu} 배너</h3>
            <p style={{ fontSize: '12px', color: '#FF9000', marginBottom: '10px' }}>
              {menu.includes('홈') ? '💡 권장: 1500 x 400 px (PC)' : '💡 권장: 1200 x 300 px (서브)'}
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
  const [editId, setEditId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (formatType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = '';

    switch (formatType) {
      case 'bold':
        formattedText = `<strong>${selectedText || '굵게'}</strong>`;
        break;
      case 'color-red':
        formattedText = `<span style="color: #FF0000;">${selectedText || '빨간색 텍스트'}</span>`;
        break;
      case 'color-blue':
        formattedText = `<span style="color: #0066FF;">${selectedText || '파란색 텍스트'}</span>`;
        break;
      case 'color-orange':
        formattedText = `<span style="color: #FF9000;">${selectedText || '주황색 텍스트'}</span>`;
        break;
      case 'size-large':
        formattedText = `<span style="font-size: 20px; font-weight: bold;">${selectedText || '큰 글씨'}</span>`;
        break;
      case 'size-xlarge':
        formattedText = `<span style="font-size: 24px; font-weight: bold;">${selectedText || '아주 큰 글씨'}</span>`;
        break;
      case 'highlight':
        formattedText = `<span style="background-color: #FEE500; padding: 2px 6px; border-radius: 3px; font-weight: bold;">${selectedText || '강조 텍스트'}</span>`;
        break;
      case 'table':
        formattedText = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
  <thead>
    <tr style="background: #F1F5F9;">
      <th style="border: 1px solid #CBD5E1; padding: 12px; text-align: left; font-weight: 700;">헤더1</th>
      <th style="border: 1px solid #CBD5E1; padding: 12px; text-align: left; font-weight: 700;">헤더2</th>
      <th style="border: 1px solid #CBD5E1; padding: 12px; text-align: left; font-weight: 700;">헤더3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용1</td>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용2</td>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용3</td>
    </tr>
    <tr>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용4</td>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용5</td>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용6</td>
    </tr>
  </tbody>
</table>`;
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

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
      const imgTag = `\n<img src="${url}" alt="메이플스토리 정보 이미지" style="width: 100%; max-width: 800px; margin: 10px 0; border-radius: 10px;" />\n`;
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        setContent(content.substring(0, start) + imgTag + content.substring(end));
      } else { setContent(prev => prev + imgTag); }
      alert("사진 업로드 완료!");
    } catch (err: any) {
      console.error("이미지 업로드 오류:", err);
      const errorMsg = err?.message || err?.toString() || "알 수 없는 오류";
      alert(`사진 업로드 실패: ${errorMsg}`);
    }
    setLoading(false);
    e.target.value = '';
  };

  const handleVideoInsert = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 체크 (50MB 제한)
    if (file.size > 50 * 1024 * 1024) {
      alert("동영상 크기는 50MB 이하로 제한됩니다.");
      return;
    }

    setLoading(true);
    try {
      const videoRef = ref(storage, `${activeCollection}/videos/${Date.now()}_${file.name}`);
      await uploadBytes(videoRef, file);
      const url = await getDownloadURL(videoRef);
      const videoTag = `\n<video autoplay muted loop playsinline controls src="${url}" style="width: 100%; max-width: 800px; margin: 10px 0; border-radius: 10px;"></video>\n`;
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        setContent(content.substring(0, start) + videoTag + content.substring(end));
      } else { setContent(prev => prev + videoTag); }
      alert("동영상 업로드 완료!");
    } catch (err: any) {
      console.error("동영상 업로드 오류:", err);
      const errorMsg = err?.message || err?.toString() || "알 수 없는 오류";
      alert(`동영상 업로드 실패: ${errorMsg}`);
    }
    setLoading(false);
    e.target.value = '';
  };

  const handleEdit = (post: any) => {
    setEditId(post.id);
    setTitle(post.title);

    // 원본(content_raw)이 있으면 원본을, 없으면 HTML을 불러옴
    if (post.content_raw) {
      setContent(post.content_raw);
    } else {
      // 기존 글은 원본이 없으므로 HTML을 텍스트로 변환
      let editContent = post.content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>\s*<p>/gi, '\n\n')
        .replace(/<p>/gi, '')
        .replace(/<\/p>/gi, '\n')
        .replace(/\n\n\n+/g, '\n\n') // 3개 이상 연속 줄바꿈을 2개로
        .trim();
      setContent(editContent);
    }

    if (activeCollection === 'notices') {
      setNoticeCategory(post.category || '공지사항');
      setIsPinned(post.isPinned || false);
    } else {
      setHowtoCategory(post.category || '거래 방법');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setContent('');
    setIsPinned(false);
    setNoticeCategory('공지사항');
    setHowtoCategory('거래 방법');
  };

  const handleSubmit = async () => {
    if (!title || !content) return alert("내용을 입력하세요.");
    const confirmMsg = editId ? "수정하시겠습니까?" : "등록하시겠습니까?";
    if (confirm(confirmMsg)) {
      setLoading(true);

      // 마크다운 변환
      let htmlContent = marked.parse(content) as string;

      // 표 주변 불필요한 공백 제거
      htmlContent = htmlContent
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<br>\s*<table/g, '<table')
        .replace(/<\/table>\s*<br>/g, '</table>')
        .trim();

      const finalCategory = activeCollection === 'notices' ? noticeCategory : howtoCategory;
      const postData = {
        title,
        content: htmlContent,
        content_raw: content, // 원본도 함께 저장
        category: finalCategory,
        isPinned: activeCollection === 'notices' ? isPinned : false,
      };

      try {
        if (editId) {
          await setDoc(doc(db, activeCollection, editId), postData, { merge: true });
          alert("수정 완료!");
        } else {
          await addDoc(collection(db, activeCollection), {
            ...postData,
            createdAt: serverTimestamp()
          });
          alert("등록 완료!");
        }
        resetForm();
        fetchPosts();
      } catch (err: any) {
        console.error("게시글 저장 오류:", err);
        const errorMsg = err?.message || err?.toString() || "알 수 없는 오류";
        alert(`${editId ? "수정" : "등록"} 실패: ${errorMsg}`);
      }
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm("삭제하시겠습니까?")) {
      await deleteDoc(doc(db, activeCollection, id));
      if (editId === id) resetForm();
      fetchPosts();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>게시글 관리</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveCollection('notices')} style={tabStyle(activeCollection === 'notices')}>📢 공지사항 관리</button>
        <button onClick={() => setActiveCollection('howto')} style={tabStyle(activeCollection === 'howto')}>📘 거래방법 관리</button>
      </div>

      <div style={{ backgroundColor: editId ? '#FFF8EE' : '#FFF', padding: '30px', borderRadius: '15px', marginBottom: '40px', border: editId ? '2px solid #FF9000' : 'none' }}>
        {editId && (
          <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#FF9000', fontSize: '16px' }}>
            ✏️ 수정 모드
          </div>
        )}
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>{editId ? '게시글 수정' : '새 글 작성'}</h3>
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

        {/* 텍스트 서식 도구 */}
        <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '15px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <button type="button" onClick={() => insertFormatting('bold')} style={{ padding: '8px 15px', backgroundColor: '#FFF', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            <strong>굵게</strong>
          </button>
          <button type="button" onClick={() => insertFormatting('size-large')} style={{ padding: '8px 15px', backgroundColor: '#FFF', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            큰 글씨
          </button>
          <button type="button" onClick={() => insertFormatting('size-xlarge')} style={{ padding: '8px 15px', backgroundColor: '#FFF', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
            더 큰 글씨
          </button>
          <button type="button" onClick={() => insertFormatting('color-red')} style={{ padding: '8px 15px', backgroundColor: '#FFF', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', color: '#FF0000', fontWeight: 'bold' }}>
            빨간색
          </button>
          <button type="button" onClick={() => insertFormatting('color-blue')} style={{ padding: '8px 15px', backgroundColor: '#FFF', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', color: '#0066FF', fontWeight: 'bold' }}>
            파란색
          </button>
          <button type="button" onClick={() => insertFormatting('color-orange')} style={{ padding: '8px 15px', backgroundColor: '#FFF', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', color: '#FF9000', fontWeight: 'bold' }}>
            주황색
          </button>
          <button type="button" onClick={() => insertFormatting('highlight')} style={{ padding: '8px 15px', backgroundColor: '#FEE500', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            형광펜
          </button>
          <button type="button" onClick={() => insertFormatting('table')} style={{ padding: '8px 15px', backgroundColor: '#FFF', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            📊 표
          </button>
          <label style={{ backgroundColor: '#FF9000', color: '#FFF', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            📷 사진 <input type="file" hidden accept="image/*" onChange={handleImageInsert} />
          </label>
          <label style={{ backgroundColor: '#9333EA', color: '#FFF', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            📹 동영상 <input type="file" hidden accept="video/*" onChange={handleVideoInsert} />
          </label>
          {loading && <span style={{ display: 'flex', alignItems: 'center', color: '#FF9000', fontWeight: 'bold' }}> 업로드 중...</span>}
        </div>

        {/* 작성 안내 */}
        <div style={{ marginBottom: '10px', padding: '12px', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6' }}>
          <strong style={{ color: '#0369A1', marginRight: '8px' }}>💡 작성 팁:</strong>
          <span style={{ color: '#0C4A6E' }}>
            <strong>줄바꿈</strong> = &lt;br&gt; 입력 |
            <strong> 서식</strong> = 위 버튼 클릭 또는 마크다운 (##, **, | 표) |
            <strong> 동영상</strong> = 50MB 이하
          </span>
        </div>

        <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} placeholder="내용 작성 (텍스트를 선택한 후 위 버튼을 눌러 서식을 적용하세요)" style={{ width: '100%', height: '400px', padding: '20px', border: '1px solid #DDD', borderRadius: '8px', fontSize: '15px', lineHeight: '1.6' }} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, marginTop: 0 }}>
            {loading ? (editId ? "수정 중..." : "등록 중...") : (editId ? "✅ 수정하기" : "등록하기")}
          </button>
          {editId && (
            <button onClick={resetForm} style={{ ...btnStyle, marginTop: 0, backgroundColor: '#888', width: '120px', fontSize: '15px' }}>
              취소
            </button>
          )}
        </div>
      </div>

      <h3>등록된 글 목록</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: editId === post.id ? '#FFF8EE' : '#FFF', padding: '15px', borderRadius: '10px', border: editId === post.id ? '2px solid #FF9000' : '1px solid #DDD' }}>
            <div>{post.isPinned && '📌'} <span style={{color:'#FF9000', fontWeight:'bold'}}>[{post.category}]</span> {post.title}</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleEdit(post)} style={{ backgroundColor: '#FF9000', color: '#FFF', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>수정</button>
              <button onClick={() => handleDelete(post.id)} style={{ backgroundColor: '#FF4444', color: '#FFF', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>삭제</button>
            </div>
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