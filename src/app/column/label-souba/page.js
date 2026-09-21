import Link from "next/link";
import PageHero from "@/components/PageHero";
import { columns } from "@/data/site";

const column = columns.find((c) => c.slug === "label-souba");

export const metadata = {
  title: `${column.title} | 買取コラム | アダルトDVD高価買取の高買屋`,
  description: column.excerpt,
};

const labelNotes = [
  {
    name: "エスワン（S1 NO.1 STYLE）",
    note: "業界最大手のひとつで、指名買いも多い代表的レーベルです。発売直後の新作は特に人気が高く、ケース・ジャケットが揃った完品であれば評価されやすい傾向にあります。",
  },
  {
    name: "ムーディーズ（MOODYZ）",
    note: "オリジナル作品を中心に根強いファン層を持つ老舗レーベルです。シリーズ物やセット商品をまとめてお売りいただくと、数量ボーナスと合わせてお得になりやすい傾向があります。",
  },
  {
    name: "マドンナ（MADONNA）",
    note: "熟女・人妻ジャンルで高い知名度を誇るレーベルです。長期にわたり安定した需要があるため、発売から時間が経過した作品でも一定の評価を得やすい傾向にあります。",
  },
  {
    name: "FALENO（ファレノ）",
    note: "近年勢いのある比較的新しいレーベルです。話題作の入れ替わりが早く、発売から日が浅いタイトルほど査定額に反映されやすい傾向があります。",
  },
];

export default function LabelSoubaPage() {
  return (
    <>
      <PageHero
        eyebrow="COLUMN"
        title={column.title}
        lead="発売時期・状態に加えて、レーベルによる傾向を知っておくと査定額の目安がつかみやすくなります。"
      />
      <section className="w-full px-6 md:px-8 py-14">
        <article className="max-w-[700px] mx-auto flex flex-col gap-8">
          <p className="text-sm leading-loose text-[#5c554d]">
            アダルトDVD・ブルーレイの買取価格は、発売時期や状態だけでなくレーベルによっても傾向が変わります。人気の高いレーベルほど流通量に対して需要が根強く、査定額が高くなりやすい一方、同じレーベルでも発売時期や保管状態によって金額は大きく変動します。ここでは代表的なレーベルの一般的な傾向をご紹介します。
          </p>

          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-[#26221e]">
              主なレーベルの傾向
            </h2>
            {labelNotes.map((l) => (
              <div key={l.name} className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold text-[#26221e]">
                  {l.name}
                </h3>
                <p className="text-sm leading-loose text-[#5c554d]">
                  {l.note}
                </p>
              </div>
            ))}
            <p className="text-sm leading-loose text-[#5c554d]">
              このほか、アイポケ・アタッカーズ・プレミアム・フィッチ・ワンズなどのレーベルも積極的に買取しております。レーベルの知名度だけでなく、収録内容や出演者の人気度によっても評価は変わります。
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-[#26221e]">
              買取価格を左右する主なポイント
            </h2>
            <ul className="list-disc list-inside text-sm leading-loose text-[#5c554d] flex flex-col gap-1">
              <li>発売からの経過期間（新しいものほど高評価になりやすい）</li>
              <li>完品かどうか（ケース・ジャケット・帯の有無）</li>
              <li>傷や汚れ、レンタル落ちの有無</li>
              <li>まとめて売る本数（数量ボーナスの対象になる場合があります）</li>
            </ul>
          </div>

          <div className="bg-[#f7f3ee] rounded-2xl p-6">
            <p className="text-xs text-[#726b5e] leading-relaxed">
              ※上記は一般的な傾向のご紹介であり、個別の作品や具体的な買取金額を保証するものではありません。実際の査定額は発売時期・状態・キャンペーンの有無などにより変動します。正確な金額は無料査定でご確認ください。
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/application"
              className="bg-[#b3242b] text-white text-sm font-bold py-3.5 px-8 rounded-full hover:bg-[#8f1c22]"
            >
              今すぐ無料査定を申し込む
            </Link>
            <Link
              href="/#price"
              className="border border-[#d8d2c8] text-[#5c554d] text-sm font-bold py-3.5 px-8 rounded-full hover:bg-[#f7f3ee]"
            >
              買取価格表を見る
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/column"
              className="text-sm font-bold text-[#b3242b] hover:underline"
            >
              ← コラム一覧に戻る
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
