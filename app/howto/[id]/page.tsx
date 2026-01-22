'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';

export default function HowtoDetailPage() {
  const { id } = useParams();
  const [howto, setHowto] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHowto = async () => {
      const docRef = doc(db, 'howto', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setHowto(docSnap.data());
    };
    fetchHowto();
  }, [id]);

  if (!howto) return <div style={{ textAlign: 'center', padding: '100px', color: '#FFF', backgroundColor: '#0F172A', minHeight: '100vh' }}>로딩 중...</div>;

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #334155', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', fontWeight: 'bold' }}>뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <span style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '16px' }}>{howto.category}</span>
        <h1 style={{ fontSize: '32px', margin: '15px 0 40px 0', fontWeight: 'bold', lineHeight: '1.3' }}>{howto.title}</h1>
        
        {howto.imageUrl && (
          <div style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', border: '1px solid #334155' }}>
            <img src={howto.imageUrl} style={{ width: '100%', display: 'block' }} alt="대표 이미지" />
          </div>
        )}

        {/* 본문 및 이미지 태그 렌더링 */}
        <div 
          style={{ fontSize: '18px', lineHeight: '1.9', color: '#CBD5E1' }}
          className="howto-content"
          dangerouslySetInnerHTML={{ 
            __html: howto.content?.replace(/\n/g, '<br/>') 
          }} 
        />
      </div>

      <style jsx global>{`
        .howto-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 30px 0;
          border-radius: 15px;
          border: 1px solid #334155;
        }
      `}</style>
    </div>
  );
}