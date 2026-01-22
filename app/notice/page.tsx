'use client';
import { useRouter } from 'next/navigation';

export default function NoticePage() {
  const router = useRouter();

  // 여기에 공지사항 내용을 직접 적으시면 됩니다.
  const notices = [
    {
      id: 1,
      title: '🎉 메이플 아이템 사이트 정식 오픈 안내',
      date: '2026.01.22',
      content: '안녕하세요! 메이플 아이템이 정식 오픈했습니다.<br>전 서버 최고가 매입 및 안전한 거래를 보장합니다.<br>많은 이용 부탁드립니다.'
    },
    {
      id: 2,
      title: '📢 안전 거래를 위한 필수 확인 사항',
      date: '2026.01.20',
      content: '사칭 사기에 주의하세요!<br>저희는 공식 카카오톡 채널 외에는 상담을 진행하지 않습니다.<br>거래 전 반드시 사이트 내 인증 마크를 확인해주세요.'
    },
    {
      id: 3,
      title: '⏰ 24시간 연중무휴 상담센터 운영',
      date: '2026.01.15',
      content: '새벽에도 거래 가능합니다.<br>언제든지 편하게 문의주시면 5분 내로 답변 드리겠습니다.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: "'Noto Sans KR', sans-serif", padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => router.push('/')} style={{ marginBottom: '30px', padding: '10px 20px', backgroundColor: '#334155', borderRadius: '8px', border: 'none', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>← 홈으로</button>
        
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9000', marginBottom: '40px', borderBottom: '2px solid #334155', paddingBottom: '15px' }}>공지사항</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {notices.map(notice => (
            <div key={notice.id} style={{ backgroundColor: '#1E293B', padding: '30px', borderRadius: '15px', border: '1px solid #334155', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#F1F5F9', margin: 0 }}>{notice.title}</h2>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>{notice.date}</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: notice.content }} style={{ lineHeight: '1.8', color: '#CBD5E1', fontSize: '15px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}