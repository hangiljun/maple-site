'use client';

import { useState, useEffect } from 'react';
// ★ 수정됨: 경로를 ../../../ 에서 ../../ 로 변경
import { db, storage } from '../../firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [list, setList] = useState<any[]>([]);
  
  // 데이터 불러오기 함수
  const fetchData = async (tab: string) => {
    // 탭에 따라 컬렉션 이름 자동 선택 (공지사항=notices, 거래방법=howtos, 후기=reviews)
    const colName = tab === 'posts' ? 'notices' : (tab === 'howto' ? 'howtos' : 'reviews');
    const q = query(collection(db, colName), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchData(activeTab); }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const colName = activeTab === 'posts' ? 'notices' : (activeTab === 'howto' ? 'howtos' : 'reviews');
    await deleteDoc(doc(db, colName, id));
    alert("삭제되었습니다.");
    fetchData(activeTab); // 목록 새로고침
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111', color: '#FFF', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 사이드바 메뉴 */}
      <div style={{ width: '250px', backgroundColor: '#222', padding: '30px 20px', borderRight: '1px solid #333' }}>
        <h2 style={{ color: '#FF9000', marginBottom: '40px', fontSize: '20px', fontWeight: 'bold' }}>관리자 센터</h2>
        <MenuButton label="공지사항 관리" active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
        <MenuButton label="거래방법 관리" active={activeTab === 'howto'} onClick={() => setActiveTab('howto')} />
        <MenuButton label="이용후기 관리" active={activeTab === 'review'} onClick={() => setActiveTab('review')} />
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>
          {activeTab === 'posts' && '공지사항 목록'}
          {activeTab === 'howto' && '거래방법 목록'}
          {activeTab === 'review' && '이용후기 목록'}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {list.length === 0 ? (
            <div style={{ color: '#666' }}>등록된 글이 없습니다.</div>
          ) : (
            list.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#1E293B', borderRadius: '10px', border: '1px solid #333' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>ID: {item.id}</div>
                </div>
                <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: '#FF4444', color: '#FFF', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>삭제</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 메뉴 버튼 컴포넌트
function MenuButton({ label, active, onClick }: any) {
  return (
    <div onClick={onClick} style={{ padding: '15px', marginBottom: '10px', backgroundColor: active ? '#FF9000' : 'transparent', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: active ? '#000' : '#FFF', transition: '0.2s' }}>
      {label}
    </div>
  );
}