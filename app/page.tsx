'use client';

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const unsubItems = onSnapshot(qItems, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Items Error:", error));

    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'), limit(1));
    const unsubBanners = onSnapshot(qBanners, (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Banners Error:", error));

    return () => { unsubItems(); unsubBanners(); };
  }, []);

  // 프리미엄/일반 분류 (isPremium 체크 확인)
  const premiumItems = items.filter(item => item.isPremium === true).slice(0, 3);
  const normalItems = items.filter(item => !item.isPremium).slice(0, 6);

  // 카카오톡 링크 연결 함수 (가장 중요)
  const goToKakao = (url: string) => {
    if (!url || url === "#") {
      alert("등록된 문의 링크가 없습니다.");
      return;
    }
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(safeUrl, '_blank'); // 새 창으로 카카오톡 열기
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: 'white', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#111', borderBottom: '1px solid #222', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '22px', fontWeight: '900', color: '#ff9000' }}>메이플 아이템</div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '15px' }}>
          <span>공지사항</span><span>거래방법</span><span>이용후기</span>
          <a href="/admin" style={{ color: '#444', textDecoration: 'none' }}>관리자</a>
        </div>
      </nav>

      {/* 대문 배너 */}
      <div style={{ width: '100%', height: '350px', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
        {banners.length > 0 ? (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.4' }} alt="Main" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#111' }}></div>
        )}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px' }}>메이플 아이템 거래의 기준</h1>
          <p style={{ color: '#ccc' }}>검증된 1등 매입 업체들을 확인하세요</p>
        </div>
      </div>

      {/* 프리미엄 파트너 - 클릭 이벤트 직접 연결 */}
      <div style={{ padding: '60px 60px 0 60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#ff9000' }}>★ 프리미엄 인증 파트너</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {premiumItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => goToKakao(item.kakaoUrl)} // 클릭 시 함수 실행
              style={{ 
                width: '100%', 
                height: '140px', 
                border: '2px solid #ff9000', 
                borderRadius: '12px', 
                overflow: 'hidden',
                cursor: 'pointer', // 마우스 올리면 손가락 모양으로 변경
                backgroundColor: '#161616'
              }}
            >
              <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="premium" />
            </div>
          ))}
          {premiumItems.length === 0 && <p style={{color:'#444'}}>등록된 프리미엄 업체가 없습니다.</p>}
        </div>
      </div>

      {/* 일반 등록 매입 업체 */}
      <div style={{ padding: '80px 60px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '35px' }}>실시간 등록 매입 업체</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {normalItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#1a1a1a', borderRadius: '20px', overflow: 'hidden', border: '1px solid #222' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt="Company" />
              <div style={{ padding: '25px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 'bold', marginBottom: '10px' }}>{item.name}</h3>
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>{item.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #282828', paddingTop: '15px' }}>
                  <span style={{ color: '#ff9000', fontWeight: 'bold' }}>{item.price}</span>
                  <button 
                    onClick={() => goToKakao(item.kakaoUrl)} // 버튼 클릭 시 카톡 이동
                    style={{ backgroundColor: '#fee500', color: '#3c1e1e', padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                  >
                    카톡 문의
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ backgroundColor: '#000', padding: '40px', textAlign: 'center', color: '#444', fontSize: '12px' }}>
        © 2026 MAPLE ITEM. All rights reserved.
      </footer>
    </div>
  );
}