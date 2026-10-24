import PageHero from "@/components/PageHero";
import TrackedLink from "@/components/TrackedLink";
import { faqs, campaign, firstTimeBonusTiers, ogImage } from "@/data/site";
import { isCampaignActive } from "@/lib/campaign";

const title = "よくある質問 | アダルトDVD高価買取の高買屋";
const description =
  "お客様からよせられる、よくあるご質問をまとめました。お問い合わせの前に、こちらをご確認ください。";

// 初回キャンペーンに関するFAQの回答は、キャンペーン期間中だけ金額を差し替える。
const CAMPAIGN_FAQ_QUESTION = "初めてのご利用特典とは、どのようなキャンペーンですか？";

// キャンペーン有無はリクエスト時点の日付で判定する必要があるため、このページは
// 静的生成のまま固定化せず、短い間隔でISR再生成する。
export const revalidate = 60;

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title,
    description,
    url: "/faq",
    siteName: "高買屋",
    locale: "ja_JP",
    type: "website",
    images: [{ ...ogImage, alt: title }],
  },
};

export default function FaqPage() {
  const campaignActive = isCampaignActive();
  const effectiveFaqs = faqs.map((faq) => {
    if (faq.q !== CAMPAIGN_FAQ_QUESTION || !campaignActive) return faq;
    return {
      ...faq,
      a: `当社を初めてご利用いただく方（お一人様1回限り）が対象です。${firstTimeBonusTiers.tier1.minCount}〜${firstTimeBonusTiers.tier1.maxCount}本で査定額に${firstTimeBonusTiers.tier1.bonus}、${firstTimeBonusTiers.tier2.minCount}本以上で通常${campaign.normalBonus}のところ、期間限定で${campaign.campaignBonus}を上乗せするキャンペーンです（現在開催中）。ディスクのみ・レンタル落ち品は対象外です。セット商品（2枚組・3枚組等）は点数に関わらず1点としてカウントします。詳しい条件はキャンペーンページをご確認ください。`,
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: effectiveFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        eyebrow="FAQ"
        title="よくある質問"
        lead="お客様からよせられる、よくあるご質問をまとめました。お問い合わせの前に、こちらをご確認ください。"
      />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[800px] mx-auto text-center mb-8">
          <TrackedLink
            href="/application"
            cta_location="faq_top"
            className="inline-block bg-[#b3242b] text-white text-sm font-bold py-3.5 px-8 rounded-full hover:bg-[#8f1c22]"
          >
            今すぐ無料査定を申し込む
          </TrackedLink>
        </div>
        <div className="max-w-[800px] mx-auto flex flex-col gap-3.5">
          {effectiveFaqs.map((faq) => (
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
        </div>
        <div className="max-w-[800px] mx-auto text-center mt-10">
          <TrackedLink
            href="/application"
            cta_location="faq_page"
            className="inline-block bg-[#b3242b] text-white text-sm font-bold py-3.5 px-8 rounded-full hover:bg-[#8f1c22]"
          >
            今すぐ無料査定を申し込む
          </TrackedLink>
        </div>
      </section>
    </>
  );
}
