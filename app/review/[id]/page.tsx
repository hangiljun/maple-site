'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc, increment, deleteDoc, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState({ nickname: '', password: '', content: '' });
  
  // ★ 추가: 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchReview = async () => {
      const docRef = doc(db, 'reviews', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReview({ id: docSnap.id, ...data });
        setEditForm({ title: data.title, content: data.content }); // 수정용 폼 초기화
        await updateDoc(docRef, { views: increment(1) });
      }
    };
    fetchReview();

    const q = query(collection(db, 'comments'), where('postId', '==', id), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (s) => {
      setComments(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [id]);

  const handleLike = async () => {
    const hasLiked = localStorage.getItem(`liked_${id}`);
    if (hasLiked) return alert('이미 추천하셨습니다.');

    const docRef = doc(db, 'reviews', id as string);
    await updateDoc(docRef, { likes: increment(1) });
    setReview((prev: any) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    localStorage.setItem(`liked_${id}`, 'true');
    alert('이 후기를 추천했습니다!');
  };

  // ★ 추가: 게시글 삭제 기능
  const handleDeletePost = async () => {
    const pw = prompt('게시글 삭제를 위해 비밀번호를 입력하세요.');
    if (pw === review.password) {
      if (confirm('정말로 이 후기를 삭제하시겠습니까?')) {
        await deleteDoc(doc(db, 'reviews', id as string));
        alert('삭제되었습니다.');
        router.push('/review');
      }
    } else if (pw !== null) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  // ★ 추가: 게시글 수정 모드 진입
  const handleEditPost = async () => {
    const pw = prompt('게시글 수정을 위해 비밀번호를 입력하세요.');
    if (pw === review.password) {
      setIsEditing(true);
    } else if (pw !== null) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  // ★ 추가: 게시글 업데이트 실행
  const handleUpdatePost = async () => {
     await updateDoc(doc(db, 'reviews', id as string), {
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

  if (!review) return <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#0F172A', minHeight: '100vh', color: '#FFF' }}>로딩 중...</div>;

  return (
    // ★ 수정: overflowX: 'hidden' 추가로 모바일 흰 여백 제거
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: "'Noto Sans KR', sans-serif", overflowX: 'hidden' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', borderBottom: '1px solid #334155', backgroundColor: 'rgba(15, 23, 42, 0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src="/logo.png" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </div>
          <div style={{ fontWeight: '900', color: '#FF9000', fontSize: '20px' }}>메이플 아이템</div>
        </div>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', fontWeight: 'bold' }}>뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* 수정 모드일 때 */}
        {isEditing ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <h2 style={{ color: '#FF9000' }}>게시글 수정</h2>
             <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={inputStyle} />
             <textarea value={editForm.content} onChange={e => setEditForm({...editForm, content: e.target.value})} style={{ ...inputStyle, height: '300px' }} />
             <div style={{ display: 'flex', gap: '10px' }}>
               <button onClick={handleUpdatePost} style={{ ...btnStyle, backgroundColor: '#FF9000', color: '#000' }}>수정 완료</button>
               <button onClick={() => setIsEditing(false)} style={btnStyle}>취소</button>
             </div>
           </div>
        ) : (
          // 일반 모드일 때
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '15px', color: '#FF9000', wordBreak: 'keep-all' }}>{review.title}</h1>
              {/* ★ 추가: 수정/삭제 버튼 그룹 */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleEditPost} style={smallBtnStyle}>수정</button>
                <button onClick={handleDeletePost} style={smallBtnStyle}>삭제</button>
              </div>
            </div>
            
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #334155', marginBottom: '30px', color: '#94A3B8', fontSize: '14px' }}>
              작성자: {review.nickname?.split('@')[0]} | 조회수: {review.views || 0} | 추천: {review.likes || 0} | 날짜: {review.createdAt?.toDate().toLocaleDateString()}
            </div>

            <div style={{ minHeight: '300px', lineHeight: '1.9', fontSize: '17px', color: '#E2E8F0', wordBreak: 'break-all' }}>
              {review.imageUrl && (
                <div style={{ marginBottom: '30px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #334155' }}>
                  <img src={review.imageUrl} style={{ width: '100%', display: 'block' }} alt="후기 인증샷" />
                </div>
              )}
              <p style={{ whiteSpace: 'pre-wrap' }}>{review.content}</p>
            </div>

            <div style={{ textAlign: 'center', margin: '50px 0' }}>
              <button onClick={handleLike} style={{ backgroundColor: 'transparent', border: '2px solid #FF9000', color: '#FF9000', padding: '12px 30px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                👍 추천 {review.likes || 0}
              </button>
            </div>
          </>
        )}

        <div style={{ marginTop: '50px', borderTop: '1px solid #334155', paddingTop: '30px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>댓글 {comments.length}</h3>
          
          <div style={{ marginBottom: '30px' }}>
            {comments.map((c) => (
              <div key={c.id} style={{ padding: '15px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '85%' }}>
                  <div style={{ fontWeight: 'bold', color: '#FF9000', marginBottom: '5px', fontSize: '14px' }}>{c.nickname}</div>
                  <div style={{ fontSize: '15px', color: '#CBD5E1', wordBreak: 'break-all' }}>{c.content}</div>
                </div>
                <button onClick={() => handleDeleteComment(c.id, c.password)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '12px', minWidth: '40px' }}>삭제</button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input placeholder="닉네임" value={newComment.nickname} onChange={e => setNewComment({...newComment, nickname: e.target.value})} style={inputStyle} />
              <input type="password" placeholder="비밀번호" value={newComment.password} onChange={e => setNewComment({...newComment, password: e.target.value})} style={inputStyle} />
            </div>
            <textarea placeholder="댓글 내용을 입력하세요" value={newComment.content} onChange={e => setNewComment({...newComment, content: e.target.value})} style={{ ...inputStyle, width: '100%', height: '80px', resize: 'none', boxSizing: 'border-box' }} />
            <button type="submit" style={{ ...btnStyle, width: '100%', marginTop: '10px', backgroundColor: '#FF9000', color: '#000' }}>댓글 등록</button>
          </form>
        </div>

        <button 
          onClick={() => router.push('/review')}
          style={{ ...btnStyle, marginTop: '50px', width: '100%', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155' }}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}

const inputStyle = { backgroundColor: '#0F172A', border: '1px solid #334155', color: '#FFF', padding: '10px', borderRadius: '5px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' as const };
const btnStyle = { padding: '15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', border: 'none' };
const smallBtnStyle = { backgroundColor: 'transparent', border: '1px solid #475569', color: '#94A3B8', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' };