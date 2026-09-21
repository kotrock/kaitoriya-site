import PageHero from "@/components/PageHero";
import { company, payoutOptions } from "@/data/site";

export const metadata = {
  title: "特定商取引法 | アダルトDVD高価買取の高買屋",
};

const rows = [
  ["社名", company.legalName],
  ["代表取締役社長", company.representative],
  ["所在地", `${company.postalCode}　${company.address}`],
  [
    "連絡先",
    `電話番号　${company.phone}　メールアドレス　${company.email}　（受付時間：${company.phoneHours}）`,
  ],
  ["送料", "ヤマト運輸／郵便局／佐川急便　全国一律：無料　※北海道・沖縄・離島除く"],
  [
    "お支払い",
    `銀行振込　${company.bank}（振込手数料${payoutOptions.bankFee}）／PayPay受け取り（${payoutOptions.paypayBonus}プラスでお支払い）`,
  ],
];

export default function TokuhouPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="特定商取引法" />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[700px] mx-auto bg-white border border-[#ece6dc] rounded-2xl overflow-hidden">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[140px_1fr] border-b border-[#ece6dc] last:border-b-0 text-sm"
            >
              <div className="bg-[#f7f3ee] py-4 px-5 font-bold text-[#26221e]">
                {label}
              </div>
              <div className="py-4 px-5 text-[#4a453d]">{value}</div>
            </div>
          ))}
        </div>
        <p className="max-w-[700px] mx-auto text-xs text-[#726b5e] mt-6 text-center">
          古物営業法に基づく表記　{company.antiqueLicense}
        </p>
      </section>
    </>
  );
}
