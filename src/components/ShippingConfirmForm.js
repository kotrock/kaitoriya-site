"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircleIcon } from "@/components/Icons";
import { trackEvent } from "@/lib/analytics";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

// スパム対策の「時間トラップ」。フォームが表示されてから送信までの経過時間が
// 短すぎる場合はbotによる自動送信とみなす。必須の身分証明書アップロードを
// 伴うフォームを人間が3秒未満で完了することは現実的にないための閾値。
const MIN_ELAPSED_MS = 3000;

export default function ShippingConfirmForm() {
  const [paymentMethod, setPaymentMethod] = useState(""); // "" | "bank" | "paypay"
  const [idPhoto, setIdPhoto] = useState(null);
  const [paypayQrPhoto, setPaypayQrPhoto] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState("");
  const [formLoadedAt, setFormLoadedAt] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormLoadedAt(Date.now());
  }, []);

  function handleSingleFileChange(e, setPhoto) {
    const input = e.target;
    const file = input.files?.[0] || null;
    if (file && (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE)) {
      input.setCustomValidity(
        `「${file.name}」はjpg/png・10MB以内のファイルにしてください。`
      );
    } else {
      input.setCustomValidity("");
    }
    setPhoto(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // 時間トラップ：表示直後の即時送信はbotとみなし、APIを呼ばずに失敗扱いにする。
    const elapsed = formLoadedAt ? Date.now() - formLoadedAt : 0;
    if (elapsed < MIN_ELAPSED_MS) {
      setStatus("error");
      setErrorMessage("");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.target);

    try {
      const res = await fetch("/api/shipping-confirm", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        trackEvent("shipping_confirm_submit", { form_name: "shipping_confirm" });
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
          発送確定情報を受け付けました
        </h3>
        <p className="text-sm text-[#5c554d]">
          内容を確認の上、店舗より商品の発送についてご案内いたします。このまま商品のご発送準備をお進めください。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto bg-white border border-[#ece6dc] rounded-2xl p-8 flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

        <Field label="お名前" required>
          <input type="text" name="name" required className={inputCls} />
        </Field>
        <Field
          label="お電話番号"
          required
          hint="仮査定申込み時にご入力いただいた電話番号と照合いたします。"
        >
          <input type="tel" name="phone" required className={inputCls} />
        </Field>

        <Field
          label="身分証明書の写真（厚みがわかる角度で撮影）"
          required
          hint="運転免許証・健康保険証・マイナンバーカードなどを、真上からではなく少し斜めにして、カードの厚み（角の部分）が写るように撮影してください。平面的なコピーと区別するための撮影方法です。"
        >
          <input
            type="file"
            name="id_document_photo"
            accept="image/jpeg,image/png"
            required
            onChange={(e) => handleSingleFileChange(e, setIdPhoto)}
            className={inputCls}
          />
        </Field>
        {idPhoto && (
          <p className="text-xs text-[#5c554d] -mt-3">
            {idPhoto.name}（{(idPhoto.size / 1024 / 1024).toFixed(1)}MB）
          </p>
        )}

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[#26221e]">
            お振込み方法
            <span className="text-[#b3242b]"> （必須）</span>
          </h3>
          <div className="flex flex-col gap-3 text-sm text-[#26221e]">
            <label className="flex items-start gap-3 border border-[#ece6dc] rounded-xl p-3">
              <Image
                src="/payment-bank.png"
                alt="銀行振込"
                width={96}
                height={96}
                className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-lg"
              />
              <span className="flex items-start gap-2 flex-1">
                <input
                  type="radio"
                  name="payment_method"
                  value="銀行振込"
                  required
                  className="mt-1"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />
                <span className="font-semibold">銀行振込</span>
              </span>
            </label>
            <label className="flex items-start gap-3 border border-[#ece6dc] rounded-xl p-3">
              <Image
                src="/payment-paypay.png"
                alt="PayPay"
                width={96}
                height={96}
                className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-lg"
              />
              <span className="flex items-start gap-2 flex-1">
                <input
                  type="radio"
                  name="payment_method"
                  value="PayPay受け取り"
                  required
                  className="mt-1"
                  checked={paymentMethod === "paypay"}
                  onChange={() => setPaymentMethod("paypay")}
                />
                <span className="font-semibold">PayPay受け取り</span>
              </span>
            </label>
          </div>

          {paymentMethod === "bank" && (
            <Field
              label="振込先口座情報"
              required
              hint="金融機関名・支店名・預金種別・口座番号・口座名義をご記入ください。"
            >
              <textarea
                name="bank_account_info"
                rows={4}
                required
                placeholder="例: ○○銀行 △△支店 普通 1234567 タカガイ タロウ"
                className={inputCls}
              />
            </Field>
          )}
          {paymentMethod === "paypay" && (
            <>
              <Field
                label="PayPay受け取り用QRコード画像"
                required
                hint="PayPayアプリの「受け取る」画面に表示されるQRコードのスクリーンショットまたは写真をアップロードしてください。"
              >
                <input
                  type="file"
                  name="paypay_qr_photo"
                  accept="image/jpeg,image/png"
                  required
                  onChange={(e) => handleSingleFileChange(e, setPaypayQrPhoto)}
                  className={inputCls}
                />
              </Field>
              {paypayQrPhoto && (
                <p className="text-xs text-[#5c554d] -mt-3">
                  {paypayQrPhoto.name}（{(paypayQrPhoto.size / 1024 / 1024).toFixed(1)}MB）
                </p>
              )}
            </>
          )}
        </div>

        {status === "error" && (
          <p className="text-sm text-[#b3242b]">
            {errorMessage ||
              "送信に失敗しました。お手数ですがお電話(022-343-1588)でもお問い合わせいただけます。"}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full hover:bg-[#8f1c22] disabled:opacity-60"
        >
          {status === "sending" ? "送信中…" : "この内容で送信する"}
        </button>
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
