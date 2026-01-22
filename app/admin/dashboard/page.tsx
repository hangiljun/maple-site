'use client';

import { useState } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert('제목과 내용을 입력해주세요.');

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        createdAt: serverTimestamp(),
      });
      alert('게시글이 성공적으로 등록되었습니다.');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#FF9000' }}>관리자 게시글 작성</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>제목</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #E5E0D5', fontSize: '16px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>내용</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              style={{ width: '100%', height: '400px', padding: '15px', borderRadius: '10px', border: '1px solid #E5E0D5', fontSize: '16px', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '18px', 
              backgroundColor: loading ? '#CCC' : '#FF9000', 
              color: '#FFF', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              cursor: loading ? 'default' : 'pointer' 
            }}
          >
            {loading ? '등록 중...' : '게시글 등록하기'}
          </button>
        </form>
        
        <button 
          onClick={() => router.push('/')}
          style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: 'transparent', border: 'none', color: '#999', cursor: 'pointer', textDecoration: 'underline' }}
        >
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}