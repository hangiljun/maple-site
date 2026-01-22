'use client';
import { useState } from 'react';
import { db, storage } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageInsert = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const imgRef = ref(storage, `content/${Date.now()}`);
    await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    setContent(prev => prev + `\n<img src="${url}" style="max-width:100%; height:auto;" />\n`);
    setLoading(true);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#111', minHeight: '100vh', color: '#FFF' }}>
      <h1>컨텐츠 에디터 (공지/방법/후기)</h1>
      <input 
        placeholder="제목 입력" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        style={{ width: '100%', padding: '15px', margin: '20px 0', backgroundColor: '#222', border: 'none', color: '#FFF', borderRadius: '8px' }}
      />
      <div style={{ marginBottom: '10px' }}>
        <label style={{ backgroundColor: '#FF9000', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
          📷 본문 이미지 삽입
          <input type="file" hidden onChange={handleImageInsert} />
        </label>
      </div>
      <textarea 
        value={content} 
        onChange={e => setContent(e.target.value)} 
        style={{ width: '100%', height: '500px', backgroundColor: '#222', color: '#FFF', padding: '20px', border: 'none', borderRadius: '8px', fontSize: '16px' }}
      />
      <button style={{ width: '100%', padding: '20px', backgroundColor: '#00C73C', color: '#FFF', border: 'none', borderRadius: '8px', marginTop: '20px', fontWeight: 'bold' }}>저장하기</button>
    </div>
  );
}