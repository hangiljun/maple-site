'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function HowtoDetailClient({ id }: { id: string }) {
  const [howto, setHowto] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHowto = async () => {
      const docRef = doc(db, 'howto', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setHowto(docSnap.data());
    };
    fetchHowto();
  }, [id]);

  const convertUrlsToLinks = (text: string) => {
    if (!text) return text;
    const urlPattern = /(https?:\/\/[^\s<>"]+)/g;
    return text.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #FF9000; text-decoration: underline; word-break: break-all;">${url}</a>`;
    });
  };

  if (!howto) return (
    <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#64748B' }}>
      로딩 중...
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#1E293B', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #E2E8F0', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
            <img src="/favicon-new.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} alt="메이플 아이템 로고" />
          </div>
          <div style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '900', color: '#FF9000', whiteSpace: 'nowrap' }}>메이플 아이템</div>
        </div>
        <button onClick={() => router.back()} style={{ border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', color: '#64748B', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', fontSize: 'clamp(12px, 3vw, 14px)', whiteSpace: 'nowrap' }}>← 뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <span style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '14px', backgroundColor: '#FFF3E0', padding: '4px 12px', borderRadius: '20px', border: '1px solid #FFD0A0' }}>{howto.category}</span>
        <h1 style={{ fontSize: '30px', margin: '20px 0 15px 0', fontWeight: 'bold', lineHeight: '1.4', color: '#1E293B' }}>{howto.title}</h1>

        <div style={{ paddingBottom: '20px', borderBottom: '1px solid #E2E8F0', marginBottom: '40px', color: '#94A3B8', fontSize: '14px' }}>
          {howto.createdAt?.toDate().toLocaleDateString()}
        </div>

        {howto.imageUrl && (
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', border: '1px solid #E2E8F0' }}>
            <img src={howto.imageUrl} style={{ width: '100%', display: 'block' }} alt={howto.title} />
          </div>
        )}

        <div
          style={{ fontSize: '17px', lineHeight: '1.9', color: '#334155' }}
          className="howto-content"
          dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(howto.content?.replace(/\n/g, '<br/>') || '') }}
        />

        <button
          onClick={() => router.push('/howto')}
          style={{ marginTop: '60px', width: '100%', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#64748B', fontSize: '15px' }}
        >
          목록으로 돌아가기
        </button>
      </div>

      <style jsx global>{`
        .howto-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 30px 0;
          border-radius: 15px;
          border: 1px solid #E2E8F0;
        }
      `}</style>
    </div>
  );
}
