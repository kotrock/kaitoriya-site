"use client";

import { useState } from "react";

export default function ApplicationForm() {
  const [assessmentType, setAssessmentType] = useState("speed");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire this up to a real submission endpoint once the backend is decided.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-[700px] mx-auto bg-white border border-[#ece6dc] rounded-2xl p-10 text-center flex flex-col gap-3">
        <div className="text-3xl">✅</div>
        <h3 className="text-lg font-bold text-[#26221e]">
          お申し込みを受け付けました
        </h3>
        <p className="text-sm text-[#5c554d]">
          最短当日〜2日程度で担当よりご連絡いたします。段ボールが届き次第、商品をご準備ください。
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[700px] mx-auto bg-white border border-[#ece6dc] rounded-2xl p-8 flex flex-col gap-8"
    >
      <div className="flex flex-col gap-5">
        <h3 className="text-base font-bold text-[#26221e]">
          1. お客様情報
        </h3>
        <Field label="お名前" required>
          <input type="text" required className={inputCls} />
        </Field>
        <Field label="メールアドレス" required>
          <input type="email" required className={inputCls} />
        </Field>
        <Field label="電話番号" required>
          <input type="tel" required className={inputCls} />
        </Field>
        <Field
          label="買取希望商品の本数"
          hint="アダルトDVD・ブルーレイは5本以上、コミックのみの場合は10冊以上から買取可能です。"
          required
        >
          <input type="number" min={1} required className={inputCls} />
        </Field>
        <Field label="商品情報" hint="在庫の写真や在庫リスト(EXCEL)などを添付ください。（任意）">
          <input type="file" className="text-sm text-[#5c554d]" />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#26221e]">2. 査定方法</h3>
        <div className="flex flex-col gap-3 text-sm text-[#26221e]">
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="assessment"
              className="mt-1"
              checked={assessmentType === "speed"}
              onChange={() => setAssessmentType("speed")}
            />
            <span>
              <span className="font-semibold">スピード買取（仮査定なし）</span>
              <br />
              <span className="text-xs text-[#a39d92]">
                お急ぎの方におすすめ。査定額の変動はございません。
              </span>
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="assessment"
              className="mt-1"
              checked={assessmentType === "preview"}
              onChange={() => setAssessmentType("preview")}
            />
            <span>
              <span className="font-semibold">仮査定申請（仮査定あり）</span>
              <br />
              <span className="text-xs text-[#a39d92]">
                発送前に概算金額をお知らせします。ご納得いただけない場合はキャンセルも可能です。
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#26221e]">
          3. 発送用の段ボール
        </h3>
        <p className="text-xs text-[#a39d92] leading-relaxed">
          高買屋では5箱まで無料で発送用の段ボールをお送りいたします。ご自身でご用意いただくと査定額に＋300円上乗せいたします（買取対象商品が10点以上の場合）。
        </p>
        <select className={inputCls} defaultValue="">
          <option value="" disabled>
            選択してください
          </option>
          <option value="need">段ボールが必要（無料）</option>
          <option value="own">自分で用意する（+300円）</option>
        </select>
      </div>

      <label className="flex items-start gap-2 text-xs text-[#5c554d]">
        <input type="checkbox" required className="mt-0.5" />
        利用規約・プライバシーポリシーに同意の上、この内容で申し込みます。
      </label>

      <button
        type="submit"
        className="bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full hover:bg-[#8f1c22]"
      >
        この内容で無料査定を申し込む
      </button>
    </form>
  );
}

const inputCls =
  "w-full border border-[#d8d2c8] rounded-lg py-2.5 px-3.5 text-sm text-[#26221e] focus:outline-none focus:border-[#b3242b]";

function Field({ label, required, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-[#26221e]">
        {label}
        {required && <span className="text-[#b3242b]"> （必須）</span>}
      </span>
      {hint && <span className="text-xs text-[#a39d92]">{hint}</span>}
      {children}
    </label>
  );
}
