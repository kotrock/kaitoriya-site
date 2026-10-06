import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CheckCircleIcon } from "@/components/Icons";
import { siteUrl, company, payoutOptions, campaign, ogImage } from "@/data/site";
import { isCampaignActive } from "@/lib/campaign";

const PAGE_PATH = "/column/adult-dvd-kaitori-takaku-uru";
const PAGE_URL = `${siteUrl}${PAGE_PATH}`;
const PUBLISHED_DATE = "2026-10-06";

const title = "アダルトDVDはどこで売るのが正解？買取方法4つを比較【2026年版】";
const description =
  "アダルトDVD・Blu-rayはどこで売るのが良いか迷っている方へ。フリマ・オークション・リサイクル店・宅配買取専門店の違いを比較し、手数料無料で売れる方法まで買取専門店が解説します。";
const h1Title = "アダルトDVDはどこで売るのが正解？買取方法4つを比較";

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
    place: "フリマアプリ（メルカリ等）",
    effort: "出品・梱包・やり取りが必要",
    suited: "手間をかけても1本ずつ売りたい人",
    caution:
      "アダルトDVD・BDの出品を規約で禁止しているサービスがある（メルカリは禁止とされています）。最新規約を確認",
  },
  {
    place: "ネットオークション（ヤフオク等）",
    effort: "出品・梱包・やり取りが必要",
    suited: "相場を見ながら自分で売りたい人",
    caution:
      "倫理団体の認証マークがないアダルト映像商品は出品禁止、パッケージ表裏の画像掲載が必須などのルールがある（2020年前後のルール改定）。最新ルールを確認",
  },
  {
    place: "総合リサイクル店（店頭・宅配）",
    effort: "店頭へ持ち込み",
    suited: "少量をすぐ現金化したい人",
    caution:
      "アダルトDVDの取扱いは店舗により異なる。品番まで見られず、価格が一律になることがある",
  },
  {
    place: "アダルト専門の宅配買取",
    effort: "申込み・梱包のみ",
    suited: "まとめて、手間なく売りたい人",
    caution:
      "手数料（送料・振込手数料・査定料）が有料の店もあるので比較が必要",
  },
];

const checklist = [
  "古物商許可番号が明記されている",
  "運営会社と所在地が分かる",
  "査定・送料・振込手数料が無料か",
  "買取対象とキャンペーンの条件が分かりやすい",
  "相談できる窓口がある",
  "品番ごとの査定に対応している",
];

const articleFaqs = [
  {
    q: "アダルトDVDはどこで売るのが一番高いですか？",
    a: "金額は商品の人気・品番・状態によって変わり、一概には言えません。市販の正規ディスクをまとめて売る場合は、品番で査定する専門の買取店が向いています。",
  },
  {
    q: "メルカリでアダルトDVDは売れますか？",
    a: "メルカリは規約でアダルトDVD・BDの出品を禁止しているとされています。最新の規約はメルカリの公式ヘルプでご確認ください。",
  },
  {
    q: "ヤフオクで売るときの注意点は？",
    a: "倫理団体の認証マークがないアダルト映像商品は出品できないなど、独自のルールがあります。最新ルールはヤフオクの公式ヘルプでご確認ください。",
  },
  {
    q: "店頭買取と宅配買取はどちらがいいですか？",
    a: "すぐ現金化したい少量なら店頭、人に会わずにまとめて売りたいなら宅配が向いています。なお、店頭でアダルトDVDを扱っているかは店舗により異なります。",
  },
  {
    q: "1枚だけでも買い取ってもらえますか？",
    a: "原則5本以上（コミックのみ10冊以上）からの買取です。",
  },
  {
    q: "レンタル落ちは売れますか？",
    a: "買取自体は対象です。ただしキャンペーンの対象外です。",
  },
  {
    q: "セット商品は何点になりますか？",
    a: "枚数にかかわらず1点です。",
  },
  {
    q: "手数料はかかりますか？",
    a: `査定・送料・振込手数料のすべて${payoutOptions.bankFee}です。`,
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
    description,
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
        name: "アダルトDVDはどこで売るのが正解？",
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
            <span>アダルトDVDはどこで売るのが正解？</span>
          </nav>

          <div className="flex flex-col gap-4">
            <p className="text-sm leading-loose text-[#5c554d]">
              <strong className="text-[#26221e]">
                結論から言うと、まとめて売るなら「アダルト専門の宅配買取」がおすすめです。
              </strong>
              フリマやオークションは手間や出品ルールのハードルがあり、リサイクル店は店舗ごとに取扱いが違うためです。
            </p>
            <p className="text-sm leading-loose text-[#5c554d]">
              この記事では、パラダイスBOX公式の買取サービス「{company.name}
              」が、売る場所4つの違いと、失敗しない選び方を解説します。
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
                <a
                  href="#conclusion"
                  className="hover:text-[#b3242b] hover:underline"
                >
                  結論：迷ったら宅配買取専門店
                </a>
              </li>
              <li>
                <a
                  href="#comparison"
                  className="hover:text-[#b3242b] hover:underline"
                >
                  売る場所4つを比較
                </a>
              </li>
              <li>
                <a
                  href="#details"
                  className="hover:text-[#b3242b] hover:underline"
                >
                  場所ごとのメリット・注意点
                </a>
              </li>
              <li>
                <a
                  href="#checklist"
                  className="hover:text-[#b3242b] hover:underline"
                >
                  宅配買取専門店の選び方
                </a>
              </li>
              <li>
                <a
                  href="#kaitoriya"
                  className="hover:text-[#b3242b] hover:underline"
                >
                  高買屋でできること
                </a>
              </li>
              <li>
                <a href="#tips" className="hover:text-[#b3242b] hover:underline">
                  高く売る3つのコツ
                </a>
              </li>
              <li>
                <a href="#flow" className="hover:text-[#b3242b] hover:underline">
                  宅配買取の流れ
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#b3242b] hover:underline">
                  よくある質問
                </a>
              </li>
            </ol>
          </nav>

          <section id="conclusion" className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-[#26221e]">
              1. 結論：迷ったら宅配買取専門店
            </h2>
            <p className="text-sm leading-loose text-[#5c554d]">
              こんな方は宅配買取専門店が向いています。
            </p>
            <ul className="list-disc list-inside text-sm leading-loose text-[#5c554d] flex flex-col gap-1">
              <li>5本以上まとめて処分したい</li>
              <li>自宅から出ずに、人に会わず売りたい</li>
              <li>出品や発送のやり取りをしたくない</li>
              <li>品番ごとにきちんと査定してほしい</li>
            </ul>
            <p className="text-sm leading-loose text-[#5c554d]">
              逆に、1〜2本だけで手間をかけてもよい方は、フリマ・オークションも選択肢です（ただし後述のルールに注意）。
            </p>
          </section>

          <section id="comparison" className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#26221e]">
              2. 売る場所4つを比較
            </h2>
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <table className="min-w-[760px] w-full text-sm border-collapse bg-white rounded-2xl overflow-hidden border border-[#ece6dc]">
                <caption className="sr-only">
                  アダルトDVDを売る場所4つの比較
                </caption>
                <thead>
                  <tr className="bg-[#26221e] text-white text-[13px]">
                    <th scope="col" className="py-3 px-5 text-left font-bold">
                      売る場所
                    </th>
                    <th scope="col" className="py-3 px-5 text-left font-bold">
                      手間
                    </th>
                    <th scope="col" className="py-3 px-5 text-left font-bold">
                      向いている人
                    </th>
                    <th scope="col" className="py-3 px-5 text-left font-bold">
                      注意点
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.place}
                      className="border-t border-[#ece6dc] even:bg-[#f7f3ee]"
                    >
                      <th
                        scope="row"
                        className="py-3.5 px-5 text-left font-bold text-[#26221e]"
                      >
                        {row.place}
                      </th>
                      <td className="py-3.5 px-5 text-[#5c554d]">
                        {row.effort}
                      </td>
                      <td className="py-3.5 px-5 text-[#5c554d]">
                        {row.suited}
                      </td>
                      <td className="py-3.5 px-5 text-[#5c554d]">
                        {row.caution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#726b5e] leading-relaxed">
              各サービスの規約・取扱いは変更されることがあります。最新の内容は各公式ページでご確認ください。
            </p>
          </section>

          <section id="details" className="flex flex-col gap-7">
            <h2 className="text-lg font-bold text-[#26221e]">
              3. 場所ごとのメリット・注意点
            </h2>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                フリマアプリ（メルカリ等）
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                個人間の取引で、自分で値段を決められるのが魅力です。ただし、アダルトDVD・BDの出品を規約で禁止しているサービスがあります（メルカリは18歳未満も利用できるため禁止とされています）。出品して削除されたり、アカウント停止になったりする場合があるため、事前に最新の規約を確認してください。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                ネットオークション（ヤフオク等）
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                入札で価格が上がる可能性があります。一方で、アダルト映像商品には出品ルールがあります。日本の倫理団体の認証マークがない商品は出品できない、パッケージの表裏の鮮明な画像が必要、といった条件です。そのうえで、出品・梱包・発送・購入者対応を自分で行う必要があります。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                総合リサイクル店
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                持ち込めば現金化が早いのが利点です。ただし、アダルトDVDを扱っているかどうかは店舗により異なります。対面で出すことに抵抗がある方も多く、品番まで細かく見てもらえず、価格が一律になることもあります。事前に電話などで取扱いを確認すると安心です。
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-[#26221e]">
                アダルト専門の宅配買取
              </h3>
              <p className="text-sm leading-loose text-[#5c554d]">
                自宅から申し込み、箱に詰めて送るだけです。専門店は品番で査定するため、市販の正規ディスクがまとまっている場合に適しています。人に会わずに済み、発送もまとめて1回で済みます。
              </p>
            </div>
          </section>

          <section id="checklist" className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#26221e]">
              4. 宅配買取専門店の選び方
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
              ※手数料は、買取額から引かれると手取りが減ります。比較するときは必ず「手取り額」で見てください。
            </p>
          </section>

          <section id="kaitoriya" className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#26221e]">
              5. 高買屋でできること
            </h2>
            <p className="text-sm leading-loose text-[#5c554d]">
              {company.name}
              は、仙台でTENGA
              SHOPなどを運営するパラダイスBOXの公式サービスです。
            </p>
            <ul className="list-disc list-inside text-sm leading-loose text-[#5c554d] flex flex-col gap-1.5">
              <li>
                査定無料・送料無料・振込手数料{payoutOptions.bankFee}
              </li>
              <li>
                初めての方は買取額アップ（10点以上、キャンペーン期間中は期間限定の増額）。ディスクのみ・レンタル品等を除く。セット商品は1点として数える
              </li>
              <li>
                事前に金額が分かる「仮査定」（全商品の背表紙が見える写真が必要。写真がない商品は最低価格での査定）
              </li>
              <li>急ぎの方向けの「スピードコース」（5点以上）</li>
              <li>
                段ボールを自分で用意すると特典（ディスクのみ・レンタル品等を除く10点以上）
              </li>
              <li>
                運営会社と古物商許可番号は
                <Link
                  href="/tokuhou"
                  className="text-[#b3242b] hover:underline"
                >
                  特定商取引法に基づく表記
                </Link>
                ページで確認できる（{company.legalName}・
                {company.antiqueLicense}）
              </li>
            </ul>
            <ApplyCta />
          </section>

          <section id="tips" className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-[#26221e]">
              6. 高く売る3つのコツ
            </h2>
            <ol className="flex flex-col gap-3">
              <li className="flex gap-3 text-sm leading-loose text-[#5c554d]">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#b3242b] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>
                  <strong className="text-[#26221e]">
                    品番が読める状態で出す：
                  </strong>
                  背表紙やパッケージの品番が分かると、査定が速く正確になります。
                </span>
              </li>
              <li className="flex gap-3 text-sm leading-loose text-[#5c554d]">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#b3242b] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>
                  <strong className="text-[#26221e]">
                    まとめて1回で送る：
                  </strong>
                  点数が増えるほど有利になる仕組み（初回キャンペーン、数量ボーナス）があります。
                </span>
              </li>
              <li className="flex gap-3 text-sm leading-loose text-[#5c554d]">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#b3242b] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>
                  <strong className="text-[#26221e]">
                    付属品・状態をそろえる：
                  </strong>
                  ケース・帯・特典があると評価されます。汚れは柔らかい布で軽く拭いてください（強くこすって傷をつけないように）。
                </span>
              </li>
            </ol>
          </section>

          <section id="flow" className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#26221e]">
              7. 宅配買取の流れ（3ステップ）
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

          <CampaignNotice active={campaignActive} />

          <section id="faq" className="flex flex-col gap-3.5">
            <h2 className="text-lg font-bold text-[#26221e]">
              8. よくある質問
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

          <ApplyCta />

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
