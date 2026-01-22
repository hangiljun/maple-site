'use client';

import { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../../firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('company'); // 기본 탭: 업체 관리
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: '#F5F5F5' }}>
      {/* 왼쪽 사이드바 메뉴 */}
      <div style={{ width: '250px', backgroundColor: '#333', color: '#FFF', padding: '30px 20px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '40px', color: '#FF9000' }}>관리자 센터</h1>
        <MenuButton label="업체 등록/관리" active={activeTab === 'company'} onClick={() => setActiveTab('company')} />
        <MenuButton label="배너 이미지 관리" active={activeTab === 'banner'} onClick={() => setActiveTab('banner')} />
        <MenuButton label="공지/방법 글쓰기" active={activeTab === 'write'} onClick={() => setActiveTab('write')} />
        <MenuButton label="이용후기 관리" active={activeTab === 'review'} onClick={() => setActiveTab('review')} />
      </div>

      {/* 오른쪽 컨텐츠 영역 */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'company' && <CompanyManager />}
        {activeTab === 'banner' && <BannerManager />}
        {activeTab === 'write' && <PostEditor />}
        {activeTab === 'review' && <ReviewManager />}
      </div>
    </div>
  );
}

// 메뉴 버튼 컴포넌트
function MenuButton({ label, active, onClick }: any) {
  return (
    <div onClick={onClick} style={{ padding: '15px', marginBottom: '10px', backgroundColor: active ? '#FF9000' : 'transparent', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
      {label}
    </div>
  );
}

// 1. 업체 관리 컴포넌트
function CompanyManager() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState(''); // 가격 또는 설명
  const [kakaoUrl, setKakaoUrl] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  // 업체 목록 불러오기
  const fetchItems = async () => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const file = e.target.image.files[0];
    if (!name || !desc || !file) return alert("정보를 모두 입력해주세요.");
    
    setLoading(true);
    try {
      const imgRef = ref(storage, `companies/${Date.now()}`);
      await uploadBytes(imgRef, file);
      const imageUrl = await getDownloadURL(imgRef);

      await addDoc(collection(db, 'items'), {
        name,
        price: desc, // page.tsx에서 price로 사용됨
        desc, 
        kakaoUrl,
        imageUrl,
        isPremium,
        createdAt: serverTimestamp()
      });
      alert("업체가 등록되었습니다.");
      fetchItems(); // 목록 새로고침
      e.target.reset();
      setName(''); setDesc(''); setKakaoUrl(''); setIsPremium(false);
    } catch (err) {
      alert("등록 실패");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 이 업체를 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, 'items', id));
      fetchItems();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>업체 등록 및 관리</h2>
      <form onSubmit={handleAdd} style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input placeholder="업체명 (예: 메이플 아이템)" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <input placeholder="설명/가격 (예: 업계 최고가 매입)" value={desc} onChange={e => setDesc(e.target.value)} style={inputStyle} />
          <input placeholder="카카오톡 오픈채팅 링크" value={kakaoUrl} onChange={e => setKakaoUrl(e.target.value)} style={inputStyle} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} />
            <span style={{ fontWeight: 'bold', color: '#FF9000' }}>프리미엄 파트너 등록 (체크 시 상단 노출)</span>
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>업체 대표 이미지</p>
          <input type="file" name="image" accept="image/*" />
        </div>
        <button type="submit" disabled={loading} style={btnStyle}>{loading ? "등록 중..." : "업체 등록하기"}</button>
      </form>

      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>등록된 업체 목록</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {items.map(item => (
          <div key={item.id} style={{ backgroundColor: '#FFF', padding: '15px', borderRadius: '10px', border: item.isPremium ? '2px solid #FF9000' : '1px solid #DDD' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.name}</div>
            <div style={{ color: '#888', fontSize: '14px', marginBottom: '10px' }}>{item.price}</div>
            <button onClick={() => handleDelete(item.id)} style={{ padding: '5px 10px', backgroundColor: '#FF4444', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. 배너 관리 컴포넌트
function BannerManager() {
  const [loading, setLoading] = useState(false);

  const handleBannerUpdate = async (e: any, type: string) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const imgRef = ref(storage, `banners/${type}_${Date.now()}`);
      await uploadBytes(imgRef, file);
      const imageUrl = await getDownloadURL(imgRef);

      // banners 컬렉션에 type별로 저장 (기존 것 덮어쓰기 위해 setDoc 대신 addDoc 후 최신순 정렬 사용 권장하지만 여기선 편의상 추가)
      await addDoc(collection(db, 'banners'), { type, imageUrl, createdAt: serverTimestamp() });
      alert(`${type} 배너가 변경되었습니다.`);
    } catch (err) {
      alert("배너 업로드 실패");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>메뉴별 배너 관리</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {['홈 (메인)', '공지사항', '거래방법', '이용후기'].map((menu, idx) => (
          <div key={idx} style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '10px' }}>{menu} 배너 변경</h3>
            <input type="file" onChange={(e) => handleBannerUpdate(e, menu)} />
            {loading && <span style={{ color: '#FF9000', fontSize: '12px' }}> 업로드 중...</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. 게시글 작성 컴포넌트 (대형 에디터 + 사진 삽입)
function PostEditor() {
  const [category, setCategory] = useState('notice'); // notice or howto
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 사진을 본문 중간에 삽입하는 함수
  const handleImageInsert = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const imgRef = ref(storage, `posts/${Date.now()}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      
      // HTML 태그 형태로 본문에 삽입
      const imgTag = `\n<img src="${url}" style="width: 100%; max-width: 800px; margin: 10px 0; border-radius: 10px;" />\n`;
      
      // 커서 위치에 삽입
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + imgTag + content.substring(end);
        setContent(newContent);
      } else {
        setContent(prev => prev + imgTag);
      }
    } catch (err) {
      alert("사진 삽입 실패");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");
    if (confirm(`[${category === 'notice' ? '공지사항' : '거래방법'}]에 글을 등록하시겠습니까?`)) {
      setLoading(true);
      await addDoc(collection(db, 'posts'), {
        category, title, content, createdAt: serverTimestamp()
      });
      alert("등록 완료!");
      setTitle(''); setContent('');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>게시글 작성</h2>
      <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '10px', marginRight: '10px', fontSize: '16px' }}>
            <option value="notice">공지사항</option>
            <option value="howto">거래방법</option>
          </select>
          <input placeholder="제목을 입력하세요" value={title} onChange={e => setTitle(e.target.value)} style={{ ...inputStyle, width: '70%' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ backgroundColor: '#FF9000', color: '#FFF', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            📷 본문에 사진 넣기 (여러 장 가능)
            <input type="file" hidden onChange={handleImageInsert} />
          </label>
          {loading && <span style={{ marginLeft: '10px', color: '#FF9000' }}>사진 업로드 중...</span>}
        </div>

        <textarea 
          ref={textareaRef}
          value={content} 
          onChange={e => setContent(e.target.value)} 
          placeholder="내용을 자유롭게 작성하세요. 위 사진 버튼을 누르면 커서 위치에 사진이 들어갑니다."
          style={{ width: '100%', height: '600px', padding: '20px', fontSize: '16px', lineHeight: '1.6', borderRadius: '10px', border: '1px solid #DDD', resize: 'vertical' }}
        />

        <button onClick={handleSubmit} style={{ ...btnStyle, marginTop: '20px' }}>게시글 등록하기</button>
      </div>
    </div>
  );
}

// 4. 이용후기 관리 컴포넌트
function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    // 이용후기는 보통 'reviews' 컬렉션을 쓰거나 'posts'에서 category='review'를 씁니다.
    // 여기서는 'reviews' 컬렉션을 가정합니다. (안 나온다면 posts로 변경 필요)
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setReviews(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("이 후기를 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, 'reviews', id));
      fetchReviews();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>이용후기 관리</h2>
      <div style={{ backgroundColor: '#FFF', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {reviews.length === 0 ? <div style={{ padding: '20px' }}>등록된 후기가 없습니다.</div> : 
          reviews.map((review) => (
            <div key={review.id} style={{ padding: '20px', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{review.title || '제목 없음'}</div>
                <div style={{ color: '#555', fontSize: '14px' }}>{review.content?.substring(0, 50)}...</div>
                <div style={{ fontSize: '12px', color: '#999' }}>작성자: {review.author || '익명'}</div>
              </div>
              <button onClick={() => handleDelete(review.id)} style={{ padding: '8px 15px', backgroundColor: '#FF4444', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>삭제</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// 공통 스타일
const inputStyle = { padding: '12px', border: '1px solid #DDD', borderRadius: '8px', outline: 'none' };
const btnStyle = { width: '100%', padding: '15px', backgroundColor: '#FF9000', color: '#FFF', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' };