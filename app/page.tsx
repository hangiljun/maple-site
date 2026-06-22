'use client';

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [mainBanner, setMainBanner] = useState<any>(null);
  const [bannerLoading, setBannerLoading] = useState(true);

  const [reviews, setReviews] = useState<any[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [today, setToday] = useState('');

  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [qnaList, setQnaList] = useState<{question: string, answer: string}[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const tradePhotos = ['/trade1.png','/trade2.png','/trade3.png','/trade4.png','/trade5.png','/trade6.png','/trade7.png'];

  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    setToday(`${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`);

    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const unsubItems = onSnapshot(qItems, (s) => setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const unsubBanner = onSnapshot(doc(db, 'banners', 'home_main'), (docSnap) => {
      if (docSnap.exists()) {
        setMainBanner(docSnap.data());
      } else {
        setMainBanner(null);
      }
      setBannerLoading(false);
    });

    const qReviews = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(10));
    const unsubReviews = onSnapshot(qReviews, (s) => setReviews(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const unsubConfig = onSnapshot(doc(db, 'site_config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.statusMessages) setStatusMessages(data.statusMessages);
        if (data.qna) setQnaList(data.qna);
      }
    });

    return () => {
      unsubItems(); unsubBanner(); unsubReviews(); unsubConfig();
    };
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % tradePhotos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const premiumItems = items.filter(item => item.isPremium === true).slice(0, 3);
  const normalItems = items.filter(item => !item.isPremium);

  const goToKakao = (url: string) => {
    if (!url || url === "#") { alert("등록된 문의 링크가 없습니다."); return; }
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(safeUrl, '_blank');
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.maplestoryitem.com/#website',
        url: 'https://www.maplestoryitem.com',
        name: '메이플 아이템',
        description: '메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입',
        inLanguage: 'ko',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.maplestoryitem.com/notice?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.maplestoryitem.com/#organization',
        name: '메이플 아이템',
        url: 'https://www.maplestoryitem.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.maplestoryitem.com/favicon-new.png',
        },
        description: '메이플스토리 아이템, 메소 전 서버 최고가 매입 및 검증 업체 플랫폼',
        areaServed: 'KR',
        serviceType: '게임 아이템 거래 플랫폼',
      },
    ],
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#1E293B', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style jsx global>{`
        .hover-card { transition: all 0.3s ease; }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 12px 28px -5px rgba(255, 144, 0, 0.22); }
        .review-fade { animation: fadeIn 0.8s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee { animation: marquee 30s linear infinite; }
      `}</style>

      {/* 1. 실시간 운영 상태 바 */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '10px 0', fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }}></span>
          <span>{today} 실시간 운영 중</span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ color: '#FF9000', fontWeight: 'bold' }}>평균 응답 시간 1분 내외</span>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', overflow: 'hidden', whiteSpace: 'nowrap', padding: '6px 0', borderTop: '1px solid #E2E8F0' }}>
          <div className="marquee" style={{ display: 'inline-block', fontSize: '12px', color: '#94A3B8' }}>
            {statusMessages.length > 0 ? statusMessages.map((msg, i) => (
               <span key={i} style={{ marginRight: '50px' }}>{msg}</span>
            )) : (
               <>
                 <span style={{ marginRight: '50px' }}>[실시간] 루나 서버 500억 메소 매입 완료</span>
                 <span style={{ marginRight: '50px' }}>[안내] 관리자 페이지에서 상태 메시지를 설정해주세요.</span>
               </>
            )}
            {statusMessages.length > 0 && statusMessages.map((msg, i) => (
               <span key={`dup-${i}`} style={{ marginRight: '50px' }}>{msg}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 네비게이션 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid #E2E8F0', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
            <Image src="/favicon-new.png" alt="메이플 아이템 최고가 매입 로고" width={30} height={30} style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#FF9000', letterSpacing: '-0.5px' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '15px', fontWeight: '600', color: '#64748B' }}>
          <Link href="/" style={{ textDecoration: 'none' }}><span style={{ cursor: 'pointer', color: '#FF9000' }}>홈</span></Link>
          <Link href="/notice" style={{ textDecoration: 'none', color: '#64748B' }}><span style={{ cursor: 'pointer' }}>공지사항</span></Link>
          <Link href="/howto" style={{ textDecoration: 'none', color: '#64748B' }}><span style={{ cursor: 'pointer' }}>거래방법</span></Link>
          <Link href="/review" style={{ textDecoration: 'none', color: '#64748B' }}><span style={{ cursor: 'pointer' }}>이용후기</span></Link>
        </div>
      </nav>

      {/* 3. 메인 배너 */}
      <div style={{ width: '100%', backgroundColor: '#E2E8F0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          aspectRatio: '3.75 / 1',
          minHeight: '200px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {!bannerLoading && (
            mainBanner ? (
              <div style={{ width: '100%', height: '100%', backgroundImage: `url(${mainBanner.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.75)' }}></div>
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FF9000 0%, #FFB347 50%, #FF6B35 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                배너를 등록해주세요.
              </div>
            )
          )}

          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', maxWidth: '800px', padding: '0 20px' }}>
            <h1 style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: '900', color: '#FFF', marginBottom: '15px', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>메이플급처 <span style={{ color: '#FFD700' }}>최고가 매입</span> & 시세 비교</h1>
            <p style={{ color: '#F1F5F9', fontWeight: '500', fontSize: 'clamp(12px, 3vw, 16px)', backgroundColor: 'rgba(0,0,0,0.45)', display: 'inline-block', padding: '8px 20px', borderRadius: '30px', backdropFilter: 'blur(5px)' }}>메이플급처 전문 검증 업체들과 안전하게 거래하세요</p>
          </div>
        </div>
      </div>

      {/* 4. 프리미엄 인증 파트너 */}
      <div style={{ padding: '50px 0', width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#FF9000', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9000', boxShadow: '0 0 8px rgba(255,144,0,0.4)' }}></span>
          프리미엄 인증 파트너
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'flex-start' }}>
          {premiumItems.map((item) => (
            <div key={item.id} onClick={() => goToKakao(item.kakaoUrl)} className="hover-card"
                 style={{
                   width: '100%',
                   maxWidth: '380px',
                   aspectRatio: '2.1 / 1',
                   border: '2px solid #FF9000',
                   borderRadius: '20px',
                   overflow: 'hidden',
                   cursor: 'pointer',
                   position: 'relative',
                   backgroundColor: '#FFFFFF',
                   boxShadow: '0 4px 14px rgba(255,144,0,0.12)',
                 }}>
              <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#FF9000', color: '#FFF', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderBottomLeftRadius: '10px', zIndex: 10 }}>공식인증</div>
              <img src={item.imageUrl} alt="메이플스토리 공식 인증 안전 거래 업체" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.92' }} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. 실시간 매입 업체 */}
      <div style={{ padding: '60px 0', width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', color: '#1E293B' }}>실시간 등록 매입 업체</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'flex-start' }}>
          {normalItems.map((item) => (
            <div key={item.id} className="hover-card"
                 style={{
                   width: '100%',
                   maxWidth: '250px',
                   backgroundColor: '#FFFFFF',
                   borderRadius: '16px',
                   overflow: 'hidden',
                   border: '1px solid #E2E8F0',
                   boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                   display: 'flex',
                   flexDirection: 'column'
                 }}>
              <div style={{ width: '100%', aspectRatio: '1.8 / 1', overflow: 'hidden' }}>
                <img src={item.imageUrl} alt="메이플 실시간 매입 업체" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px', color: '#1E293B' }}>{item.name}</h3>
                  <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>{item.desc}</p>
                </div>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  <div style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>{item.price}</div>
                  <button onClick={() => goToKakao(item.kakaoUrl)} style={{ width: '100%', backgroundColor: '#FEE500', color: '#000', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>카톡 문의하기</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. 업체 비교 */}
      <div style={{ padding: '80px 0', backgroundColor: '#F1F5F9', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '50px', color: '#1E293B' }}>
          <span style={{ color: '#FF9000' }}>메이플 아이템</span> 업체 비교, 저희는 다릅니다.
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <ComparisonCard title="장사꾼 A" subtitle="게임내 고성능 확성기로 홍보하는 사람" items={["오직 메소 ", "평균 70% 낮은 매입가", "아이템 시세를 경매장 최소가", "시세측정 이해 불가"]} />
          <ComparisonCard title="메이플 아이템" subtitle="공식 인증 업체" isMain={true} items={["메소 / 무통장 거래 가능 (업체보증)", "업계 최고 매입가 85% ", "365일 24시간 상시 대기", "합리적인 경매장 시세 측정"]} />
          <ComparisonCard title="B 장사꾼" subtitle="1인 웹사이트,블로그 업체" items={["무조건 선 받으려고 하는 업체", "수수료,가위값을 판매자에게 부담", "느린 대답 / 지연 이체", "신뢰도 부족"]} />
        </div>
      </div>

      {/* 7. 실시간 후기 */}
      <div style={{ padding: '60px 0', borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
          <h2 style={{ textAlign: 'center', fontSize: '22px', marginBottom: '30px', color: '#1E293B' }}>📢 실시간 거래 후기</h2>
          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '40px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minHeight: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%' }}>
            {reviews.length > 0 ? (
              <div key={currentReviewIndex} className="review-fade" style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9000', marginBottom: '15px' }}>{reviews[currentReviewIndex].title}</div>
                <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>"{reviews[currentReviewIndex].content?.substring(0, 100)}..."</p>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center', width: '100%' }}>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>작성자: {reviews[currentReviewIndex].nickname || reviews[currentReviewIndex].author || '익명'}</span>
                </div>
              </div>
            ) : ( <div style={{ color: '#94A3B8' }}>등록된 후기가 없습니다.</div> )}
          </div>
      </div>

      {/* 7.5. 거래 인증 사진 슬라이드 */}
      <div style={{ padding: '60px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '22px', marginBottom: '30px', color: '#1E293B' }}>📸 실시간 거래 인증</h2>
        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', backgroundColor: '#F1F5F9' }}>
            <img
              src={tradePhotos[slideIndex]}
              alt={`메이플급처 거래 인증 사진 ${slideIndex + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s ease' }}
            />
          </div>
          <button
            onClick={() => setSlideIndex((prev) => (prev - 1 + tradePhotos.length) % tradePhotos.length)}
            style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-60%)', width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.35)', color: '#FFF', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >‹</button>
          <button
            onClick={() => setSlideIndex((prev) => (prev + 1) % tradePhotos.length)}
            style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-60%)', width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.35)', color: '#FFF', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >›</button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {tradePhotos.map((_, i) => (
              <div
                key={i}
                onClick={() => setSlideIndex(i)}
                style={{ width: i === slideIndex ? '20px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === slideIndex ? '#FF9000' : '#CBD5E1', cursor: 'pointer', transition: 'all 0.3s ease' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 8. 자주 묻는 질문 (Q&A) */}
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px 80px' }}>
        <h2 style={{ textAlign: 'center', color: '#FF9000', marginBottom: '30px', fontSize: '22px' }}>자주 묻는 질문 (Q&A)</h2>
        {qnaList.map((q, i) => (
          <div key={i} style={{ marginBottom: '15px', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '20px', backgroundColor: '#FFFFFF', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#FF9000' }}>Q.</span>
              <span style={{ color: '#1E293B' }}>{q.question}</span>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#F8FAFC', color: '#475569', lineHeight: '1.6', borderTop: '1px solid #E2E8F0', fontSize: '15px' }}>
              <span style={{ color: '#FF9000', fontWeight: 'bold', marginRight: '5px' }}>A.</span>
              {q.answer}
            </div>
          </div>
        ))}
        {qnaList.length === 0 && <div style={{ textAlign: 'center', color: '#94A3B8' }}>등록된 질문이 없습니다.</div>}
      </div>

      <footer style={{ backgroundColor: '#F1F5F9', padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '12px', borderTop: '1px solid #E2E8F0' }}>
        © 2026 메이플 아이템. All rights reserved.
      </footer>
    </div>
  );
}

function ComparisonCard({ title, subtitle, items, isMain = false }: any) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '20px', width: '300px', border: isMain ? '2px solid #FF9000' : '1px solid #E2E8F0', boxShadow: isMain ? '0 8px 30px rgba(255,144,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)', transform: isMain ? 'scale(1.05)' : 'none', position: 'relative', transition: '0.3s' }}>
      {isMain && <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FF9000', color: '#FFF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>추천</span>}
      <h3 style={{ color: isMain ? '#FF9000' : '#1E293B', fontSize: '24px', marginBottom: '8px', fontWeight: 'bold' }}>{title}</h3>
      <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '25px', height: '32px' }}>{subtitle}</p>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2.4' }}>
        {items.map((text: string, i: number) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
            <span style={{ color: isMain ? '#FF9000' : '#CBD5E1', fontSize: '12px', fontWeight: 'bold' }}>✔</span> <span style={{ flex: 1 }}>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
