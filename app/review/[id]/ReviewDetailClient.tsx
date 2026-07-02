'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc, increment, deleteDoc, collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function ReviewDetailClient({ id }: { id: string }) {
  const [review, setReview] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState({ nickname: '', password: '', content: '' });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  const router = useRouter();

  const convertUrlsToLinks = (text: string) => {
    if (!text) return text;
    const urlPattern = /(https?:\/\/[^\s<>"]+)/g;
    const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #FF9000; text-decoration: underline; word-break: break-all;">${url}</a>`;
    });
  };

  useEffect(() => {
    if (!id) return;

    const fetchReview = async () => {
      const docRef = doc(db, 'reviews', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReview({ id: docSnap.id, ...data });
        setEditForm({ title: data.title, content: data.content });
        await updateDoc(docRef, { views: increment(1) });
      }
    };
    fetchReview();

    const q = query(collection(db, 'comments'), where('postId', '==', id));
    const unsubscribe = onSnapshot(q, (s) => {
      const fetchedData = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedData.sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateA - dateB;
      });
      setComments(fetchedData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleLike = async () => {
    const hasLiked = localStorage.getItem(`liked_${id}`);
    if (hasLiked) return alert('이미 추천하셨습니다.');
    const docRef = doc(db, 'reviews', id);
    await updateDoc(docRef, { likes: increment(1) });
    setReview((prev: any) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    localStorage.setItem(`liked_${id}`, 'true');
    alert('이 후기를 추천했습니다!');
  };

  const handleDeletePost = async () => {
    const pw = prompt('게시글 삭제를 위해 비밀번호를 입력하세요.');
    if (pw === review.password) {
      if (confirm('정말로 이 후기를 삭제하시겠습니까?')) {
        await deleteDoc(doc(db, 'reviews', id));
        alert('삭제되었습니다.');
        router.push('/review');
      }
    } else if (pw !== null) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleEditPost = async () => {
    const pw = prompt('게시글 수정을 위해 비밀번호를 입력하세요.');
    if (pw === review.password) {
      setIsEditing(true);
    } else if (pw !== null) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleUpdatePost = async () => {
    await updateDoc(doc(db, 'reviews', id), {
      title: editForm.title,
      content: editForm.content
    });
    setReview((prev: any) => ({ ...prev, title: editForm.title, content: editForm.content }));
    setIsEditing(false);
    alert('수정 완료되었습니다.');
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.nickname || !newComment.content || !newComment.password) return alert('모든 항목을 입력하세요.');
    await addDoc(collection(db, 'comments'), {
      postId: id,
      nickname: newComment.nickname,
      password: newComment.password,
      content: newComment.content,
      createdAt: serverTimestamp()
    });
    setNewComment({ nickname: '', password: '', content: '' });
  };

  const handleDeleteComment = async (commentId: string, correctPw: string) => {
    const pw = prompt('댓글 삭제 비밀번호를 입력하세요.');
    if (pw === correctPw) {
      await deleteDoc(doc(db, 'comments', commentId));
      alert('댓글이 삭제되었습니다.');
    } else if (pw !== null) {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  if (!review) return (
    <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#64748B' }}>
      로딩 중...
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#1E293B', fontFamily: "'Noto Sans KR', sans-serif", overflowX: 'hidden' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', borderBottom: '1px solid #E2E8F0', backgroundColor: 'rgba(255,255,255,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
            <img src="/favicon-new.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} alt="메이플 아이템 로고" />
          </div>
          <div style={{ fontWeight: '900', color: '#FF9000', fontSize: 'clamp(16px, 4vw, 20px)', whiteSpace: 'nowrap' }}>메이플 아이템</div>
        </div>
        <button onClick={() => router.back()} style={{ border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', color: '#64748B', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', fontSize: 'clamp(12px, 3vw, 14px)', whiteSpace: 'nowrap' }}>← 뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', width: '100%', boxSizing: 'border-box' }}>

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ color: '#FF9000' }}>게시글 수정</h2>
            <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={inputStyle} />
            <textarea value={editForm.content} onChange={e => setEditForm({...editForm, content: e.target.value})} style={{ ...inputStyle, height: '300px', resize: 'none' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpdatePost} style={{ ...btnStyle, backgroundColor: '#FF9000', color: '#FFF', flex: 1 }}>수정 완료</button>
              <button onClick={() => setIsEditing(false)} style={{ ...btnStyle, backgroundColor: '#F1F5F9', color: '#64748B', flex: 1 }}>취소</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: '#1E293B', wordBreak: 'keep-all', flex: 1 }}>{review.title}</h1>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleEditPost} style={smallBtnStyle}>수정</button>
                <button onClick={handleDeletePost} style={{ ...smallBtnStyle, borderColor: '#FCA5A5', color: '#EF4444' }}>삭제</button>
              </div>
            </div>

            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #E2E8F0', marginBottom: '30px', color: '#94A3B8', fontSize: '14px' }}>
              작성자: {review.nickname?.split('@')[0]} | 조회수: {review.views || 0} | 추천: {review.likes || 0} | 날짜: {review.createdAt?.toDate().toLocaleDateString()}
            </div>

            <div style={{ minHeight: '300px', lineHeight: '1.9', fontSize: '17px', color: '#334155', wordBreak: 'break-all' }}>
              {review.imageUrl && (
                <div style={{ marginBottom: '30px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                  <img src={review.imageUrl} style={{ width: '100%', display: 'block' }} alt="후기 인증샷" />
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(review.content) }} />
            </div>

            <div style={{ textAlign: 'center', margin: '50px 0' }}>
              <button onClick={handleLike} style={{ backgroundColor: 'transparent', border: '2px solid #FF9000', color: '#FF9000', padding: '12px 30px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                👍 추천 {review.likes || 0}
              </button>
            </div>
          </>
        )}

        {/* 댓글 영역 */}
        <div style={{ marginTop: '50px', borderTop: '1px solid #E2E8F0', paddingTop: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#1E293B', fontWeight: 'bold' }}>댓글 {comments.length}</h3>

          <div style={{ marginBottom: '30px' }}>
            {comments.map((c) => (
              <div key={c.id} style={{ padding: '15px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: '8px', marginBottom: '8px', border: '1px solid #F1F5F9' }}>
                <div style={{ width: '85%' }}>
                  <div style={{ fontWeight: 'bold', color: '#FF9000', marginBottom: '5px', fontSize: '14px' }}>{c.nickname}</div>
                  <div style={{ fontSize: '15px', color: '#475569', wordBreak: 'break-all' }}>{c.content}</div>
                </div>
                <button onClick={() => handleDeleteComment(c.id, c.password)} style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', fontSize: '12px', minWidth: '40px' }}>삭제</button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="닉네임" value={newComment.nickname} onChange={e => setNewComment({...newComment, nickname: e.target.value})} style={{ ...inputStyle, flex: 1 }} />
                <input type="password" placeholder="비밀번호" value={newComment.password} onChange={e => setNewComment({...newComment, password: e.target.value})} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
            <textarea placeholder="댓글 내용을 입력하세요" value={newComment.content} onChange={e => setNewComment({...newComment, content: e.target.value})} style={{ ...inputStyle, width: '100%', height: '80px', resize: 'none', boxSizing: 'border-box' }} />
            <button type="submit" style={{ ...btnStyle, width: '100%', marginTop: '10px', backgroundColor: '#FF9000', color: '#FFF' }}>댓글 등록</button>
          </form>
        </div>

        <button
          onClick={() => router.push('/review')}
          style={{ ...btnStyle, marginTop: '40px', width: '100%', backgroundColor: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0' }}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B', padding: '10px 14px', borderRadius: '8px', outline: 'none', fontSize: '14px', boxSizing: 'border-box', width: '100%' };
const btnStyle: React.CSSProperties = { padding: '13px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', border: 'none', fontSize: '14px' };
const smallBtnStyle: React.CSSProperties = { backgroundColor: 'transparent', border: '1px solid #E2E8F0', color: '#64748B', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };
