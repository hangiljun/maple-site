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
  const router = useRouter();

  // 유저 작성용 상태
  const [form, setForm] = useState({ nickname: '', password: '', content: '' });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    // 1. 관리자가 등록한 이용후기 배너 가져오기
    const getBanner = async () => {
      const d = await getDoc(doc(db, 'settings', 'reviewBanner'));
      if (d.exists()) setBannerUrl(d.data().url);
    };
    getBanner();

    // 2. 유저들이 작성한 후기 리스트 실시간 동기화
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (s) => {
      setReviews(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 후기 등록 함수 (유저용)
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nickname || !form.password || !form.content) return alert('모든 항목을 입력해주세요.');
    setLoading(true);
    try {
      let url = "";
      if (image) {
        const imgRef = ref(storage, `reviews/${Date.now()}`);
        await uploadBytes(imgRef, image);
        url = await getDownloadURL(imgRef);
      }
      // 데이터베이스에 후기 저장
      await addDoc(collection(db, 'reviews'), { 
        ...form, 
        imageUrl: url, 
        createdAt: serverTimestamp() 
      });
      alert('후기가 성공적으로 등록되었습니다!');
      setForm({ nickname: '', password: '', content: '' });
      setImage(null);
    } catch (err) { alert('등록 중 오류가 발생했습니다.'); }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 상단 네비게이션 - '홈' 추가 및 경로 연결 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} onError={(e)=>(e.currentTarget.style.display='none')} />
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>거래방법</span>
          <span style={{ cursor: 'pointer', color: '#FF9000' }} onClick={() => window.scrollTo(0,0)}>이용후기</span>
        </div>
      </nav>

      {/* 이용후기 상단 배너 섹션 */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#DDD', position: 'relative', overflow: 'hidden' }}>
        {bannerUrl && <img src={bannerUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="banner" />}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>이용후기</h1>
          <p style={{ fontSize: '18px', marginTop: '10px' }}>고객님들의 소중한 거래 후기를 확인하세요.</p>
        </div>
      </div>

      <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* 후기 작성 폼 */}
        <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '25px', marginBottom: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px' }}>의견 남기기</h3>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <input placeholder="닉네임" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} style={inputStyle} />
              <input type="password" placeholder="비밀번호 (삭제용)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
            </div>
            <textarea placeholder="거래 경험을 공유해 주세요!" value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{ ...inputStyle, height: '120px', marginBottom: '15px', resize: 'none' }} />
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>사진 첨부 (선택)</p>
              <input type="file" onChange={e => setImage(e.target.files![0])} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#FF9000', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>후기 등록하기</button>
          </form>
        </div>

        {/* 후기 그리드 리스트 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {reviews.map((r) => (
            <div key={r.id} style={{ backgroundColor: '#FFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', border: '1px solid #EEE' }}>
              {r.imageUrl && <img src={r.imageUrl} style={{ width: '100%', height: '220px', objectFit: 'cover' }} alt="review" />}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{r.nickname}</span>
                  <span style={{ fontSize: '12px', color: '#AAA' }}>{r.createdAt?.toDate().toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#444' }}>{r.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '14px', border: '1px solid #E5E0D5', borderRadius: '10px', fontSize: '14px', backgroundColor: '#FDFDFB' };