function BonusTable({ title, label, tiers }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-base font-bold text-[#26221e]">{title}</h3>
        <p className="text-xs text-[#726b5e] break-keep">{label}</p>
      </div>
      <div className="bg-white rounded-2xl overflow-hidden border border-[#ece6dc]">
        {/* md以上: テーブル表示 */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{title}の数量ボーナス早見表</caption>
            <thead>
              <tr className="bg-[#26221e] text-white text-[13px]">
                <th scope="col" className="py-3 px-5 text-left font-bold">
                  本数
                </th>
                <th scope="col" className="py-3 px-5 text-right font-bold">
                  ボーナス
                </th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr
                  key={t.count}
                  className="border-t border-[#ece6dc] even:bg-[#f7f3ee]"
                >
                  <th
                    scope="row"
                    className="py-3 px-5 text-left font-bold text-[#26221e] whitespace-nowrap"
                  >
                    {t.count}
                  </th>
                  <td className="py-3 px-5 text-right font-extrabold text-[#b3242b] whitespace-nowrap">
                    {t.bonus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* md未満: ラベル付きカード表示 */}
        <ul className="md:hidden divide-y divide-[#ece6dc]">
          {tiers.map((t) => (
            <li key={t.count} className="flex gap-3 px-5 py-3 text-sm">
              <span className="font-bold text-[#26221e] shrink-0">
                {t.count}
              </span>
              <span className="font-extrabold text-[#b3242b] text-right break-keep flex-1">
                {t.bonus}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function BonusTiers({ aRank, bRank }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <BonusTable title="Aランク" label={aRank.label} tiers={aRank.tiers} />
      <BonusTable title="Bランク" label={bRank.label} tiers={bRank.tiers} />
    </div>
  );
}
