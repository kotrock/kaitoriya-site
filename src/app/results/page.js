import Link from "next/link";
import PageHero from "@/components/PageHero";
import ResultsSummary from "@/components/ResultsSummary";
import ResultsTable from "@/components/ResultsTable";
import { results, resultsSummary } from "@/data/site";

export const metadata = {
  title: "買取実績 | アダルトDVD高価買取の高買屋",
  description: "高買屋の買取実績をご紹介します。カテゴリ・点数・買取金額の目安をご確認いただけます。",
};

export default function ResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="RESULTS"
        title="買取実績"
        lead="直近の買取実績を一部ご紹介します。査定の参考にぜひご覧ください。"
      />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[800px] mx-auto flex flex-col gap-8">
          <ResultsSummary
            totalCount={resultsSummary.totalCount}
            totalAmount={resultsSummary.totalAmount}
          />

          <ResultsTable items={results} />

          <div className="flex flex-col gap-1.5 text-center">
            <p className="text-xs text-[#726b5e]">
              ※上記の実績にお客様の個人情報は一切含まれません。
            </p>
            <p className="text-xs text-[#726b5e]">
              ※買取金額はカテゴリ単位の目安です。実際の査定額は商品の状態・レーベル・発売時期により異なります。
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/application"
              className="inline-block bg-[#b3242b] text-white text-sm font-bold py-3.5 px-8 rounded-full hover:bg-[#8f1c22]"
            >
              今すぐ無料査定を申し込む
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
