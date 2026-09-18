import Link from "next/link";
import { nav } from "@/data/site";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-[#ece6dc] sticky top-0 z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-[#b3242b] text-white flex items-center justify-center font-extrabold text-sm">
            高
          </div>
          <div>
            <div className="text-lg font-extrabold text-[#26221e] tracking-tight">
              高買屋
            </div>
            <div className="text-[10px] text-[#a39d92] tracking-wide">
              アダルトDVD高価買取専門店
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-[#4a453d]">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#b3242b]">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/application"
          className="bg-[#b3242b] text-white text-[13px] font-bold py-3 px-5 rounded-full whitespace-nowrap hover:bg-[#8f1c22] transition-colors"
        >
          無料査定を申し込む
        </Link>
      </div>
    </header>
  );
}
