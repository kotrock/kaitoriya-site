"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { priceTiers, AVG_PRICE_LOW, AVG_PRICE_HIGH, minimumGuarantee } from "@/data/site";

const yen = new Intl.NumberFormat("ja-JP");

const ratableTiers = priceTiers.filter(
  (t) =>
    typeof t.rateMin === "number" &&
    typeof t.rateMax === "number" &&
    !t.requiresUnitPrice
);
const unitPriceTiers = priceTiers.filter((t) => t.requiresUnitPrice);
const individualTiers = priceTiers.filter(
  (t) => !(typeof t.rateMin === "number" && typeof t.rateMax === "number")
);

export default function PriceSimulator() {
  const [inputs, setInputs] = useState({});
  const [dupExpandedOverrides, setDupExpandedOverrides] = useState({});

  function setField(condition, field, value) {
    setInputs((prev) => ({
      ...prev,
      [condition]: { ...prev[condition], [field]: value },
    }));
  }

  function isDupExpanded(condition) {
    if (condition in dupExpandedOverrides) return dupExpandedOverrides[condition];
    return Number(inputs[condition]?.dup) > 0;
  }

  function toggleDupExpanded(condition) {
    setDupExpandedOverrides((prev) => ({
      ...prev,
      [condition]: !isDupExpanded(condition),
    }));
  }

  const { rows, unitPriceRows, totalQty, totalLow, totalHigh } = useMemo(() => {
    const rows = ratableTiers.map((tier) => {
      const v = inputs[tier.condition] || {};
      const qty = Math.max(0, Number(v.qty) || 0);
      const dup = Math.min(Math.max(0, Number(v.dup) || 0), qty);
      const normalQty = qty - dup;
      const unitLow = (AVG_PRICE_LOW * tier.rateMin) / 100;
      const unitHigh = (AVG_PRICE_HIGH * tier.rateMax) / 100;
      const low = Math.round(normalQty * unitLow + dup * unitLow * 0.5);
      const high = Math.round(normalQty * unitHigh + dup * unitHigh * 0.5);
      return { tier, qty, low, high };
    });

    const unitPriceRows = unitPriceTiers.map((tier) => {
      const v = inputs[tier.condition] || {};
      const qty = Math.max(0, Number(v.qty) || 0);
      const dup = Math.min(Math.max(0, Number(v.dup) || 0), qty);
      const normalQty = qty - dup;
      const price = Math.max(0, Number(v.price) || 0);
      const unit = (price * tier.rateMin) / 100;
      const amount = Math.round(normalQty * unit + dup * unit * 0.5);
      return { tier, qty, low: amount, high: amount };
    });

    const allRows = [...rows, ...unitPriceRows];
    return {
      rows,
      unitPriceRows,
      totalQty: allRows.reduce((sum, r) => sum + r.qty, 0),
      totalLow: allRows.reduce((sum, r) => sum + r.low, 0),
      totalHigh: allRows.reduce((sum, r) => sum + r.high, 0),
    };
  }, [inputs]);

  return (
    <div className="bg-white border border-[#ece6dc] rounded-2xl p-7 md:p-8 flex flex-col gap-6">
      <div className="sticky top-[72px] z-30 bg-[#f7f3ee] rounded-xl p-6 text-center flex flex-col gap-1.5 shadow-sm">
        <div className="text-xs font-bold text-[#726b5e]">
          概算合計金額{totalQty > 0 ? `（合計${totalQty}点）` : ""}
        </div>
        {totalQty > 0 ? (
          <div className="text-3xl md:text-[40px] font-extrabold text-[#b3242b] leading-tight">
            {totalLow === totalHigh
              ? `¥${yen.format(totalLow)}`
              : `¥${yen.format(totalLow)} 〜 ¥${yen.format(totalHigh)}`}
          </div>
        ) : (
          <div className="text-sm text-[#726b5e] py-2">
            下記の区分ごとに本数を入力すると、概算金額が表示されます。
          </div>
        )}
        {totalQty > 0 && totalQty < 5 && (
          <div className="text-xs font-bold text-[#b3242b]">
            買取は5本以上からです（現在{totalQty}本）
          </div>
        )}
        <div className="text-[11px] text-[#726b5e]">
          1本あたり定価{yen.format(AVG_PRICE_LOW)}〜{yen.format(AVG_PRICE_HIGH)}円・区分ごとの買取率の目安で試算
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map(({ tier, qty }) => {
          const v = inputs[tier.condition] || {};
          const dupOpen = isDupExpanded(tier.condition);
          return (
            <div
              key={tier.condition}
              className="border border-[#ece6dc] rounded-xl p-4 flex items-start gap-4 flex-wrap justify-between"
            >
              <div className="flex-1 min-w-[160px]">
                <div className="text-sm font-bold text-[#26221e]">
                  {tier.condition}
                </div>
                <div className="text-xs text-[#726b5e]">
                  {tier.target}・買取率 {tier.rate}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="0"
                    value={v.qty ?? ""}
                    onChange={(e) => setField(tier.condition, "qty", e.target.value)}
                    className="w-20 border border-[#d8d2c8] rounded-lg py-2 px-3 text-base text-right text-[#26221e] focus:outline-none focus:border-[#b3242b]"
                  />
                  <span className="text-xs text-[#726b5e]">本</span>
                </label>
                <button
                  type="button"
                  aria-expanded={dupOpen}
                  onClick={() => toggleDupExpanded(tier.condition)}
                  className="text-[11px] text-[#b3242b] underline underline-offset-2 decoration-dotted"
                >
                  同じ商品が複数ある場合
                </button>
                {dupOpen && (
                  <div className="flex flex-col items-end gap-1 w-full">
                    <label className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#9a9386] whitespace-nowrap">
                        同じ商品の2本目以降（半額）
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="0"
                        value={v.dup ?? ""}
                        onChange={(e) => setField(tier.condition, "dup", e.target.value)}
                        className="w-16 border border-[#e5dfd4] rounded-lg py-1.5 px-2 text-base text-right text-[#5c554d] focus:outline-none focus:border-[#b3242b]"
                      />
                      <span className="text-[11px] text-[#9a9386]">本</span>
                    </label>
                    <p className="text-[10px] text-[#aca493] leading-snug text-right max-w-[220px]">
                      同じ商品を複数お売りの場合の、2本目以降の合計本数です。例:同じ商品5本なら、4本と入力
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {unitPriceTiers.length > 0 && (
        <div className="flex flex-col gap-3">
          {unitPriceTiers.map((tier) => {
            const v = inputs[tier.condition] || {};
            const dupOpen = isDupExpanded(tier.condition);
            return (
              <div
                key={tier.condition}
                className="border border-[#ece6dc] rounded-xl p-4 flex flex-col gap-3"
              >
                <div>
                  <div className="text-sm font-bold text-[#26221e]">
                    {tier.condition}
                  </div>
                  <div className="text-xs text-[#726b5e]">
                    {tier.target}・買取率 {tier.rate}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 items-end">
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-[#726b5e]">定価</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="0"
                      value={v.price ?? ""}
                      onChange={(e) => setField(tier.condition, "price", e.target.value)}
                      className="w-28 border border-[#d8d2c8] rounded-lg py-2 px-3 text-base text-right text-[#26221e] focus:outline-none focus:border-[#b3242b]"
                    />
                    <span className="text-xs text-[#726b5e]">円</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="0"
                      value={v.qty ?? ""}
                      onChange={(e) => setField(tier.condition, "qty", e.target.value)}
                      className="w-20 border border-[#d8d2c8] rounded-lg py-2 px-3 text-base text-right text-[#26221e] focus:outline-none focus:border-[#b3242b]"
                    />
                    <span className="text-xs text-[#726b5e]">本</span>
                  </label>
                </div>
                <button
                  type="button"
                  aria-expanded={dupOpen}
                  onClick={() => toggleDupExpanded(tier.condition)}
                  className="self-start text-[11px] text-[#b3242b] underline underline-offset-2 decoration-dotted"
                >
                  同じ商品が複数ある場合
                </button>
                {dupOpen && (
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#9a9386] whitespace-nowrap">
                        同じ商品の2本目以降（半額）
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="0"
                        value={v.dup ?? ""}
                        onChange={(e) => setField(tier.condition, "dup", e.target.value)}
                        className="w-16 border border-[#e5dfd4] rounded-lg py-1.5 px-2 text-base text-right text-[#5c554d] focus:outline-none focus:border-[#b3242b]"
                      />
                      <span className="text-[11px] text-[#9a9386]">本</span>
                    </label>
                    <p className="text-[10px] text-[#aca493] leading-snug max-w-[280px]">
                      同じ商品を複数お売りの場合の、2本目以降の合計本数です。例:同じ商品5本なら、4本と入力
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {individualTiers.length > 0 && (
        <p className="text-xs text-[#726b5e] leading-relaxed">
          ※{individualTiers.map((t) => t.condition).join("・")}
          の商品は個別査定（定額）となるため、このシミュレーターの概算には含まれません。無料査定でご相談ください。
        </p>
      )}

      <p className="text-xs text-[#726b5e] leading-relaxed">
        ※このシミュレーターは区分ごとの買取率（目安）に基づく概算金額です。数量ボーナスは含まれません。レーベル・発売時期・状態により実際の査定額は変動します。正確な金額は無料査定でご確認ください。
      </p>
      <p className="text-xs text-[#726b5e] leading-relaxed">
        ※同じ商品を複数お売りいただく場合、2本目以降は半額で査定します。DVDとブルーレイは別の商品として数え、同じタイトルの限定版と通常版は同じ商品として数えます。
      </p>
      <p className="text-xs text-[#726b5e] leading-relaxed">
        ※初めてのご利用で{minimumGuarantee.minCount}本以上の場合は、特典を含めた買取金額が最低{minimumGuarantee.amount}になります（条件あり）。
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
