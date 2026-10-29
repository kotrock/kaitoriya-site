"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Script from "next/script";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// NEXT_PUBLIC_TURNSTILE_SITE_KEY が未設定（ローカル開発など）の場合は
// ウィジェットを表示せず、呼び出し側もトークン待ちをしなくてよいことを示すフラグ。
// サーバー側（src/lib/turnstile.js）もTURNSTILE_SECRET_KEY未設定時は検証をスキップするため連動する。
export const TURNSTILE_ENABLED = Boolean(siteKey);

// Cloudflare Turnstileのウィジェット。
//
// トークンは1回使い切り（siteverifyで検証した時点でCloudflare側が無効化する）かつ
// 数分で期限切れになる。暗黙レンダー（data-sitekey属性を付けたdivを置くだけの方式）では
// 呼び出し側からウィジェットを制御できず、送信失敗後に古い（消費済み・期限切れの）
// トークンが残り続けて再送信が必ず失敗する問題があったため、明示的にrenderして
// widgetIdを保持し、呼び出し側（フォーム）がreset()で新しいトークンを取り直せるようにする。
const Turnstile = forwardRef(function Turnstile({ onVerify, onExpire, onError }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current != null && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {
          // ウィジェットがまだ準備できていない等。次の操作時に再試行されるため無視する。
        }
      }
    },
  }));

  function render() {
    if (!containerRef.current || widgetIdRef.current != null) return;
    if (!window.turnstile) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onVerify?.(token),
      "expired-callback": () => {
        onExpire?.();
        // 期限切れのトークンを残さず、自動で新しいトークンを取り直す。
        if (widgetIdRef.current != null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
      "error-callback": () => {
        onError?.();
        // ネットワーク等の一時的な失敗。少し待って自動的に再試行する。
        if (widgetIdRef.current != null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    });
  }

  useEffect(() => {
    if (!siteKey) return;

    // next/scriptの読み込みが既に完了済みのマウント（ページ遷移後の再マウント等）に対応。
    // まだ読み込み中の場合は、Script側のonReadyでrenderする（renderは冪等なので二重実行も安全）。
    if (window.turnstile) render();

    return () => {
      if (widgetIdRef.current != null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ページ遷移等で既に破棄されている場合は無視する。
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
        onReady={render}
      />
      <div ref={containerRef} />
    </>
  );
});

export default Turnstile;
