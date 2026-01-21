'use client';

export default function KakaoChatButton() {
  const KAKAO_URL = "https://open.kakao.com/o/YOUR_LINK"; // 실제 카톡 오픈채팅 링크로 수정하세요

  return (
    <div 
      onClick={() => window.open(KAKAO_URL, '_blank')}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        backgroundColor: '#FEE500',
        borderRadius: '50%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // 모든 화면 위로 노출
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" 
        alt="카카오톡 문의"
        style={{ width: '35px', height: '35px' }}
      />
    </div>
  );
}