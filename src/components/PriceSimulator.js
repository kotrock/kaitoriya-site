"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { priceTiers, AVG_PRICE_LOW, AVG_PRICE_HIGH } from "@/data/site";

const yen = new Intl.NumberFormat("ja-JP");

const ratableTiers = priceTiers.filter(
  (t) => typeof t.rateMin === "number" && typeof t.rateMax === "number"
);
const individualTiers = priceTiers.filter(
  (t) => !(typeof t.rateMin === "number" && typeof t.rateMax === "number")
);

export default function PriceSimulator() {
  const [quantities, setQuantities] = useState({});

  function setQuantity(condition, value) {
    setQuantities((q) => ({ ...q, [condition]: value }));
  }

  const { rows, totalQty, totalLow, totalHigh } = useMemo(() => {
    const rows = ratableTiers.map((tier) => {
      const qty = Math.max(0, Number(quantities[tier.condition]) || 0);
      const low = Math.round((qty * AVG_PRICE_LOW * tier.rateMin) / 100);
      const high = Math.round((qty * AVG_PRICE_HIGH * tier.rateMax) / 100);
      return { tier, qty, low, high };
    });
    return {
      rows,
      totalQty: rows.reduce((sum, r) => sum + r.qty, 0),
      totalLow: rows.reduce((sum, r) => sum + r.low, 0),
      totalHigh: rows.reduce((sum, r) => sum + r.high, 0),
    };
  }, [quantities]);

  return (
    <div className="bg-white border border-[#ece6dc] rounded-2xl p-7 md:p-8 flex flex-col gap-6">
      <div className="sticky top-[72px] z-30 bg-[#f7f3ee] rounded-xl p-6 text-center flex flex-col gap-1.5 shadow-sm">
        <div className="text-xs font-bold text-[#726b5e]">
          概算合計金額{totalQty > 0 ? `（合計${totalQty}点）` : ""}
        </div>
        {totalQty > 0 ? (
          <div className="text-3xl md:text-[40px] font-extrabold text-[#b3242b] leading-tight">
            ¥{yen.format(totalLow)} 〜 ¥{yen.format(totalHigh)}
          </div>
        ) : (
          <div className="text-sm text-[#726b5e] py-2">
            下記の区分ごとに本数を入力すると、概算金額が表示されます。
          </div>
        )}
        <div className="text-[11px] text-[#726b5e]">
          1本あたり定価{yen.format(AVG_PRICE_LOW)}〜{yen.format(AVG_PRICE_HIGH)}円・区分ごとの買取率の目安で試算
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map(({ tier, qty }) => (
          <div
            key={tier.condition}
            className="border border-[#ece6dc] rounded-xl p-4 flex items-center gap-4 flex-wrap justify-between"
          >
            <div className="flex-1 min-w-[160px]">
              <div className="text-sm font-bold text-[#26221e]">
                {tier.condition}
              </div>
              <div className="text-xs text-[#726b5e]">
                {tier.target}・買取率 {tier.rate}
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="0"
                value={quantities[tier.condition] ?? ""}
                onChange={(e) => setQuantity(tier.condition, e.target.value)}
                className="w-20 border border-[#d8d2c8] rounded-lg py-2 px-3 text-sm text-right text-[#26221e] focus:outline-none focus:border-[#b3242b]"
              />
              <span className="text-xs text-[#726b5e]">本</span>
            </label>
          </div>
        ))}
      </div>

      {individualTiers.length > 0 && (
        <p className="text-xs text-[#726b5e] leading-relaxed">
          ※{individualTiers.map((t) => t.condition).join("・")}
          の商品は個別査定（定額）となるため、このシミュレーターの概算には含まれません。無料査定でご相談ください。
        </p>
      )}

      <p className="text-xs text-[#726b5e] leading-relaxed">
        ※このシミュレーターは区分ごとの買取率（目安）に基づく概算金額です。数量ボーナスは含まれません。レーベル・発売時期・状態により実際の査定額は変動します。正確な金額は無料査定でご確認ください。
      </p>

      <Link
        href="/application"
        className="bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full text-center hover:bg-[#8f1c22] transition-colors"
      >
        この内容で無料査定を申し込む
      </Link>
    </div>
  );
}
