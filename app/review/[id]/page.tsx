'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReview = async () => {
      const docRef = doc(db, 'reviews', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReview(docSnap.data());
        // 조회수 1 증가
        await updateDoc(docRef, { views: increment(1) });
      }
    };
    fetchReview();
  }, [id]);

  if (!review) return <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#0F172A', minHeight: '100vh', color: '#FFF' }}>로딩 중...</div>;

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', borderBottom: '1px solid #334155', backgroundColor: 'rgba(15, 23, 42, 0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </div>
          <div style={{ fontWeight: '900', color: '#FF9000', fontSize: '20px' }}>메이플 아이템</div>
        </div>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', fontWeight: 'bold' }}>뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '15px', color: '#FF9000' }}>{review.title}</h1>
        <div style={{ paddingBottom: '20px', borderBottom: '1px solid #334155', marginBottom: '30px', color: '#94A3B8', fontSize: '14px' }}>
          작성자: {review.nickname?.split('@')[0]} | 조회수: {(review.views || 0) + 1} | 날짜: {review.createdAt?.toDate().toLocaleDateString()}
        </div>

        <div style={{ minHeight: '300px', lineHeight: '1.9', fontSize: '17px', color: '#E2E8F0' }}>
          {review.imageUrl && (
            <div style={{ marginBottom: '30px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #334155' }}>
              <img src={review.imageUrl} style={{ width: '100%', display: 'block' }} alt="후기 인증샷" />
            </div>
          )}
          <p style={{ whiteSpace: 'pre-wrap' }}>{review.content}</p>
        </div>

        <button 
          onClick={() => router.push('/review')}
          style={{ marginTop: '50px', width: '100%', padding: '15px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}