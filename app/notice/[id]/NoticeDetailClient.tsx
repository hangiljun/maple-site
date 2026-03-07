'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function NoticeDetailClient({ id }: { id: string }) {
  const [notice, setNotice] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotice = async () => {
      const docRef = doc(db, 'notices', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setNotice(docSnap.data());
    };
    fetchNotice();
  }, [id]);

  if (!notice) return <div style={{ textAlign: 'center', padding: '100px' }}>로딩 중...</div>;

  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', borderBottom: '1px solid #EEE' }}>
        <div style={{ fontWeight: '900', color: '#FF9000', cursor: 'pointer', fontSize: '20px' }} onClick={() => router.push('/')}>메이플 아이템</div>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#666', fontWeight: 'bold' }}>뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <span style={{ color: '#00aaff', fontWeight: 'bold', fontSize: '16px' }}>{notice.category}</span>
        <h1 style={{ fontSize: '32px', margin: '15px 0 40px 0', fontWeight: 'bold', lineHeight: '1.3' }}>{notice.title}</h1>

        {notice.imageUrl && (
          <div style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', border: '1px solid #EEE' }}>
            <img src={notice.imageUrl} style={{ width: '100%', display: 'block' }} alt={notice.title} />
          </div>
        )}

        <div
          style={{ fontSize: '18px', lineHeight: '1.8', color: '#333' }}
          className="notice-content"
          dangerouslySetInnerHTML={{
            __html: notice.content.replace(/\n/g, '<br/>')
          }}
        />
      </div>

      <style jsx global>{`
        .notice-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 20px 0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
