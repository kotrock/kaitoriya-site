const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Cloudflare Turnstileのトークンをサーバー側で検証する。
// TURNSTILE_SECRET_KEY が未設定（ローカル開発などキーを発行していない環境）の場合は
// 検証そのものをスキップする。本番環境ではこの環境変数を設定することで、
// NEXT_PUBLIC_TURNSTILE_SITE_KEY と連動してウィジェット表示・検証が有効になる。
export async function verifyTurnstile(token, remoteIp) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return { ok: true, skipped: true, reason: null };
  }
  if (!token) {
    return { ok: false, skipped: false, reason: "missing-token" };
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    });

    if (!res.ok) {
      // Turnstile側の障害・一時的なエラー。呼び出し元でメッセージを
      // 「不正な送信」ではなく「時間をおいて再度」に出し分けられるようにする。
      return { ok: false, skipped: false, reason: "service-error" };
    }

    const data = await res.json();
    return {
      ok: data.success === true,
      skipped: false,
      reason: data.success ? null : data["error-codes"]?.[0] || "verification-failed",
    };
  } catch {
    return { ok: false, skipped: false, reason: "network-error" };
  }
}
