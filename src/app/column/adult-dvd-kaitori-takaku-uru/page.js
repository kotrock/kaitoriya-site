import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CheckCircleIcon } from "@/components/Icons";
import { siteUrl, company, payoutOptions, campaign, ogImage } from "@/data/site";
import { isCampaignActive } from "@/lib/campaign";

const PAGE_PATH = "/column/adult-dvd-kaitori-takaku-uru";
const PAGE_URL = `${siteUrl}${PAGE_PATH}`;
const PUBLISHED_DATE = "2026-10-06";

const title =
  "アダルトDVDを高く売る7つのコツ｜宅配買取の流れと注意点【2026年版】";
const description =
  "アダルトDVD・Blu-rayを少しでも高く売るコツを、買取専門店が解説。品番の確認、セット商品の数え方、まとめ売りのコツ、査定・送料・振込手数料無料で売る方法まで。";
const h1Title = "アダルトDVDを高く売る7つのコツ｜宅配買取の流れと注意点";

// キャンペーン有無はリクエスト時点の日付で判定する必要があるため、このページは
// 静的生成のまま固定化せず、短い間隔でISR再生成する。
export const revalidate = 60;

export const metadata = {
  title,
  description,
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title,
    description,
    url: PAGE_PATH,
    siteName: "高買屋",
    locale: "ja_JP",
    type: "website",
    images: [{ ...ogImage, alt: title }],
  },
};

const comparisonRows = [
  {
    item: "状態",
    good: "傷が少ない、ケース・帯あり",
    bad: "大きな傷、割れ、カビ",
  },
  {
    item: "付属品",
    good: "特典・ブックレットあり",
    bad: "欠品多数",
  },
  {
    item: "種類",
    good: "市販品の正規ディスク",
    bad: "レンタル落ち品、ディスクのみ（条件による）",
  },
  {
    item: "数え方",
    good: "ー",
    bad: "セット商品（2枚組・3枚組など）は枚数に関わらず1点",
  },
];

const checklist = [
  "古物商許可番号が明記されている",
  "運営会社と所在地が分かる",
  "査定・送料・振込手数料が無料",
  "相談できる窓口がある",
  "品番ごとの査定に対応している",
  "キャンペーンの条件が分かりやすい",
];

const articleFaqs = [
  {
    q: "アダルトDVDは売れますか？",
    a: "はい、正規の市販品なら売れます。品番が分かり、状態が良いほど高くなります。",
  },
  {
    q: "1枚だけでも買い取ってもらえますか？",
    a: "いいえ、原則として一度のお申し込みでアダルトDVD・ブルーレイは5本以上、アダルトコミックのみの場合は10冊以上からの買取となります（仮査定コースも同様です）。なお、初回利用キャンペーンの対象は10点以上、スピードコースのご依頼条件は5点以上です。",
  },
  {
    q: "写真は必ず必要ですか？",
    a: "仮査定コースでは必須です。背表紙が見える写真を全商品分お願いします。写真がない商品は最低価格での査定になります。",
  },
  {
    q: "セット商品は何点になりますか？",
    a: "枚数にかかわらず1点です。",
  },
  {
    q: "レンタル落ちは売れますか？",
    a: "買取自体は対象です。ただし、ケースなし・レンタル落ち品は個別査定（定額）となり、初回利用キャンペーンなどの対象には含まれません。詳しくはFAQをご確認ください。",
  },
  {
    q: "手数料はかかりますか？",
    a: `査定・送料・振込手数料のすべて${payoutOptions.bankFee}です。`,
  },
  {
    q: "個人情報は大丈夫ですか？",
    a: "古物営業法に基づく本人確認を行い、取り扱いには注意しています。プライバシーポリシーをご確認ください。",
  },
];

// ISO形式（YYYY-MM-DD）の日付をタイムゾーンのズレなく「〜年〜月〜日」表記にする。
function formatJapaneseDate(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

function CampaignNotice({ active }) {
  if (!active) {
    return (
      <p className="text-sm text-[#5c554d] bg-[#f7f3ee] rounded-xl px-5 py-4">
        初めての方は買取額+{campaign.normalBonus}（10点以上）。ディスクのみ・レンタル品等を除く。セット商品は1点として数えます。
      </p>
    );
  }
  return (
    <div className="bg-gradient-to-b from-[#b3242b] to-[#8f1c22] rounded-2xl p-5 text-white flex flex-col gap-1.5">
      <p className="text-sm font-bold leading-relaxed">
        今なら期間限定！初めての方は買取額
        <del className="text-white/55 decoration-2 ml-1">
          +{campaign.normalBonus}
        </del>
        {" → "}
        <span className="text-[#ffe08a]">
          期間限定+{campaign.campaignBonus}
        </span>
        （10点以上）
      </p>
      <p className="text-xs text-white/80">
        〜{formatJapaneseDate(campaign.endDate)}まで
      </p>
      <p className="text-[11px] text-white/70">
        ※ディスクのみ・レンタル品等を除く。セット商品は1点として数えます。
      </p>
    </div>
  );
}

function ApplyCta() {
  return (
    <Link
      href="/application"
      className="bg-[#b3242b] text-white text-sm font-bold py-4 px-6 rounded-full text-center hover:bg-[#8f1c22] transition-colors"
    >
      まずは仮査定から。写真を送るだけで金額が分かります
    </Link>
  );
}

export default function AdultDvdKaitoriTakakuUruPage() {
  const campaignActive = isCampaignActive();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: h1Title,
    datePublished: PUBLISHED_DATE,
    dateModified: PUBLISHED_DATE,
    author: {
      "@type": "Organization",
      name: company.name,
    },
    publisher: {
      "@type": "Organization",
      name: company.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}${ogImage.url}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": PAGE_URL,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: articleFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "買取コラム",
        item: `${siteUrl}/column`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "アダルトDVDを高く売る7つのコツ",
        item: PAGE_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero eyebrow="COLUMN" title={h1Title} />
      <section className="w-full px-6 md:px-8 py-14">
        <article className="max-w-[700px] mx-auto flex flex-col gap-10">
          <nav
            aria-label="パンくずリスト"
            className="-mt-4 flex flex-wrap items-center gap-1.5 text-xs text-[#726b5e]"
          >
            <Link href="/" className="hover:text-[#b3242b] hover:underline">
              ホーム
            </Link>
            <span>›</span>
            <Link
              href="/column"
              className="hover:text-[#b3242b] hover:underline"
            >
              コラム
            </Link>
            <span>›</span>
            <span>アダルトDVDを高く売る7つのコツ</span>
          </nav>

          <div className="flex flex-col gap-4">
            <p className="text-sm leading-loose text-[#5c554d]">
              <strong className="text-[#26221e]">
                結論から言うと、高く売るポイントは「品番が分かる状態で」「まとめて」「専門店に」出すことです。
              </strong>
              この3つを押さえるだけで、同じ商品でも査定額が変わります。
            </p>
            <p className="text-sm leading-loose text-[#5c554d]">
              この記事では、パラダイスBOX公式の買取サービス「{company.name}
              」が、実際の査定で見ているポイントをもとに解説します。
            </p>
          </div>

          <CampaignNotice active={campaignActive} />

          <ApplyCta />

          <nav
            aria-label="目次"
            className="bg-[#f7f3ee] rounded-2xl p-6 flex flex-col gap-2.5"
          >
            <h2 className="text-sm font-bold text-[#26221e]">目次</h2>
            <ol className="list-decimal list-inside text-sm text-[#5c554d] flex flex-col gap-1.5">
              <li>
                <a href="#tips" className="hover:text-[#b3242b] hover:underline">
                  高く売る7つのコツ
                </a>
              </li>
              <li>
                <a
                  href="#comparison"
                  className="hover:text-[#b3242b] hover:underline"
                >
                  売れる・売れにくいものの違い
                </a>
              </li>
              <li>
                <a href="#flow" className="hover:text-[#b3242b] hover:underline">
                  宅配買取の流れ
                </a>
              </li>
              <li>
                <a
                  href="#checklist"
                  className="hover:text-[#b3242b] hover:underline"
                >
                  買取店の選び方チェックリスト
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#b3242b] hover:underline">
                  よくある質問
                </a>
              </li>
            </ol>
          </nav>

          <section id="tips" className="flex flex-col gap-7">
            <h2 className="text-lg font-bold text-[#26221e]">
              1. 高く売る7つのコツ
            </h2>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                コツ① 売る前に「品番」を確認する
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                査定は品番（型番）で行います。背表紙やパッケージにある品番が読める状態にしておくと、査定が速く、間違いも起きません。同じタイトルでも版違いや再販で価格が異なるため、品番は一番大切な情報です。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                コツ② まとめて1回で送る
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                1点ずつ送るより、まとめて送るほうが有利になる仕組みの店が多くあります。{company.name}
                でも、10点以上で「初めての方は買取額アップ」の対象になり、点数に応じた数量ボーナスもあります。売るか迷っているものも、この機会にまとめて整理するのがおすすめです。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                コツ③ 付属品・状態をそろえる
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                ケース、帯、特典、ブックレットがそろっているほど評価されます。ディスクの汚れは柔らかい布で軽く拭き、ケースの汚れも落としておきましょう。ただし、強くこすって傷をつけないよう注意してください。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                コツ④ 「仮査定」で売る前に金額を知る
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                いきなり送るのが不安なら、事前に概算を知れる仮査定が便利です。{company.name}
                では、全商品の背表紙が見える写真をアップロードしてもらいます。品番を確認して正確に見積もるためで、写真がない商品は最低価格での査定になります。逆に言うと、写真さえしっかり撮れば、金額のブレが小さくなります。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                コツ⑤ 手数料の「見えないコスト」を比較する
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                買取額が高くても、送料、振込手数料、査定手数料で手取りが減ることがあります。{company.name}
                は査定無料・送料無料・振込手数料{payoutOptions.bankFee}
                なので、表示された金額がそのまま手取りの基準になります。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                コツ⑥ 段ボールは自分で用意すると得になることがある
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                梱包用の段ボールを自分で用意すると特典がつく場合があります（条件はディスクのみ・レンタル品等を除く10点以上）。手元にある箱を使えば、その分お得です。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                コツ⑦ 価値が分かる専門店に出す
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                総合リサイクル店では、品番まで見られず一律に低めの価格になることがあります。専門知識のある店は、相場に合わせた価格をつけられます。
              </p>
            </div>
          </section>

          <ApplyCta />

          <section id="comparison" className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#26221e]">
              2. 売れる・売れにくいものの違い
            </h2>
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <table className="min-w-[560px] w-full text-sm border-collapse bg-white rounded-2xl overflow-hidden border border-[#ece6dc]">
                <caption className="sr-only">
                  売れやすい商品・売れにくい商品の比較
                </caption>
                <thead>
                  <tr className="bg-[#26221e] text-white text-[13px]">
                    <th scope="col" className="py-3 px-5 text-left font-bold">
                      項目
                    </th>
                    <th scope="col" className="py-3 px-5 text-left font-bold">
                      売れやすい
                    </th>
                    <th scope="col" className="py-3 px-5 text-left font-bold">
                      売れにくい／対象外になりやすい
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.item}
                      className="border-t border-[#ece6dc] even:bg-[#f7f3ee]"
                    >
                      <th
                        scope="row"
                        className="py-3.5 px-5 text-left font-bold text-[#26221e] whitespace-nowrap"
                      >
                        {row.item}
                      </th>
                      <td className="py-3.5 px-5 text-[#5c554d]">{row.good}</td>
                      <td className="py-3.5 px-5 text-[#5c554d]">{row.bad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#726b5e] leading-relaxed">
              セット商品は、実際の枚数にかかわらず1点として数えます。キャンペーンや数量ボーナスの点数にも同じルールを使います。
            </p>
          </section>

          <section id="flow" className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#26221e]">
              3. 宅配買取の流れ（3ステップ）
            </h2>
            <ol className="flex flex-col gap-3">
              <li className="flex gap-3 text-sm leading-loose text-[#5c554d]">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#b3242b] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>
                  <strong className="text-[#26221e]">申込み：</strong>
                  フォームから、仮査定またはスピードコースを選ぶ（スピードコースは5点以上）
                </span>
              </li>
              <li className="flex gap-3 text-sm leading-loose text-[#5c554d]">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#b3242b] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>
                  <strong className="text-[#26221e]">発送・査定：</strong>
                  梱包して送る（送料無料）。本人確認書類のご提出が必要です（スピードコースは申込み時に、仮査定コースは発送手続き時にご提出いただきます）。
                </span>
              </li>
              <li className="flex gap-3 text-sm leading-loose text-[#5c554d]">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#b3242b] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>
                  <strong className="text-[#26221e]">振込：</strong>
                  金額に同意すれば入金（振込手数料{payoutOptions.bankFee}）
                </span>
              </li>
            </ol>
            <p className="text-xs text-[#726b5e] leading-relaxed">
              補足：運営会社と古物商許可番号は
              <Link
                href="/tokuhou"
                className="text-[#b3242b] hover:underline"
              >
                特定商取引法に基づく表記
              </Link>
              ページでご確認いただけます（{company.legalName}・
              {company.antiqueLicense}）。
            </p>
          </section>

          <section id="checklist" className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#26221e]">
              4. 買取店の選び方チェックリスト
            </h2>
            <ul className="flex flex-col gap-2.5">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-[#5c554d]"
                >
                  <CheckCircleIcon className="w-4.5 h-4.5 text-[#2f9e5c] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#726b5e] leading-relaxed">
              補足：{company.name}
              は、仙台でTENGA
              SHOPなどを運営するパラダイスBOXの公式サービスです。実店舗での販売経験が、相場判断に活きています。
            </p>
          </section>

          <CampaignNotice active={campaignActive} />

          <ApplyCta />

          <section id="faq" className="flex flex-col gap-3.5">
            <h2 className="text-lg font-bold text-[#26221e]">
              5. よくある質問
            </h2>
            {articleFaqs.map((faq) => (
              <div
                key={faq.q}
                className="border border-[#ece6dc] rounded-xl py-5 px-6 flex flex-col gap-2 bg-white"
              >
                <div className="flex gap-2.5 text-sm font-bold text-[#26221e]">
                  <span className="text-[#b3242b]">Q</span>
                  {faq.q}
                </div>
                <div className="flex gap-2.5 text-[13px] leading-loose text-[#5c554d]">
                  <span className="text-[#726b5e] font-bold">A</span>
                  {faq.a}
                </div>
              </div>
            ))}
          </section>

          <div className="bg-white border border-[#ece6dc] rounded-2xl p-6 flex flex-col gap-3">
            <h2 className="text-base font-bold text-[#26221e]">関連ページ</h2>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li>
                <Link
                  href="/campaign"
                  className="text-[#b3242b] font-bold hover:underline"
                >
                  初めてのご利用で査定額アップキャンペーン →
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[#b3242b] font-bold hover:underline"
                >
                  よくある質問 →
                </Link>
              </li>
              <li>
                <Link
                  href="/application"
                  className="text-[#b3242b] font-bold hover:underline"
                >
                  買取お申込みフォーム →
                </Link>
              </li>
              <li>
                <Link
                  href="/tokuhou"
                  className="text-[#b3242b] font-bold hover:underline"
                >
                  特定商取引法に基づく表記 →
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-[#b3242b] font-bold hover:underline"
                >
                  プライバシーポリシー →
                </Link>
              </li>
              <li>
                <Link
                  href="/column"
                  className="text-[#b3242b] font-bold hover:underline"
                >
                  買取コラム一覧 →
                </Link>
              </li>
            </ul>
          </div>
        </article>
      </section>
    </>
  );
}
