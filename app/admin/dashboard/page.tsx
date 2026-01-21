'use client';

import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 기존 업체 등록 폼 상태
  const [form, setForm] = useState({ name: '', price: '', kakaoUrl: '', desc: '', isPremium: false });
  // 공지사항 등록 폼 상태
  const [noticeForm, setNoticeForm] = useState({ title: '', category: '공지사항', content: '' });
  
  const [image, setImage] = useState<File | null>(null);
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [mainBannerImage, setMainBannerImage] = useState<File | null>(null);
  const [noticeBannerImage, setNoticeBannerImage] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push('/admin');
    });

    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    onSnapshot(qItems, (snapshot) => setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qNotices = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    onSnapshot(qNotices, (snapshot) => setNotices(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => unsubscribe();
  }, [router]);

  // 업체 등록 (기존 로직 유지)
  const handleUploadItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !form.name || !form.kakaoUrl) return alert('업체 정보를 입력해주세요.');
    setLoading(true);
    try {
      const imgRef = ref(storage, `items/${Date.now()}`);
      await uploadBytes(imgRef, image);
      const url = await getDownloadURL(imgRef);
      await addDoc(collection(db, 'items'), { ...form, imageUrl: url, createdAt: serverTimestamp() });
      alert('업체 등록 완료!');
      setForm({ name: '', price: '', kakaoUrl: '', desc: '', isPremium: false });
      setImage(null);
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  // 공지사항 등록
  const handleUploadNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeImage || !noticeForm.title) return alert('제목과 사진을 등록해주세요.');
    setLoading(true);
    try {
      const imgRef = ref(storage, `notices/${Date.now()}`);
      await uploadBytes(imgRef, noticeImage);
      const url = await getDownloadURL(imgRef);
      await addDoc(collection(db, 'notices'), { ...noticeForm, imageUrl: url, createdAt: serverTimestamp() });
      alert('공지사항 등록 완료!');
      setNoticeForm({ title: '', category: '공지사항', content: '' });
      setNoticeImage(null);
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  // 메인 페이지 대문 관리 (복구)
  const handleUploadMainBanner = async () => {
    if (!mainBannerImage) return alert('메인 배너 사진을 선택하세요.');
    setLoading(true);
    try {
      const bRef = ref(storage, `banners/${Date.now()}`);
      await uploadBytes(bRef, mainBannerImage);
      const url = await getDownloadURL(bRef);
      await addDoc(collection(db, 'banners'), { imageUrl: url, createdAt: serverTimestamp() });
      alert('메인 대문 사진 업데이트 완료!');
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  // 공지사항 페이지 대문 관리
  const handleUploadNoticeBanner = async () => {
    if (!noticeBannerImage) return alert('공지 배너 사진을 선택하세요.');
    setLoading(true);
    try {
      const bRef = ref(storage, `noticeBanners/${Date.now()}`);
      await uploadBytes(bRef, noticeBannerImage);
      const url = await getDownloadURL(bRef);
      await addDoc(collection(db, 'noticeBanners'), { imageUrl: url, createdAt: serverTimestamp() });
      alert('공지사항 대문 사진 업데이트 완료!');
    } catch (err) { alert('오류 발생'); }
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
        {/* 기존 업체 관리 섹션 복구 */}
        <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px' }}>
          <h3 style={{ color: '#ff9000' }}>기존 업체 관리</h3>
          <input placeholder="업체명" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="카톡링크" value={form.kakaoUrl} onChange={e => setForm({...form, kakaoUrl: e.target.value})} style={inputStyle} />
          <div style={{ margin: '10px 0' }}>
            <label><input type="checkbox" checked={form.isPremium} onChange={e => setForm({...form, isPremium: e.target.checked})} /> 프리미엄 등록</label>
          </div>
          {!form.isPremium && (
            <>
              <input placeholder="설명" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} style={inputStyle} />
              <input placeholder="가격 정보" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle} />
            </>
          )}
          <input type="file" onChange={e => setImage(e.target.files![0])} style={inputStyle} />
          <button onClick={handleUploadItem} disabled={loading} style={btnStyle}>업체 등록하기</button>
        </section>

        {/* 공지사항 및 대문 관리 섹션 */}
        <div>
          <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px', marginBottom: '20px' }}>
            <h3 style={{ color: '#00aaff' }}>공지사항 작성</h3>
            <input placeholder="공지 제목" value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} style={inputStyle} />
            <select value={noticeForm.category} onChange={e => setNoticeForm({...noticeForm, category: e.target.value})} style={inputStyle}>
              <option>공지사항</option>
              <option>주의사항</option>
              <option>메이플패치</option>
            </select>
            <textarea placeholder="내용" value={noticeForm.content} onChange={e => setNoticeForm({...noticeForm, content: e.target.value})} style={{ ...inputStyle, height: '100px' }} />
            <input type="file" onChange={e => setNoticeImage(e.target.files![0])} style={inputStyle} />
            <button onClick={handleUploadNotice} disabled={loading} style={{ ...btnStyle, backgroundColor: '#00aaff' }}>공지 등록하기</button>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px' }}>
            <h3>대문 배너 통합 관리</h3>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '14px', color: '#aaa' }}>1. 메인 페이지 대문</p>
              <input type="file" onChange={e => setMainBannerImage(e.target.files![0])} style={inputStyle} />
              <button onClick={handleUploadMainBanner} disabled={loading} style={{ ...btnStyle, backgroundColor: '#444' }}>메인 배너 업데이트</button>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#aaa' }}>2. 공지사항 페이지 대문</p>
              <input type="file" onChange={e => setNoticeBannerImage(e.target.files![0])} style={inputStyle} />
              <button onClick={handleUploadNoticeBanner} disabled={loading} style={{ ...btnStyle, backgroundColor: '#444' }}>공지 배너 업데이트</button>
            </div>
          </section>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
        <section><h3>등록 업체 리스트</h3>{items.map(i => <div key={i.id} style={listStyle}><span>{i.name}</span><button onClick={()=>handleDelete('items', i.id)} style={delBtn}>삭제</button></div>)}</section>
        <section><h3>공지사항 리스트</h3>{notices.map(n => <div key={n.id} style={listStyle}><span>[{n.category}] {n.title}</span><button onClick={()=>handleDelete('notices', n.id)} style={delBtn}>삭제</button></div>)}</section>
      </div>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#ff9000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as any };
const listStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #333' };
const delBtn = { color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' };