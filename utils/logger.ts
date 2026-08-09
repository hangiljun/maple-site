// 개발 환경에서만 로그 출력하는 유틸리티
export const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // 에러는 프로덕션에서도 출력
    console.error(...args);
  },
};
