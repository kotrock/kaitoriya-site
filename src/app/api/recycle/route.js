// DVD無料回収フォームの送信を処理するAPI Route。
// /api/application と同じ順序（honeypot→時間トラップ→Turnstile→入力検証→Resend送信）で検証する。

import { company } from "@/data/site";
import { verifyTurnstile } from "@/lib/turnstile";
import { sanitizeForEmail } from "@/lib/sanitizeText";

export const runtime = "nodejs";

const TO_EMAIL = "pbkaitori@gmail.com";
// スパム対策の「時間トラップ」。フロントエンドの判定だけに頼らず、
// サーバー側でもフォーム表示時刻からの経過時間を検証する。
const MIN_ELAPSED_MS = 3000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_CODE_PATTERN = /^\d{3}-?\d{4}$/;
const MAX_EMAIL_LENGTH = 254;

function normalizePhone(phone) {
  return phone.replace(/[^\d]/g, "");
}

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { success: false, error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  // スパム対策用ハニーポット。人間には見えない項目が埋まっていたら
  // 成功したふりをして黙って処理を打ち切る（bot に判定材料を与えない）。
  if (formData.get("botcheck")) {
    return Response.json({ success: true });
  }

  // スパム対策の時間トラップ。フォームが表示されてからの経過時間が
  // 短すぎる場合はbotによる自動送信とみなしてブロックする。
  const formLoadedAt = Number(formData.get("form_loaded_at"));
  if (!formLoadedAt || Date.now() - formLoadedAt < MIN_ELAPSED_MS) {
    return Response.json(
      { success: false, error: "送信に失敗しました。もう一度お試しください。" },
      { status: 400 }
    );
  }

  // Cloudflare Turnstileの検証。TURNSTILE_SECRET_KEY未設定（ローカル開発等）の場合は
  // src/lib/turnstile.js側でスキップされる。
  const forwardedFor = request.headers.get("x-forwarded-for");
  const remoteIp = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;
  const turnstileResult = await verifyTurnstile(
    formData.get("cf-turnstile-response"),
    remoteIp
  );
  if (!turnstileResult.ok) {
    const isServiceIssue =
      turnstileResult.reason === "service-error" ||
      turnstileResult.reason === "network-error";
    return Response.json(
      {
        success: false,
        error: isServiceIssue
          ? "確認処理が混み合っています。時間をおいて再度お試しください。"
          : "送信に失敗しました。もう一度お試しください。",
      },
      { status: 400 }
    );
  }

  // メール本文に差し込む値はすべてsanitizeForEmailを通し、改行・制御文字による
  // テンプレート偽装（偽の追加行の挿入）を防ぐ。
  const name = sanitizeForEmail(formData.get("name"));
  const email = sanitizeForEmail(formData.get("email"));
  const phone = sanitizeForEmail(formData.get("phone"));
  const kit = sanitizeForEmail(formData.get("kit"));
  const boxSize = sanitizeForEmail(formData.get("box_size"));
  const boxCount = sanitizeForEmail(formData.get("box_count"));
  const boxRequest = sanitizeForEmail(formData.get("box_request"));
  const postalCode = sanitizeForEmail(formData.get("postal_code"));
  const prefecture = sanitizeForEmail(formData.get("prefecture"));
  const city = sanitizeForEmail(formData.get("city"));
  const addressLine = sanitizeForEmail(formData.get("address_line"));

  // クライアント側のrequired属性をすり抜けた場合の保険。
  if (!name || !email || !phone) {
    return Response.json(
      { success: false, error: "お名前・メールアドレス・電話番号をご入力ください。" },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL_LENGTH) {
    return Response.json(
      { success: false, error: "メールアドレスの形式が正しくありません。" },
      { status: 400 }
    );
  }

  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
    return Response.json(
      { success: false, error: "電話番号の形式が正しくありません。" },
      { status: 400 }
    );
  }

  // 回収キット希望の場合のみ、郵送先住所一式が必須。
  if (kit === "希望する") {
    if (!postalCode || !prefecture || !city || !addressLine) {
      return Response.json(
        {
          success: false,
          error: "郵送先の郵便番号・都道府県・市区町村・番地（建物名）をすべてご入力ください。",
        },
        { status: 400 }
      );
    }
    if (!POSTAL_CODE_PATTERN.test(postalCode)) {
      return Response.json(
        { success: false, error: "郵便番号は7桁の数字でご入力ください（ハイフンはあってもなくても構いません）。" },
        { status: 400 }
      );
    }
  }

  const sentAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

  const lines = [
    `お名前：${name}`,
    `メールアドレス：${email}`,
    `電話番号：${phone}`,
    `回収キット（無料ダンボール）の希望：${kit || "未選択"}`,
  ];

  if (kit === "希望する") {
    if (boxSize) lines.push(`箱のサイズ：${boxSize}`);
    if (boxCount) lines.push(`ボックス数：${boxCount}`);
    if (boxRequest) lines.push(`ご要望：${boxRequest}`);
    lines.push(`郵便番号：${postalCode}`);
    lines.push(`都道府県：${prefecture}`);
    lines.push(`市区町村：${city}`);
    lines.push(`番地・建物名：${addressLine}`);
  }

  const storeOnlyNotes = [
    "",
    `送信元IPアドレス：${sanitizeForEmail(remoteIp) || "不明"}`,
    `送信日時：${sentAt}`,
  ];

  const applicantText = [
    `${name} 様`,
    "",
    "この度は「DVD無料回収」にお申し込みいただき、誠にありがとうございます。",
    "以下の内容でお申し込みを承りました。",
    "",
    "【お申し込み内容】",
    "――――――――――――――――",
    ...lines,
    "――――――――――――――――",
    "",
    "■ 今後の流れ",
    kit === "希望する"
      ? "ご入力いただいたご住所を確認のうえ、無料の回収キット（段ボール）を手配いたします。到着まで今しばらくお待ちください。"
      : "お荷物のご準備ができましたら、ご自身でご用意いただいた箱に詰めて、着払いにてご発送ください。",
    "",
    "ご不明点がございましたら、お気軽にお問い合わせください。",
    `電話：${company.phone}`,
    `電話受付時間：${company.phoneHours}`,
    "",
    `高買屋（${company.legalName}）`,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // 開発中などAPIキー未設定の場合はここで分かりやすく失敗させる。
    console.error("RESEND_API_KEY が設定されていません。");
    return Response.json(
      {
        success: false,
        error: "現在お申し込みを受け付けられません。恐れ入りますがお電話でお問い合わせください。",
      },
      { status: 500 }
    );
  }

  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "高買屋 査定フォーム <noreply@mail.pb-kaitori.com>";

  // 店舗宛メール。こちらの送信成功を申し込み受付の成否とする。
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [TO_EMAIL],
        reply_to: email || undefined,
        subject: `【高買屋】DVD無料回収のお申し込みがありました（${name}）`,
        text: [...lines, ...storeOnlyNotes].join("\n"),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend送信エラー（店舗宛・無料回収）:", res.status, errText);
      return Response.json(
        { success: false, error: "メール送信に失敗しました。" },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("DVD無料回収フォームの送信中にエラーが発生しました（店舗宛）:", err);
    return Response.json(
      { success: false, error: "予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }

  // 申込者宛の自動返信メール。店舗宛メールが送れていれば申し込み自体は成立しているため、
  // こちらが失敗してもリクエスト全体は失敗させず、ログのみ残す。
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: "【高買屋】DVD無料回収のお申し込みを受け付けました",
        text: applicantText,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend送信エラー（申込者宛自動返信・無料回収）:", res.status, errText);
    }
  } catch (err) {
    console.error("申込者宛自動返信メール（無料回収）の送信中にエラーが発生しました:", err);
  }

  return Response.json({ success: true });
}
