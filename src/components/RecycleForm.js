"use client";

import { useRef, useState } from "react";
import { CheckCircleIcon } from "@/components/Icons";
import { StepIndicator, SummaryRow } from "@/components/FormSteps";

const STEPS = ["お客様情報", "詳細", "確認"];

const boxSizes = [
  { id: "A", label: "Ａ：DVDケース25枚程度（幅26cm 奥行37cm 高さ16cm）" },
  { id: "B", label: "Ｂ：DVDケース50枚程度（幅40cm 奥行40cm 高さ18cm）" },
  { id: "C", label: "Ｃ：DVDケース85枚程度（幅37cm 奥行45cm 高さ25cm）" },
];

export default function RecycleForm() {
  const [wantsKit, setWantsKit] = useState("");
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
    formData.append("subject", "【高買屋】DVD無料回収のお申し込みがありました");

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
      <section className="w-full px-6 md:px-8 pb-16">
        <div className="max-w-[700px] mx-auto bg-white border border-[#ece6dc] rounded-2xl p-10 text-center flex flex-col gap-3">
          <CheckCircleIcon className="w-9 h-9 text-[#2f9e5c] mx-auto" />
          <h3 className="text-lg font-bold text-[#26221e]">
            お申し込みを受け付けました
          </h3>
          <p className="text-sm text-[#5c554d]">
            担当より折り返しご連絡いたします。段ボールが届き次第、商品をご準備ください。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 md:px-8 pb-16">
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
          </div>

          <div
            ref={step1Ref}
            className={step === 1 ? "flex flex-col gap-5" : "hidden"}
          >
            <h3 className="text-base font-bold text-[#26221e]">
              買取キット（無料ダンボール）の有無
            </h3>
            <div className="flex gap-6 text-sm text-[#26221e]">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="kit"
                  value="希望しない"
                  checked={wantsKit === "no"}
                  onChange={() => setWantsKit("no")}
                />
                希望しない
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="kit"
                  value="希望する"
                  checked={wantsKit === "yes"}
                  onChange={() => setWantsKit("yes")}
                />
                希望する
              </label>
            </div>
            <p className="text-xs text-[#726b5e] leading-relaxed">
              ご自身で段ボールをご用意して頂くと査定金額に＋300円アップさせていただきます。（買取対象商品が10点以上の方のみが対象となります）
            </p>

            {wantsKit === "yes" && (
              <div className="flex flex-col gap-4 mt-1 p-5 bg-[#f7f3ee] rounded-xl">
                <Field label="段ボールのサイズ">
                  <select name="box_size" className={inputCls} defaultValue="">
                    <option value="" disabled>
                      選択してください
                    </option>
                    {boxSizes.map((box) => (
                      <option key={box.id} value={box.label}>
                        {box.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="段ボールの数">
                  <select name="box_count" className={inputCls} defaultValue="">
                    <option value="" disabled>
                      選択してください
                    </option>
                    <option value="1個">１個</option>
                    <option value="2個">２個</option>
                    <option value="3個">３個</option>
                  </select>
                </Field>
                <Field
                  label="ご要望"
                  hint="ダンボールが4個以上必要な場合や細かい要望があればご記入ください。"
                >
                  <textarea name="box_request" rows={3} className={inputCls} />
                </Field>

                <h4 className="text-sm font-bold text-[#26221e] mt-2">
                  段ボールのご郵送先
                </h4>
                <Field label="郵便番号" required>
                  <input type="text" name="postal_code" required className={inputCls} />
                </Field>
                <Field label="都道府県" required>
                  <input type="text" name="prefecture" required className={inputCls} />
                </Field>
                <Field label="市区町村" required>
                  <input type="text" name="city" required className={inputCls} />
                </Field>
                <Field label="それ以降の住所（建物名も記入）" required>
                  <input type="text" name="address_line" required className={inputCls} />
                </Field>
              </div>
            )}
          </div>

          <div className={step === 2 ? "flex flex-col gap-5" : "hidden"}>
            <h3 className="text-base font-bold text-[#26221e]">内容確認</h3>
            <div className="border border-[#ece6dc] rounded-xl px-5">
              <SummaryRow label="お名前" value={summary.name} />
              <SummaryRow label="メールアドレス" value={summary.email} />
              <SummaryRow label="電話番号" value={summary.phone} />
              <SummaryRow label="買取キットの希望" value={summary.kit} />
              <SummaryRow label="段ボールのサイズ" value={summary.box_size} />
              <SummaryRow label="段ボールの数" value={summary.box_count} />
              <SummaryRow label="ご要望" value={summary.box_request} />
              <SummaryRow label="郵便番号" value={summary.postal_code} />
              <SummaryRow label="都道府県" value={summary.prefecture} />
              <SummaryRow label="市区町村" value={summary.city} />
              <SummaryRow
                label="それ以降の住所"
                value={summary.address_line}
              />
            </div>
            <label className="flex items-start gap-2 text-xs text-[#5c554d]">
              <input type="checkbox" required className="mt-0.5" />
              内容にお間違えなければ、こちらにチェックを入れてください。
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
                {status === "sending" ? "送信中…" : "この内容で申し込む"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
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
