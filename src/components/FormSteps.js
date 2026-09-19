export function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-1.5 mb-1" aria-label={`ステップ ${current + 1} / ${steps.length}`}>
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-1.5 flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className={
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " +
                (i <= current
                  ? "bg-[#b3242b] text-white"
                  : "bg-[#ece6dc] text-[#4a453d]")
              }
            >
              {i + 1}
            </div>
            <span
              className={
                "text-[11px] font-bold whitespace-nowrap " +
                (i === current ? "text-[#26221e]" : "text-[#726b5e]")
              }
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={
                "flex-1 h-px mb-4 " + (i < current ? "bg-[#b3242b]" : "bg-[#ece6dc]")
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function SummaryRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-[#f2ede5] last:border-b-0">
      <span className="text-xs font-bold text-[#726b5e]">{label}</span>
      <span className="text-sm text-[#26221e] whitespace-pre-wrap break-words">
        {value}
      </span>
    </div>
  );
}
