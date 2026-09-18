import PageHero from "@/components/PageHero";

export const metadata = {
  title: "利用規約 | アダルトDVD高価買取の高買屋",
};

const sections = [
  {
    title: "第1条（規約の適用・登録）",
    body: "本規約はサービス利用者全員に適用され、登録申請時に同意が必要です。虚偽の申告や過去の違反がある場合、当社は登録をお断りすることがあります。",
  },
  {
    title: "第2条（利用者の禁止事項）",
    body: "虚偽登録、営業目的での利用、法令違反、著作権侵害、その他当社サービスの妨害に該当する行為を禁止します。",
  },
  {
    title: "第3条（商品の配送・梱包）",
    body: "梱包は利用者にご対応いただきます。梱包が不十分であったことによる破損・紛失について、当社は補償いたしかねます。送料無料の対象は沖縄・離島を除く国内に限ります。",
  },
  {
    title: "第4条（買取契約の成立）",
    body: "買取契約は当社が買取を承諾した時点で成立します。査定結果にご同意いただいた後の返送請求はお受けできません。ただし査定結果にご不満の場合は、返送料をお客様にご負担いただいた上でご返却可能です。",
  },
  {
    title: "第5条（代金のお支払い）",
    body: "代金は銀行振込のみでのお支払いとなります。振込手続き完了後に生じたお支払い不能について、当社は責任を負いません。",
  },
  {
    title: "第6条（免責事項）",
    body: "当社の故意または重過失による場合を除き、本サービスのご利用により生じた損害について、当社は責任を負いません。",
  },
  {
    title: "第7条（年齢制限）",
    body: "18歳未満の方によるご利用を禁止いたします。",
  },
  {
    title: "第8条（管轄裁判所）",
    body: "本サービスに関して紛争が生じた場合、仙台地方裁判所を第一審の専属的合意管轄裁判所とします。",
  },
];

export default function TermsOfUsePage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="利用規約" />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[700px] mx-auto flex flex-col gap-6">
          {sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-[#26221e]">
                {s.title}
              </h2>
              <p className="text-sm leading-loose text-[#5c554d]">
                {s.body}
              </p>
            </div>
          ))}
          <p className="text-xs text-[#a39d92] pt-4 border-t border-[#ece6dc]">
            本規約は2025年1月1日から適用されます。
          </p>
        </div>
      </section>
    </>
  );
}
