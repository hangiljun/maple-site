'use client';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    onSnapshot(qItems, (s) => setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (s) => setBanners(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const premiumItems = items.filter(item => item.isPremium === true).slice(0, 3);
  const normalItems = items.filter(item => !item.isPremium);

  const goToKakao = (url: string) => {
    if (!url || url === "#") { alert("등록된 문의 링크가 없습니다."); return; }
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', color: '#333', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 네비게이션 - 데스크탑/모바일 공통 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <img src="/logo.png" alt="로고" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '15px', fontSize: '14px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>방법</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/review')}>후기</span>
        </div>
      </nav>

      {/* 배너 섹션 */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#DDD', position: 'relative', overflow: 'hidden' }}>
        {banners.length > 0 ? (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Main" />
        ) : ( <div style={{ width: '100%', height: '100%', background: '#EEE' }}></div> )}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '90%', backgroundColor: 'rgba(255,255,255,0.8)', padding: '20px 0', borderRadius: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#222', marginBottom: '8px' }}>메이플 아이템 비교해서 최고가 판매 하세요</h1>
          <p style={{ color: '#555', fontWeight: '600', fontSize: '14px' }}>검증된 1등 매입 업체들을 확인하세요</p>
        </div>
      </div>

      {/* 프리미엄 인증 파트너 - 모바일 반응형 그리드 */}
      <div style={{ padding: '40px 5% 0 5%' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#FF9000', textAlign: 'center' }}>★ 프리미엄 인증 파트너</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
          {premiumItems.map((item) => (
            <div key={item.id} onClick={() => goToKakao(item.kakaoUrl)} style={{ aspectRatio: '2.5 / 1', border: '2px solid #FF9000', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255,144,0,0.1)' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="premium" />
            </div>
          ))}
        </div>
      </div>

      {/* 실시간 매입 업체 - 반응형 그리드 */}
      <div style={{ padding: '60px 5%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>실시간 등록 매입 업체</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
          {normalItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#FFF', borderRadius: '15px', overflow: 'hidden', border: '1px solid #E5E0D5' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '120px', objectFit: 'cover' }} alt="Company" />
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>{item.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '14px' }}>{item.price}</span>
                  <button onClick={() => goToKakao(item.kakaoUrl)} style={{ backgroundColor: '#FEE500', fontSize: '11px', padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>문의</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 비교 카드 섹션 (기존 코드 유지) */}
      <div style={{ padding: '60px 5%', backgroundColor: '#F3F0E9' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '40px' }}><span style={{ color: '#FF9000' }}>메이플 아이템</span> 업체 비교</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <ComparisonCard title="장사꾼 A" subtitle="일반 장사꾼" items={["오직 메소", "낮은 매입가", "불투명한 측정"]} />
          <ComparisonCard title="메이플 아이템" subtitle="공식 인증" isMain={true} items={["무통장 가능", "최고 매입가", "24시간 대기"]} />
        </div>
      </div>

      <footer style={{ backgroundColor: '#FFF', padding: '30px', textAlign: 'center', color: '#999', fontSize: '11px' }}>© 2026 메이플 아이템.</footer>
    </div>
  );
}

function ComparisonCard({ title, subtitle, items, isMain = false }: any) {
  return (
    <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '15px', width: '260px', border: isMain ? '2px solid #FF9000' : '1px solid #E5E0D5' }}>
      <h3 style={{ color: isMain ? '#FF9000' : '#333', fontSize: '20px', marginBottom: '5px' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px' }}>
        {items.map((text: string, i: number) => <li key={i} style={{ marginBottom: '8px' }}>✔ {text}</li>)}
      </ul>
    </div>
  );
}