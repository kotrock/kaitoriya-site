// Vercelの標準ドメインを暫定利用。独自ドメインが決まったら
// NEXT_PUBLIC_SITE_URL 環境変数で上書きしてください。
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kaitoriya-site.vercel.app";

export const company = {
  name: "高買屋",
  legalName: "有限会社 萬屋カンパニー",
  founded: "1988年（昭和63年）6月",
  representative: "守屋 貴博",
  postalCode: "〒981-3111",
  address: "宮城県仙台市泉区松森字坂下1-1",
  shipTo: "パラダイスＢＯＸ仙台店",
  phone: "022-343-1588",
  phoneTel: "0223431588",
  phoneHours: "9時〜18時",
  email: "pbox_sendai@yahoo.co.jp",
  businessDesc: "本・DVD・雑貨の販売",
  parentSite: "https://www.paradise-box.com/",
  antiqueLicense: "宮城県公安委員会許可第221240000756号",
  bank: "七十七銀行より指定の口座へお振込み",
  // TODO: 実際のLINE公式アカウントの友だち追加URLに差し替えてください
  lineUrl: "https://lin.ee/xxxxxxx",
  googleReviewUrl: "https://maps.app.goo.gl/D1C2TE1gmSmiPqrY9",
};

export const storeVisit = {
  available: true,
  note: "予約不要・24時間受付。査定額はその場で現金にてお支払いします。",
};

// 銀行振込・PayPay受け取りの条件。値を変更する場合はFAQ・利用規約・特定商取引法ページの記載も揃えて確認してください。
export const payoutOptions = {
  bankFee: "880円",
  paypayBonus: "300円",
};

// 初回利用キャンペーンのボーナス額。
export const firstTimeBonus = "1,000円";

export const nav = [
  { href: "/#price", label: "買取価格表" },
  { href: "/recycle", label: "DVD無料回収" },
  { href: "/#flow", label: "ご利用の流れ" },
  { href: "/user-voice", label: "利用者の声" },
  { href: "/faq", label: "よくある質問" },
];

export const footerLinks = [
  { href: "/about", label: "会社概要" },
  { href: "/results", label: "買取実績" },
  { href: "/column", label: "買取コラム" },
  { href: "/terms-of-use", label: "利用規約" },
  { href: "/tokuhou", label: "特定商取引法" },
  { href: "/privacy-policy", label: "プライバシーポリシー" },
];

export const labels = [
  "エスワン", "ムーディーズ", "マドンナ", "FALENO", "アイポケ",
  "アタッカーズ", "プレミアム", "フィッチ", "ワンズ",
];

export const trustItems = [
  { icon: "truck", title: "送料無料", desc: "全国一律（離島等除く）" },
  { icon: "search", title: "査定無料", desc: "何本でも0円で査定" },
  { icon: "box", title: "段ボール無料", desc: "5箱まで無料提供" },
  { icon: "lock", title: "個人情報厳重管理", desc: "梱包は中身が見えない配慮" },
  { icon: "calendar", title: `創業${company.founded.match(/^\d+年/)[0]}`, desc: "古物商許可の老舗店舗" },
  { icon: "store", title: "実店舗運営", desc: "パラダイスＢＯＸ仙台店" },
];

export const priceTiers = [
  {
    condition: "発売2週間以内・完品",
    target: "最新作限定の保証価格",
    rate: "45〜50%",
    rateMin: 45,
    rateMax: 50,
  },
  {
    condition: "発売1ヶ月以内・完品",
    target: "通常の新作",
    rate: "25〜30%",
    rateMin: 25,
    rateMax: 30,
  },
  {
    condition: "発売3ヶ月以内・完品",
    target: "準新作",
    rate: "15〜20%",
    rateMin: 15,
    rateMax: 20,
  },
  {
    condition: "発売4ヶ月〜1年以内・完品",
    target: "通常作品",
    rate: "10〜12%",
    rateMin: 10,
    rateMax: 12,
  },
  {
    condition: "発売1年以上・完品",
    target: "旧作",
    rate: "3〜8%",
    rateMin: 3,
    rateMax: 8,
  },
  {
    condition: "ディスクのみ・状態不良",
    target: "ケース/ジャケットなし、破れ、レンタル落ち等",
    rate: "個別査定(定額)",
    rateMin: null,
    rateMax: null,
  },
];

// シミュレーター用の仮の平均定価（1本あたり）。商品ごとの正確な定価データがないための概算値。
export const avgUnitPrice = 4000;

// 数量ボーナス。Aランクは新作系、Bランクは旧作・ディスクのみが対象。
export const bonusTiers = {
  aRank: {
    label: "発売2週間以内・保証価格 / 発売1ヶ月以内・完品が対象",
    tiers: [
      { count: "10本以上", bonus: "+1,500円" },
      { count: "30本以上", bonus: "+3,000円" },
      { count: "50本以上", bonus: "+6,000円" },
      { count: "100本以上", bonus: "個別見積り(お問い合わせ)" },
    ],
  },
  bRank: {
    label: "発売1年以上・完品 / ディスクのみ・状態不良が対象",
    tiers: [
      { count: "30本以上", bonus: "+300円" },
      { count: "50本以上", bonus: "+800円" },
      { count: "100本以上", bonus: "+2,000円" },
    ],
  },
};

export const steps = [
  { num: "1", title: "お申し込み", desc: "フォームからお客様情報と商品情報をご入力ください。仮査定の希望有無も選べます。" },
  { num: "2", title: "梱包・発送", desc: "無料の段ボールに詰めて発送するだけ。着払いで送料もかかりません。" },
  {
    num: "3",
    title: "査定・お振込み",
    desc: `店舗到着後、最短翌日にお振込みいたします。銀行振込（振込手数料${payoutOptions.bankFee}）とPayPay受け取り（${payoutOptions.paypayBonus}プラス）からお選びいただけます。`,
  },
];

export const voices = [
  { text: "思っていたより高く買い取ってもらえました。段ボールが無料なのも助かりました。", name: "仙台市 30代男性" },
  { text: "個人情報を提示せずに処分できるプランがあり安心して利用できました。", name: "東京都 40代男性" },
  { text: "査定から入金までのスピードが早く、対応も丁寧でした。", name: "大阪府 20代男性" },
];

// サンプルデータ。実際の買取実績が取れ次第、この配列を差し替えてください。
export const results = [
  { date: "09/20", prefecture: "宮城県", category: "アダルトDVD（人気レーベル）", count: "45点", amount: "32,400円" },
  { date: "09/18", prefecture: "東京都", category: "アダルトDVD・ブルーレイ", count: "120点", amount: "68,500円" },
  { date: "09/15", prefecture: "大阪府", category: "アダルトDVD", count: "8点", amount: "5,200円" },
  { date: "09/12", prefecture: "北海道", category: "アダルトDVD・ブルーレイ", count: "60点", amount: "41,000円" },
  { date: "09/08", prefecture: "福岡県", category: "アダルトDVD", count: "15点", amount: "9,800円" },
  { date: "09/05", prefecture: "愛知県", category: "アダルトDVD（人気レーベル）", count: "30点", amount: "21,600円" },
  { date: "09/02", prefecture: "神奈川県", category: "アダルトDVD・ブルーレイ", count: "95点", amount: "54,300円" },
  { date: "08/29", prefecture: "埼玉県", category: "アダルトDVD", count: "12点", amount: "7,400円" },
  { date: "08/25", prefecture: "千葉県", category: "アダルトDVD・ブルーレイ", count: "200点", amount: "118,000円" },
  { date: "08/20", prefecture: "兵庫県", category: "アダルトコミック", count: "25点", amount: "6,800円" },
];

// 累計サマリー用のサンプルデータ。実績が増え次第、実際の集計値に差し替えてください。
export const resultsSummary = {
  totalCount: "12,480点",
  totalAmount: "8,240,000円",
};

// 買取コラム。記事本文は src/app/column/[slug]/page.js に実装します。
export const columns = [
  {
    slug: "label-souba",
    title: "レーベル別の買取相場",
    excerpt:
      "エスワン・ムーディーズ・マドンナ・FALENOなど人気レーベルの買取相場の傾向と、高く売れやすい条件を解説します。",
    date: "2026-09-21",
  },
];

export const faqs = [
  {
    q: "どのようなDVDを買取していますか？",
    a: "一般的に流通しているアダルトDVDを買取しております。店舗、ネットどこで買ったものでも対象です。レンタル落ちやディスクのみでも買取可能！そのほかアダルトコミックも買取させて頂いてます。",
  },
  {
    q: "買取をする際に必要なものは何ですか？",
    a: "身分証明書（運転免許証、健康保険証、マイナンバーカードなど）が必要です。郵送時に提示して頂く際はコピーで、画像を添付できる方は両面の画像添付で提出をお願いしております。",
  },
  {
    q: "査定にお金はかかりますか？",
    a: "買取査定は何本でも無料です。仮査定を知りたいだけでも査定は無料ですのでご気軽にお申し込みください。",
  },
  {
    q: "何点から買取可能ですか？",
    a: "一度の買取でアダルトDVD、ブルーレイディスク「5本以上」から買取可能となります。アダルトコミックのみの場合は10冊以上から。",
  },
  {
    q: "査定基準はどのように決まりますか？",
    a: "DVDの発売日、状態、などを基準に査定いたします。傷や汚れがある場合、買取価格が下がることがあります。",
  },
  {
    q: "事前に仮査定はできますか？",
    a: "はい、できます。当社は「スピード買取（仮査定なし）」と「仮査定申請（仮査定あり）」からお選び頂けます。どちらを選んでも査定額の変動はございませんのでお急ぎの方は「スピード買取（仮査定なし）」がおすすめです。",
  },
  {
    q: "査定後にキャンセルできますか？",
    a: "はい、できます。仮査定申請の査定額にご満足いただけない場合はキャンセル可能です。しかし店舗へ郵送後の場合、キャンセルは可能ですが、返送料はお客様負担となりますので予めご了承ください。",
  },
  {
    q: "仮査定はどれぐらいの時間がかかりますか？",
    a: "お問い合わせから最短当日〜2日程度で仮査定のご連絡をいたします。",
  },
  {
    q: "ケースやジャケットがない場合でも買取可能ですか？",
    a: "ケースやジャケットがないDVDは「ディスクのみ」として買取致しております。ただディスクのみは雑誌の付録、コピー品は買取対象外となります。",
  },
  {
    q: "査定結果のメールが届きません。",
    a: "登録のメールアドレスが間違えている、迷惑メール設定・指定受信設定がされている場合が考えられます。docomo/au/softbankなどのメールアドレスは、設定を行わないとメールが受信できません。",
  },
  {
    q: "一点ずつの査定明細は確認できますか？",
    a: "査定額は総額でのご案内となり、一点ずつの明細はご案内致しておりません。",
  },
  {
    q: "DVDを送る段ボールがありません。",
    a: "お申し込みの際に段ボールの有無をご記入ください。高買屋では「5箱まで無料」で発送用の段ボールをお送りいたします。お客様が段ボールをご用意して頂くと査定額にプラス300円上乗せいたします（どんな段ボールでもOK）。",
  },
  {
    q: "どんな商品が高く売れますか。",
    a: "発売2週間以内・完品の最新作は定価の45%〜50%の保証価格で買取いたします。発売時期が新しいものほど高価買取となります。その他キャンペーンも実施しておりますのでご確認ください。",
  },
  {
    q: "大量のDVD買取でも大丈夫ですか？",
    a: "法人様、個人様の大量買取も承っております。梱包や発送などもご相談にのりますので、DVD無料回収ページよりお気軽にお問合せください。",
  },
  {
    q: "お支払い方法を選べますか？",
    a: "銀行振込とPayPay受け取りからお選びいただけます。銀行振込は振込手数料880円を頂戴しておりますが、PayPay受け取りの場合は逆に300円プラスしてお支払いします。",
  },
];
