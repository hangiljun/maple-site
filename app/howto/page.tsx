'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function HowtoPage() {
  const [howtos, setHowtos] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 1. 거래방법 목록 가져오기 (기존 로직 유지)
    const q = query(collection(db, 'howtos'), orderBy('createdAt', 'asc')); // 순서대로 보여주기 위해 asc
    onSnapshot(q, (s) => setHowtos(s.docs.map(doc => ({ id: d.id, ...doc.data() }))));

    // 2. 거래방법 전용 배너 가져오기 (기존 로직 유지)
    const qBanners = query(collection(db, 'howtoBanners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (s) => setBanners(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#F8FAFC' }}>
      
      {/* 1. 상단 네비게이션 (일관된 다크 모드 디자인) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #334155', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} onError={(e)=>(e.currentTarget.style.display='none')} />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600', color: '#94A3B8' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer', color: '#FF9000' }} onClick={() => window.scrollTo(0,0)}>거래방법</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/review')}>이용후기</span>
        </div>
      </nav>

      {/* 2. 거래방법 전용 배너 (다크 오버레이) */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#1E293B', position: 'relative', overflow: 'hidden' }}>
        {banners[0] && (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' }} />
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>쉽고 빠른 3분 거래 방법</h1>
          <p style={{ fontSize: '16px', marginTop: '10px', color: '#CBD5E1' }}>안전한 거래 절차를 확인하고 최고가에 판매하세요.</p>
        </div>
      </div>

      {/* 3. 거래방법 리스트 (다크 모드 카드 디자인) */}
      <div style={{ padding: '60px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {howtos.map((h, index) => (
            <div 
              key={h.id} 
              style={{ 
                display: 'flex', 
                gap: '25px', 
                backgroundColor: '#1E293B', 
                padding: '35px', 
                borderRadius: '20px', 
                border: '1px solid #334155', 
                alignItems: 'center',
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                transition: '0.3s'
              }}
            >
              {/* 단계별 번호 표시 */}
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: index === 0 ? '#FF9000' : '#334155', 
                borderRadius: '50%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                fontSize: '24px', 
                fontWeight: '900', 
                color: index === 0 ? '#000' : '#FFF', 
                flexShrink: 0,
                boxShadow: index === 0 ? '0 0 15px rgba(255, 144, 0, 0.4)' : 'none'
              }}>
                {index + 1}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#FFF' }}>{h.title}</h3>
                <div 
                  dangerouslySetInnerHTML={{ __html: h.content?.replace(/\n/g, '<br/>') }} 
                  style={{ color: '#CBD5E1', lineHeight: '1.7', fontSize: '16px' }} 
                />
                {h.imageUrl && (
                  <img src={h.imageUrl} style={{ maxWidth: '100%', borderRadius: '15px', marginTop: '20px', border: '1px solid #444' }} alt="howto step" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 데이터가 없을 경우 */}
        {howtos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748B' }}>
            등록된 거래 방법 가이드가 없습니다.
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#020617', padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '12px', borderTop: '1px solid #1E293B' }}>
        © 2026 메이플 아이템. All rights reserved.
      </footer>
    </div>
  );
}