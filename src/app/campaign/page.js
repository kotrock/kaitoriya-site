import PageHero from "@/components/PageHero";
import TrackedLink from "@/components/TrackedLink";
import ReassurancePoints from "@/components/ReassurancePoints";
import { campaign, firstTimeBonusTiers, boxBonus, ogImage } from "@/data/site";
import {
  isCampaignActive,
  getCurrentBonus,
  getNewBonusConditionsEndDateLong,
  getBoxBonusMinCount,
} from "@/lib/campaign";

// キャンペーン有無はリクエスト時点の日付で判定する必要があるため、このページは
// 静的生成のまま固定化せず、短い間隔でISR再生成する。
export const revalidate = 60;

// title/descriptionはキャンペーンの金額表記を含むため、isCampaignActive()の結果に
// 連動させる必要がある。静的なmetadataオブジェクトではビルド時の値に固定されて
// しまうため、generateMetadata()でページ本体と同じロジックを使って都度評価する。
export async function generateMetadata() {
  const bonus = isCampaignActive() ? campaign.campaignBonus : campaign.normalBonus;
  const title = `初めてのご利用で査定額+${bonus}キャンペーン | アダルトDVD高価買取の高買屋`;
  const description = `初めてご利用の方限定で査定額に${bonus}を上乗せするキャンペーンのご案内です。対象条件・注意事項をご確認ください。`;

  return {
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
}

const conditions = [
  "当社をはじめてご利用の方（お一人様1回限り。お電話番号・お名前・ご住所のいずれかが過去のご利用情報と一致する場合は対象外）",
  `1回のご発送につき、対象商品${firstTimeBonusTiers.tier1.minCount}点（本）以上（本数ごとの特典額は下記表のとおり）`,
  "ケース・ジャケットのない「ディスクのみ」の商品は対象外",
  "レンタル落ち品（レンタル用シール・貸出穴等があるもの）は対象外",
  "2枚組・3枚組などのセット商品は、点数に関わらず1点としてカウント",
  "その他、当社の買取基準を満たす商品であること",
];

export default function CampaignPage() {
  const campaignActive = isCampaignActive();
  const bonusRows = [
    {
      count: `${firstTimeBonusTiers.tier1.minCount}〜${firstTimeBonusTiers.tier1.maxCount}本`,
      bonus: `+${firstTimeBonusTiers.tier1.bonus}`,
    },
    {
      count: `${firstTimeBonusTiers.tier2.minCount}本以上`,
      bonus: `+${getCurrentBonus()}${campaignActive ? "（期間限定）" : ""}`,
    },
  ];

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

          <div className="bg-white border border-[#ece6dc] rounded-2xl p-8 flex flex-col gap-4">
            <div>
              <h2 className="text-base font-bold text-[#26221e]">
                特典額（本数ごと）
              </h2>
              <p className="text-xs text-[#726b5e] mt-1">
                {firstTimeBonusTiers.tier1.minCount}本からの特典拡大は〜{getNewBonusConditionsEndDateLong()}までの期間限定です。
              </p>
            </div>
            <div className="bg-[#f7f3ee] rounded-xl overflow-hidden border border-[#ece6dc]">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">初めてのご利用特典の本数ごとの金額</caption>
                <thead>
                  <tr className="bg-[#26221e] text-white text-[13px]">
                    <th scope="col" className="py-3 px-5 text-left font-bold">
                      本数
                    </th>
                    <th scope="col" className="py-3 px-5 text-right font-bold">
                      特典額
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bonusRows.map((row) => (
                    <tr
                      key={row.count}
                      className="border-t border-[#ece6dc] even:bg-white"
                    >
                      <th
                        scope="row"
                        className="py-3 px-5 text-left font-bold text-[#26221e] whitespace-nowrap"
                      >
                        {row.count}
                      </th>
                      <td className="py-3 px-5 text-right font-extrabold text-[#b3242b] whitespace-nowrap">
                        {row.bonus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#726b5e] leading-relaxed">
              ※発送用の段ボールをご自身でご用意いただく場合は、別途{boxBonus.amount}の特典があります（ディスクのみ・レンタル品等を除く{getBoxBonusMinCount()}点以上が対象、〜{getNewBonusConditionsEndDateLong()}まで）。
            </p>
          </div>

          <TrackedLink
            href="/application"
            cta_location="campaign_mid"
            className="bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full text-center hover:bg-[#8f1c22] transition-colors"
          >
            この内容で無料査定を申し込む
          </TrackedLink>
          <ReassurancePoints />

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

          <TrackedLink
            href="/application"
            cta_location="campaign_page"
            className="bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full text-center hover:bg-[#8f1c22] transition-colors"
          >
            この内容で無料査定を申し込む
          </TrackedLink>
        </div>
      </section>
    </>
  );
}
