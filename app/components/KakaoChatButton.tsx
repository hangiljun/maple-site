'use client';

export default function KakaoChatButton() {
  // 예시 주소였던 sPInyN7g를 삭제하고, 사용자님의 진짜 주소로 변경했습니다.
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
      <svg width="32" height="32" viewBox="0 0 512 512" aria-label="카톡상담" role="img">
        <path fill="#3C1E1E" d="M256 32C132.3 32 32 112.5 32 211.3c0 62 38.3 116.6 96.5 150.3l-24.5 89.8 105.1-70.2c15.4 2.2 31.3 3.4 47 3.4 123.7 0 224-80.5 224-179.3C480 112.5 379.7 32 256 32z"/>
      </svg>
    </div>
  );
}