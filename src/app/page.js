import Link from "next/link";
import {
  labels,
  trustItems,
  priceTiers,
  bonusTiers,
  steps,
  voices,
  results,
  resultsSummary,
  faqs,
  company,
  firstTimeBonus,
} from "@/data/site";
import {
  TruckIcon,
  SearchIcon,
  BoxIcon,
  LockIcon,
  CalendarIcon,
  StoreIcon,
  StarRating,
} from "@/components/Icons";
import LineBanner from "@/components/LineBanner";
import PriceSimulator from "@/components/PriceSimulator";
import ResultsSummary from "@/components/ResultsSummary";
import ResultsTable from "@/components/ResultsTable";
import BonusTiers from "@/components/BonusTiers";
import { siteUrl } from "@/data/site";

const trustIcons = {
  truck: TruckIcon,
  search: SearchIcon,
  box: BoxIcon,
  lock: LockIcon,
  calendar: CalendarIcon,
  store: StoreIcon,
};

export default function Home() {
  const [, addressRegion, addressLocality] =
    company.address.match(/^(.{2,3}[都道府県])(.+)$/) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    alternateName: company.legalName,
    url: siteUrl,
    telephone: company.phone,
    description:
      "エスワン・ムーディーズ・マドンナ・FALENOなどの人気レーベルを強化買取中のアダルトDVD・ブルーレイ買取専門店。",
    address: {
      "@type": "PostalAddress",
      streetAddress: addressLocality || company.address,
      addressRegion: addressRegion || undefined,
      postalCode: company.postalCode.replace("〒", ""),
      addressCountry: "JP",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "¥¥",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* HERO */}
      <section className="w-full bg-gradient-to-b from-[#201a17] to-[#2c231e] text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-16 pb-14 flex flex-col items-center text-center gap-5">
          <div className="text-[13px] font-bold tracking-wide text-[#e8a97a] bg-[#e8a97a]/10 py-1.5 px-4 rounded-full">
            {company.antiqueLicense}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-[40px] leading-snug font-extrabold break-keep">
            アダルトDVD・ブルーレイの
            <br />
            高価買取なら高買屋
          </h1>
          <p className="text-[15px] leading-loose text-[#cfc6bc] max-w-[560px]">
            エスワン・ムーディーズ・マドンナ・FALENOなどの人気レーベルを強化買取中。査定は何本でも無料、個人情報は厳重に管理いたします。
          </p>
          <div className="flex gap-3.5 mt-2 flex-wrap justify-center">
            <Link
              href="/application"
              className="bg-[#b3242b] text-white text-[15px] font-bold py-4 px-8 rounded-full hover:bg-[#8f1c22] transition-colors"
            >
              今すぐ無料査定を申し込む
            </Link>
            <Link
              href="/recycle"
              className="bg-transparent border border-white/35 text-white text-[15px] font-bold py-4 px-8 rounded-full hover:bg-white/10 transition-colors"
            >
              無料回収について
            </Link>
          </div>

          <div className="w-full max-w-[880px] bg-white rounded-2xl p-8 mt-6 flex items-center gap-8 text-[#26221e] flex-wrap justify-center">
            <div className="text-left shrink-0">
              <div className="text-[13px] font-bold text-[#b3242b]">
                対象レーベル新作
              </div>
              <div className="text-[15px] font-bold mt-1">
                発売2週間以内・完品
              </div>
            </div>
            <div className="hidden md:block w-px self-stretch bg-[#ece6dc]" />
            <div className="text-left">
              <div className="text-[13px] text-[#5c554d]">定価の</div>
              <div className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-[#b3242b] leading-none break-keep whitespace-nowrap">
                最大50<span className="text-lg sm:text-xl md:text-2xl">%</span>買取
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-3 max-w-[720px]">
            {labels.map((label) => (
              <span
                key={label}
                className="bg-white/8 border border-white/18 text-[#efe8de] text-xs font-semibold py-1.5 px-3.5 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="w-full bg-white border-b border-[#ece6dc]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {trustItems.map((item) => {
            const Icon = trustIcons[item.icon];
            return (
              <div key={item.title} className="text-center flex flex-col items-center gap-1.5">
                <Icon className="w-7 h-7 text-[#b3242b]" />
                <div className="text-sm font-bold text-[#26221e]">
                  {item.title}
                </div>
                <div className="text-xs text-[#726b5e]">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FIRST TIME CAMPAIGN */}
      <section className="w-full px-6 md:px-8 py-4 bg-[#fbeceb] border-y border-[#f3d4d2]">
        <p className="max-w-[1000px] mx-auto text-center text-sm md:text-base font-extrabold text-[#b3242b] break-keep">
          初めてのご利用で査定額+{firstTimeBonus}キャンペーン実施中
        </p>
      </section>

      {/* PRICE TABLE */}
      <section id="price" className="w-full px-6 md:px-8 py-18 py-16">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2.5">
            <div className="text-[13px] font-bold text-[#b3242b] tracking-wide">
              PRICE LIST
            </div>
            <h2 className="text-2xl md:text-[28px] text-[#26221e] font-bold">
              買取価格の目安
            </h2>
            <p className="text-[13px] text-[#726b5e]">
              状態・発売時期・レーベルにより査定額は変動します。まずは無料査定をご利用ください。
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-[#ece6dc]">
            {/* md以上: テーブル表示 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  アダルトDVD・ブルーレイの買取価格の目安
                </caption>
                <thead>
                  <tr className="bg-[#26221e] text-white text-[13px]">
                    <th scope="col" className="py-4 px-5 text-left font-bold">
                      状態・条件
                    </th>
                    <th scope="col" className="py-4 px-5 text-left font-bold">
                      対象商品
                    </th>
                    <th scope="col" className="py-4 px-5 text-right font-bold">
                      買取率
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priceTiers.map((tier) => (
                    <tr key={tier.condition} className="border-t border-[#ece6dc]">
                      <th
                        scope="row"
                        className="py-4.5 px-5 text-left font-bold text-[#26221e]"
                      >
                        {tier.condition}
                      </th>
                      <td className="py-4.5 px-5 text-[#5c554d]">
                        {tier.target}
                      </td>
                      <td className="py-4.5 px-5 text-right font-extrabold text-[#b3242b] text-lg">
                        {tier.rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* md未満: カード表示 */}
            <ul className="md:hidden divide-y divide-[#ece6dc]">
              {priceTiers.map((tier) => (
                <li key={tier.condition} className="p-5 flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-bold text-[#26221e] break-keep">
                      {tier.condition}
                    </span>
                    <span className="font-extrabold text-[#b3242b] text-xl text-right ml-auto whitespace-nowrap">
                      {tier.rate}
                    </span>
                  </div>
                  <span className="text-xs text-[#5c554d] break-keep">
                    {tier.target}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-1.5 text-center">
            <p className="text-xs text-[#726b5e]">
              ※査定は発売日・定価・状態を基準に行います（開封・未開封は問いません）。
            </p>
            <p className="text-xs text-[#726b5e]">
              ※ケースやジャケットがない「ディスクのみ」も買取可能です。コピー品・雑誌付録は対象外となります。
            </p>
            <p className="text-sm font-bold text-[#26221e]">
              送料無料・査定無料・段ボール無料でご利用いただけます。
            </p>
          </div>
        </div>
      </section>

      {/* BONUS TIERS */}
      <section className="w-full px-6 md:px-8 py-16 bg-white border-t border-[#ece6dc]">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2.5">
            <div className="text-[13px] font-bold text-[#b3242b] tracking-wide">
              BONUS
            </div>
            <h2 className="text-2xl md:text-[28px] text-[#26221e] font-bold">
              まとめて売るとお得
            </h2>
            <p className="text-[13px] text-[#726b5e]">
              本数に応じて買取金額にボーナスが加算されます。
            </p>
          </div>
          <BonusTiers aRank={bonusTiers.aRank} bRank={bonusTiers.bRank} />
        </div>
      </section>

      {/* PRICE SIMULATOR */}
      <section id="simulator" className="w-full px-6 md:px-8 py-16 bg-[#f7f3ee]">
        <div className="max-w-[700px] mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2.5">
            <div className="text-[13px] font-bold text-[#b3242b] tracking-wide">
              SIMULATOR
            </div>
            <h2 className="text-2xl md:text-[28px] text-[#26221e] font-bold">
              買取価格シミュレーター
            </h2>
            <p className="text-[13px] text-[#726b5e]">
              本数と状態を選ぶだけで、概算の買取金額をすぐに確認できます。
            </p>
          </div>
          <PriceSimulator />
        </div>
      </section>

      {/* FLOW */}
      <section id="flow" className="w-full px-6 md:px-8 py-16 bg-white border-t border-[#ece6dc]">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-2.5">
            <div className="text-[13px] font-bold text-[#b3242b] tracking-wide">
              HOW IT WORKS
            </div>
            <h2 className="text-2xl md:text-[28px] text-[#26221e] font-bold">
              ご利用の流れ
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col gap-3 p-7 bg-[#f7f3ee] rounded-2xl"
              >
                <div className="w-9 h-9 rounded-full bg-[#b3242b] text-white flex items-center justify-center font-extrabold text-sm">
                  {step.num}
                </div>
                <div className="text-base font-bold text-[#26221e]">
                  {step.title}
                </div>
                <div className="text-[13px] leading-loose text-[#5c554d]">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOICE */}
      <section id="voice" className="w-full px-6 md:px-8 py-16">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col gap-2.5">
            <div className="text-[13px] font-bold text-[#b3242b] tracking-wide">
              VOICE
            </div>
            <h2 className="text-2xl md:text-[28px] text-[#26221e] font-bold">
              利用者の声
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {voices.map((voice) => (
              <div
                key={voice.name}
                className="bg-white rounded-2xl p-6 flex flex-col gap-3 border border-[#ece6dc]"
              >
                <div className="text-[#e8a97a]">
                  <StarRating className="w-4 h-4" />
                </div>
                <div className="text-[13px] leading-loose text-[#4a453d]">
                  {voice.text}
                </div>
                <div className="text-xs text-[#726b5e] font-bold">
                  {voice.name}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/user-voice"
              className="text-sm font-bold text-[#b3242b] hover:underline"
            >
              利用者の声をもっと見る →
            </Link>
            <a
              href={company.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#5c554d] hover:text-[#b3242b] hover:underline"
            >
              Googleの口コミを見る ↗
            </a>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="w-full px-6 md:px-8 py-16 bg-white border-t border-[#ece6dc]">
        <div className="max-w-[800px] mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2.5">
            <div className="text-[13px] font-bold text-[#b3242b] tracking-wide">
              RESULTS
            </div>
            <h2 className="text-2xl md:text-[28px] text-[#26221e] font-bold">
              買取実績
            </h2>
            <p className="text-[13px] text-[#726b5e]">
              直近の買取実績を一部ご紹介します。
            </p>
          </div>
          <ResultsSummary
            totalCount={resultsSummary.totalCount}
            totalAmount={resultsSummary.totalAmount}
          />
          <ResultsTable items={results.slice(0, 5)} />
          <div className="text-center">
            <Link
              href="/results"
              className="text-sm font-bold text-[#b3242b] hover:underline"
            >
              買取実績をもっと見る →
            </Link>
          </div>
        </div>
      </section>

      {/* RECYCLE BANNER */}
      <section className="w-full px-6 md:px-8 py-14 bg-[#26221e]">
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-6 flex-wrap">
          <div className="flex flex-col gap-2 text-white">
            <div className="text-xs font-bold text-[#e8a97a]">
              個人情報不要
            </div>
            <div className="text-lg sm:text-xl font-extrabold break-keep">
              売るほどでもないDVDは
              <br className="sm:hidden" />
              無料回収します
            </div>
            <div className="text-[13px] text-[#cfc6bc]">
              段ボール5箱まで無料提供・送料無料・何点でもOK
            </div>
          </div>
          <Link
            href="/recycle"
            className="bg-white text-[#26221e] text-sm font-bold py-3.5 px-6 rounded-full shrink-0 hover:bg-[#f7f3ee]"
          >
            無料回収を申し込む
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="w-full px-6 md:px-8 py-16 bg-white">
        <div className="max-w-[800px] mx-auto flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2.5">
            <div className="text-[13px] font-bold text-[#b3242b] tracking-wide">
              FAQ
            </div>
            <h2 className="text-2xl md:text-[28px] text-[#26221e] font-bold">
              よくある質問
            </h2>
          </div>
          <div className="flex flex-col gap-3.5">
            {faqs.slice(0, 4).map((faq) => (
              <div
                key={faq.q}
                className="border border-[#ece6dc] rounded-xl py-5 px-6 flex flex-col gap-2"
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
          <div className="text-center">
            <Link
              href="/faq"
              className="text-sm font-bold text-[#b3242b] hover:underline"
            >
              よくある質問をもっと見る →
            </Link>
          </div>
        </div>
      </section>

      {/* LINE CTA */}
      <section className="w-full px-6 md:px-8 py-12 bg-white border-t border-[#ece6dc]">
        <div className="max-w-[900px] mx-auto">
          <LineBanner />
        </div>
      </section>

      {/* APPLY CTA */}
      <section
        id="apply"
        className="w-full px-6 md:px-8 py-16 bg-gradient-to-b from-[#b3242b] to-[#8f1c22]"
      >
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white break-keep">
            まずは無料査定から
            <br className="sm:hidden" />
            お気軽にどうぞ
          </h2>
          <p className="text-[13px] text-white/85">
            5本以上から買取可能・査定は何度でも無料・お申し込みから最短当日でご連絡
          </p>
          <Link
            href="/application"
            className="bg-white text-[#b3242b] text-base font-extrabold py-4.5 px-11 rounded-full hover:bg-[#f7f3ee] transition-colors"
          >
            買取申込フォームへ進む
          </Link>
          <a
            href={`tel:${company.phoneTel}`}
            className="text-[13px] text-white/85 hover:text-white underline decoration-white/40"
          >
            お電話でのお申込みは {company.phone}（{company.phoneHours}）
          </a>
        </div>
      </section>
    </>
  );
}
