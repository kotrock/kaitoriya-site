import PageHero from "@/components/PageHero";
import { company } from "@/data/site";

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
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="ABOUT" title="会社概要" />
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
        <p className="max-w-[700px] mx-auto text-xs text-[#a39d92] mt-6 text-center">
          古物営業法に基づく表記　{company.antiqueLicense}
        </p>
      </section>
    </>
  );
}
