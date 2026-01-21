'use client';

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    // 업체 목록 가져오기 (메인에는 실시간 6개 표시)
    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'), limit(6));
    const unsubItems = onSnapshot(qItems, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 배너 이미지 가져오기
    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'), limit(1));
    const unsubBanners = onSnapshot(qBanners, (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubItems(); unsubBanners(); };
  }, []);

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: 'white', fontFamily: "'Noto Sans KR', sans-serif" }}>
      
      {/* 1. 상단 네비게이션 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#111', borderBottom: '1px solid #222', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '22px', fontWeight: '900', color: '#ff9000', letterSpacing: '-1px' }}>메이플 아이템</div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '15px', fontWeight: '500' }}>
          <span style={{ cursor: 'pointer', hover: { color: '#ff9000' } } as any}>공지사항</span>
          <span style={{ cursor: 'pointer' }}>거래방법</span>
          <span style={{ cursor: 'pointer' }}>이용후기</span>
          <a href="/admin" style={{ color: '#444', textDecoration: 'none', fontSize: '13px' }}>관리자</a>
        </div>
      </nav>

      {/* 2. 대문 비주얼 영역 */}
      <div style={{ width: '100%', height: '450px', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
        {banners.length > 0 ? (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.5' }} alt="Main Banner" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #111, #222)' }}></div>
        )}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '15px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>메이플 아이템 거래의 기준</h1>
          <p style={{ fontSize: '19px', color: '#ccc', letterSpacing: '2px' }}>검증된 1등 매입 업체들을 한눈에 비교하세요</p>
        </div>
      </div>

      {/* 3. 프리미엄 인증 업체 (상단 광고 영역) */}
      <div style={{ padding: '60px 60px 0 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
          <span style={{ backgroundColor: '#ff9000', color: 'black', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>AD</span>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>프리미엄 인증 파트너</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ backgroundColor: '#161616', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', transition: '0.2s', cursor: 'pointer' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#ff9000', borderRadius: '10px', marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'black' }}>VVIP</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>인증 업체 0{i}</div>
                <div style={{ fontSize: '13px', color: '#777' }}>사고율 0% · 24시 상담</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 전문 매입 업체 리스트 (하단 6개) */}
      <div style={{ padding: '80px 60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '35px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '24px', backgroundColor: '#ff9000' }}></div>
          실시간 등록 매입 업체
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#1a1a1a', borderRadius: '20px', overflow: 'hidden', border: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '200px', backgroundColor: '#222', position: 'relative' }}>
                <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Company" />
                <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', color: '#ff9000', border: '1px solid #ff9000' }}>인증완료</div>
              </div>
              <div style={{ padding: '25px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{item.name}</h3>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', height: '44px', overflow: 'hidden' }}>{item.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #282828' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#666', display: 'block' }}>매입가 기준</span>
                    <span style={{ color: '#ff9000', fontWeight: '800', fontSize: '18px' }}>{item.price}</span>
                  </div>
                  <a href={item.kakaoUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#fee500', color: '#3c1e1e', padding: '12px 20px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    카톡 문의하기
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 하단 푸터 영역 */}
      <footer style={{ backgroundColor: '#000', padding: '60px', textAlign: 'center', borderTop: '1px solid #111' }}>
        <div style={{ color: '#ff9000', fontWeight: 'bold', marginBottom: '20px' }}>메이플 아이템</div>
        <p style={{ color: '#444', fontSize: '13px', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto' }}>
          본 사이트는 등록된 업체들의 홍보 정보를 제공하는 플랫폼으로, 실제 거래 과정에서 발생하는 문제에 대해서는 책임을 지지 않습니다. 거래 전 업체의 신뢰도를 반드시 확인하시기 바랍니다.
        </p>
        <p style={{ color: '#222', fontSize: '12px', marginTop: '30px' }}>© 2026 MAPLE ITEM. All rights reserved.</p>
      </footer>
    </div>
  );
}