// 発送確定フォーム（仮査定にご納得いただいた方向け）の送信を処理するAPI Route。
//
// 重要: 身分証明書・PayPay受け取り用QRコード等の添付ファイルは一切ディスク・DBに
// 保存しません。リクエストで受け取ったファイルはメモリ上でBase64化してメール送信
// APIに渡すだけで、この関数の処理が終わると同時に（明示的な削除処理なしに）
// メモリから解放されます。

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const TO_EMAIL = "pbkaitori@gmail.com";

// スパム対策の「時間トラップ」。フロントエンドの判定だけに頼らず、
// サーバー側でもフォーム表示時刻からの経過時間を検証する。
const MIN_ELAPSED_MS = 3000;

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

  const name = String(formData.get("name") || "");
  const phone = String(formData.get("phone") || "");
  const paymentMethod = String(formData.get("payment_method") || "");
  const bankAccountInfo = String(formData.get("bank_account_info") || "");

  const idFile = formData.get("id_document_photo");
  const paypayQrFile = formData.get("paypay_qr_photo");
  const files = [idFile, paypayQrFile].filter(
    (entry) => entry instanceof File && entry.size > 0
  );

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
    `お名前：${name}`,
    `電話番号：${phone}`,
    `お振込み方法：${paymentMethod}`,
  ];
  if (paymentMethod === "銀行振込" && bankAccountInfo) {
    lines.push(`振込先口座情報：${bankAccountInfo}`);
  }
  lines.push(`身分証明書：「${idFile?.name || "未添付"}」`);
  if (paypayQrFile instanceof File && paypayQrFile.size > 0) {
    lines.push(`PayPay受け取り用QRコード：「${paypayQrFile.name}」`);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY が設定されていません。");
    return Response.json(
      {
        success: false,
        error: "現在受け付けられません。恐れ入りますがお電話でお問い合わせください。",
      },
      { status: 500 }
    );
  }

  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "高買屋 査定フォーム <noreply@mail.pb-kaitori.com>";

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
        subject: "【高買屋】仮査定の発送確定情報が届きました（要：仮査定依頼と照合）",
        text: lines.join("\n"),
        attachments: attachments.length > 0 ? attachments : undefined,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend送信エラー（発送確定フォーム）:", res.status, errText);
      return Response.json(
        { success: false, error: "メール送信に失敗しました。" },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("発送確定フォームの送信中にエラーが発生しました:", err);
    return Response.json(
      { success: false, error: "予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }

  // attachments / files はここでスコープを抜けて破棄される（ディスクには一度も書き出していない）。
  return Response.json({ success: true });
}
