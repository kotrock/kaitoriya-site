import Image from "next/image";
import PageHero from "@/components/PageHero";
import { company, storeVisit } from "@/data/site";

export const metadata = {
  title: "会社概要 | アダルトDVD高価買取の高買屋",
};

const rows = [
  ["社名", company.legalName],
  ["会社設立", company.founded],
  ["所在地", company.address],
  ["事業内容", company.businessDesc],
  ["ホームページ", company.parentSite],
  ["代表取締役社長", company.representative],
  ...(storeVisit.available
    ? [["店舗への持ち込み", `対応可（${storeVisit.note}）`]]
    : []),
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT" title="会社概要" />
      <section className="w-full px-6 md:px-8 pt-10">
        <div className="max-w-[700px] mx-auto rounded-2xl overflow-hidden border border-[#ece6dc]">
          <Image
            src="/store-front.jpg"
            alt="パラダイスBOX仙台店 外観"
            width={1600}
            height={744}
            className="w-full h-auto"
          />
        </div>
      </section>
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
