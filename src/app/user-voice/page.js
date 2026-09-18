import Link from "next/link";
import PageHero from "@/components/PageHero";
import { voices } from "@/data/site";

export const metadata = {
  title: "利用者の声 | アダルトDVD高価買取の高買屋",
  description: "ご利用者の声。迷っている暇なし！まずは簡単お申込み。",
};

export default function UserVoicePage() {
  return (
    <>
      <PageHero eyebrow="VOICE" title="利用者の声" />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-10">
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

          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="text-xl font-extrabold text-[#26221e]">
              迷っている暇なし！まずは簡単お申込み
            </h2>
            <Link
              href="/application"
              className="bg-[#b3242b] text-white text-sm font-bold py-4 px-9 rounded-full hover:bg-[#8f1c22]"
            >
              今すぐ簡単DVD無料査定 &gt;&gt;
            </Link>
          </div>

          <div className="bg-[#26221e] rounded-2xl px-8 py-10 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex flex-col gap-2 text-white">
              <div className="text-xs font-bold text-[#e8a97a]">
                個人情報不要！
              </div>
              <div className="text-lg font-extrabold">
                アダルトDVD無料回収します！
              </div>
              <ul className="text-[13px] text-[#cfc6bc] list-disc list-inside">
                <li>何点でも送料無料</li>
                <li>個人情報不要</li>
                <li>段ボール無料提供</li>
              </ul>
            </div>
            <Link
              href="/recycle"
              className="bg-white text-[#26221e] text-sm font-bold py-3.5 px-6 rounded-full shrink-0 hover:bg-[#f7f3ee]"
            >
              アダルトDVDを無料で処分する
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
