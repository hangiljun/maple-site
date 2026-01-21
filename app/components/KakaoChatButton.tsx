'use client';

export default function KakaoChatButton() {
  const KAKAO_URL = "https://open.kakao.com/o/sPInyN7g"; 

  return (
    <div 
      onClick={() => window.open(KAKAO_URL, '_blank')}
      style={{
        position: 'fixed',
        bottom: '25px',
        right: '25px',
        width: '55px',
        height: '55px',
        backgroundColor: '#FEE500',
        borderRadius: '50%',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        transition: 'transform 0.15s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" 
        alt="카톡상담"
        style={{ width: '30px', height: '30px' }}
      />
    </div>
  );
}