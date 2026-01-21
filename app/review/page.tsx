'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [bannerUrl, setBannerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 후기 작성 폼 상태
  const [form, setForm] = useState({ nickname: '', password: '', content: '' });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    // 이용후기 배너 가져오기
    const getBanner = async () => {
      const d = await getDoc(doc(db, 'settings', 'reviewBanner'));
      if (d.exists()) setBannerUrl(d.data().url);
    };
    getBanner();

    // 후기 리스트 실시간 동기화
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (s) => setReviews(s.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nickname || !form.password || !form.content) return alert('내용을 모두 입력해주세요.');
    setLoading(true);
    try {
      let url = "";
      if (image) {
        const imgRef = ref(storage, `reviews/${Date.now()}`);
        await uploadBytes(imgRef, image);
        url = await getDownloadURL(imgRef);
      }
      await addDoc(collection(db, 'reviews'), { ...form, imageUrl: url, createdAt: serverTimestamp() });
      alert('후기가 등록되었습니다!');
      setForm({ nickname: '', password: '', content: '' });
      setImage(null);
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 60px', backgroundColor: '#FFF', borderBottom: '1px solid #E5E0D5', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9000' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '15px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>거래방법</span>
          <span style={{ cursor: 'pointer', color: '#FF9000' }} onClick={() => window.scrollTo(0,0)}>이용후기</span>
        </div>
      </nav>

      {/* 이용후기 배너 */}
      <div style={{ width: '100%', height: '300px', backgroundColor: '#DDD', position: 'relative', overflow: 'hidden' }}>
        {bannerUrl ? <img src={bannerUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="banner" /> : 
        <div style={{ width: '100%', height: '100%', backgroundColor: '#EEE', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>배너를 등록해주세요</div>}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>실제 이용 고객님들의 생생한 후기</h1>
        </div>
      </div>

      <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* 후기 작성 폼 */}
        <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '20px', marginBottom: '50px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>후기 작성하기</h3>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input placeholder="닉네임" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} style={inputStyle} />
              <input type="password" placeholder="비밀번호" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
            </div>
            <textarea placeholder="정직한 후기를 남겨주세요!" value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{ ...inputStyle, height: '100px', marginBottom: '10px' }} />
            <input type="file" onChange={e => setImage(e.target.files![0])} style={{ marginBottom: '15px' }} />
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#FF9000', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>등록하기</button>
          </form>
        </div>

        {/* 후기 리스트 (이미지 그리드 형태) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {reviews.map((r) => (
            <div key={r.id} style={{ backgroundColor: '#FFF', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 10px rgba(0,0,0,0.05)' }}>
              {r.imageUrl && <img src={r.imageUrl} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="review" />}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{r.nickname}</span>
                  <span style={{ fontSize: '12px', color: '#AAA' }}>{r.createdAt?.toDate().toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>{r.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', border: '1px solid #DDD', borderRadius: '8px' };