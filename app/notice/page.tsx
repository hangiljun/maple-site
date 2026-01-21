'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 공지사항 리스트
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 공지사항 전용 배너
    const qBanners = query(collection(db, 'noticeBanners'), orderBy('createdAt', 'desc'), limit(1));
    onSnapshot(qBanners, (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 네비게이션 - 로고 사진 추가 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <img src="/logo.png" alt="로고" style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
               onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>공지사항 센터</div>
      </nav>

      {/* 관리자 수정 가능 대문 섹션 */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#DDD', position: 'relative', overflow: 'hidden' }}>
        {banners[0] ? (
          <img src={banners[0].imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Notice Banner" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }}>
             <p>대문 사진을 등록해주세요.</p>
          </div>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>메이플급처템, 템셋팅 공지사항</h1>
          <p style={{ fontSize: '18px', marginTop: '10px' }}>중요 소식을 가장 빠르게 확인하세요.</p>
        </div>
      </div>

      <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {notices.map((n) => (
            <div key={n.id} onClick={() => router.push(`/notice/${n.id}`)} style={{ backgroundColor: '#FFF', borderRadius: '25px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ height: '180px' }}>
                <img src={n.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="notice" />
              </div>
              <div style={{ padding: '20px' }}>
                <span style={{ color: '#00aaff', fontSize: '13px', fontWeight: 'bold' }}>{n.category}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>{n.title}</h3>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{n.createdAt?.toDate().toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}