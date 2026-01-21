'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    onSnapshot(qItems, (s) => setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qNotices = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(8));
    onSnapshot(qNotices, (s) => setNotices(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (s) => setBanners(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const premiumItems = items.filter(item => item.isPremium === true).slice(0, 3);
  const normalItems = items.filter(item => !item.isPremium).slice(0, 6);

  const goToKakao = (url: string) => {
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(safeUrl, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', color: '#333', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 네비게이션 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} onError={(e)=>(e.currentTarget.style.display='none')} />
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000', cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '15px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => noticeRef.current?.scrollIntoView({ behavior: 'smooth' })}>공지사항</span>
          <span>거래방법</span><span>이용후기</span>
        </div>
      </nav>

      {/* 대문 */}
      <div style={{ width: '100%', height: '350px', backgroundColor: '#DDD', position: 'relative', overflow: 'hidden' }}>
        {banners[0] && <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', backgroundColor: 'rgba(255,255,255,0.8)', padding: '30px 0' }}>
          <h1 style={{ fontSize: '38px', fontWeight: '900' }}>메이플 아이템 비교해서 최고가 판매 하세요</h1>
        </div>
      </div>

      {/* 프리미엄 파트너 */}
      <div style={{ padding: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#FF9000', textAlign: 'center' }}>★ 프리미엄 인증 파트너</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {premiumItems.map((item) => (
            <div key={item.id} onClick={() => goToKakao(item.kakaoUrl)} style={{ height: '140px', border: '2px solid #FF9000', borderRadius: '15px', overflow: 'hidden', cursor: 'pointer' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* 공지사항 섹션 (예시 이미지 스타일 반영) */}
      <div ref={noticeRef} style={{ padding: '80px 60px', backgroundColor: '#FFF' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '32px', color: '#FF9000' }}>메이플급처템, 템셋팅 공지사항</h2>
          <p>메이플스토리와 메이플랜드의 모든 정보를 신속하게 전달드립니다.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
          {notices.map((n) => (
            <div key={n.id} style={{ cursor: 'pointer' }} onClick={() => alert(n.content)}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', height: '160px', marginBottom: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <img src={n.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ color: '#00aaff', fontSize: '13px', fontWeight: 'bold' }}>{n.category}</span>
              <h3 style={{ fontSize: '15px', margin: '5px 0', lineHeight: '1.4' }}>{n.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* 실시간 업체 리스트 */}
      <div style={{ padding: '80px 60px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '35px', textAlign: 'center' }}>실시간 등록 매입 업체</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {normalItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#FFF', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E5E0D5' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '25px' }}>
                <h3 style={{ fontWeight: 'bold' }}>{item.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                  <span style={{ color: '#FF9000', fontWeight: 'bold' }}>{item.price}</span>
                  <button onClick={() => goToKakao(item.kakaoUrl)} style={{ backgroundColor: '#FEE500', border: 'none', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>카톡 문의</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 업체 비교 섹션 */}
      <div style={{ padding: '80px 60px', backgroundColor: '#F3F0E9' }}>
        <h2 style={{ textAlign: 'center', fontSize: '30px', marginBottom: '50px' }}><span style={{ color: '#FF9000' }}>메이플 아이템</span> 업체 비교</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <ComparisonCard title="장사꾼 A" subtitle="확성기 홍보" items={["메소만 가능", "낮은 매입가", "시세측정 불가"]} />
          <ComparisonCard title="메이플 아이템" subtitle="공식 인증" isMain={true} items={["무통장 가능", "최고가 85%", "24시 대기"]} />
          <ComparisonCard title="B 장사꾼" subtitle="개인 블로그" items={["신뢰도 부족", "느린 대답", "판매자 부담"]} />
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({ title, subtitle, items, isMain = false }: any) {
  return (
    <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', width: '280px', border: isMain ? '3px solid #FF9000' : '1px solid #E5E0D5', transform: isMain ? 'scale(1.05)' : 'none' }}>
      <h3 style={{ color: isMain ? '#FF9000' : '#333', fontSize: '20px', fontWeight: 'bold' }}>{title}</h3>
      <p style={{ color: '#AAA', fontSize: '13px' }}>{subtitle}</p>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {items.map((t: string, i: number) => <li key={i} style={{ marginBottom: '10px', fontSize: '14px' }}>✔ {t}</li>)}
      </ul>
    </div>
  );
}