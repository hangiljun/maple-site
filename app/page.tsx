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
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(safeUrl, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 스타일 태그: 호버 애니메이션 효과 정의 */}
      <style jsx global>{`
        .hover-card { transition: all 0.3s ease; }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(255, 144, 0, 0.3); }
        .neon-text { text-shadow: 0 0 10px rgba(255, 144, 0, 0.5); }
      `}</style>

      {/* 네비게이션: 다크 테마 적용 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #334155', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <img src="/logo.png" alt="로고" style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#FF9000', letterSpacing: '-0.5px' }} className="neon-text">MAPLE ITEM</div>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '15px', fontWeight: '600', color: '#94A3B8' }}>
          <span style={{ cursor: 'pointer', color: '#FF9000' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => router.push('/notice')}>공지</span>
          <span style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => router.push('/howto')}>방법</span>
          <span style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => router.push('/review')}>후기</span>
        </div>
      </nav>

      {/* 배너 섹션 */}
      <div style={{ width: '100%', height: '320px', backgroundColor: '#1E293B', position: 'relative', overflow: 'hidden' }}>
        {banners.length > 0 ? (
          <div style={{ width: '100%', height: '100%', backgroundImage: `url(${banners[0].imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.7)' }}></div>
        ) : ( <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #1E293B, #0F172A)' }}></div> )}
        
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '90%', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#FFF', marginBottom: '15px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            메이플 아이템 <span style={{ color: '#FF9000' }}>최고가 매입</span> & 시세 비교
          </h1>
          <p style={{ color: '#E2E8F0', fontWeight: '500', fontSize: '16px', backgroundColor: 'rgba(0,0,0,0.5)', display: 'inline-block', padding: '8px 20px', borderRadius: '30px', backdropFilter: 'blur(5px)' }}>
            검증된 1등 업체들과 안전하게 거래하세요
          </p>
        </div>
      </div>

      {/* 프리미엄 인증 파트너 (Bento Grid 스타일) */}
      <div style={{ padding: '50px 5% 0 5%' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#FF9000', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9000', boxShadow: '0 0 10px #FF9000' }}></span>
          PREMIUM PARTNER
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {premiumItems.map((item) => (
            <div key={item.id} onClick={() => goToKakao(item.kakaoUrl)} className="hover-card" style={{ aspectRatio: '2.5 / 1', border: '1px solid #FF9000', borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', position: 'relative', backgroundColor: '#1E293B' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#FF9000', color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '3px 10px', borderBottomLeftRadius: '10px' }}>공식인증</div>
              <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.9' }} alt="premium" />
            </div>
          ))}
        </div>
      </div>

      {/* 실시간 매입 업체 (다크 카드 스타일) */}
      <div style={{ padding: '60px 5%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', color: '#FFF' }}>실시간 등록 매입 업체</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {normalItems.map((item) => (
            <div key={item.id} className="hover-card" style={{ backgroundColor: '#1E293B', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
              <div style={{ width: '100%', height: '140px', overflow: 'hidden' }}>
                <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Company" />
              </div>
              <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px', color: '#F1F5F9' }}>{item.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                  <span style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '14px' }}>{item.price}</span>
                  <button onClick={() => goToKakao(item.kakaoUrl)} style={{ backgroundColor: '#FEE500', color: '#000', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>문의</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 비교 섹션 (다크 버전) */}
      <div style={{ padding: '80px 5%', backgroundColor: '#0B1120', borderTop: '1px solid #1E293B' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '50px', color: '#FFF' }}>
          왜 <span style={{ color: '#FF9000' }}>메이플 아이템</span>인가요?
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <ComparisonCard title="장사꾼 A" subtitle="비인증 개인 거래" items={["낮은 매입가", "불투명한 시세", "사기 위험 존재"]} />
          <ComparisonCard title="메이플 아이템" subtitle="공식 인증 플랫폼" isMain={true} items={["업계 최고 매입가", "투명한 실시간 시세", "100% 안전 보장"]} />
          <ComparisonCard title="장사꾼 B" subtitle="소규모 업체" items={["수수료 부담 전가", "느린 정산 속도", "고객 응대 미흡"]} />
        </div>
      </div>

      <footer style={{ backgroundColor: '#020617', padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '12px', borderTop: '1px solid #1E293B' }}>
        © 2026 MAPLE ITEM. All rights reserved.
      </footer>
    </div>
  );
}

// 비교 카드 컴포넌트 (다크 모드용)
function ComparisonCard({ title, subtitle, items, isMain = false }: any) {
  return (
    <div style={{ 
      backgroundColor: isMain ? '#1E293B' : '#0F172A', 
      padding: '30px', 
      borderRadius: '20px', 
      width: '280px', 
      border: isMain ? '2px solid #FF9000' : '1px solid #334155', 
      boxShadow: isMain ? '0 0 30px rgba(255,144,0,0.1)' : 'none',
      transform: isMain ? 'scale(1.05)' : 'none', 
      position: 'relative' 
    }}>
      {isMain && <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FF9000', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>RECOMMENDED</span>}
      <h3 style={{ color: isMain ? '#FF9000' : '#E2E8F0', fontSize: '20px', marginBottom: '8px', fontWeight: 'bold' }}>{title}</h3>
      <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '25px' }}>{subtitle}</p>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2.2' }}>
        {items.map((text: string, i: number) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#CBD5E1' }}>
            <span style={{ color: isMain ? '#FF9000' : '#475569', fontSize: '12px' }}>●</span> {text}
          </li>
        ))}
      </ul>
    </div>
  );
}