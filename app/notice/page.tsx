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
    // 1. 공지사항 목록 가져오기 (기존 로직 유지)
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (s) => setNotices(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // 2. 공지사항 전용 배너 가져오기 (기존 로직 유지)
    const qBanners = query(collection(db, 'noticeBanners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (s) => setBanners(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#F8FAFC' }}>
      
      {/* 1. 상단 네비게이션 (다크 모드 디자인 적용) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #334155', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} onError={(e)=>(e.currentTarget.style.display='none')} />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600', color: '#94A3B8' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer', color: '#FF9000' }} onClick={() => window.scrollTo(0,0)}>공지사항</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>거래방법</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/review')}>이용후기</span>
        </div>
      </nav>

      {/* 2. 공지사항 전용 배너 (다크 오버레이 적용) */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#1E293B', position: 'relative', overflow: 'hidden' }}>
        {banners[0] && (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' }} />
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>메이플급처템, 템셋팅 공지사항</h1>
          <p style={{ fontSize: '16px', marginTop: '10px', color: '#CBD5E1' }}>메이플스토리와 메이플랜드 정보를 확인하세요.</p>
        </div>
      </div>

      {/* 3. 공지사항 그리드 리스트 (다크 모드 카드 디자인) */}
      <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {notices.map((n) => (
            <div 
              key={n.id} 
              onClick={() => router.push(`/notice/${n.id}`)} 
              style={{ 
                backgroundColor: '#1E293B', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                cursor: 'pointer', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)', 
                border: '1px solid #334155',
                transition: '0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <img src={n.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.9' }} />
                <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#FF9000', color: '#000', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '5px' }}>
                  {n.category || 'NOTICE'}
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#F1F5F9', lineHeight: '1.4' }}>{n.title}</h3>
                <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{n.createdAt?.toDate().toLocaleDateString()}</span>
                  <span style={{ color: '#FF9000' }}>자세히 보기 →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 공지가 없을 경우 안내 */}
        {notices.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748B' }}>
            등록된 공지사항이 없습니다.
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#020617', padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '12px', borderTop: '1px solid #1E293B' }}>
        © 2026 메이플 아이템. All rights reserved.
      </footer>
    </div>
  );
}