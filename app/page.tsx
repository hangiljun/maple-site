'use client';

import { useEffect, useState } from 'react';
import { db } from '../firebase'; // 경로 확인: 최상위 firebase.js 불러오기
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // 1. Firebase에서 아이템 목록 실시간으로 가져오기
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.id && doc.data()
      }));
      setItems(itemData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#ff9000' }}>메이플스토리 아이템 거래소</h1>
        <p>방금 등록된 따끈따끈한 매물을 확인하세요!</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid #333' }}>
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '15px' }} 
            />
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{item.name}</h3>
            <p style={{ color: '#ff9000', fontWeight: 'bold', fontSize: '20px' }}>{item.price} 메소</p>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>현재 등록된 아이템이 없습니다.</p>
      )}
    </div>
  );
}