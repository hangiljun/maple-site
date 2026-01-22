'use client';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function HowtoPage() {
  const [howtos, setHowtos] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('전체');
  const [selectedItem, setSelectedItem] = useState<any>(null); // 팝업용 상태
  const router = useRouter();

  useEffect(() => {
    // howto 컬렉션 가져오기
    const q = query(collection(db, 'howto'), orderBy('createdAt', 'desc')); // 최신순 정렬
    onSnapshot(q, (s) => setHowtos(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (s) => setBanners(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  // 탭 필터링
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
          <p style={{ fontSize: '16px', marginTop: '10px', color: '#CBD5E1' }}>안전한 거래 절차와 주의사항을 확인하세요.</p>
        </div>
      </div>

      <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 카테고리 탭 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {['전체', '거래 방법', '거래 주의 사항'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', borderRadius: '30px', border: activeTab === tab ? '1px solid #FF9000' : '1px solid #334155', backgroundColor: activeTab === tab ? '#FF9000' : '#1E293B', color: activeTab === tab ? '#000' : '#CBD5E1', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>{tab}</button>
          ))}
        </div>

        {/* 게시글 목록 (공지사항과 동일한 카드 그리드 디자인) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredHowtos.map((h) => (
            <div 
              key={h.id} 
              onClick={() => setSelectedItem(h)} 
              style={{ backgroundColor: '#1E293B', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #334155', transition: '0.3s' }}
              className="hover-card"
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* 카드 이미지 영역 */}
              <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#333' }}>
                {h.imageUrl ? 
                  <img src={h.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.9' }} /> 
                  : <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center', color:'#555'}}>이미지 없음</div>
                }
                <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#FF9000', color: '#000', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '5px' }}>
                  {h.category || '가이드'}
                </div>
              </div>
              
              {/* 카드 내용 영역 */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#F1F5F9', lineHeight: '1.4' }}>{h.title}</h3>
                <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{h.createdAt?.toDate().toLocaleDateString()}</span>
                  <span style={{ color: '#FF9000', fontWeight: 'bold' }}>자세히 보기 →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHowtos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748B' }}>
            해당 카테고리에 등록된 글이 없습니다.
          </div>
        )}
      </div>

      {/* 팝업 모달 (상세 내용 보기) */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }} onClick={() => setSelectedItem(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#1E293B', padding: '40px', borderRadius: '20px', width: '90%', maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #334155', position: 'relative' }}>
            <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#FFF', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            
            <div style={{ borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px' }}>
              <span style={{ backgroundColor: '#FF9000', color: '#000', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{selectedItem.category}</span>
              <h2 style={{ color: '#FFF', fontSize: '24px', fontWeight: 'bold', marginTop: '10px', lineHeight: '1.4' }}>{selectedItem.title}</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '10px' }}>{selectedItem.createdAt?.toDate().toLocaleDateString()}</p>
            </div>

            <div style={{ color: '#E2E8F0', lineHeight: '1.8', fontSize: '16px' }}>
              {selectedItem.imageUrl && <img src={selectedItem.imageUrl} style={{ width: '100%', borderRadius: '10px', marginBottom: '20px', border: '1px solid #334155' }} />}
              <div dangerouslySetInnerHTML={{ __html: selectedItem.content?.replace(/\n/g, '<br/>') }} />
            </div>

            <button onClick={() => setSelectedItem(null)} style={{ width: '100%', padding: '15px', backgroundColor: '#334155', color: '#FFF', border: 'none', borderRadius: '10px', marginTop: '30px', fontWeight: 'bold', cursor: 'pointer' }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}