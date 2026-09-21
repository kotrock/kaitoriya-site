export default function ResultsTable({ items }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#ece6dc]">
      {/* md以上: テーブル表示（ゼブラストライプ） */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">買取実績の一覧</caption>
          <thead>
            <tr className="bg-[#26221e] text-white text-[13px]">
              <th scope="col" className="py-4 px-5 text-left font-bold">
                日付
              </th>
              <th scope="col" className="py-4 px-5 text-left font-bold">
                都道府県
              </th>
              <th scope="col" className="py-4 px-5 text-left font-bold">
                カテゴリ
              </th>
              <th scope="col" className="py-4 px-5 text-right font-bold">
                点数
              </th>
              <th scope="col" className="py-4 px-5 text-right font-bold">
                買取金額
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr
                key={`${r.date}-${r.amount}`}
                className="border-t border-[#ece6dc] even:bg-[#f7f3ee]"
              >
                <th
                  scope="row"
                  className="py-4 px-5 text-left font-bold text-[#26221e] whitespace-nowrap"
                >
                  {r.date}
                </th>
                <td className="py-4 px-5 text-[#5c554d] whitespace-nowrap">
                  {r.prefecture}
                </td>
                <td className="py-4 px-5 text-[#5c554d]">{r.category}</td>
                <td className="py-4 px-5 text-right text-[#5c554d] whitespace-nowrap">
                  {r.count}
                </td>
                <td className="py-4 px-5 text-right font-extrabold text-[#b3242b] whitespace-nowrap">
                  {r.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* md未満: ラベル付きカード表示 */}
      <ul className="md:hidden divide-y divide-[#ece6dc]">
        {items.map((r) => (
          <li key={`${r.date}-${r.amount}`}>
            <div className="flex items-center justify-between px-5 py-3 bg-[#f7f3ee]">
              <span className="text-sm font-bold text-[#26221e]">
                {r.date}
              </span>
              <span className="text-xs font-bold text-[#726b5e]">
                {r.prefecture}
              </span>
            </div>
            <div className="divide-y divide-[#f2ede5]">
              <div className="flex gap-3 px-5 py-2.5 text-sm">
                <span className="text-[#726b5e] shrink-0">カテゴリ</span>
                <span className="font-bold text-[#26221e] text-right break-keep flex-1">
                  {r.category}
                </span>
              </div>
              <div className="flex gap-3 px-5 py-2.5 text-sm">
                <span className="text-[#726b5e] shrink-0">点数</span>
                <span className="font-bold text-[#26221e] text-right flex-1">
                  {r.count}
                </span>
              </div>
              <div className="flex gap-3 px-5 py-2.5 text-sm">
                <span className="text-[#726b5e] shrink-0">買取金額</span>
                <span className="font-extrabold text-[#b3242b] text-right flex-1">
                  {r.amount}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
