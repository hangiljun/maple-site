'use client';

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    // 업체 목록 가져오기 (메인에는 최신 6개만 표시)
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
    <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      {/* 상단 네비게이션 - 이름 변경: 메이플 아이템 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 50px', backgroundColor: '#1a1a1a', borderBottom: '2px solid #ff9000', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9000', cursor: 'pointer' }}>메이플 아이템</div>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px' }}>
          <span>공지사항</span>
          <span>거래방법</span>
          <span>이용후기</span>
          <a href="/admin" style={{ color: '#555', textDecoration: 'none' }}>관리</a>
        </div>
      </nav>

      {/* 메인 대문 배너 */}
      <div style={{ width: '100%', height: '350px', backgroundColor: '#222', overflow: 'hidden', position: 'relative' }}>
        {banners.length > 0 ? (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' }} alt="Main Banner" />
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '150px', color: '#444' }}>관리자에서 대문 사진을 등록해주세요.</div>
        )}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '42px', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>메이플 아이템 거래의 시작</h1>
          <p style={{ fontSize: '18px', color: '#ddd' }}>검증된 업체와 안전하게 거래하세요.</p>
        </div>
      </div>

      {/* 신규 추가: 상단 프리미엄 광고 영역 */}
      <div style={{ padding: '40px 50px 0 50px' }}>
        <h3 style={{ color: '#ff9000', marginBottom: '20px', fontSize: '18px' }}>★ 프리미엄 인증 업체</h3>
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ minWidth: '300px', height: '80px', backgroundColor: '#1a1a1a', border: '1px solid #ff9000', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#333', borderRadius: '50%', marginRight: '15px' }}></div>
              <div>
                <div style={{ fontWeight: 'bold' }}>공식 인증 파트너 {i}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>24시간 친절 상담 대기 중</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 업체 리스트 섹션 (최대 6개) */}
      <div style={{ padding: '50px' }}>
        <h2 style={{ marginBottom: '30px', borderLeft: '5px solid #ff9000', paddingLeft: '15px', fontSize: '22px' }}>전문 매입 업체 목록</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
              <div style={{ width: '100%', height: '180px', backgroundColor: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="업체" />
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '19px', marginBottom: '8px' }}>{item.name}</h3>
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2a2a2a', paddingTop: '15px' }}>
                  <span style={{ color: '#ff9000', fontWeight: 'bold', fontSize: '17px' }}>{item.price}</span>
                  <a href={item.kakaoUrl} target="_blank" style={{ backgroundColor: '#fee500', color: '#3c1e1e', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                    카톡 문의
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <footer style={{ padding: '40px 50px', borderTop: '1px solid #1a1a1a', textAlign: 'center', color: '#444', fontSize: '13px' }}>
        <p>© 2026 메이플 아이템. All rights reserved.</p>
        <p style={{ marginTop: '5px' }}>본 사이트는 아이템 거래 정보 제공을 목적으로 하며, 거래의 당사자가 아닙니다.</p>
      </footer>
    </div>
  );
}