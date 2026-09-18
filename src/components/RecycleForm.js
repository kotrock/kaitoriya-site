"use client";

import { useState } from "react";

const boxSizes = [
  { id: "A", label: "Ａ：DVDケース25枚程度（幅26cm 奥行37cm 高さ16cm）" },
  { id: "B", label: "Ｂ：DVDケース50枚程度（幅40cm 奥行40cm 高さ18cm）" },
  { id: "C", label: "Ｃ：DVDケース85枚程度（幅37cm 奥行45cm 高さ25cm）" },
];

export default function RecycleForm() {
  const [wantsKit, setWantsKit] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

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
          <div className="text-3xl">✅</div>
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
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-base font-bold text-[#26221e]">
            2. 買取キット（無料ダンボール）の有無
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
          <p className="text-xs text-[#a39d92] leading-relaxed">
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

        <label className="flex items-start gap-2 text-xs text-[#5c554d]">
          <input type="checkbox" required className="mt-0.5" />
          内容にお間違えなければ、こちらにチェックを入れてください。
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
          {status === "sending" ? "送信中…" : "この内容で申し込む"}
        </button>
      </form>
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
      {hint && <span className="text-xs text-[#a39d92]">{hint}</span>}
      {children}
    </label>
  );
}
