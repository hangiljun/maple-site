'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 네비게이션 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #FF9000', color: '#FF9000', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>메인으로</button>
        </div>
      </nav>

      {/* 헤더 섹션 (예시 이미지 스타일 반영) */}
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '36px', color: '#FF9000', fontWeight: 'bold', marginBottom: '15px' }}>메이플급처템, 템셋팅 공지사항</h1>
        <p style={{ fontSize: '18px', color: '#333', fontWeight: '500' }}>메이플스토리와 메이플랜드의 모든 정보를 신속하게 전달드립니다.</p>
      </div>

      {/* 공지사항 카드 리스트 */}
      <div style={{ padding: '0 60px 80px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {notices.map((n) => (
            <div key={n.id} 
                 onClick={() => router.push(`/notice/${n.id}`)} // 상세 페이지로 이동
                 style={{ backgroundColor: '#FFF', borderRadius: '25px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: '0.3s' }}>
              <div style={{ height: '180px', position: 'relative' }}>
                <img src={n.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="notice" />
                <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#00aaff', color: 'white', padding: '3px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold' }}>{n.category}</div>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.4', height: '44px', overflow: 'hidden' }}>{n.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', color: '#aaa' }}>{n.createdAt?.toDate().toLocaleDateString()}</span>
                   <span style={{ fontSize: '12px', color: '#FF9000', fontWeight: 'bold' }}>자세히 보기 &gt;</span>
                </div>
              </div>
            </div>
          ))}
          {notices.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px', color: '#999' }}>등록된 공지사항이 없습니다.</p>}
        </div>
      </div>
    </div>
  );
}