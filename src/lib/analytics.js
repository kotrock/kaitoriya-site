// GA4へのカスタムイベント送信用の薄いヘルパー。
// window.gtag が無い環境（開発環境・広告ブロック・NEXT_PUBLIC_GA_ID未設定時など）でも
// エラーにならないよう、存在チェックのうえで呼び出すだけに留める。
// 呼び出し側の本来の処理（送信完了表示など）を計測の失敗で妨げないよう、例外は握りつぶす。
export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  try {
    window.gtag("event", eventName, params);
  } catch {
    // 計測エラーは無視する。
  }
}
