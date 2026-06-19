import "./globals.css"
import { ReactNode } from "react"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "双休购 — 用购买力投票，支持守规矩的企业",
  description:
    "600 家精选规范用工企业展示平台。承诺双休制度 + 五险一金足额缴纳，为消费者提供更安心、更优质的商品选择。",
  keywords:
    "双休购, 双休企业, 规范用工, 五险一金, 精选企业, 品质消费, 良心企业",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="bg-[#FFFAF5] text-[#2A2620] flex flex-col justify-center items-center w-full min-h-screen">
          <div className="w-full">{children}</div>
        </main>
      </body>
    </html>
  )
}
