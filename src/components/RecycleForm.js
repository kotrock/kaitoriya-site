"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircleIcon } from "@/components/Icons";
import { StepIndicator, SummaryRow } from "@/components/FormSteps";
import Turnstile from "@/components/Turnstile";
import { trackEvent } from "@/lib/analytics";

// スパム対策の「時間トラップ」。フォームが表示されてから送信までの経過時間が
// 短すぎる場合はbotによる自動送信とみなす。
const MIN_ELAPSED_MS = 3000;

const STEPS = ["お客様情報", "詳細", "確認"];

const boxSizes = [
  { id: "A", label: "Ａ：DVDケース25枚程度（幅26cm 奥行37cm 高さ16cm）" },
  { id: "B", label: "Ｂ：DVDケース50枚程度（幅40cm 奥行40cm 高さ18cm）" },
  { id: "C", label: "Ｃ：DVDケース85枚程度（幅37cm 奥行45cm 高さ25cm）" },
];

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

export default function RecycleForm() {
  const [wantsKit, setWantsKit] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState({});
  const [formLoadedAt, setFormLoadedAt] = useState(null);
  const cardRef = useRef(null);
  const formRef = useRef(null);
  const step0Ref = useRef(null);
  const step1Ref = useRef(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormLoadedAt(Date.now());
  }, []);

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

    // 連打による二重送信（GA4イベントの二重送信含む）を防ぐ。
    if (isSubmittingRef.current) return;

    // 時間トラップ：表示直後の即時送信はbotとみなし、APIを呼ばずに失敗扱いにする。
    const elapsed = formLoadedAt ? Date.now() - formLoadedAt : 0;
    if (elapsed < MIN_ELAPSED_MS) {
      setStatus("error");
      setErrorMessage("");
      return;
    }

    isSubmittingRef.current = true;
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.target);

    try {
      const res = await fetch("/api/recycle", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        trackEvent("generate_lead", { form_name: "recycle" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "");
      }
    } catch {
      setStatus("error");
      setErrorMessage("通信エラーが発生しました。電波の良い場所で再度お試しください。");
    } finally {
      isSubmittingRef.current = false;
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
          {/* スパム対策用の時間トラップ。フォーム表示時刻をサーバー側でも検証する */}
          <input type="hidden" name="form_loaded_at" value={formLoadedAt ?? ""} />

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
              <input
                type="tel"
                inputMode="tel"
                name="phone"
                required
                pattern="[0-9\-]{10,13}"
                title="ハイフンありなし、10〜11桁の数字でご入力ください"
                className={inputCls}
              />
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
                <Field
                  label="郵便番号"
                  required
                  hint="ハイフンありなし、どちらでも構いません。"
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    name="postal_code"
                    required
                    pattern="\d{3}-?\d{4}"
                    title="7桁の数字でご入力ください（ハイフンありなし可）"
                    className={inputCls}
                  />
                </Field>
                <Field label="都道府県" required>
                  <select name="prefecture" required className={inputCls} defaultValue="">
                    <option value="" disabled>
                      選択してください
                    </option>
                    {PREFECTURES.map((pref) => (
                      <option key={pref} value={pref}>
                        {pref}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="市区町村" required>
                  <input type="text" name="city" required className={inputCls} />
                </Field>
                <Field
                  label="番地・建物名"
                  required
                  hint="例：旭町4丁目4-10　○○マンション101"
                >
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
              <SummaryRow label="番地・建物名" value={summary.address_line} />
            </div>
            <Turnstile />
            <label className="flex items-start gap-2 text-xs text-[#5c554d]">
              <input type="checkbox" required className="mt-0.5" />
              内容にお間違えなければ、こちらにチェックを入れてください。
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
    </section>
  );
}

// text-baseを使用（16px未満だとiOS Safariでフォーカス時に自動ズームが発生し、
// 入力中に画面が左右に動く原因になるため）。
const inputCls =
  "w-full border border-[#d8d2c8] rounded-lg py-2.5 px-3.5 text-base text-[#26221e] focus:outline-none focus:border-[#b3242b]";

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
