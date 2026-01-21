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

  // 기존 업체 등록 폼 상태 유지
  const [form, setForm] = useState({ name: '', price: '', kakaoUrl: '', desc: '', isPremium: false });
  // 새로운 공지사항 등록 폼 상태 추가
  const [noticeForm, setNoticeForm] = useState({ title: '', category: '공지사항', content: '' });
  
  const [image, setImage] = useState<File | null>(null);
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push('/admin');
    });

    // 업체 리스트 실시간 감시 유지
    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    onSnapshot(qItems, (snapshot) => setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))));

    // 공지사항 리스트 실시간 감시 추가
    const qNotices = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    onSnapshot(qNotices, (snapshot) => setNotices(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => unsubscribe();
  }, [router]);

  // 1. 기존 업체 등록 함수 (변경 없음)
  const handleUploadItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !form.name || !form.kakaoUrl) return alert('업체 정보를 모두 입력해주세요.');
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

  // 2. 신규 공지사항 등록 함수 추가
  const handleUploadNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeImage || !noticeForm.title) return alert('공지 제목과 사진을 등록해주세요.');
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

  const handleUploadBanner = async () => {
    if (!bannerImage) return alert('배너 사진을 선택하세요.');
    setLoading(true);
    try {
      const bRef = ref(storage, `banners/${Date.now()}`);
      await uploadBytes(bRef, bannerImage);
      const url = await getDownloadURL(bRef);
      await addDoc(collection(db, 'banners'), { imageUrl: url, createdAt: serverTimestamp() });
      alert('대문 사진 업데이트 완료!');
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  const handleDelete = async (col: string, id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) await deleteDoc(doc(db, col, id));
  };

  if (!user) return null;

  return (
    <div style={{ padding: '40px', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '30px' }}>메이플 아이템 관리 센터</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* 왼쪽: 기존 업체 관리 섹션 */}
        <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px' }}>
          <h3 style={{ color: '#ff9000', marginBottom: '15px' }}>기존 업체 관리</h3>
          <input placeholder="업체 식별 이름" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="카카오톡 링크" value={form.kakaoUrl} onChange={e => setForm({...form, kakaoUrl: e.target.value})} style={inputStyle} />
          <div style={{ margin: '15px 0' }}>
            <label style={{ cursor: 'pointer' }}><input type="checkbox" checked={form.isPremium} onChange={e => setForm({...form, isPremium: e.target.checked})} /> ★ 프리미엄 등록</label>
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

        {/* 오른쪽: 공지사항 & 대문 관리 섹션 */}
        <div>
          <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
            <h3 style={{ color: '#00aaff', marginBottom: '15px' }}>공지사항 작성</h3>
            <input placeholder="공지 제목" value={noticeForm.title} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} style={inputStyle} />
            <select value={noticeForm.category} onChange={e => setNoticeForm({...noticeForm, category: e.target.value})} style={inputStyle}>
              <option>공지사항</option><option>메이플 꿀팁</option><option>패치노트</option>
            </select>
            <textarea placeholder="공지 상세 내용" value={noticeForm.content} onChange={e => setNoticeForm({...noticeForm, content: e.target.value})} style={{ ...inputStyle, height: '100px', resize: 'none' }} />
            <input type="file" onChange={e => setNoticeImage(e.target.files![0])} style={inputStyle} />
            <button onClick={handleUploadNotice} disabled={loading} style={{ ...btnStyle, backgroundColor: '#00aaff' }}>공지 등록하기</button>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px' }}>
            <h3>메인 대문 관리</h3>
            <input type="file" onChange={e => setBannerImage(e.target.files![0])} style={inputStyle} />
            <button onClick={handleUploadBanner} disabled={loading} style={{ ...btnStyle, backgroundColor: '#444' }}>대문 배너 업데이트</button>
          </section>
        </div>
      </div>

      {/* 하단: 각각의 데이터 리스트 (업체와 공지사항이 별도로 관리됨) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '50px' }}>
        <section>
          <h3>등록된 업체 리스트</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <tbody style={{ textAlign: 'left' }}>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '10px' }}>{item.isPremium ? '★' : '일'}</td>
                  <td>{item.name}</td>
                  <td><button onClick={() => handleDelete('items', item.id)} style={delBtn}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3>등록된 공지사항 리스트</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <tbody style={{ textAlign: 'left' }}>
              {notices.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '10px', color: '#00aaff' }}>[{n.category}]</td>
                  <td>{n.title}</td>
                  <td><button onClick={() => handleDelete('notices', n.id)} style={delBtn}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '12px', margin: '10px 0', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' };
const btnStyle = { width: '100%', padding: '15px', backgroundColor: '#ff9000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as any };
const delBtn = { color: '#ff4444', background: 'none', border: '1px solid #ff4444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };