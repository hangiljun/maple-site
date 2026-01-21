'use client';

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    // 업체 목록 가져오기
    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const unsubItems = onSnapshot(qItems, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 배너 이미지 가져오기 (가장 최근 것 하나)
    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
    const unsubBanners = onSnapshot(qBanners, (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubItems(); unsubBanners(); };
  }, []);

  return (
    <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      {/* 상단 네비게이션 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px', backgroundColor: '#1a1a1a', borderBottom: '2px solid #ff9000' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9000' }}>MAPLE ITEM</div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <span>공지사항</span>
          <span>거래방법</span>
          <span>이용후기</span>
          <a href="/admin" style={{ color: '#888', fontSize: '12px', textDecoration: 'none' }}>관리자</a>
        </div>
      </nav>

      {/* 대문 배너 (수시로 변경 가능) */}
      <div style={{ width: '100%', height: '400px', backgroundColor: '#222', overflow: 'hidden', position: 'relative' }}>
        {banners.length > 0 ? (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Main Banner" />
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '180px', color: '#555' }}>등록된 대문 이미지가 없습니다.</div>
        )}
        <div style={{ position: 'absolute', bottom: '30px', left: '50px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '20px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>최고가 아이템 매입 업체</h2>
          <p>안전하고 빠른 거래, 검증된 업체만 등록됩니다.</p>
        </div>
      </div>

      {/* 업체 리스트 섹션 */}
      <div style={{ padding: '50px' }}>
        <h2 style={{ marginBottom: '30px', borderLeft: '5px solid #ff9000', paddingLeft: '15px' }}>등록된 전문 매입 업체</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#1e1e1e', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333', transition: '0.3s' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="업체로고" />
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{item.name}</h3>
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '15px' }}>{item.description || '최고가 매입 보장업체'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ff9000', fontWeight: 'bold' }}>{item.price}</span>
                  {/* 카카오톡 버튼 */}
                  <a href={item.kakaoUrl || "#"} target="_blank" style={{ backgroundColor: '#fee500', color: '#3c1e1e', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                    카톡 문의
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}