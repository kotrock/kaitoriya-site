import Link from "next/link";
import PageHero from "@/components/PageHero";
import { columns } from "@/data/site";

export const metadata = {
  title: "買取コラム | アダルトDVD高価買取の高買屋",
  description: "アダルトDVD・ブルーレイの買取査定に役立つコラムをお届けします。",
};

export default function ColumnPage() {
  return (
    <>
      <PageHero
        eyebrow="COLUMN"
        title="買取コラム"
        lead="査定の参考になる情報を少しずつ更新していきます。"
      />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[700px] mx-auto flex flex-col gap-4">
          {columns.map((c) => (
            <Link
              key={c.slug}
              href={`/column/${c.slug}`}
              className="flex flex-col gap-2 bg-white border border-[#ece6dc] rounded-2xl p-6 hover:border-[#d8d2c8] transition-colors"
            >
              <span className="text-xs text-[#726b5e]">{c.date}</span>
              <span className="text-base font-bold text-[#26221e]">
                {c.title}
              </span>
              <span className="text-sm text-[#5c554d] leading-relaxed">
                {c.excerpt}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
