"use client";

import { useState } from "react";

export default function ApplicationForm() {
  const [assessmentType, setAssessmentType] = useState("speed");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.target);
    formData.append(
      "access_key",
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
    );
    formData.append("subject", "【高買屋】買取お申込みがありました");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
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
      {/* スパム対策用のハニーポット。実際の利用者には見えず、bot だけが埋めてしまう */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="flex flex-col gap-5">
        <h3 className="text-base font-bold text-[#26221e]">
          1. お客様情報
        </h3>
        <Field label="お名前" required>
          <input type="text" name="name" required className={inputCls} />
        </Field>
        <Field label="メールアドレス" required>
          <input type="email" name="email" required className={inputCls} />
        </Field>
        <Field label="電話番号" required>
          <input type="tel" name="phone" required className={inputCls} />
        </Field>
        <Field
          label="買取希望商品の本数"
          hint="アダルトDVD・ブルーレイは5本以上、コミックのみの場合は10冊以上から買取可能です。"
          required
        >
          <input
            type="number"
            name="quantity"
            min={1}
            required
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#26221e]">2. 査定方法</h3>
        <div className="flex flex-col gap-3 text-sm text-[#26221e]">
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="assessment_type"
              value="スピード買取（仮査定なし）"
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
              name="assessment_type"
              value="仮査定申請（仮査定あり）"
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
        <select name="box_option" className={inputCls} defaultValue="">
          <option value="" disabled>
            選択してください
          </option>
          <option value="段ボールが必要（無料）">
            段ボールが必要（無料）
          </option>
          <option value="自分で用意する（+300円）">
            自分で用意する（+300円）
          </option>
        </select>
      </div>

      <label className="flex items-start gap-2 text-xs text-[#5c554d]">
        <input type="checkbox" required className="mt-0.5" />
        利用規約・プライバシーポリシーに同意の上、この内容で申し込みます。
      </label>

      {status === "error" && (
        <p className="text-sm text-[#b3242b]">
          送信に失敗しました。お手数ですがお電話(022-343-1588)でもお問い合わせいただけます。
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full hover:bg-[#8f1c22] disabled:opacity-60"
      >
        {status === "sending" ? "送信中…" : "この内容で無料査定を申し込む"}
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
