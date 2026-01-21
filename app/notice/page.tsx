'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (s) => setNotices(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qBanners = query(collection(db, 'noticeBanners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (s) => setBanners(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 네비게이션 복구 및 홈 메뉴 추가 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} onError={(e)=>(e.currentTarget.style.display='none')} />
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer', color: '#FF9000' }} onClick={() => window.scrollTo(0,0)}>공지사항</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>거래방법</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/review')}>이용후기</span>
        </div>
      </nav>

      {/* 배너 및 리스트 로직 유지 */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#DDD', position: 'relative', overflow: 'hidden' }}>
        {banners[0] && <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>메이플급처템, 템셋팅 공지사항</h1>
          <p style={{ fontSize: '18px', marginTop: '10px' }}>메이플스토리와 메이플랜드 정보를 확인하세요.</p>
        </div>
      </div>

      <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {notices.map((n) => (
            <div key={n.id} onClick={() => router.push(`/notice/${n.id}`)} style={{ backgroundColor: '#FFF', borderRadius: '25px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
              <img src={n.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <span style={{ color: '#00aaff', fontSize: '13px', fontWeight: 'bold' }}>{n.category}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>{n.title}</h3>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{n.createdAt?.toDate().toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}