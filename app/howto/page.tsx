'use client';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function HowtoPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'posts'), where('category', '==', 'howto'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: "'Noto Sans KR', sans-serif", padding: '20px' }}>
      <button onClick={() => router.push('/')} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#334155', borderRadius: '8px', border: 'none', color: '#FFF', cursor: 'pointer' }}>← 홈으로 돌아가기</button>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF9000', marginBottom: '30px' }}>거래방법</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ backgroundColor: '#1E293B', padding: '25px', borderRadius: '15px', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br/>') }} style={{ lineHeight: '1.6', color: '#CBD5E1' }} />
          </div>
        ))}
      </div>
    </div>
  );
}