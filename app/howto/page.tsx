'use client';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function HowtoPage() {
  const [howtos, setHowtos] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('전체'); // ★ 탭 기능 추가
  const router = useRouter();

  useEffect(() => {
    // howto 컬렉션 가져오기
    const q = query(collection(db, 'howto'), orderBy('createdAt', 'asc'));
    onSnapshot(q, (s) => setHowtos(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (s) => setBanners(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  // ★ 탭에 따른 필터링 기능
  const filteredHowtos = activeTab === '전체' ? howtos : howtos.filter(h => h.category === activeTab);

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#F8FAFC' }}>
      
      {/* 네비게이션 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #334155', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} onError={(e)=>(e.currentTarget.style.display='none')} />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600', color: '#94A3B8' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer', color: '#FF9000' }}>거래방법</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/review')}>이용후기</span>
        </div>
      </nav>

      {/* 배너 */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#1E293B', position: 'relative', overflow: 'hidden' }}>
        {banners[0] && <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' }} />}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>거래 방법</h1>
          <p style={{ fontSize: '16px', marginTop: '10px', color: '#CBD5E1' }}>안전한 거래 절차를 안내해 드립니다.</p>
        </div>
      </div>

      <div style={{ padding: '60px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* ★ 거래방법 카테고리 탭 (공지사항과 동일한 스타일) */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {['전체', '거래 방법', '거래 주의 사항'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', borderRadius: '30px', border: activeTab === tab ? '1px solid #FF9000' : '1px solid #334155', backgroundColor: activeTab === tab ? '#FF9000' : '#1E293B', color: activeTab === tab ? '#000' : '#CBD5E1', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>{tab}</button>
          ))}
        </div>

        {/* 게시글 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {filteredHowtos.length === 0 ? <div style={{textAlign:'center', color:'#666', padding:'50px'}}>해당 카테고리에 등록된 글이 없습니다.</div> : 
           filteredHowtos.map((h, index) => (
            <div key={h.id} style={{ display: 'flex', gap: '25px', backgroundColor: '#1E293B', padding: '35px', borderRadius: '20px', border: '1px solid #334155', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: index === 0 ? '#FF9000' : '#334155', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: '900', color: index === 0 ? '#000' : '#FFF', flexShrink: 0 }}>
                {h.category === '거래 주의 사항' ? '!' : index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#FF9000', marginBottom: '5px', fontWeight: 'bold' }}>[{h.category}]</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#FFF' }}>{h.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: h.content?.replace(/\n/g, '<br/>') }} style={{ color: '#CBD5E1', lineHeight: '1.7', fontSize: '16px' }} />
                {h.imageUrl && <img src={h.imageUrl} style={{ maxWidth: '100%', borderRadius: '15px', marginTop: '20px', border: '1px solid #444' }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}