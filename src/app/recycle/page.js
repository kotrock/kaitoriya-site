import PageHero from "@/components/PageHero";
import RecycleForm from "@/components/RecycleForm";
import LineBanner from "@/components/LineBanner";
import { company } from "@/data/site";

export const metadata = {
  title: "個人情報不要！アダルトDVD無料回収します! | アダルトDVD高価買取の高買屋",
  description:
    "お部屋をすっきり！いらないアダルトDVDを段ボールに入れて手軽に処分。何点でも送料無料、個人情報不要、段ボール無料提供。",
};

export default function RecyclePage() {
  return (
    <>
      <PageHero
        eyebrow="個人情報不要！"
        title="アダルトDVD無料回収します!"
        lead="お部屋をすっきり！いらないアダルトDVDを段ボールに入れて手軽に処分♪"
      />

      <section className="w-full px-6 md:px-8 py-12">
        <div className="max-w-[800px] mx-auto flex flex-wrap gap-3 justify-center">
          {["何点でも送料無料", "個人情報不要", "段ボール無料提供"].map(
            (item) => (
              <span
                key={item}
                className="bg-white border border-[#ece6dc] text-sm font-bold text-[#26221e] py-2.5 px-5 rounded-full"
              >
                {item}
              </span>
            )
          )}
        </div>
      </section>

      <RecycleForm />

      <section className="w-full px-6 md:px-8 pb-12">
        <div className="max-w-[700px] mx-auto">
          <LineBanner />
        </div>
      </section>

      <section className="w-full px-6 md:px-8 pb-16">
        <div className="max-w-[700px] mx-auto bg-white border border-[#ece6dc] rounded-2xl p-8 flex flex-col gap-3">
          <h3 className="text-base font-bold text-[#26221e]">
            お荷物のご準備ができたら発送してください
          </h3>
          <div className="text-sm text-[#5c554d] leading-loose">
            【送り先】
            <br />
            {company.postalCode} {company.address}
            <br />
            {company.shipTo}
          </div>
          <p className="text-xs text-[#726b5e] leading-relaxed">
            最寄りの配送業者より着払いで発送してください（ヤマト運輸／郵便局／佐川急便）。最寄りのコンビニへ持ち込みでも可能です。ヤマト運輸などで送られる場合は、段ボールの個口数を段ボールに記載して頂くようお願い致します。記載がない場合、通常より確認にお時間がかかる場合がございます。
          </p>
        </div>
      </section>
    </>
  );
}
