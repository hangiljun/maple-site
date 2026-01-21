'use client';

export default function KakaoChatButton() {
  // 1. 이곳에 설정된 주소가 실제 버튼 클릭 시 연결되는 주소입니다.
  // 2. 아래 주소를 사용자님의 실제 주소로 변경했습니다.
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
        zIndex: 9999,
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