import Link from "next/link";
import PageHero from "@/components/PageHero";
import { faqs } from "@/data/site";

export const metadata = {
  title: "よくある質問 | アダルトDVD高価買取の高買屋",
  description:
    "お客様からよせられる、よくあるご質問をまとめました。お問い合わせの前に、こちらをご確認ください。",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        eyebrow="FAQ"
        title="よくある質問"
        lead="お客様からよせられる、よくあるご質問をまとめました。お問い合わせの前に、こちらをご確認ください。"
      />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[800px] mx-auto flex flex-col gap-3.5">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="border border-[#ece6dc] rounded-xl py-5 px-6 flex flex-col gap-2 bg-white"
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
        <div className="max-w-[800px] mx-auto text-center mt-10">
          <Link
            href="/application"
            className="inline-block bg-[#b3242b] text-white text-sm font-bold py-3.5 px-8 rounded-full hover:bg-[#8f1c22]"
          >
            今すぐ無料査定を申し込む
          </Link>
        </div>
      </section>
    </>
  );
}
