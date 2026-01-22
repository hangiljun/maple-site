'use client';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (s) => setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const premiumItems = items.filter(item => item.isPremium).slice(0, 3);
  const normalItems = items.filter(item => !item.isPremium);

  const goToKakao = (url: string) => {
    if (!url || url === "#") return alert("등록된 문의 링크가 없습니다.");
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 상단 네비게이션 */}
      <nav style={{ backgroundColor: '#FFF', padding: '15px', borderBottom: '1px solid #E5E0D5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 onClick={() => router.push('/')} style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#FF9000', cursor: 'pointer' }}>MAPLE ITEM</h1>
        <div style={{ display: 'flex', gap: '15px', fontSize: '14px', fontWeight: 'bold' }}>
          <span onClick={() => router.push('/notice')} style={{ cursor: 'pointer' }}>공지</span>
          <span onClick={() => router.push('/guide')} style={{ cursor: 'pointer' }}>방법</span>
          <span onClick={() => router.push('/review')} style={{ cursor: 'pointer' }}>후기</span>
        </div>
      </nav>

      {/* 프리미엄 파트너 - 가로형 고정 */}
      <div style={{ padding: '20px 15px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#FF9000', textAlign: 'center' }}>★ 프리미엄 인증 파트너</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {premiumItems.map((item) => (
            <div key={item.id} onClick={() => goToKakao(item.kakaoUrl)} style={{ aspectRatio: '2.4 / 1', border: '1.5px solid #FF9000', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', backgroundColor: '#FFF' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="premium" />
            </div>
          ))}
        </div>
      </div>

      {/* 실시간 매입 업체 - 모바일 3열 */}
      <div style={{ padding: '10px 15px 40px 15px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>실시간 등록 매입 업체</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {normalItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#FFF', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E0D5', display: 'flex', flexDirection: 'column' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '70px', objectFit: 'cover' }} alt="Company" />
              <div style={{ padding: '8px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '10px', marginBottom: '6px' }}>{item.price}</div>
                </div>
                <button onClick={() => goToKakao(item.kakaoUrl)} style={{ width: '100%', backgroundColor: '#FEE500', padding: '5px 0', borderRadius: '4px', border: 'none', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>카톡문의</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}