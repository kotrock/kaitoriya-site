import "./globals.css";
import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "アダルトDVD高価買取の高買屋 | どこよりも高くアダルト買取ます!",
  description:
    "どこよりも高くアダルト買取ます!簡単・迅速・安心。エスワン・ムーディーズ・マドンナ・FALENOなど人気レーベルを強化買取中の高買屋。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#f7f3ee] text-[#26221e]">
        <AgeGate />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
