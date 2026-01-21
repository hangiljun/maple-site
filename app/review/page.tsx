'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [bannerUrl, setBannerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // 글쓰기 폼 열고 닫기
  const router = useRouter();

  const [form, setForm] = useState({ nickname: '', password: '', title: '', content: '' });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const getBanner = async () => {
      const d = await getDoc(doc(db, 'settings', 'reviewBanner'));
      if (d.exists()) setBannerUrl(d.data().url);
    };
    getBanner();

    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (s) => {
      setReviews(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

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
        views: Math.floor(Math.random() * 50) + 1 // 조회수 랜덤 생성
      });
      alert('후기가 등록되었습니다!');
      setForm({ nickname: '', password: '', title: '', content: '' });
      setImage(null);
      setShowForm(false);
    } catch (err) { alert('등록 중 오류 발생'); }
    setLoading(false);
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
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>최신순 이용후기</h2>

        {/* 게시판 헤더 (이미지 120fe1 스타일 참고) */}
        <div style={{ display: 'flex', borderTop: '2px solid #333', borderBottom: '1px solid #DDD', padding: '15px 0', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', backgroundColor: '#F9F9F9' }}>
          <div style={{ width: '10%' }}>카테고리</div>
          <div style={{ width: '55%' }}>제목</div>
          <div style={{ width: '15%' }}>작성자</div>
          <div style={{ width: '10%' }}>작성일</div>
          <div style={{ width: '10%' }}>조회</div>
        </div>

        {/* 게시글 리스트 (이미지 10c54e 스타일 참고) */}
        {reviews.map((r) => (
          <div key={r.id} style={{ display: 'flex', borderBottom: '1px solid #EEE', padding: '15px 0', fontSize: '14px', textAlign: 'center', alignItems: 'center' }}>
            <div style={{ width: '10%', color: '#FF9000', fontWeight: 'bold' }}>메이플스토리</div>
            <div style={{ width: '55%', textAlign: 'left', paddingLeft: '20px', cursor: 'pointer', fontWeight: '500' }} onClick={() => alert(r.content)}>
              {r.title} {r.imageUrl && <span style={{ color: '#00AAFF', fontSize: '12px' }}>[사진]</span>}
            </div>
            <div style={{ width: '15%', color: '#666' }}>{r.nickname}</div>
            <div style={{ width: '10%', color: '#999' }}>{r.createdAt?.toDate().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}</div>
            <div style={{ width: '10%', color: '#999' }}>{r.views || 0}</div>
          </div>
        ))}

        {/* 글쓰기 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#000', color: '#FFF', padding: '10px 25px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {showForm ? '닫기' : '글쓰기'}
          </button>
        </div>

        {/* 글쓰기 폼 */}
        {showForm && (
          <div style={{ marginTop: '30px', padding: '30px', border: '1px solid #DDD', borderRadius: '15px', backgroundColor: '#F9F9F9' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input placeholder="닉네임" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} style={inputStyle} />
              <input type="password" placeholder="비밀번호" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
            </div>
            <input placeholder="글 제목을 입력해주세요" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{...inputStyle, width: '100%', marginBottom: '10px'}} />
            <textarea placeholder="내용을 입력해주세요" value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{ ...inputStyle, width: '100%', height: '150px', marginBottom: '10px' }} />
            <input type="file" onChange={e => setImage(e.target.files![0])} style={{ marginBottom: '15px', display: 'block' }} />
            <button onClick={handleUpload} disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#FF9000', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>등록하기</button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', border: '1px solid #DDD', borderRadius: '5px', fontSize: '14px' };