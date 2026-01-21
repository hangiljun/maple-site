'use client';

export default function KakaoChatButton() {
  // 보내주신 실제 카카오톡 주소로 업데이트 완료
  const KAKAO_URL = "https://open.kakao.com/o/sKg86b7f"; 

  return (
    <div 
      onClick={() => window.open(KAKAO_URL, '_blank')}
      style={{
        position: 'fixed',
        bottom: '25px',
        right: '25px',
        width: '60px',
        height: '60px',
        backgroundColor: '#FEE500',
        borderRadius: '50%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // 어느 페이지에서든 최상단에 노출
        transition: 'transform 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" 
        alt="카톡상담"
        style={{ width: '32px', height: '32px' }}
      />
    </div>
  );
}