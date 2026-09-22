import "./globals.css";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteUrl } from "@/data/site";

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const title = "アダルトDVD買取 最大50%〜｜査定無料・送料無料の高買屋";
const description =
  "アダルトDVD・ブルーレイを最大50%で高価買取。査定は何本でも無料、段ボールも無料提供。エスワン・ムーディーズ・マドンナなど人気レーベル強化買取中。仙台のアダルトDVD買取専門店「高買屋」。";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "高買屋",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`h-full antialiased ${zenKakuGothicNew.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[#f7f3ee] text-[#26221e]">
        <AgeGate />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
