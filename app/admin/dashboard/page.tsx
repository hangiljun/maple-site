'use client';

import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push('/admin');
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !price || !image) return alert('모든 정보를 입력해주세요!');

    setLoading(true);
    try {
      // 1. 사진을 Firebase Storage에 업로드
      const imageRef = ref(storage, `items/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // 2. 아이템 정보를 Firestore 데이터베이스에 저장
      await addDoc(collection(db, 'items'), {
        name: itemName,
        price: price,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });

      alert('아이템 등록 완료!');
      setItemName(''); setPrice(''); setImage(null); // 입력창 초기화
    } catch (error) {
      console.error(error);
      alert('등록 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin');
  };

  if (!user) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>권한 확인 중...</div>;

  return (
    <div style={{ padding: '40px', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>관리자 대시보드</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#444', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>로그아웃</button>
      </div>
      
      <form onSubmit={handleUpload} style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '10px' }}>
        <h2 style={{ marginBottom: '20px' }}>새 아이템 등록</h2>
        
        <label>아이템 이름</label>
        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="예: 앱솔랩스 나이트글러브" style={inputStyle} />
        
        <label>가격</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="예: 10,000,000" style={inputStyle} />
        
        <label>아이템 스샷</label>
        <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} style={inputStyle} />
        
        <button type="submit" disabled={loading} style={{ ...buttonStyle, backgroundColor: loading ? '#666' : '#ff9000' }}>
          {loading ? '등록 중...' : '아이템 올리기'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  display: 'block', width: '100%', padding: '12px', margin: '10px 0 20px 0', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white'
};

const buttonStyle = {
  width: '100%', padding: '15px', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' as const, cursor: 'pointer', fontSize: '16px'
};