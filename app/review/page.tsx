'use client';

import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]); // 검색 결과 상태
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
      setFilteredReviews(data);
    });
  }, []);

  // 검색 로직 추가 (이미지 120fe1 하단 검색창 연동)
  const handleSearch = () => {
    const filtered = reviews.filter(r => 
      r.title.includes(searchTerm) || r.nickname.includes(searchTerm)
    );
    setFilteredReviews(filtered);
  };

  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* (중간 리스트 출력 로직 생략 - 기존 디자인 유지) */}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 게시글 목록 출력 부분에 filteredReviews 사용 */}
        {filteredReviews.map((r, index) => (
          <div key={r.id} style={{ display: 'flex', borderBottom: '1px solid #EEE', padding: '15px 0' }}>
            {/* 리스트 항목들... */}
          </div>
        ))}

        {/* 하단 검색바 (이미지 120fe1 스타일) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
          <input 
            placeholder="제목 및 내용 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 15px', border: '1px solid #DDD', width: '300px' }}
          />
          <button 
            onClick={handleSearch}
            style={{ padding: '8px 20px', backgroundColor: '#F9F9F9', border: '1px solid #DDD', cursor: 'pointer' }}
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
}