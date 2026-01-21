'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function HowToPage() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'howto'), (doc) => {
      if (doc.exists()) setData(doc.data());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} onError={(e)=>(e.currentTarget.style.display='none')} />
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer', color: '#FF9000' }} onClick={() => window.scrollTo(0,0)}>거래방법</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/review')}>이용후기</span>
        </div>
      </nav>

      {/* 대문 및 본문 로직 유지 */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#DDD', position: 'relative', overflow: 'hidden' }}>
        {data?.bannerUrl && <img src={data.bannerUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>거래방법 안내</h1>
          <p style={{ fontSize: '18px', marginTop: '10px' }}>안전하고 빠른 거래를 위한 가이드입니다.</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', backgroundColor: '#FFF', marginTop: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        {data ? (
          <>
            {data.mainImgUrl && <img src={data.mainImgUrl} style={{ width: '100%', borderRadius: '20px', marginBottom: '40px' }} />}
            <div style={{ fontSize: '18px', lineHeight: '2', whiteSpace: 'pre-wrap', color: '#333', padding: '0 20px' }}>
              {data.content}
            </div>
          </>
        ) : <p style={{ textAlign: 'center', padding: '100px' }}>내용을 불러오는 중입니다...</p>}
      </div>
    </div>
  );
}