"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

// 申込フォームへの導線（CTA）専用のLinkラッパー。見た目・遷移の挙動はnext/linkの
// <Link>と同一で、クリック時にGA4へcta_clickイベントを送るだけの薄いラッパー。
// Server Componentには直接onClickを渡せないため、CTAを置く各ページ側から
// このクライアントコンポーネントを使う。
//
// cta_location: ページ内のどのCTAかを表す固定の文字列（例: "hero", "article_mid"）。
// 個人情報やクリックされたテキストなどは送らない。
export default function TrackedLink({ href, cta_location, onClick, children, ...props }) {
  const pagePath = usePathname();

  function handleClick(e) {
    trackEvent("cta_click", { cta_location, page_path: pagePath });
    onClick?.(e);
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
