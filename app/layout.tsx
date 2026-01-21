import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '메이플 아이템 - No.1 공식 인증 매입 업체',
  description: '검증된 매입 업체와 안전하게 거래하세요. 업계 최고가 보장.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* 파비콘 강제 갱신을 위해 ?v=1을 붙였습니다 */}
        <link rel="icon" href="/favicon.ico?v=1" sizes="any" />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}