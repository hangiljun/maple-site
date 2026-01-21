'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({ title: '', nickname: '', password: '', content: '' });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    // 실시간 데이터 동기화
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (s) => {
      const data = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
      setFilteredReviews(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    const filtered = reviews.filter(r => 
      r.title.includes(searchTerm) || r.nickname.includes(searchTerm) || r.content.includes(searchTerm)
    );
    setFilteredReviews(filtered);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.nickname || !form.password || !form.content) return alert('모두 입력하세요.');
    setLoading(true);
    try {
      let url = "";
      if (image) {
        const imgRef = ref(storage, `reviews/${Date.now()}`);
        await uploadBytes(imgRef, image);
        url = await getDownloadURL(imgRef);
      }
      await addDoc(collection(db, 'reviews'), { ...form, imageUrl: url, createdAt: serverTimestamp(), views: 0 });
      alert('후기 등록 완료!');
      setShowForm(false);
      setForm({ title: '', nickname: '', password: '', content: '' });
      setImage(null);
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  const openReview = async (review: any) => {
    setSelectedReview(review);
    await updateDoc(doc(db, 'reviews', review.id), { views: increment(1) });
  };

  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', borderBottom: '1px solid #EEE', backgroundColor: '#FFF', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ cursor: 'pointer', fontWeight: '900', color: '#FF9000', fontSize: '22px' }} onClick={() => router.push('/')}>메이플 아이템</div>
        <div style={{ display: 'flex', gap: '25px', fontWeight: '600', fontSize: '15px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>거래방법</span>
          <span style={{ color: '#FF9000' }}>이용후기</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px', fontWeight: 'bold' }}>이용후기</h2>
        
        {/* 게시판 목록 헤더 */}
        <div style={{ borderTop: '2px solid #333', borderBottom: '1px solid #DDD', padding: '15px 0', display: 'flex', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#F9F9F9', fontSize: '14px' }}>
          <div style={{ width: '10%' }}>번호</div>
          <div style={{ width: '55%' }}>제목</div>
          <div style={{ width: '15%' }}>작성자</div>
          <div style={{ width: '10%' }}>작성일</div>
          <div style={{ width: '10%' }}>조회</div>
        </div>

        {/* 리뷰 리스트 출력 */}
        {filteredReviews.length > 0 ? filteredReviews.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', padding: '15px 0', borderBottom: '1px solid #EEE', textAlign: 'center', fontSize: '14px', alignItems: 'center' }}>
            <div style={{ width: '10%', color: '#999' }}>{filteredReviews.length - i}</div>
            <div style={{ width: '55%', textAlign: 'left', paddingLeft: '20px', cursor: 'pointer', fontWeight: '500' }} onClick={() => openReview(r)}>
              {r.title} {r.imageUrl && <span style={{ color: '#FF9000', fontSize: '11px', marginLeft: '5px' }}>[사진]</span>}
            </div>
            <div style={{ width: '15%', color: '#666' }}>{r.nickname.split('@')[0]}</div>
            <div style={{ width: '10%', color: '#999' }}>{r.createdAt?.toDate().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}</div>
            <div style={{ width: '10%', color: '#999' }}>{r.views || 0}</div>
          </div>
        )) : (
          <p style={{ textAlign: 'center', padding: '50px', color: '#999' }}>작성된 후기가 없습니다.</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => setShowForm(true)} style={{ backgroundColor: '#000', color: '#FFF', padding: '10px 25px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>글쓰기</button>
        </div>

        {/* 하단 검색바 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
          <input 
            placeholder="제목 및 내용 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 15px', border: '1px solid #DDD', width: '350px', borderRadius: '5px' }}
          />
          <button 
            onClick={handleSearch}
            style={{ padding: '10px 25px', backgroundColor: '#F9F9F9', border: '1px solid #DDD', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            검색
          </button>
        </div>
      </div>

      {/* 후기 작성 모달 */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '18px', borderBottom: '1px solid #EEE', paddingBottom: '10px' }}>후기 작성</h3>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>제목 *</p>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={fullInputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>작성자 *</p>
                <input placeholder="이메일 주소" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} style={fullInputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>비밀번호 *</p>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={fullInputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{ ...fullInputStyle, height: '200px', resize: 'none' }} placeholder="내용을 입력하세요" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>사진 첨부</p>
              <input type="file" onChange={e => setImage(e.target.files![0])} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpload} disabled={loading} style={{ flex: 1, padding: '12px', backgroundColor: '#000', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>저장하기</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#EEE', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>돌아가기</button>
            </div>
          </div>
        </div>
      )}

      {/* 후기 상세 보기 모달 */}
      {selectedReview && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', padding: '35px', borderRadius: '15px', width: '90%', maxWidth: '750px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>{selectedReview.title}</h3>
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>작성자: {selectedReview.nickname} | 조회수: {selectedReview.views}</p>
            <div style={{ minHeight: '300px', borderTop: '1px solid #EEE', paddingTop: '20px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#333' }}>
              {selectedReview.imageUrl && <img src={selectedReview.imageUrl} style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '20px' }} />}
              <p>{selectedReview.content}</p>
            </div>
            <button onClick={() => setSelectedReview(null)} style={{ width: '100%', marginTop: '20px', padding: '14px', backgroundColor: '#333', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

const fullInputStyle = { width: '100%', padding: '12px', border: '1px solid #DDD', borderRadius: '5px', fontSize: '14px' };