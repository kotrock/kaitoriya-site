export default function ResultsSummary({ totalCount, totalAmount }) {
  return (
    <div className="w-full max-w-[600px] mx-auto bg-white rounded-2xl border border-[#ece6dc] p-6 md:p-8 flex items-center gap-8 flex-wrap justify-center text-center">
      <div>
        <div className="text-[13px] text-[#5c554d]">累計買取点数</div>
        <div className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-[#b3242b] leading-none break-keep whitespace-nowrap">
          {totalCount}
        </div>
      </div>
      <div className="hidden md:block w-px self-stretch bg-[#ece6dc]" />
      <div>
        <div className="text-[13px] text-[#5c554d]">累計買取実績</div>
        <div className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-[#b3242b] leading-none break-keep whitespace-nowrap">
          {totalAmount}
        </div>
      </div>
    </div>
  );
}
