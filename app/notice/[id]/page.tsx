'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotice = async () => {
      const docRef = doc(db, 'notices', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setNotice(docSnap.data());
    };
    fetchNotice();
  }, [id]);

  if (!notice) return <div style={{ textAlign: 'center', padding: '100px' }}>로딩 중...</div>;

  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', borderBottom: '1px solid #EEE' }}>
        <div style={{ fontWeight: '900', color: '#FF9000', cursor: 'pointer' }} onClick={() => router.push('/')}>메이플 아이템</div>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <span style={{ color: '#00aaff', fontWeight: 'bold' }}>{notice.category}</span>
        <h1 style={{ fontSize: '32px', margin: '15px 0 40px 0', fontWeight: 'bold' }}>{notice.title}</h1>
        
        <div style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px' }}>
          <img src={notice.imageUrl} style={{ width: '100%', objectFit: 'contain' }} alt="content" />
        </div>

        <div style={{ fontSize: '18px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#333' }}>
          {notice.content}
        </div>
      </div>
    </div>
  );
}