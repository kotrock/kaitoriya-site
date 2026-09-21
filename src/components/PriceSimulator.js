"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { priceTiers, avgUnitPrice } from "@/data/site";

const yen = new Intl.NumberFormat("ja-JP");

export default function PriceSimulator() {
  const [quantity, setQuantity] = useState(5);
  const [tierIndex, setTierIndex] = useState(0);

  const tier = priceTiers[tierIndex];
  const hasRate = typeof tier.rateMin === "number" && typeof tier.rateMax === "number";

  const { low, high } = useMemo(() => {
    if (!hasRate) return { low: null, high: null };
    const qty = Math.max(1, Number(quantity) || 0);
    const low = Math.round((qty * avgUnitPrice * tier.rateMin) / 100);
    const high = Math.round((qty * avgUnitPrice * tier.rateMax) / 100);
    return { low, high };
  }, [quantity, tier, hasRate]);

  return (
    <div className="bg-white border border-[#ece6dc] rounded-2xl p-7 md:p-8 flex flex-col gap-6">
      <div className="grid md:grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-[#26221e]">本数</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border border-[#d8d2c8] rounded-lg py-2.5 px-3.5 text-sm text-[#26221e] focus:outline-none focus:border-[#b3242b]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-[#26221e]">状態</span>
          <select
            value={tierIndex}
            onChange={(e) => setTierIndex(Number(e.target.value))}
            className="w-full border border-[#d8d2c8] rounded-lg py-2.5 px-3.5 text-sm text-[#26221e] focus:outline-none focus:border-[#b3242b]"
          >
            {priceTiers.map((t, i) => (
              <option key={t.condition} value={i}>
                {t.condition}（{t.target}）
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="bg-[#f7f3ee] rounded-xl p-6 text-center flex flex-col gap-1.5">
        <div className="text-xs font-bold text-[#726b5e]">概算買取金額</div>
        {hasRate ? (
          <>
            <div className="text-3xl md:text-[40px] font-extrabold text-[#b3242b] leading-tight">
              ¥{yen.format(low)} 〜 ¥{yen.format(high)}
            </div>
            <div className="text-[11px] text-[#726b5e]">
              買取率 {tier.rate}・1本あたり平均定価{yen.format(avgUnitPrice)}円で試算
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl md:text-3xl font-extrabold text-[#b3242b] leading-tight">
              個別査定（定額）
            </div>
            <div className="text-[11px] text-[#726b5e]">
              状態を確認のうえ個別に査定いたします。無料査定でご相談ください。
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-[#726b5e] leading-relaxed">
        ※このシミュレーターは目安の概算金額です。レーベル・発売時期・状態により実際の査定額は変動します。正確な金額は無料査定でご確認ください。
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
