'use client';

import { useState } from 'react';
import { db, storage } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // 본문 중간에 이미지를 삽입하는 함수
  const handleImageInsert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const imgRef = ref(storage, `content/${Date.now()}_${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      
      // 글 중간에 이미지 태그를 자동으로 삽입
      setContent(prev => prev + `\n<img src="${url}" style="max-width:100%; height:auto; margin:10px 0;" />\n`);
      alert("이미지가 성공적으로 삽입되었습니다.");
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        createdAt: serverTimestamp(),
      });
      alert("성공적으로 저장되었습니다.");
      setTitle('');
      setContent('');
    } catch (error) {
      alert("저장 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', color: '#FFF', padding: '40px', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', borderBottom: '2px solid #FF9000', paddingBottom: '10px', display: 'inline-block' }}>
        컨텐츠 통합 관리자 에디터
      </h1>
      
      <div style={{ backgroundColor: '#222', padding: '30px', borderRadius: '15px', marginTop: '20px', maxWidth: '1000px' }}>
        {/* 제목 입력란 */}
        <input 
          placeholder="공지사항 / 거래방법 / 이용후기 제목을 입력하세요" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          style={{ width: '100%', padding: '15px', backgroundColor: '#333', border: '1px solid #444', color: '#FFF', marginBottom: '20px', borderRadius: '8px', fontSize: '18px', outline: 'none' }}
        />
        
        {/* 기능 버튼 영역 */}
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ backgroundColor: '#FF9000', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.3s' }}>
            📷 본문 중간에 사진 삽입
            <input type="file" hidden onChange={handleImageInsert} accept="image/*" />
          </label>
          {loading && <span style={{ fontSize: '13px', color: '#FF9000' }}>처리 중...</span>}
        </div>

        {/* 본문 에디터 (확대된 사이즈) */}
        <textarea 
          placeholder="내용을 작성하세요. 위 사진 버튼을 누르면 커서 끝에 이미지가 삽입됩니다." 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          style={{ 
            width: '100%', 
            height: '600px', 
            backgroundColor: '#333', 
            border: '1px solid #444', 
            color: '#FFF', 
            padding: '20px', 
            borderRadius: '8px', 
            lineHeight: '1.6', 
            fontSize: '16px', 
            resize: 'vertical',
            outline: 'none'
          }}
        />
        
        {/* 저장 버튼 */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '20px', 
            backgroundColor: loading ? '#555' : '#00C73C', 
            border: 'none', 
            color: '#FFF', 
            fontWeight: 'bold', 
            fontSize: '18px',
            borderRadius: '8px', 
            marginTop: '25px', 
            cursor: loading ? 'default' : 'pointer' 
          }}
        >
          {loading ? '처리 중...' : '게시글 등록하기'}
        </button>
      </div>
    </div>
  );
}