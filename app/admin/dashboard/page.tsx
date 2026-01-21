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

  const [form, setForm] = useState({ name: '', price: '', kakao: '', desc: '', isPremium: false });
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

  const handleUploadItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !form.name) return alert('정보를 입력해주세요.');
    setLoading(true);
    try {
      const imgRef = ref(storage, `items/${Date.now()}`);
      await uploadBytes(imgRef, image);
      const url = await getDownloadURL(imgRef);
      await addDoc(collection(db, 'items'), {
        ...form,
        imageUrl: url,
        createdAt: serverTimestamp()
      });
      alert('업체 등록 완료!');
      setForm({ name: '', price: '', kakao: '', desc: '', isPremium: false });
      setImage(null);
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  const handleUploadBanner = async () => {
    if (!bannerImage) return alert('이미지를 선택하세요.');
    setLoading(true);
    try {
      const bRef = ref(storage, `banners/${Date.now()}`);
      await uploadBytes(bRef, bannerImage);
      const url = await getDownloadURL(bRef);
      await addDoc(collection(db, 'banners'), { imageUrl: url, createdAt: serverTimestamp() });
      alert('대문 사진이 업데이트되었습니다!');
      setBannerImage(null);
    } catch (err) { alert('오류 발생'); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'items', id));
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '40px', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1>메이플 아이템 관리 센터</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
        {/* 업체 등록 섹션 */}
        <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px' }}>
          <h3 style={{ color: '#ff9000' }}>신규 업체 등록</h3>
          <p style={{ fontSize: '12px', color: '#888' }}>* 프리미엄 업체는 1200x300 사이즈 권장</p>
          
          <input placeholder="업체 식별 이름 (관리용)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="카카오톡 링크 (https://...)" value={form.kakao} onChange={e => setForm({...form, kakao: e.target.value})} style={inputStyle} />
          
          <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#252525', borderRadius: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPremium} onChange={e => setForm({...form, isPremium: e.target.checked})} style={{ width: '20px', height: '20px' }} />
              <span style={{ fontWeight: 'bold' }}>★ 프리미엄 인증 파트너로 등록</span>
            </label>
          </div>

          {!form.isPremium && (
            <>
              <input placeholder="일반 업체용 설명" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} style={inputStyle} />
              <input placeholder="일반 업체용 가격 정보" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle} />
            </>
          )}

          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>업체 사진 (이미지만 노출됨)</span>
            <input type="file" onChange={e => setImage(e.target.files![0])} style={inputStyle} />
          </div>
          
          <button onClick={handleUploadItem} disabled={loading} style={btnStyle}>업체 등록하기</button>
        </section>

        {/* 대문 배너 섹션 */}
        <section style={{ backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '15px' }}>
          <h3>메인 대문 사진 관리</h3>
          <p style={{ fontSize: '12px', color: '#888' }}>메인 최상단 배경 사진을 교체합니다.</p>
          <input type="file" onChange={e => setBannerImage(e.target.files![0])} style={inputStyle} />
          <button onClick={handleUploadBanner} disabled={loading} style={{ ...btnStyle, backgroundColor: '#444' }}>배너 업데이트</button>
        </section>
      </div>

      {/* 리스트 관리 */}
      <h3 style={{ marginTop: '50px' }}>현재 등록 리스트</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ padding: '15px' }}>유형</th>
              <th>이름</th>
              <th>카톡 링크</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '15px' }}>{item.isPremium ? <b style={{color:'#ff9000'}}>PREMIUM</b> : '일반'}</td>
                <td>{item.name}</td>
                <td style={{ fontSize: '12px', color: '#666' }}>{item.kakaoUrl}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)} style={{ color: '#ff4444', background: 'none', border: '1px solid #ff4444', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '12px', margin: '10px 0', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', fontSize: '14px' };
const btnStyle = { width: '100%', padding: '15px', backgroundColor: '#ff9000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as const, fontSize: '16px' };