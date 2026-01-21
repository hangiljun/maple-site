'use client';

import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({ name: '', price: '', kakaoUrl: '', desc: '', isPremium: false });
  const [noticeForm, setNoticeForm] = useState({ title: '', category: '공지사항', content: '' });
  const [howToContent, setHowToContent] = useState('');
  
  const [image, setImage] = useState<File | null>(null);
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [mainBannerImage, setMainBannerImage] = useState<File | null>(null);
  const [noticeBannerImage, setNoticeBannerImage] = useState<File | null>(null);
  const [howToBannerImage, setHowToBannerImage] = useState<File | null>(null);
  const [reviewBannerImage, setReviewBannerImage] = useState<File | null>(null);
  const [howToMainImage, setHowToMainImage] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push('/admin');
    });

    onSnapshot(query(collection(db, 'items'), orderBy('createdAt', 'desc')), (s) => setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(query(collection(db, 'notices'), orderBy('createdAt', 'desc')), (s) => setNotices(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')), (s) => setReviews(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => unsubscribe();
  }, [router]);

  // 기존 등록 로직들 유지
  const handleUploadItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !form.name || !form.kakaoUrl) return alert('정보를 입력하세요.');
    setLoading(true);
    try {
      const imgRef = ref(storage, `items/${Date.now()}`);
      await uploadBytes(imgRef, image);
      const url = await getDownloadURL(imgRef);
      await addDoc(collection(db, 'items'), { ...form, imageUrl: url, createdAt: serverTimestamp() });
      alert('등록 완료');
    } catch (err) { alert('오류'); }
    setLoading(false);
  };

  // 이미지 1050cb에서 누락되었던 거래방법 배너 업데이트 버튼 기능 추가
  const handleUploadHowToBanner = async () => {
    if (!howToBannerImage) return alert('사진을 선택하세요.');
    setLoading(true);
    try {
      const bRef = ref(storage, `howToBanners/banner`);
      await uploadBytes(bRef, howToBannerImage);
      const bannerUrl = await getDownloadURL(bRef);
      await setDoc(doc(db, 'settings', 'howto'), { bannerUrl, updatedAt: serverTimestamp() }, { merge: true });
      alert('거래방법 대문 사진 업데이트 완료!');
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  const handleUpdateHowTo = async () => {
    setLoading(true);
    try {
      let mainImgUrl = "";
      if (howToMainImage) {
        const mRef = ref(storage, `howToContents/main`);
        await uploadBytes(mRef, howToMainImage);
        mainImgUrl = await getDownloadURL(mRef);
      }
      await setDoc(doc(db, 'settings', 'howto'), { content: howToContent, mainImgUrl, updatedAt: serverTimestamp() }, { merge: true });
      alert('거래방법 본문 저장 완료!');
    } catch (err) { alert('오류'); }
    setLoading(false);
  };

  const handleDelete = async (col: string, id: string) => {
    if (confirm('삭제하시겠습니까?')) await deleteDoc(doc(db, col, id));
  };

  if (!user) return null;

  return (
    <div style={{ padding: '40px', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1>메이플 아이템 관리 센터</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
        <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px' }}>
          <h3>기존 업체 관리</h3>
          <input placeholder="업체명" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="카톡링크" value={form.kakaoUrl} onChange={e => setForm({...form, kakaoUrl: e.target.value})} style={inputStyle} />
          <input type="file" onChange={e => setImage(e.target.files![0])} style={inputStyle} />
          <button onClick={handleUploadItem} disabled={loading} style={btnStyle}>업체 등록하기</button>
        </section>

        <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px' }}>
          <h3>대문 배너 통합 관리</h3>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ fontSize: '13px', color: '#aaa' }}>1. 메인 배너</p>
            <input type="file" onChange={e => setMainBannerImage(e.target.files![0])} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ fontSize: '13px', color: '#aaa' }}>2. 공지사항 배너</p>
            <input type="file" onChange={e => setNoticeBannerImage(e.target.files![0])} style={inputStyle} />
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#aaa' }}>3. 거래방법 배너</p>
            <input type="file" onChange={e => setHowToBannerImage(e.target.files![0])} style={inputStyle} />
            {/* 버튼 누락 해결 */}
            <button onClick={handleUploadHowToBanner} style={smBtnStyle}>거래방법 배너 업데이트</button>
          </div>
        </section>
      </div>

      <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px', marginTop: '30px' }}>
        <h3>거래방법 페이지 관리</h3>
        <input type="file" onChange={e => setHowToMainImage(e.target.files![0])} style={inputStyle} />
        <textarea value={howToContent} onChange={e => setHowToContent(e.target.value)} style={{ ...inputStyle, height: '100px' }} />
        <button onClick={handleUpdateHowTo} style={{ ...btnStyle, backgroundColor: '#00ff88', color: '#000' }}>본문 저장하기</button>
      </section>

      <div style={{ marginTop: '40px' }}>
        <h3>이용후기 삭제 관리</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {reviews.map(r => (
            <div key={r.id} style={{ padding: '10px', backgroundColor: '#333', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px' }}>{r.nickname}</p>
              <button onClick={() => handleDelete('reviews', r.id)} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px', width: '100%', cursor: 'pointer' }}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#ff9000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as any };
const smBtnStyle = { width: '100%', padding: '8px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' };