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
// スパム対策の「時間トラップ」。フロントエンドの判定だけに頼らず、
// サーバー側でもフォーム表示時刻からの経過時間を検証する。
const MIN_ELAPSED_MS = 3000;

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

  // スパム対策の時間トラップ。フォームが表示されてからの経過時間が
  // 短すぎる場合はbotによる自動送信とみなしてブロックする。
  const formLoadedAt = Number(formData.get("form_loaded_at"));
  if (!formLoadedAt || Date.now() - formLoadedAt < MIN_ELAPSED_MS) {
    return Response.json(
      { success: false, error: "送信に失敗しました。もう一度お試しください。" },
      { status: 400 }
    );
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
  const paypayQrFile = formData.get("paypay_qr_photo");
  const identityFiles = [selfieFile, idFile, paypayQrFile].filter(
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
  if (course === "speed") {
    if (paymentMethod) lines.push(`お支払い方法：${paymentMethod}`);
    lines.push(
      `本人確認書類：顔写真「${selfieFile?.name || "未添付"}」／身分証明書「${idFile?.name || "未添付"}」`
    );
    if (paypayQrFile instanceof File && paypayQrFile.size > 0) {
      lines.push(`PayPay受け取り用QRコード：「${paypayQrFile.name}」`);
    }
  }
  if (productImages.length > 0) {
    lines.push(
      `添付画像：${productImages.length}枚（${productImages.map((f) => f.name).join("、")}）`
    );
  }

  // 店舗宛メールにのみ追記する合計点数・数量ボーナス早見表。
  // 申込みフォームでは本数がカテゴリ別（DVD/ブルーレイ/コミック等）にしか分からず、
  // A/Bどちらのボーナスランクが適用されるかは現物確認後でないと判定できないため、
  // 査定担当者が加算を忘れないよう、合計点数と早見表を店舗宛メールにのみ表示する。
  const totalQuantity =
    course === "provisional"
      ? (Number(dvdCount) || 0) +
        (Number(bdCount) || 0) +
        (Number(comicCount) || 0) +
        (Number(otherCount) || 0)
      : Number(quantity) || 0;

  const storeOnlyNotes = [
    `合計点数（申告ベース）：${totalQuantity}点`,
    "",
    "【数量ボーナス早見（該当する場合、査定時に加算）】",
    "Aランク（発売2週間以内・保証価格 / 発売1ヶ月以内・完品が対象）",
    "　10本以上 +1,500円 / 30本以上 +3,000円 / 50本以上 +6,000円 / 100本以上 個別見積り",
    "Bランク（発売1年以上・完品 / ディスクのみ・状態不良が対象）",
    "　30本以上 +300円 / 50本以上 +800円 / 100本以上 +2,000円",
    "※実際の適用ランクは現物確認後の区分により判定してください。",
    "※セット商品（2枚組・3枚組等）は点数に関わらず1点としてカウントしてください（上記の合計点数は申告ベースのため、現物確認時に要再集計）。",
  ];

  const contactLine = `${company.phone}（受付 ${company.phoneHours}）`;
  const courseNameForBody = course === "provisional" ? "仮査定" : "スピード査定";
  const applicantSubject =
    course === "provisional"
      ? "【高買屋】仮査定のお申し込みを受け付けました"
      : "【高買屋】スピード査定のお申し込みを受け付けました";

  // 無料段ボールをご自身で用意いただいた場合の+300円ボーナスは、
  // 既存の box_option（ApplicationForm.js）・FAQと同じ内容で案内する。
  const boxBonusCallout = [
    "-------------------------------------------",
    "段ボールをご自身でご用意いただくと、査定額に+300円プラス！",
    "-------------------------------------------",
  ].join("\n");

  const applicantFlow =
    course === "provisional"
      ? [
          "1. 担当者が内容を確認し、仮査定額をメールにてご案内いたします",
          "2. 仮査定額にご納得いただけましたら、ご案内するページ（発送確定フォーム）より本人確認書類・お振込み先情報をご提出の上、商品をご発送ください（この時点でご成約となります）",
          "3. 商品到着後、現物を確認の上、正式な査定額を確定いたします",
          "4. 正式査定額をご案内し、ご同意いただけましたらお振込みいたします",
        ]
      : [
          "1. 商品を梱包の上、着払いにてご発送ください",
          "　梱包方法は自由です（段ボール・袋など、お好きな方法で構いません）。",
          "　無料の段ボールをご希望の方にはお送りいたします。",
          "",
          boxBonusCallout,
          "",
          "2. 商品到着後、現物を確認の上、査定額を確定いたします",
          "3. 査定額確定後、指定の口座へお振込みいたします",
          "4. お振込み完了後、査定内訳などの詳細をメールにてご連絡いたします",
        ];

  const applicantCancelPolicy =
    course === "provisional"
      ? "仮査定額のご案内後、発送前であればいつでもキャンセル可能です（キャンセル料等は一切かかりません）。また、発送後の現物確認で正式査定額が仮査定額と大きく異なる場合はご返送も可能ですが、その際の返送料はお客様のご負担となります。本人確認書類等は、発送を決めていただいた段階で初めてご提出いただく形のため、仮査定のみをご希望の場合に個人情報をご提出いただく必要はございません。"
      : "スピード査定は、商品を発送いただいた時点でご成約となります。発送前であればキャンセル可能ですが、発送後のキャンセルはお受けできません。査定額は当社の買取基準に基づき確定させていただきますので、あらかじめご了承ください。";

  const applicantText = [
    `${name} 様`,
    "",
    `この度は「${courseNameForBody}」にお申し込みいただき、誠にありがとうございます。`,
    "以下の内容でお申し込みを承りました。",
    "",
    "【お申し込み内容】",
    "――――――――――――――――",
    ...lines,
    "――――――――――――――――",
    "",
    "■ 今後の流れ",
    ...applicantFlow,
    "",
    "■ キャンセルについて",
    applicantCancelPolicy,
    "",
    "ご不明点がございましたら、お気軽にお問い合わせください。",
    contactLine,
    "",
    `高買屋（${company.legalName}）`,
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
    process.env.RESEND_FROM_EMAIL || "高買屋 査定フォーム <noreply@mail.pb-kaitori.com>";

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
        text: [...lines, "", ...storeOnlyNotes].join("\n"),
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
  if (email) {
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
  }

  // attachments / files はここでスコープを抜けて破棄される（ディスクには一度も書き出していない）。
  return Response.json({ success: true });
}
