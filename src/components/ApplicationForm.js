"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CheckCircleIcon } from "@/components/Icons";
import { StepIndicator, SummaryRow } from "@/components/FormSteps";
import { payoutOptions } from "@/data/site";

const STEPS = ["コース選択", "お客様情報", "詳細", "確認"];

const courseCopy = {
  speed: {
    label: "スピード買取（仮査定なし）",
    desc: "画像添付不要。到着後すぐ査定・お振込み。査定額に関わらずキャンセル不可です。",
  },
  provisional: {
    label: "仮査定申請（仮査定あり）",
    desc: "本数・商品内容・画像を送付。店舗で仮査定後にご連絡、内容にご納得いただけたら発送してください。",
  },
};

const paymentLabels = {
  bank: `銀行振込（振込手数料${payoutOptions.bankFee}）`,
  paypay: `PayPay受け取り（${payoutOptions.paypayBonus}プラス）`,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export default function ApplicationForm() {
  const [course, setCourse] = useState(""); // "" | "speed" | "provisional"
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState({});
  const cardRef = useRef(null);
  const formRef = useRef(null);
  const step0Ref = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);

  const stepRefs = [step0Ref, step1Ref, step2Ref];

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

  function handleImagesChange(e) {
    const input = e.target;
    const files = Array.from(input.files || []);
    const invalid = files.find(
      (f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE
    );
    if (invalid) {
      input.setCustomValidity(
        `「${invalid.name}」はjpg/png・10MB以内のファイルにしてください。`
      );
    } else {
      input.setCustomValidity("");
    }
    setImages(files);
  }

  function goNext() {
    const currentEl = stepRefs[step]?.current;
    if (!validateStep(currentEl)) return;
    if (step === 2) {
      const data = new FormData(formRef.current);
      const entries = Object.fromEntries(data.entries());
      delete entries.images;
      setSummary(entries);
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
    setErrorMessage("");

    const formData = new FormData(e.target);

    try {
      const res = await fetch("/api/application", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "");
      }
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
          {course === "provisional"
            ? "店舗にて仮査定を行い、最短当日〜2日程度でご連絡いたします。内容にご納得いただけましたら発送手続きをご案内します。"
            : "最短翌日にご連絡・お振込みいたします。段ボールが届き次第、商品をご準備ください。"}
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

        {/* STEP 0: コース選択 */}
        <div
          ref={step0Ref}
          className={step === 0 ? "flex flex-col gap-4" : "hidden"}
        >
          <h3 className="text-base font-bold text-[#26221e]">
            コースを選択してください
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(courseCopy).map(([value, c]) => (
              <label
                key={value}
                className={
                  "cursor-pointer border-2 rounded-2xl p-5 flex flex-col gap-2 transition-colors " +
                  (course === value
                    ? "border-[#b3242b] bg-[#fbeceb]"
                    : "border-[#ece6dc] hover:border-[#d8d2c8]")
                }
              >
                <input
                  type="radio"
                  name="course"
                  value={value}
                  required
                  className="sr-only"
                  checked={course === value}
                  onChange={() => setCourse(value)}
                />
                <span className="text-base font-bold text-[#26221e]">
                  {c.label}
                </span>
                <span className="text-xs text-[#726b5e] leading-relaxed">
                  {c.desc}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* STEP 1: お客様情報（コースにより一部項目が変わる） */}
        <div
          ref={step1Ref}
          className={step === 1 ? "flex flex-col gap-5" : "hidden"}
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

          {course === "provisional" && (
            <>
              <Field
                label="買取商品の内容"
                required
                hint="レーベル名・タイトルなど、わかる範囲でご記入ください。"
              >
                <textarea
                  name="product_details"
                  rows={4}
                  required
                  className={inputCls}
                />
              </Field>
              <Field
                label="商品の画像"
                required
                hint="jpg/png形式、1枚あたり10MBまで。複数枚選択できます。"
              >
                <input
                  type="file"
                  name="images"
                  accept="image/jpeg,image/png"
                  multiple
                  required
                  onChange={handleImagesChange}
                  className={inputCls}
                />
              </Field>
              {images.length > 0 && (
                <ul className="text-xs text-[#5c554d] flex flex-col gap-1">
                  {images.map((f, i) => (
                    <li key={i}>
                      {f.name}（{(f.size / 1024 / 1024).toFixed(1)}MB）
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* STEP 2: 詳細（段ボール・お支払い方法。両コース共通） */}
        <div
          ref={step2Ref}
          className={step === 2 ? "flex flex-col gap-8" : "hidden"}
        >
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
              <label className="flex items-start gap-3 border border-[#ece6dc] rounded-xl p-3">
                <Image
                  src="/payment-bank.png"
                  alt=""
                  width={96}
                  height={96}
                  className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-lg"
                />
                <span className="flex items-start gap-2 flex-1">
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
                </span>
              </label>
              <label className="flex items-start gap-3 border border-[#ece6dc] rounded-xl p-3">
                <Image
                  src="/payment-paypay.png"
                  alt=""
                  width={96}
                  height={96}
                  className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-lg"
                />
                <span className="flex items-start gap-2 flex-1">
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
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* STEP 3: 確認 */}
        <div className={step === 3 ? "flex flex-col gap-5" : "hidden"}>
          <h3 className="text-base font-bold text-[#26221e]">内容確認</h3>
          <div className="border border-[#ece6dc] rounded-xl px-5">
            <SummaryRow
              label="コース"
              value={course ? courseCopy[course]?.label : ""}
            />
            <SummaryRow label="お名前" value={summary.name} />
            <SummaryRow label="メールアドレス" value={summary.email} />
            <SummaryRow label="電話番号" value={summary.phone} />
            <SummaryRow label="買取希望商品の本数" value={summary.quantity} />
            {course === "provisional" && (
              <>
                <SummaryRow
                  label="買取商品の内容"
                  value={summary.product_details}
                />
                <SummaryRow
                  label="添付画像"
                  value={
                    images.length > 0
                      ? `${images.length}枚（${images.map((f) => f.name).join("、")}）`
                      : ""
                  }
                />
              </>
            )}
            <SummaryRow label="発送用の段ボール" value={summary.box_option} />
            <SummaryRow label="お支払い方法" value={summary.payment_method} />
          </div>

          {course === "speed" && (
            <label className="flex items-start gap-2 text-xs text-[#5c554d]">
              <input type="checkbox" required className="mt-0.5" />
              査定額に関わらずキャンセルはできないことに同意します。
            </label>
          )}
          <label className="flex items-start gap-2 text-xs text-[#5c554d]">
            <input type="checkbox" required className="mt-0.5" />
            利用規約・プライバシーポリシーに同意の上、この内容で申し込みます。
          </label>
        </div>

        {status === "error" && (
          <p className="text-sm text-[#b3242b]">
            {errorMessage ||
              "送信に失敗しました。お手数ですがお電話(022-343-1588)でもお問い合わせいただけます。"}
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
              {status === "sending" ? "送信中…" : "この内容で申し込む"}
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
