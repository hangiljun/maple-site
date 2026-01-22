'use client';

import { useState, useEffect } from 'react';
// 파일 위치가 app/admin/dashboard/page.tsx라면 ../../../firebase 가 맞습니다.
// 만약 에러가 나면 ../../firebase 로 줄여보세요.
import { db, storage } from '../../../firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  // 기본 탭을 'notices'(공지사항)로 설정
  const [activeTab, setActiveTab] = useState('notices'); 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. 데이터 불러오기 (탭이 바뀔 때마다 실행)
  const fetchData = async (tab: string) => {
    try {
      // 탭 이름(notices 또는 howtos)을 그대로 컬렉션 이름으로 사용
      const q = query(collection(db, tab), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // 2. 글 등록하기
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");
    
    setLoading(true);
    try {
      let imageUrl = "";
      // 이미지 첨부 시 업로드 처리
      if (image) {
        const imgRef = ref(storage, `${activeTab}/${Date.now()}`);
        await uploadBytes(imgRef, image);
        imageUrl = await getDownloadURL(imgRef);
      }

      // 현재 선택된 탭(notices 또는 howtos)에 데이터 저장
      await addDoc(collection(db, activeTab), {
        title,
        content,
        imageUrl, // 이미지 URL도 저장
        category: activeTab === 'notices' ? '공지' : '가이드',
        createdAt: serverTimestamp(),
      });

      alert("등록되었습니다!");
      // 입력창 초기화
      setTitle('');
      setContent('');
      setImage(null);
      // 목록 새로고침
      fetchData(activeTab); 
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  // 3. 글 삭제하기
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    try {
      await deleteDoc(doc(db, activeTab, id));
      alert("삭제되었습니다.");
      fetchData(activeTab); // 목록 새로고침
    } catch (error) {
      alert("삭제 실패");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111', color: '#FFF', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 사이드바 */}
      <div style={{ width: '250px', backgroundColor: '#1E1E1E', padding: '30px 20px', borderRight: '1px solid #333' }}>
        <h2 style={{ color: '#FF9000', marginBottom: '40px', fontSize: '22px', fontWeight: 'bold' }}>관리자 대시보드</h2>
        
        <div onClick={() => setActiveTab('notices')} style={tabStyle(activeTab === 'notices')}>
          📢 공지사항 관리
        </div>
        <div onClick={() => setActiveTab('howtos')} style={tabStyle(activeTab === 'howtos')}>
          📘 거래방법 관리
        </div>
        
        <button onClick={() => router.push('/')} style={{ marginTop: '50px', width: '100%', padding: '10px', backgroundColor: '#333', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ← 사이트로 이동
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ flex: 1, padding: '50px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', borderBottom: '2px solid #FF9000', paddingBottom: '10px', display: 'inline-block' }}>
          {activeTab === 'notices' ? '공지사항' : '거래방법'} 관리
        </h1>

        {/* 글쓰기 폼 */}
        <div style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '15px', marginBottom: '40px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>새 글 작성하기</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#888' }}>제목</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="제목을 입력하세요"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#888' }}>대표 이미지 (선택)</label>
              <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} style={{ color: '#FFF' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#888' }}>내용</label>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="내용을 입력하세요 (줄바꿈 가능)"
                style={{ ...inputStyle, height: '200px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#FF9000', color: '#FFF', fontWeight: 'bold', fontSize: '16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              {loading ? '등록 중...' : '게시글 등록하기'}
            </button>
          </form>
        </div>

        {/* 작성된 글 목록 */}
        <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>등록된 글 목록 ({list.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {list.length === 0 ? <p style={{ color: '#666' }}>등록된 글이 없습니다.</p> : 
            list.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E1E1E', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {item.imageUrl && <img src={item.imageUrl} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} alt="img" />}
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', color: '#FFF' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '날짜 없음'}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: '#FF4444', color: '#FFF', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  삭제
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// 스타일 헬퍼 함수
const tabStyle = (isActive: boolean) => ({
  padding: '15px',
  marginBottom: '10px',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: isActive ? '#FF9000' : 'transparent',
  color: isActive ? '#FFF' : '#AAA',
  fontWeight: isActive ? 'bold' : 'normal',
  transition: '0.2s'
});

const inputStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#333',
  border: '1px solid #444',
  borderRadius: '8px',
  color: '#FFF',
  fontSize: '14px',
  outline: 'none'
};