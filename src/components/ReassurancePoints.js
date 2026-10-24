const POINTS = [
  "仮査定は無料",
  "申込み時に身分証は不要",
  "仮査定の金額に納得できなければキャンセルできます",
  "送料無料（着払い）",
];

// 申込みボタン付近に表示する安心材料4点。トップ・/campaign・申込フォームで共通利用する。
// colorClassNameでテキスト色のみ上書きできる（暗い背景上ではtext-white/75等を指定）。
export default function ReassurancePoints({ colorClassName = "text-[#726b5e]" }) {
  return (
    <ul
      className={`flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] ${colorClassName}`}
    >
      {POINTS.map((point) => (
        <li key={point} className="flex items-center gap-1">
          <span className="text-[#2f9e5c]" aria-hidden="true">
            ✓
          </span>
          {point}
        </li>
      ))}
    </ul>
  );
}
