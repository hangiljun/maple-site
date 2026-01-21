import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// 사이트의 이름과 설명 설정을 여기서 관리합니다.
export const metadata = {
  title: '메이플 아이템 - No.1 아이템 매입 업체 리스트',
  description: '메이플스토리 아이템 및 메소 매입 전문 업체 홍보 사이트입니다. 안전하고 빠른 거래 업체를 한눈에 확인하세요.',
  keywords: '메이플 아이템, 메이플 메소 매입, 아이템 거래, 메이플스토리 거래소',
  viewport: 'width=device-width, initial-scale=1',
  // 네이버/구글 소유확인 태그를 받으시면 여기에 추가할 수 있습니다.
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* 파비콘이나 추가적인 메타 태그가 필요할 경우 여기에 작성합니다. */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}