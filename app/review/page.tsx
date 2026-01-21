'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); 
  const [selectedReview, setSelectedReview] = useState<any>(null); // 클릭한 후기 상세 정보
  const router = useRouter();

  const [form, setForm] = useState({ nickname: '', password: '', title: '', content: '' });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (s) => {
      setReviews(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 후기 등록 함수
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nickname || !form.password || !form.title || !form.content) return alert('모든 항목을 입력해주세요.');
    setLoading(true);
    try {
      let url = "";
      if (image) {
        const imgRef = ref(storage, `reviews/${Date.now()}`);
        await uploadBytes(imgRef, image);
        url = await getDownloadURL(imgRef);
      }
      await addDoc(collection(db, 'reviews'), { 
        ...form, 
        imageUrl: url, 
        createdAt: serverTimestamp(),
        views: 0
      });
      alert('후기가 등록되었습니다!');
      setForm({ nickname: '', password: '', title: '', content: '' });
      setImage(null);
      setShowForm(false);
    } catch (err) { alert('등록 중 오류 발생'); }
    setLoading(false);
  };

  // 상세 보기 클릭 시 조회수 증가 및 모달 열기
  const openReview = async (review: any) => {
    setSelectedReview(review);
    const docRef = doc(db, 'reviews', review.id);
    await updateDoc(docRef, { views: increment(1) });
  };

  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 상단 네비게이션 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #EEE', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>거래방법</span>
          <span style={{ cursor: 'pointer', color: '#FF9000' }} onClick={() => window.scrollTo(0,0)}>이용후기</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>이용후기</h2>

        {/* 게시판 목록 헤더 */}
        <div style={{ display: 'flex', borderTop: '2px solid #333', borderBottom: '1px solid #DDD', padding: '15px 0', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', backgroundColor: '#F9F9F9' }}>
          <div style={{ width: '10%' }}>번호</div>
          <div style={{ width: '55%' }}>제목</div>
          <div style={{ width: '15%' }}>작성자</div>
          <div style={{ width: '10%' }}>작성일</div>
          <div style={{ width: '10%' }}>조회</div>
        </div>

        {/* 게시글 리스트 */}
        {reviews.map((r, index) => (
          <div key={r.id} style={{ display: 'flex', borderBottom: '1px solid #EEE', padding: '15px 0', fontSize: '14px', textAlign: 'center', alignItems: 'center' }}>
            <div style={{ width: '10%', color: '#999' }}>{reviews.length - index}</div>
            <div style={{ width: '55%', textAlign: 'left', paddingLeft: '20px', cursor: 'pointer', fontWeight: '500' }} onClick={() => openReview(r)}>
              {r.title} {r.imageUrl && <span style={{ color: '#FF9000', fontSize: '12px', marginLeft: '5px' }}>[사진]</span>}
            </div>
            <div style={{ width: '15%', color: '#666' }}>{r.nickname}</div>
            <div style={{ width: '10%', color: '#999' }}>{r.createdAt?.toDate().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}</div>
            <div style={{ width: '10%', color: '#999' }}>{r.views || 0}</div>
          </div>
        ))}

        {/* 글쓰기 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => setShowForm(true)} style={{ backgroundColor: '#FF9000', color: '#FFF', padding: '10px 25px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>글쓰기</button>
        </div>

        {/* 1. 글쓰기 모달 (이미지 요청 스타일) */}
        {showForm && (
          <div style={modalOverlayStyle}>
            <div style={{ ...modalContentStyle, maxWidth: '600px' }}>
              <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>후기 작성하기</h3>
              <input placeholder="제목을 입력하세요" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={fullInputStyle} />
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input placeholder="닉네임" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} style={inputStyle} />
                <input type="password" placeholder="비밀번호" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
              </div>
              <textarea placeholder="내용을 입력하세요" value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{ ...fullInputStyle, height: '200px', resize: 'none' }} />
              <input type="file" onChange={e => setImage(e.target.files![0])} style={{ marginBottom: '20px', display: 'block' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleUpload} disabled={loading} style={{ flex: 1, padding: '15px', backgroundColor: '#FF9000', color: '#FFF', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>등록</button>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '15px', backgroundColor: '#EEE', color: '#333', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>취소</button>
              </div>
            </div>
          </div>
        )}

        {/* 2. 후기 상세보기 모달 */}
        {selectedReview && (
          <div style={modalOverlayStyle}>
            <div style={{ ...modalContentStyle, maxWidth: '700px' }}>
              <div style={{ borderBottom: '1px solid #EEE', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedReview.title}</h3>
                <div style={{ fontSize: '13px', color: '#999', marginTop: '10px' }}>
                  작성자: {selectedReview.nickname} | 일시: {selectedReview.createdAt?.toDate().toLocaleString()}
                </div>
              </div>
              <div style={{ minHeight: '200px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {selectedReview.imageUrl && <img src={selectedReview.imageUrl} style={{ maxWidth: '100%', borderRadius: '10px', marginBottom: '20px' }} />}
                {selectedReview.content}
              </div>
              <button onClick={() => setSelectedReview(null)} style={{ width: '100%', marginTop: '30px', padding: '12px', backgroundColor: '#333', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: '#FFF', padding: '30px', borderRadius: '15px', width: '90%', maxHeight: '90vh', overflowY: 'auto' };
const inputStyle = { flex: 1, padding: '12px', border: '1px solid #DDD', borderRadius: '5px' };
const fullInputStyle = { width: '100%', padding: '12px', border: '1px solid #DDD', borderRadius: '5px', marginBottom: '15px' };