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
    // 업체 리스트 실시간 동기화 유지
    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    onSnapshot(qItems, (s) => setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    // 메인 대문 배너 실시간 동기화 유지
    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (s) => setBanners(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const premiumItems = items.filter(item => item.isPremium === true).slice(0, 3);
  const normalItems = items.filter(item => !item.isPremium);

  const goToKakao = (url: string) => {
    if (!url || url === "#") {
      alert("등록된 문의 링크가 없습니다.");
      return;
    }
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(safeUrl, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', color: '#333', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 네비게이션 - 모든 메뉴 클릭 시 해당 페이지로 이동하도록 설정 완료 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="로고" style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
               onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000', cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>
            메이플 아이템
          </div>
        </div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '15px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>거래방법</span>
          {/* 이용후기 버튼을 /review 주소와 연결했습니다 */}
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/review')}>이용후기</span>
        </div>
      </nav>

      {/* 대문 배너 - 문구 유지 */}
      <div style={{ width: '100%', height: '350px', backgroundColor: '#DDD', position: 'relative', overflow: 'hidden' }}>
        {banners.length > 0 ? (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Main" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#EEE' }}></div>
        )}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', backgroundColor: 'rgba(255,255,255,0.8)', padding: '30px 0' }}>
          <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#222', marginBottom: '10px' }}>
            메이플 아이템 비교해서 최고가 판매 하세요
          </h1>
          <p style={{ color: '#555', fontWeight: '600' }}>검증된 1등 매입 업체들을 확인하세요</p>
        </div>
      </div>

      {/* 프리미엄 파트너 */}
      <div style={{ padding: '60px 60px 0 60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#FF9000', textAlign: 'center' }}>★ 프리미엄 인증 파트너</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {premiumItems.map((item) => (
            <div key={item.id} onClick={() => goToKakao(item.kakaoUrl)} style={{ width: '100%', height: '140px', border: '2px solid #FF9000', borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,144,0,0.1)' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="premium" />
            </div>
          ))}
        </div>
      </div>

      {/* 실시간 등록 매입 업체 */}
      <div style={{ padding: '80px 60px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '35px', textAlign: 'center' }}>실시간 등록 매입 업체</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {normalItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#FFF', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E5E0D5', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt="Company" />
              <div style={{ padding: '25px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 'bold', marginBottom: '10px' }}>{item.name}</h3>
                <p style={{ color: '#777', fontSize: '14px', marginBottom: '20px' }}>{item.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0EDE5', paddingTop: '15px' }}>
                  <span style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '18px' }}>{item.price}</span>
                  <button onClick={() => goToKakao(item.kakaoUrl)} style={{ backgroundColor: '#FEE500', color: '#3C1E1E', padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>카톡 문의</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 업체 비교 섹션 - 문구 완벽 유지 */}
      <div style={{ padding: '80px 60px', backgroundColor: '#F3F0E9' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '50px' }}>
          <span style={{ color: '#FF9000' }}>메이플 아이템</span> 업체 비교, 무엇이 다를까요?
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <ComparisonCard 
            title="장사꾼 A" 
            subtitle="게임내 고성능 확성기로 홍보하는 사람" 
            items={["오직 메소 ", "평균 70% 낮은 매입가", "아이템 시세를 경매장 최소가", "시세측정 이해 불가"]} 
          />
          <ComparisonCard 
            title="메이플 아이템" 
            subtitle="공식 인증 업체" 
            isMain={true} 
            items={["메소 / 무통장 거래 가능 (업체보증)", "업계 최고 매입가 85% ", "365일 24시간 상시 대기", "합리적인 경매장 시세 측정"]} 
          />
          <ComparisonCard 
            title="B 장사꾼" 
            subtitle="1인 웹사이트,블로그 업체" 
            items={["무조건 선 받으려고 하는 업체", "수수료,가위값을 판매자에게 부담", "느린 대답 / 지연 이체", "신뢰도 부족"]} 
          />
        </div>
      </div>

      <footer style={{ backgroundColor: '#FFF', padding: '40px', textAlign: 'center', color: '#999', fontSize: '12px', borderTop: '1px solid #E5E0D5' }}>
        © 2026 메이플 아이템. All rights reserved.
      </footer>
    </div>
  );
}

function ComparisonCard({ title, subtitle, items, isMain = false }: any) {
  return (
    <div style={{ 
      backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', width: '300px',
      border: isMain ? '3px solid #FF9000' : '1px solid #E5E0D5',
      boxShadow: isMain ? '0 10px 30px rgba(255,144,0,0.2)' : 'none',
      transform: isMain ? 'scale(1.05)' : 'none',
      position: 'relative', transition: '0.3s'
    }}>
      {isMain && <span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#FF9000', color: '#FFF', padding: '2px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>추천</span>}
      <h3 style={{ color: isMain ? '#FF9000' : '#333', fontSize: '24px', marginBottom: '8px', fontWeight: 'bold' }}>{title}</h3>
      <p style={{ color: '#AAA', fontSize: '13px', marginBottom: '25px', height: '32px' }}>{subtitle}</p>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2.4' }}>
        {items.map((text: string, i: number) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: isMain ? '#FF9000' : '#CCC', fontWeight: 'bold' }}>✔</span> 
            <span style={{ flex: 1 }}>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}