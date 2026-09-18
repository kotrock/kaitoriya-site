import Link from "next/link";
import {
  labels,
  trustItems,
  priceTiers,
  steps,
  voices,
  faqs,
  company,
} from "@/data/site";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="w-full bg-gradient-to-b from-[#201a17] to-[#2c231e] text-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-16 pb-14 flex flex-col items-center text-center gap-5">
          <div className="text-[13px] font-bold tracking-wide text-[#e8a97a] bg-[#e8a97a]/10 py-1.5 px-4 rounded-full">
            {company.antiqueLicense}
          </div>
          <h1 className="text-3xl md:text-[40px] leading-snug font-extrabold">
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
                発売から1ヶ月以内・完品
              </div>
            </div>
            <div className="hidden md:block w-px self-stretch bg-[#ece6dc]" />
            <div className="text-left">
              <div className="text-[13px] text-[#5c554d]">定価の</div>
              <div className="text-[56px] font-extrabold text-[#b3242b] leading-none">
                最大65<span className="text-2xl">%</span>買取
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
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-7 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="text-center flex flex-col gap-1">
              <div className="text-2xl">{item.icon}</div>
              <div className="text-sm font-bold text-[#26221e]">
                {item.title}
              </div>
              <div className="text-xs text-[#a39d92]">{item.desc}</div>
            </div>
          ))}
        </div>
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
            <p className="text-[13px] text-[#a39d92]">
              状態・発売時期・レーベルにより査定額は変動します。まずは無料査定をご利用ください。
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-[#ece6dc]">
            <div className="grid grid-cols-3 bg-[#26221e] text-white text-[13px] font-bold">
              <div className="py-4 px-5">状態・条件</div>
              <div className="py-4 px-5">対象商品</div>
              <div className="py-4 px-5 text-right">買取率</div>
            </div>
            {priceTiers.map((tier) => (
              <div
                key={tier.condition}
                className="grid grid-cols-3 border-t border-[#ece6dc] text-sm items-center"
              >
                <div className="py-4.5 px-5 font-bold text-[#26221e]">
                  {tier.condition}
                </div>
                <div className="py-4.5 px-5 text-[#5c554d]">
                  {tier.target}
                </div>
                <div className="py-4.5 px-5 text-right font-extrabold text-[#b3242b] text-lg">
                  {tier.rate}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#a39d92] text-center">
            ※ケースやジャケットがない「ディスクのみ」も買取可能です。コピー品・雑誌付録は対象外となります。
          </p>
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
                <div className="text-[#e8a97a] text-sm tracking-widest">
                  ★★★★★
                </div>
                <div className="text-[13px] leading-loose text-[#4a453d]">
                  {voice.text}
                </div>
                <div className="text-xs text-[#a39d92] font-bold">
                  {voice.name}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/user-voice"
              className="text-sm font-bold text-[#b3242b] hover:underline"
            >
              利用者の声をもっと見る →
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
            <div className="text-xl font-extrabold">
              売るほどでもないDVDは無料回収します
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
                  <span className="text-[#a39d92] font-bold">A</span>
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

      {/* APPLY CTA */}
      <section
        id="apply"
        className="w-full px-6 md:px-8 py-16 bg-gradient-to-b from-[#b3242b] to-[#8f1c22]"
      >
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl font-extrabold text-white">
            まずは無料査定からお気軽にどうぞ
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
        </div>
      </section>
    </>
  );
}
