import PageHero from "@/components/PageHero";
import Link from "next/link";
import { firstTimeBonus, campaign, ogImage } from "@/data/site";
import { isCampaignActive } from "@/lib/campaign";

const title = `初めてのご利用で査定額+${firstTimeBonus}キャンペーン | アダルトDVD高価買取の高買屋`;
const description =
  "初めてご利用の方限定で査定額に1,000円を上乗せするキャンペーンのご案内です。対象条件・注意事項をご確認ください。";

// キャンペーン有無はリクエスト時点の日付で判定する必要があるため、このページは
// 静的生成のまま固定化せず、短い間隔でISR再生成する。
export const revalidate = 60;

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/campaign",
  },
  openGraph: {
    title,
    description,
    url: "/campaign",
    siteName: "高買屋",
    locale: "ja_JP",
    type: "website",
    images: [{ ...ogImage, alt: title }],
  },
};

const conditions = [
  "当社をはじめてご利用の方（お電話番号・お名前・ご住所のいずれかが過去のご利用情報と一致する場合は対象外）",
  "1回のご発送につき、対象商品10点（本）以上",
  "ケース・ジャケットのない「ディスクのみ」の商品は対象外",
  "レンタル落ち品（レンタル用シール・貸出穴等があるもの）は対象外",
  "2枚組・3枚組などのセット商品は、点数に関わらず1点としてカウント",
  "その他、当社の買取基準を満たす商品であること",
];

export default function CampaignPage() {
  const campaignActive = isCampaignActive();

  return (
    <>
      <PageHero
        eyebrow="CAMPAIGN"
        title={
          campaignActive ? (
            <>
              「初めてのご利用で査定額
              <del className="text-white/55 decoration-2 ml-1">
                +{campaign.normalBonus}
              </del>
              {" → "}
              <span className="text-[#ffe08a]">
                期間限定+{campaign.campaignBonus}
              </span>
              」キャンペーン
            </>
          ) : (
            `「初めてのご利用で査定額+${campaign.normalBonus}」キャンペーン`
          )
        }
        lead={
          campaignActive
            ? `対象条件を満たす方は、査定額に期間限定で${campaign.campaignBonus}をプラスしてお振込みいたします（通常${campaign.normalBonus}）。`
            : `対象条件を満たす方は、査定額に${campaign.normalBonus}をプラスしてお振込みいたします。`
        }
      />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[700px] mx-auto flex flex-col gap-6">
          <div className="bg-white border border-[#ece6dc] rounded-2xl p-8 flex flex-col gap-5">
            <h2 className="text-base font-bold text-[#26221e]">対象条件</h2>
            <ul className="flex flex-col gap-3">
              {conditions.map((c) => (
                <li
                  key={c}
                  className="flex gap-2.5 text-sm text-[#5c554d] leading-relaxed"
                >
                  <span className="text-[#b3242b] font-bold shrink-0">・</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-[#726b5e] leading-relaxed">
              ※{campaignActive ? campaign.campaignBonus : campaign.normalBonus}
              は査定額に上乗せしてご案内いたします。仮査定の時点で加算後の金額を明記いたしますので、あわせてご確認ください。
              {campaignActive && `（通常${campaign.normalBonus}・期間限定キャンペーン適用中）`}
            </p>
            <p className="text-xs text-[#726b5e] leading-relaxed">
              ※本キャンペーンは予告なく内容を変更・終了する場合がございます。
            </p>
          </div>

          <Link
            href="/application"
            className="bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full text-center hover:bg-[#8f1c22] transition-colors"
          >
            この内容で無料査定を申し込む
          </Link>
        </div>
      </section>
    </>
  );
}
