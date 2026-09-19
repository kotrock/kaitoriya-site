import { company } from "@/data/site";
import { LineIcon } from "@/components/Icons";

export default function LineBanner({
  title = "電話・メールが不安な方はLINEでご相談ください",
  desc = "査定のご質問やご不明点も、公式LINEから気軽にお問い合わせいただけます。",
}) {
  return (
    <div className="w-full bg-[#eaf7ef] border border-[#c7e8d3] rounded-2xl p-6 flex items-center gap-5 flex-wrap justify-between">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-[#027a34] text-white flex items-center justify-center shrink-0">
          <LineIcon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-bold text-[#26221e]">{title}</div>
          <div className="text-xs text-[#5c554d] mt-0.5">{desc}</div>
        </div>
      </div>
      <a
        href={company.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#027a34] text-white text-sm font-bold py-3 px-6 rounded-full whitespace-nowrap hover:bg-[#01602a] transition-colors"
      >
        LINEで相談する
      </a>
    </div>
  );
}
