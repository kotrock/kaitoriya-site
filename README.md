This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 運用メモ：仮査定額のご案内メール（手動送信）

仮査定申込みの担当者が仮査定額を確定した際、以下のテンプレートを使って**手動で**お客様にメールを送信してください（このメール自体はシステムからの自動送信ではありません）。

本文中の `https://（本番URL）/shipping-confirm` は、本番ドメイン確定後に実際のURLへ差し替えてください。お客様はこのリンク先の発送確定フォームから、本人確認書類とお振込み先情報を提出した上で商品を発送します。

```
件名: 【高買屋】仮査定額のご案内

○○ 様

お待たせいたしました。ご依頼いただいた商品の仮査定額は
以下の通りです。

【仮査定額】
◯◯円

こちらの金額にご納得いただけましたら、下記フォームより
本人確認書類とお振込み先情報をご提出の上、商品をご発送ください。

▼ 発送手続きフォーム
https://（本番URL）/shipping-confirm

【発送手続きについて】
・梱包方法は自由です（段ボール・袋など、お好きな方法で構いません）
・無料の段ボールをご希望の場合はお申し付けください

  -------------------------------------------
  段ボールをご自身でご用意いただくと、査定額に+300円プラス！
  -------------------------------------------

・お振込み方法は、フォーム内で「銀行振込」または「PayPay」を
  お選びいただけます（PayPayの場合は受け取り用QRコード画像の
  ご提出をお願いいたします）

【キャンセルについて】
・発送前であれば、いつでもキャンセル可能です（キャンセル料等は
  一切かかりません）
・商品発送後、現物確認の結果、正式査定額が仮査定額と大きく
  異なる場合はご返送も可能ですが、その際の返送料はお客様の
  ご負担となります

ご不明点がございましたら、お気軽にお問い合わせください。

高買屋（有限会社萬屋カンパニー）
```

【運用メモ】
- 「査定内訳」の各行は実際の点数・金額に置き換えて送信する。
- 段ボール特典・PayPay特典は該当する場合のみ表示し、該当しない行は削除する。
- このメールを送る時点（仮査定額の提示＝発送前）では、支払い方法はまだ未確定（/shipping-confirmで発送確定時に選択いただく設計のため）。よって「銀行振込をご希望の場合」「PayPayをご希望の場合」の両方をそのまま残し、どちらか一方に絞らないこと。
- 「仮査定額との差についての返送案内」は、発送前に送る事前告知（利用規約的な位置づけ）のため、実際に差が出たかどうかに関わらず毎回残す。

## 運用メモ：仮査定 正式査定額のご案内メール（手動送信）

このメールは、お客様が/shipping-confirmで本人確認・支払い方法を登録し、商品を発送、到着後の現物確認が完了した後に送る。ここで初めて、各商品を実際に確認した上での確定金額（査定内訳）を提示し、承諾を得る。

```
件名: 【高買屋】正式査定額のご案内

○○ 様

お世話になっております。ご発送いただいた商品の到着・現物確認が
完了いたしましたので、確定した査定額をご案内いたします。

【査定内訳】
◯◯　◯本　◯◯円
◯◯　◯本　◯◯円

【正式査定額】
◯◯円

  -------------------------------------------
  段ボールをご自身でご用意いただいたため、査定額に+300円プラス
  しております
  -------------------------------------------

  -------------------------------------------
  PayPay受け取りのため、査定額に+300円プラスしております
  -------------------------------------------

【お支払い方法】
◯◯（/shipping-confirmでご登録いただいた方法を記載）

こちらの金額にご納得いただけましたら、このメールに「承諾します」
とご返信ください。ご返信を確認後、お振込み（またはお受け取り）の
お手続きを進めさせていただきます。

※発送前にご案内した仮査定額と、今回の正式査定額に差がある場合が
ございます。内容にご納得いただけない場合はご返送も可能ですが、
その際の返送料はお客様のご負担となりますので、あらかじめご了承
ください。

ご不明点がございましたら、お気軽にお問い合わせください。

高買屋（有限会社萬屋カンパニー）
```

【運用メモ】
- 「査定内訳」の各行は実際の点数・金額に置き換えて送信する。
- 段ボール特典・PayPay特典は該当する場合のみ表示し、該当しない行は削除する。
- 支払い方法は、/shipping-confirmで既に登録済みのため、該当する一方のみを残し、もう一方は削除する。
- 「仮査定額との差についての返送案内」は、発送前に提示した仮査定額と現物確認後の金額に差がある場合の告知として、基本的に毎回残す。

## 運用メモ：仮査定 お振込み完了のご案内メール（手動送信）

このメールは、商品到着後の現物確認が完了し、「正式査定額のご案内」で承諾いただいた金額の振込み（または送付）を実際に完了した後に送る。

```
件名: 【高買屋】お振込み完了のご案内

○○ 様

お世話になっております。ご発送いただきました商品の到着・確認が
完了し、以下の通りお振込み（またはお受け取り）手続きを完了
いたしましたのでご案内いたします。

【査定内訳】
◯◯円

【合計金額】
◯◯円

【お支払い方法】
◯◯（銀行振込／PayPayのいずれか、実際にご利用いただいた方法を
記載してください）

この度は高買屋をご利用いただき、誠にありがとうございました。
またのご利用を心よりお待ちしております。

ご不明点がございましたら、お気軽にお問い合わせください。

高買屋（有限会社萬屋カンパニー）
```

【運用メモ】
- 到着した商品が「正式査定額のご案内」時点の内容・数量と一致していることを確認してから送信する。
- 大きく異なる場合（本数不足、状態不良など）は、このメールを送らず、先に個別にお客様へ連絡し金額の再調整または返送対応を行う。
- 支払い方法は、/shipping-confirmで登録された方（銀行振込／PayPay）のみを残し、もう一方は削除する。
