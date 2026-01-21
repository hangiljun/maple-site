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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 입력 폼 상태
  const [form, setForm] = useState({ name: '', price: '', kakao: '', desc: '' });
  const [image, setImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push('/admin');
    });

    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const unsubList = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubscribe(); unsubList(); };
  }, [router]);

  // 업체 등록
  const handleUploadItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !form.name) return alert('정보를 입력해주세요.');
    setLoading(true);
    try {
      const imgRef = ref(storage, `items/${Date.now()}`);
      await uploadBytes(imgRef, image);
      const url = await getDownloadURL(imgRef);
      await addDoc(collection(db, 'items'), {
        name: form.name, price: form.price, kakaoUrl: form.kakao, description: form.desc, imageUrl: url, createdAt: serverTimestamp()
      });
      alert('업체 등록 완료!');
      setForm({ name: '', price: '', kakao: '', desc: '' });
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  // 대문 배너 변경
  const handleUploadBanner = async () => {
    if (!bannerImage) return alert('이미지를 선택하세요.');
    setLoading(true);
    try {
      const bRef = ref(storage, `banners/${Date.now()}`);
      await uploadBytes(bRef, bannerImage);
      const url = await getDownloadURL(bRef);
      await addDoc(collection(db, 'banners'), { imageUrl: url, createdAt: serverTimestamp() });
      alert('대문 사진이 변경되었습니다!');
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  // 삭제 기능
  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'items', id));
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '40px', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1>관리 센터</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
        {/* 업체 등록 폼 */}
        <section style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px' }}>
          <h3>새 매입 업체 등록</h3>
          <input placeholder="업체명" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="한줄 설명(예: 업계 최고가)" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} style={inputStyle} />
          <input placeholder="매입 가격/조건" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle} />
          <input placeholder="카카오톡 링크 (https://...)" value={form.kakao} onChange={e => setForm({...form, kakao: e.target.value})} style={inputStyle} />
          <input type="file" onChange={e => setImage(e.target.files![0])} style={inputStyle} />
          <button onClick={handleUploadItem} disabled={loading} style={btnStyle}>업체 등록하기</button>
        </section>

        {/* 배너 관리 */}
        <section style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px' }}>
          <h3>대문 사진(배너) 교체</h3>
          <p style={{ fontSize: '12px', color: '#888' }}>가장 최근에 올린 사진이 메인에 뜹니다.</p>
          <input type="file" onChange={e => setBannerImage(e.target.files![0])} style={inputStyle} />
          <button onClick={handleUploadBanner} disabled={loading} style={{ ...btnStyle, backgroundColor: '#444' }}>배너 변경하기</button>
        </section>
      </div>

      {/* 등록된 업체 리스트 (삭제 버튼 포함) */}
      <h3 style={{ marginTop: '50px' }}>현재 등록된 홍보 업체 목록</h3>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            <th style={{ padding: '10px' }}>업체명</th>
            <th>조건</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '15px' }}>{item.name}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => handleDelete(item.id)} style={{ color: '#ff4444', background: 'none', border: '1px solid #ff4444', cursor: 'pointer', padding: '5px 10px' }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#ff9000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' as const };