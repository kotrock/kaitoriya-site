// 買取申込フォーム（スピード買取・仮査定申請）の送信を処理するAPI Route。
//
// 重要: ジャケット画像等の添付ファイルは一切ディスク・DBに保存しません。
// リクエストで受け取ったファイルはメモリ上でBase64化してメール送信APIに渡すだけで、
// この関数の処理が終わると同時に（明示的な削除処理なしに）メモリから解放されます。

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
// TODO: ドメイン認証完了後に本番用アドレス（pbox_sendai@yahoo.co.jp）へ戻す。
// 現在は動作確認のため ktvotarou@gmail.com に一時変更中。
const TO_EMAIL = "ktvotarou@gmail.com";

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
  const boxOption = String(formData.get("box_option") || "");
  const paymentMethod = String(formData.get("payment_method") || "");
  const productDetails = String(formData.get("product_details") || "");

  const files = formData
    .getAll("images")
    .filter((entry) => entry instanceof File && entry.size > 0);

  for (const file of files) {
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
      files.map(async (file) => ({
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
    `買取希望商品の本数：${quantity}`,
  ];
  if (course === "provisional" && productDetails) {
    lines.push(`買取商品の内容：${productDetails}`);
  }
  if (boxOption) lines.push(`発送用の段ボール：${boxOption}`);
  if (paymentMethod) lines.push(`お支払い方法：${paymentMethod}`);
  if (files.length > 0) {
    lines.push(
      `添付画像：${files.length}枚（${files.map((f) => f.name).join("、")}）`
    );
  }

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
      console.error("Resend送信エラー:", res.status, errText);
      return Response.json(
        { success: false, error: "メール送信に失敗しました。" },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("買取申込フォームの送信中にエラーが発生しました:", err);
    return Response.json(
      { success: false, error: "予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }

  // attachments / files はここでスコープを抜けて破棄される（ディスクには一度も書き出していない）。
  return Response.json({ success: true });
}
