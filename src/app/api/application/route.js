// 買取申込フォーム（スピード買取・仮査定申請）の送信を処理するAPI Route。
//
// 重要: ジャケット画像等の添付ファイルは一切ディスク・DBに保存しません。
// リクエストで受け取ったファイルはメモリ上でBase64化してメール送信APIに渡すだけで、
// この関数の処理が終わると同時に（明示的な削除処理なしに）メモリから解放されます。

import { company } from "@/data/site";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const TO_EMAIL = "pbkaitori@gmail.com";

// TODO: Resendの送信ドメイン認証が完了したら、この一時上書きを削除して
// 申込者本人のメールアドレス（email）宛に自動返信を送信するように戻してください。
// 現在はResendの未検証ドメイン（onboarding@resend.dev）が登録済みアドレスにしか
// 送信できないため、動作確認用にktvotarou@gmail.comへ固定しています。
const APPLICANT_EMAIL_TEST_OVERRIDE = "ktvotarou@gmail.com";

function courseLabel(course) {
  return course === "provisional"
    ? "仮査定申請（仮査定あり）"
    : "スピード買取（仮査定なし）";
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

  const course = formData.get("course") === "provisional" ? "provisional" : "speed";
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const phone = String(formData.get("phone") || "");
  const quantity = String(formData.get("quantity") || "");
  const dvdCount = String(formData.get("dvd_count") || "");
  const bdCount = String(formData.get("bd_count") || "");
  const comicCount = String(formData.get("comic_count") || "");
  const otherCount = String(formData.get("other_count") || "");
  const boxOption = String(formData.get("box_option") || "");
  const paymentMethod = String(formData.get("payment_method") || "");
  const productDetails = String(formData.get("product_details") || "");

  const productImages = formData
    .getAll("images")
    .filter((entry) => entry instanceof File && entry.size > 0);

  const selfieFile = formData.get("selfie_photo");
  const idFile = formData.get("id_document_photo");
  const identityFiles = [selfieFile, idFile].filter(
    (entry) => entry instanceof File && entry.size > 0
  );

  const allFiles = [...productImages, ...identityFiles];

  for (const file of allFiles) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        {
          success: false,
          error: `対応していないファイル形式です（jpg/pngのみ）：${file.name}`,
        },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        {
          success: false,
          error: `ファイルサイズが大きすぎます（1枚10MBまで）：${file.name}`,
        },
        { status: 400 }
      );
    }
  }

  // ファイルをメール添付用にBase64エンコード。ここで扱うのはメモリ上のBufferのみ。
  let attachments = [];
  try {
    attachments = await Promise.all(
      allFiles.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      }))
    );
  } catch {
    return Response.json(
      { success: false, error: "画像の読み込みに失敗しました。" },
      { status: 400 }
    );
  }

  const lines = [
    `コース：${courseLabel(course)}`,
    `お名前：${name}`,
    `メールアドレス：${email}`,
    `電話番号：${phone}`,
  ];

  if (course === "provisional") {
    const countParts = [];
    if (dvdCount) countParts.push(`DVD ${dvdCount}本`);
    if (bdCount) countParts.push(`ブルーレイ ${bdCount}本`);
    if (comicCount) countParts.push(`コミック ${comicCount}冊`);
    if (otherCount) countParts.push(`その他 ${otherCount}点`);
    lines.push(
      `買取点数の内訳：${countParts.length > 0 ? countParts.join("、") : "未記入"}`
    );
    if (productDetails) {
      lines.push(`買取商品の内容：${productDetails}`);
    }
  } else {
    lines.push(`買取希望商品の本数：${quantity}`);
  }

  if (boxOption) lines.push(`発送用の段ボール：${boxOption}`);
  if (paymentMethod) lines.push(`お支払い方法：${paymentMethod}`);
  lines.push(
    `本人確認書類：顔写真「${selfieFile?.name || "未添付"}」／身分証明書「${idFile?.name || "未添付"}」`
  );
  if (productImages.length > 0) {
    lines.push(
      `添付画像：${productImages.length}枚（${productImages.map((f) => f.name).join("、")}）`
    );
  }

  const contactLine = `${company.phone}（受付 ${company.phoneHours}）`;
  const applicantSubject =
    course === "provisional"
      ? "【高買屋】仮査定のお申し込みを受け付けました"
      : "【高買屋】お申し込みを受け付けました";
  const applicantNextSteps =
    course === "provisional"
      ? [
          "・店舗にてお送りいただいた内容を確認し、1〜2営業日を目安に仮査定結果をご連絡いたします。",
          "・仮査定額にご納得いただけない場合は、発送前であればキャンセルも可能です。",
          "・内容にご納得いただけましたら、発送用の段ボールをお送りしますので商品をご準備ください。",
        ]
      : [
          "・ご指定の内容で発送用の段ボールをお送りいたします（ご自身でご用意いただく場合は不要です）。",
          "・商品が店舗に到着次第すぐに査定を行い、査定額に関わらずそのままお振込みいたします。",
          "・スピード買取（仮査定なし）は査定額に関わらずキャンセルができませんので、あらかじめご了承ください。",
        ];
  const applicantText = [
    `${name} 様`,
    "",
    `この度は高買屋へお申し込みいただき、誠にありがとうございます。`,
    `以下の内容で「${courseLabel(course)}」のお申し込みを受け付けました。`,
    "",
    "――――――――――――――――",
    ...lines,
    "――――――――――――――――",
    "",
    "【今後の流れ】",
    ...applicantNextSteps,
    "",
    "ご不明な点がございましたら、お電話にてお気軽にお問い合わせください。",
    contactLine,
    "",
    "高買屋",
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // 開発中などAPIキー未設定の場合はここで分かりやすく失敗させる。
    // Resendにサインアップし、RESEND_API_KEY を .env.local に設定してください。
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
    process.env.RESEND_FROM_EMAIL || "高買屋 査定フォーム <onboarding@resend.dev>";

  // 店舗宛メール（画像添付あり）。こちらの送信成功を申し込み受付の成否とする。
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
        subject:
          course === "provisional"
            ? "【高買屋】仮査定申請がありました"
            : "【高買屋】スピード買取のお申し込みがありました",
        text: lines.join("\n"),
        attachments: attachments.length > 0 ? attachments : undefined,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend送信エラー（店舗宛）:", res.status, errText);
      return Response.json(
        { success: false, error: "メール送信に失敗しました。" },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("買取申込フォームの送信中にエラーが発生しました（店舗宛）:", err);
    return Response.json(
      { success: false, error: "予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }

  // 申込者宛の自動返信メール（画像添付なし）。
  // 店舗宛メールが送れていれば申し込み自体は成立しているため、
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
        to: [APPLICANT_EMAIL_TEST_OVERRIDE],
        subject: applicantSubject,
        text: applicantText,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend送信エラー（申込者宛自動返信）:", res.status, errText);
    }
  } catch (err) {
    console.error("申込者宛自動返信メールの送信中にエラーが発生しました:", err);
  }

  // attachments / files はここでスコープを抜けて破棄される（ディスクには一度も書き出していない）。
  return Response.json({ success: true });
}
