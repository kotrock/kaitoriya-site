"use client";

import { useState } from "react";
import Link from "next/link";
import { nav, company } from "@/data/site";
import { PhoneIcon } from "@/components/Icons";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-[#ece6dc] sticky top-0 z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          onClick={() => setOpen(false)}
        >
          <div className="w-10 h-10 rounded-lg bg-[#b3242b] text-white flex items-center justify-center font-extrabold text-sm">
            高
          </div>
          <div>
            <div className="text-lg font-extrabold text-[#26221e] tracking-tight">
              高買屋
            </div>
            <div className="text-[10px] text-[#726b5e] tracking-wide">
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

        <div className="flex items-center gap-4">
          <a
            href={`tel:${company.phoneTel}`}
            className="hidden lg:flex items-center gap-1.5 text-sm font-bold text-[#26221e] hover:text-[#b3242b] whitespace-nowrap"
          >
            <PhoneIcon className="w-4 h-4" />
            {company.phone}
          </a>
          <Link
            href="/application"
            className="hidden sm:inline-block bg-[#b3242b] text-white text-[13px] font-bold py-3 px-5 rounded-full whitespace-nowrap hover:bg-[#8f1c22] transition-colors"
          >
            無料査定を申し込む
          </Link>

          {/* モバイル用メニューボタン。lg以上では非表示 */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-[#ece6dc] text-[#26221e]"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* モバイル用ドロップダウンメニュー */}
      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t border-[#ece6dc] bg-white px-6 py-4 flex flex-col gap-1"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-semibold text-[#26221e] border-b border-[#f2ede5] last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/application"
            onClick={() => setOpen(false)}
            className="mt-3 bg-[#b3242b] text-white text-sm font-bold py-3.5 rounded-full text-center hover:bg-[#8f1c22]"
          >
            無料査定を申し込む
          </Link>
          <a
            href={`tel:${company.phoneTel}`}
            className="mt-2 flex items-center justify-center gap-1.5 py-3 text-sm font-bold text-[#26221e]"
          >
            <PhoneIcon className="w-4 h-4" />
            {company.phone}（{company.phoneHours}）
          </a>
        </nav>
      )}
    </header>
  );
}
