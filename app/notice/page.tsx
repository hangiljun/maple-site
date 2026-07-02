'use client';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('전체');
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubNotices = onSnapshot(q, (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });
      setNotices(data);
    });

    const qBanners = query(collection(db, 'banners'), orderBy('createdAt', 'desc'), limit(50));
    const unsubBanners = onSnapshot(qBanners, (s) => {
      const allBanners = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const targetBanner = allBanners.find((b: any) => b.type === '공지사항');
      setBanner(targetBanner || null);
    });

    return () => { unsubNotices(); unsubBanners(); }
  }, []);

  const extractFirstImg = (content: string) => {
    if (!content) return null;
    const imgReg = /<img[^>]+src=["']([^"']+)["']/;
    const match = imgReg.exec(content);
    return match ? match[1] : null;
  };

  const filteredNotices = activeTab === '전체' ? notices : notices.filter(n => n.category === activeTab);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#1E293B' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid #E2E8F0', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
            <img src="/favicon-new.png" alt="메이플 아이템 로고" style={{ width: '30px', height: '30px', objectFit: 'contain' }} onError={(e)=>(e.currentTarget.style.display='none')} />
          </div>
          <div style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '900', color: '#FF9000', whiteSpace: 'nowrap' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(8px, 3vw, 20px)', fontSize: 'clamp(12px, 3vw, 15px)', fontWeight: '600', color: '#64748B' }}>
          <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer', color: '#FF9000', whiteSpace: 'nowrap' }}>공지사항</span>
          <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => router.push('/howto')}>거래방법</span>
          <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => router.push('/review')}>이용후기</span>
        </div>
      </nav>

      <div style={{ width: '100%', backgroundColor: '#E2E8F0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', aspectRatio: '4/1', position: 'relative', overflow: 'hidden' }}>
          {banner && <img src={banner.imageUrl} alt="공지사항 배너" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.65' }} />}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: banner ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 144, 0, 0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>공지사항</h1>
            <p style={{ fontSize: '16px', marginTop: '10px', color: 'rgba(255,255,255,0.9)' }}>새로운 소식과 이벤트를 확인하세요.</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {['전체', '공지사항', '메이플 패치', '이벤트', '시세측정 기준'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', borderRadius: '30px', border: activeTab === tab ? '1px solid #FF9000' : '1px solid #E2E8F0', backgroundColor: activeTab === tab ? '#FF9000' : '#FFFFFF', color: activeTab === tab ? '#FFF' : '#64748B', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', boxShadow: activeTab === tab ? '0 2px 8px rgba(255,144,0,0.3)' : 'none' }}>{tab}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredNotices.map((n) => {
            const thumbnail = n.imageUrl || extractFirstImg(n.content);
            return (
              <Link key={n.id} href={`/notice/${n.id}`}
                   style={{ display: 'block', textDecoration: 'none', backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', border: n.isPinned ? '2px solid #FF9000' : '1px solid #E2E8F0', boxShadow: n.isPinned ? '0 4px 20px rgba(255, 144, 0, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#F1F5F9' }}>
                  {thumbnail ? ( <img src={thumbnail} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> ) : ( <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center', color:'#94A3B8', fontSize:'13px'}}>이미지 없음</div> )}
                  {n.isPinned && <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '20px' }}>📌</div>}
                  <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#FF9000', color: '#FFF', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '5px' }}>{n.category || '공지'}</div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#1E293B' }}>{n.title}</h3>
                  <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{n.createdAt?.toDate().toLocaleDateString()}</span>
                    <span style={{ color: '#FF9000', fontWeight: 'bold' }}>자세히 →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
