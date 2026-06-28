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

  if (!notice) return (
    <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#64748B' }}>
      로딩 중...
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#1E293B' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', borderBottom: '1px solid #E2E8F0', backgroundColor: 'rgba(255,255,255,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
            <img src="/favicon-new.png" alt="메이플 아이템 로고" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </div>
          <div style={{ fontWeight: '900', color: '#FF9000', fontSize: 'clamp(16px, 4vw, 20px)', whiteSpace: 'nowrap' }}>메이플 아이템</div>
        </div>
        <button onClick={() => router.back()} style={{ border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', color: '#64748B', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', fontSize: 'clamp(12px, 3vw, 14px)', whiteSpace: 'nowrap' }}>← 뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <span style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '14px', backgroundColor: '#FFF3E0', padding: '4px 12px', borderRadius: '20px', border: '1px solid #FFD0A0' }}>{notice.category}</span>
        <h1 style={{ fontSize: '30px', margin: '20px 0 15px 0', fontWeight: 'bold', lineHeight: '1.4', color: '#1E293B' }}>{notice.title}</h1>

        <div style={{ paddingBottom: '20px', borderBottom: '1px solid #E2E8F0', marginBottom: '40px', color: '#94A3B8', fontSize: '14px' }}>
          {notice.createdAt?.toDate().toLocaleDateString()}
        </div>

        {notice.imageUrl && (
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', border: '1px solid #E2E8F0' }}>
            <img src={notice.imageUrl} style={{ width: '100%', display: 'block' }} alt={notice.title} />
          </div>
        )}

        <div
          style={{ fontSize: '17px', lineHeight: '1.9', color: '#334155' }}
          className="notice-content"
          dangerouslySetInnerHTML={{ __html: notice.content.replace(/\n/g, '<br/>') }}
        />

        <button
          onClick={() => router.push('/notice')}
          style={{ marginTop: '60px', width: '100%', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#64748B', fontSize: '15px' }}
        >
          목록으로 돌아가기
        </button>
      </div>

      <style jsx global>{`
        .notice-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 20px 0;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
        }
      `}</style>
    </div>
  );
}
