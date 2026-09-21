"use client";

import { useRef, useState } from "react";
import { CheckCircleIcon } from "@/components/Icons";
import { StepIndicator, SummaryRow } from "@/components/FormSteps";
import { payoutOptions } from "@/data/site";

const STEPS = ["お客様情報", "詳細", "確認"];

const assessmentLabels = {
  speed: "スピード買取（仮査定なし）",
  preview: "仮査定申請（仮査定あり）",
};

const paymentLabels = {
  bank: `銀行振込（振込手数料${payoutOptions.bankFee}）`,
  paypay: `PayPay受け取り（${payoutOptions.paypayBonus}プラス）`,
};

export default function ApplicationForm() {
  const [assessmentType, setAssessmentType] = useState("speed");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState({});
  const cardRef = useRef(null);
  const formRef = useRef(null);
  const step0Ref = useRef(null);
  const step1Ref = useRef(null);

  function validateStep(el) {
    if (!el) return true;
    const fields = Array.from(el.querySelectorAll("input, select, textarea"));
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  function goNext() {
    const currentEl = step === 0 ? step0Ref.current : step1Ref.current;
    if (!validateStep(currentEl)) return;
    if (step === 1) {
      const data = new FormData(formRef.current);
      setSummary(Object.fromEntries(data.entries()));
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: cardRef.current?.offsetTop - 80, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: cardRef.current?.offsetTop - 80, behavior: "smooth" });
  }

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
        <CheckCircleIcon className="w-9 h-9 text-[#2f9e5c] mx-auto" />
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
    <div
      ref={cardRef}
      className="max-w-[700px] mx-auto bg-white border border-[#ece6dc] rounded-2xl p-8 flex flex-col gap-8"
    >
      <StepIndicator steps={STEPS} current={step} />

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* スパム対策用のハニーポット。実際の利用者には見えず、bot だけが埋めてしまう */}
        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div
          ref={step0Ref}
          className={step === 0 ? "flex flex-col gap-5" : "hidden"}
        >
          <h3 className="text-base font-bold text-[#26221e]">
            お客様情報
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

        <div
          ref={step1Ref}
          className={step === 1 ? "flex flex-col gap-8" : "hidden"}
        >
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#26221e]">査定方法</h3>
            <div className="flex flex-col gap-3 text-sm text-[#26221e]">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="assessment_type"
                  value={assessmentLabels.speed}
                  className="mt-1"
                  checked={assessmentType === "speed"}
                  onChange={() => setAssessmentType("speed")}
                />
                <span>
                  <span className="font-semibold">スピード買取（仮査定なし）</span>
                  <br />
                  <span className="text-xs text-[#726b5e]">
                    お急ぎの方におすすめ。査定額の変動はございません。
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="assessment_type"
                  value={assessmentLabels.preview}
                  className="mt-1"
                  checked={assessmentType === "preview"}
                  onChange={() => setAssessmentType("preview")}
                />
                <span>
                  <span className="font-semibold">仮査定申請（仮査定あり）</span>
                  <br />
                  <span className="text-xs text-[#726b5e]">
                    発送前に概算金額をお知らせします。ご納得いただけない場合はキャンセルも可能です。
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#26221e]">
              発送用の段ボール
            </h3>
            <p className="text-xs text-[#726b5e] leading-relaxed">
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

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#26221e]">
              お支払い方法
            </h3>
            <div className="flex flex-col gap-3 text-sm text-[#26221e]">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="payment_method"
                  value={paymentLabels.bank}
                  className="mt-1"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />
                <span>
                  <span className="font-semibold">{paymentLabels.bank}</span>
                  <br />
                  <span className="text-xs text-[#726b5e]">
                    指定の口座へお振込みいたします。
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="payment_method"
                  value={paymentLabels.paypay}
                  className="mt-1"
                  checked={paymentMethod === "paypay"}
                  onChange={() => setPaymentMethod("paypay")}
                />
                <span>
                  <span className="font-semibold">{paymentLabels.paypay}</span>
                  <br />
                  <span className="text-xs text-[#726b5e]">
                    振込手数料がかからず、逆にボーナスを上乗せしてお支払いします。
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div
          className={step === 2 ? "flex flex-col gap-5" : "hidden"}
        >
          <h3 className="text-base font-bold text-[#26221e]">内容確認</h3>
          <div className="border border-[#ece6dc] rounded-xl px-5">
            <SummaryRow label="お名前" value={summary.name} />
            <SummaryRow label="メールアドレス" value={summary.email} />
            <SummaryRow label="電話番号" value={summary.phone} />
            <SummaryRow label="買取希望商品の本数" value={summary.quantity} />
            <SummaryRow label="査定方法" value={summary.assessment_type} />
            <SummaryRow label="発送用の段ボール" value={summary.box_option} />
            <SummaryRow label="お支払い方法" value={summary.payment_method} />
          </div>
          <label className="flex items-start gap-2 text-xs text-[#5c554d]">
            <input type="checkbox" required className="mt-0.5" />
            利用規約・プライバシーポリシーに同意の上、この内容で申し込みます。
          </label>
        </div>

        {status === "error" && (
          <p className="text-sm text-[#b3242b]">
            送信に失敗しました。お手数ですがお電話(022-343-1588)でもお問い合わせいただけます。
          </p>
        )}

        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex-1 border border-[#d8d2c8] text-[#5c554d] text-sm font-bold py-4 rounded-full hover:bg-[#f7f3ee]"
            >
              戻る
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex-1 bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full hover:bg-[#8f1c22]"
            >
              次へ
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex-1 bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full hover:bg-[#8f1c22] disabled:opacity-60"
            >
              {status === "sending" ? "送信中…" : "この内容で無料査定を申し込む"}
            </button>
          )}
        </div>
      </form>
    </div>
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
      {hint && <span className="text-xs text-[#726b5e]">{hint}</span>}
      {children}
    </label>
  );
}
