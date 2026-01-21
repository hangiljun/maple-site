'use client';

import { useState } from 'react';
import { auth } from '../../firebase'; // 파일 위치에 맞게 경로 수정
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('관리자님 환영합니다!');
      router.push('/admin/dashboard'); // 로그인 성공 시 이동할 페이지
    } catch (error) {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ marginBottom: '30px' }}>관리자 전용 로그인</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: '0 auto' }}>
        <input 
          type="email" 
          placeholder="관리자 이메일" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', color: 'black' }}
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: 'none', color: 'black' }}
        />
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#ff9000', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          로그인하기
        </button>
      </form>
    </div>
  );
}