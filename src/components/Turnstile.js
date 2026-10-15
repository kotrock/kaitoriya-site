"use client";

import Script from "next/script";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Cloudflare Turnstileのウィジェット。NEXT_PUBLIC_TURNSTILE_SITE_KEY が未設定の場合
// （ローカル開発など）は何も描画しない。サーバー側（src/lib/turnstile.js）も
// TURNSTILE_SECRET_KEY 未設定時は検証をスキップするため、両者は連動して動く。
// ウィジェットは送信先の<form>内に name="cf-turnstile-response" のhidden inputを
// 自動で挿入するため、formDataに自動的に含まれる。
export default function Turnstile() {
  if (!siteKey) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />
      <div className="cf-turnstile" data-sitekey={siteKey} />
    </>
  );
}
