'use client';
import { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [list, setList] = useState<any[]>([]);
  
  // 데이터 불러오기 함수 (삭제 후 리프레시용)
  const fetchData = async (tab: string) => {
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
    fetchData(activeTab);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111', color: '#FFF' }}>
      <div style={{ width: '250px', backgroundColor: '#222', padding: '20px' }}>
        <h2 style={{ color: '#FF9000' }}>관리자 센터</h2>
        <div onClick={() => setActiveTab('posts')} style={{ cursor: 'pointer', padding: '10px 0', color: activeTab === 'posts' ? '#FF9000' : '#FFF' }}>공지사항 관리</div>
        <div onClick={() => setActiveTab('howto')} style={{ cursor: 'pointer', padding: '10px 0', color: activeTab === 'howto' ? '#FF9000' : '#FFF' }}>거래방법 관리</div>
        <div onClick={() => setActiveTab('review')} style={{ cursor: 'pointer', padding: '10px 0', color: activeTab === 'review' ? '#FF9000' : '#FFF' }}>이용후기 관리</div>
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        <h2>{activeTab.toUpperCase()} 목록 및 관리</h2>
        {/* 등록 폼 생략 (기존 로직 유지하되 컬렉션 명칭만 notices/howtos로 변경하여 저장하세요) */}
        
        <div style={{ marginTop: '30px' }}>
          {list.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #333', backgroundColor: '#1E293B', marginBottom: '10px', borderRadius: '8px' }}>
              <span>{item.title}</span>
              <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: '#FF4444', color: '#FFF', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}