'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({ title: '', nickname: '', password: '', content: '' });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
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

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#F8FAFC' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', borderBottom: '1px solid #334155', backgroundColor: 'rgba(15, 23, 42, 0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src="/logo.png" alt="로고" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </div>
          <div style={{ fontWeight: '900', color: '#FF9000', fontSize: '20px' }}>메이플 아이템</div>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontWeight: '600', fontSize: '15px', color: '#94A3B8' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>홈</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/notice')}>공지사항</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/howto')}>거래방법</span>
          <span style={{ color: '#FF9000', cursor: 'pointer' }}>이용후기</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
             <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF9000', margin: 0 }}>이용후기</h2>
             <button onClick={() => setShowForm(true)} style={{ backgroundColor: '#FF9000', color: '#FFF', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+ 후기 쓰기</button>
        </div>
        
        <div style={{ borderTop: '2px solid #FF9000', borderBottom: '1px solid #334155', padding: '15px 0', display: 'flex', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#1E293B', fontSize: '14px' }}>
          <div style={{ width: '10%' }}>번호</div>
          <div style={{ width: '55%' }}>제목</div>
          <div style={{ width: '15%' }}>작성자</div>
          <div style={{ width: '10%' }}>작성일</div>
          <div style={{ width: '10%' }}>조회</div>
        </div>

        {filteredReviews.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', padding: '15px 0', borderBottom: '1px solid #334155', textAlign: 'center', fontSize: '14px', alignItems: 'center', color: '#CBD5E1' }}>
            <div style={{ width: '10%', color: '#64748B' }}>{filteredReviews.length - i}</div>
            <div style={{ width: '55%', textAlign: 'left', paddingLeft: '20px', cursor: 'pointer', fontWeight: '500', color: '#F8FAFC' }} 
                 onClick={() => router.push(`/review/${r.id}`)}>
              {r.title} {r.imageUrl && <span style={{ backgroundColor: '#FF9000', color: '#000', fontSize: '10px', padding: '2px 5px', borderRadius: '4px', marginLeft: '5px' }}>IMG</span>}
            </div>
            <div style={{ width: '15%' }}>{r.nickname.split('@')[0]}</div>
            <div style={{ width: '10%', color: '#64748B' }}>{r.createdAt?.toDate().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}</div>
            <div style={{ width: '10%', color: '#64748B' }}>{r.views || 0}</div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
          <input 
            placeholder="제목 및 내용 검색" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '12px 20px', border: '1px solid #334155', width: '350px', borderRadius: '8px', backgroundColor: '#1E293B', color: '#FFF', outline: 'none' }}
          />
          <button onClick={handleSearch} style={{ padding: '10px 25px', backgroundColor: '#334155', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#FFF' }}>검색</button>
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: '#1E293B', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155', color: '#FFF' }}>
            <h3 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px', color: '#FF9000' }}>후기 작성</h3>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#94A3B8' }}>제목 *</p>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={darkInputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#94A3B8' }}>작성자 *</p>
                <input placeholder="닉네임" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} style={darkInputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#94A3B8' }}>비밀번호 *</p>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={darkInputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{ ...darkInputStyle, height: '200px', resize: 'none' }} placeholder="내용을 입력하세요" />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#94A3B8' }}>사진 첨부</p>
              <input type="file" onChange={e => setImage(e.target.files![0])} style={{ color: '#CBD5E1' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpload} disabled={loading} style={{ flex: 1, padding: '15px', backgroundColor: '#FF9000', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{loading ? '저장 중...' : '작성 완료'}</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '15px', backgroundColor: '#334155', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const darkInputStyle = { width: '100%', padding: '12px', border: '1px solid #334155', borderRadius: '8px', fontSize: '14px', backgroundColor: '#0F172A', color: '#FFF', outline: 'none' };