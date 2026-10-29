"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircleIcon } from "@/components/Icons";
import { StepIndicator, SummaryRow } from "@/components/FormSteps";
import { payoutOptions, boxBonus } from "@/data/site";
import { getBoxBonusMinCount } from "@/lib/campaign";
import { trackEvent } from "@/lib/analytics";
import Turnstile, { TURNSTILE_ENABLED } from "@/components/Turnstile";
import ReassurancePoints from "@/components/ReassurancePoints";
import {
  compressImageToTarget,
  compressImagesToBudget,
  UnsupportedImageError,
} from "@/lib/image-compression";

// スパム対策の「時間トラップ」。フォームが表示されてから送信までの経過時間が
// 短すぎる場合はbotによる自動送信とみなす。4ステップの入力・ファイル選択を
// 人間が3秒未満で完了することは現実的にないための閾値。
const MIN_ELAPSED_MS = 3000;

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

// 仮査定申請の「買取点数の内訳」4項目。ラベルの高さ・単位の位置をそろえて表示する。
const QUANTITY_FIELDS = [
  { name: "dvd_count", label: "DVD", unit: "本" },
  { name: "bd_count", label: "ブルーレイ", unit: "本" },
  { name: "comic_count", label: "コミック", unit: "冊" },
  { name: "other_count", label: "その他（イメージDVD/BD等）", unit: "点" },
];

// src/app/api/application/route.jsのサーバー側チェックと同じ値を使う。
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB（1枚あたり、圧縮後はほぼ下回る想定）
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_IMAGE_COUNT = 20;
const MAX_TOTAL_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB（サーバー側上限と同じ）
// 圧縮の目標値。Vercelのリクエストボディ上限（約4.5MB）・サーバー側上限（4MB）より
// 少し余裕を持たせた約3.8MBを目標に、選択直後に自動で圧縮する。
const COMPRESSION_TARGET_TOTAL = 3.8 * 1024 * 1024;
// 顔写真・身分証明書・PayPay QRコードなど、1枚ずつ個別に選択される画像の目標サイズ。
// 判読性を優先するため、商品画像より緩やかな目標値にする。
const PRIORITY_FILE_TARGET = 1.2 * 1024 * 1024;

// GA4計測用の申込み点数。スピード買取はquantity、仮査定は内訳の合計（route.jsの
// totalQuantity計算と同じロジック）。個人情報は含めない。
function computeItemCount(formData, course) {
  if (course === "provisional") {
    const dvd = Number(formData.get("dvd_count")) || 0;
    const bd = Number(formData.get("bd_count")) || 0;
    const comic = Number(formData.get("comic_count")) || 0;
    const other = Number(formData.get("other_count")) || 0;
    return dvd + bd + comic + other;
  }
  return Number(formData.get("quantity")) || 0;
}

// 送信失敗時のGA4計測用に、エラーの種類をざっくり分類する（個人情報・本文は含めない）。
function classifyError(status, message) {
  if (status === 413) return "too_large";
  if (status && status >= 500) return "server";
  if (message && /サイズ|枚/.test(message)) return "too_large";
  return "validation";
}

// 圧縮後のFileでネイティブのinput.filesを置き換える（DataTransfer経由。
// モダンブラウザで共通してサポートされている方法）。これによりFormData送信時に
// 実際に圧縮後のファイルが使われるようにする。
function setInputFiles(input, files) {
  const dataTransfer = new DataTransfer();
  files.forEach((f) => dataTransfer.items.add(f));
  input.files = dataTransfer.files;
}

const TURNSTILE_PENDING_MESSAGE =
  "確認がうまくいきませんでした。もう一度、確認のチェックが終わってから、送信してください。";

export default function ApplicationForm() {
  const boxBonusMinCount = getBoxBonusMinCount();
  const [course, setCourse] = useState(""); // "" | "speed" | "provisional"
  const [paymentMethod, setPaymentMethod] = useState(""); // "" | "bank" | "paypay"
  const [images, setImages] = useState([]);
  const [imagesError, setImagesError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [paypayQrPhoto, setPaypayQrPhoto] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState({});
  const [formLoadedAt, setFormLoadedAt] = useState(null);
  const [turnstileReady, setTurnstileReady] = useState(!TURNSTILE_ENABLED);
  const cardRef = useRef(null);
  const formRef = useRef(null);
  const step0Ref = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const quantityErrorRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const turnstileRef = useRef(null);

  // トークンは1回使い切り・期限切れがあるため、送信が終わった（成功・失敗問わず）
  // 直後は必ず捨てて、次の送信に備えて新しいトークンを取り直す。
  function resetTurnstile() {
    setTurnstileReady(!TURNSTILE_ENABLED);
    turnstileRef.current?.reset();
  }

  const stepRefs = [step0Ref, step1Ref, step2Ref];

  useEffect(() => {
    if (quantityError) {
      quantityErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [quantityError]);

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

  async function handleImagesChange(e) {
    const input = e.target;
    const files = Array.from(input.files || []);

    if (files.length === 0) {
      input.setCustomValidity("");
      setImagesError("");
      setImages([]);
      return;
    }

    if (files.length > MAX_IMAGE_COUNT) {
      const message = `商品の画像は${MAX_IMAGE_COUNT}枚まで選択できます（現在${files.length}枚）。枚数を減らしてください。`;
      input.setCustomValidity(message);
      setImagesError(message);
      setImages([]);
      return;
    }

    setCompressing(true);
    setImagesError("");
    try {
      const compressed = await compressImagesToBudget(files, {
        totalBudget: COMPRESSION_TARGET_TOTAL,
        priority: false,
      });
      const totalSize = compressed.reduce((sum, f) => sum + f.size, 0);
      const message =
        totalSize > MAX_TOTAL_IMAGE_SIZE
          ? `商品の画像の合計サイズが大きすぎます（圧縮後も合計${(
              totalSize /
              1024 /
              1024
            ).toFixed(1)}MB）。枚数を減らして再度お試しください。`
          : "";
      input.setCustomValidity(message);
      setImagesError(message);
      setInputFiles(input, compressed);
      setImages(compressed);
    } catch (err) {
      const message =
        err instanceof UnsupportedImageError
          ? err.message
          : "画像の処理中にエラーが発生しました。別の画像でお試しください。";
      input.setCustomValidity(message);
      setImagesError(message);
      setImages([]);
    } finally {
      setCompressing(false);
    }
  }

  async function handleSingleFileChange(e, setPhoto) {
    const input = e.target;
    const file = input.files?.[0] || null;

    if (!file) {
      input.setCustomValidity("");
      setPhoto(null);
      return;
    }

    setCompressing(true);
    try {
      // 顔写真・身分証明書・PayPay QRコードは、判読性を優先する「priority」扱いで圧縮する。
      const compressed = await compressImageToTarget(file, {
        targetSize: PRIORITY_FILE_TARGET,
        priority: true,
      });
      input.setCustomValidity("");
      setInputFiles(input, [compressed]);
      setPhoto(compressed);
    } catch (err) {
      const message =
        err instanceof UnsupportedImageError
          ? err.message
          : "画像の処理中にエラーが発生しました。別の画像でお試しください。";
      input.setCustomValidity(message);
      setPhoto(null);
    } finally {
      setCompressing(false);
    }
  }

  // 仮査定申請の最低本数（アダルトDVD・ブルーレイ・イメージDVD/BD合計5本以上、
  // またはそれらが0冊でコミックのみ10冊以上）を満たしているか確認する。
  // 満たさない場合はやさしい文言のエラーメッセージを返す（満たす場合はnull）。
  function checkMinimumQuantity() {
    const data = new FormData(formRef.current);
    const mainCount =
      (Number(data.get("dvd_count")) || 0) +
      (Number(data.get("bd_count")) || 0) +
      (Number(data.get("other_count")) || 0);
    const comicCountNum = Number(data.get("comic_count")) || 0;
    const meetsMinimum = mainCount >= 5 || (mainCount === 0 && comicCountNum >= 10);
    if (meetsMinimum) return null;
    const displayCount = mainCount > 0 ? mainCount : comicCountNum;
    const unit = mainCount > 0 ? "本" : "冊";
    return `買取は、アダルトDVD・ブルーレイ（イメージDVD・BD含む）合わせて5本以上（コミックのみの場合は10冊以上）からです。現在${displayCount}${unit}です。`;
  }

  function goNext() {
    if (compressing) return;
    const currentEl = stepRefs[step]?.current;
    if (!validateStep(currentEl)) return;
    if (step === 1 && course === "provisional") {
      const message = checkMinimumQuantity();
      if (message) {
        setQuantityError(message);
        trackEvent("generate_lead_error", {
          form_name: "application",
          error_type: "validation",
        });
        return;
      }
      setQuantityError("");
    }
    if (step === 2) {
      const data = new FormData(formRef.current);
      const entries = Object.fromEntries(data.entries());
      delete entries.images;
      delete entries.selfie_photo;
      delete entries.id_document_photo;
      delete entries.paypay_qr_photo;
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

    // 連打による二重送信を防ぐ。
    if (isSubmittingRef.current) return;

    // 時間トラップ：表示直後の即時送信はbotとみなし、APIを呼ばずに失敗扱いにする。
    const elapsed = formLoadedAt ? Date.now() - formLoadedAt : 0;
    if (elapsed < MIN_ELAPSED_MS) {
      setStatus("error");
      setErrorMessage("");
      return;
    }

    // 画像処理中は送信しない（ボタン自体も無効化しているが念のための二重ガード）。
    if (compressing) return;

    // 仮査定申請の最低本数（goNextでのチェックをすり抜けた場合の保険）。
    if (course === "provisional") {
      const message = checkMinimumQuantity();
      if (message) {
        setStep(1);
        setQuantityError(message);
        trackEvent("generate_lead_error", {
          form_name: "application",
          error_type: "validation",
        });
        return;
      }
    }

    // トークンがまだ取得できていない（ウィジェットの確認が終わっていない）場合は、
    // 送信せずにその旨を伝える。ボタン側も無効化しているが、保険として二重にチェックする。
    if (!turnstileReady) {
      setStatus("error");
      setErrorMessage(TURNSTILE_PENDING_MESSAGE);
      return;
    }

    isSubmittingRef.current = true;
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.target);

    try {
      let res;
      try {
        res = await fetch("/api/application", {
          method: "POST",
          body: formData,
        });
      } catch {
        // fetch自体が失敗（オフライン等）。レスポンスを受け取れていない。
        setStatus("error");
        setErrorMessage("通信エラーが発生しました。電波の良い場所で再度お試しください。");
        trackEvent("generate_lead_error", {
          form_name: "application",
          error_type: "network",
        });
        return;
      }

      // Vercelの413 (リクエストボディが大きすぎる場合) はJSONではないため、
      // res.json()を試みる前にステータスで判定する。
      if (res.status === 413) {
        setStatus("error");
        setErrorMessage(
          "画像の合計サイズが大きすぎます。枚数を減らして再度お試しください。"
        );
        trackEvent("generate_lead_error", {
          form_name: "application",
          error_type: "too_large",
        });
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch {
        // JSONでない予期しないレスポンス（プラットフォーム側のエラーページ等）。
        setStatus("error");
        setErrorMessage("");
        trackEvent("generate_lead_error", {
          form_name: "application",
          error_type: classifyError(res.status, null),
        });
        return;
      }

      if (data.success) {
        setStatus("sent");
        trackEvent("generate_lead", {
          form_name: "application",
          course,
          item_count: computeItemCount(formData, course),
        });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "");
        trackEvent("generate_lead_error", {
          form_name: "application",
          error_type: classifyError(res.status, data.error),
        });
      }
    } finally {
      isSubmittingRef.current = false;
      // 使用済み・期限切れの可能性があるトークンを必ず捨てて、次回分を取り直す。
      resetTurnstile();
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
      <ReassurancePoints />
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
          {course === "provisional" ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-[#26221e]">
                買取点数の内訳
                <span className="text-[#b3242b]"> （必須）</span>
              </span>
              <span className="text-xs text-[#726b5e]">
                アダルトDVD・ブルーレイ・イメージDVD/BD（「その他」にご記入ください）は合計5本以上、コミックのみの場合は10冊以上からお申し込みいただけます。わかる範囲で内訳をご記入ください。
              </span>
              <div className="grid grid-cols-2 gap-3">
                {QUANTITY_FIELDS.map((field) => (
                  <label key={field.name} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-[#5c554d] min-h-[2rem] flex items-end">
                      {field.label}
                    </span>
                    <span className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="numeric"
                        name={field.name}
                        min={0}
                        onChange={() => setQuantityError("")}
                        className={`${inputCls} flex-1 min-w-0`}
                      />
                      <span className="text-xs text-[#726b5e] shrink-0">
                        {field.unit}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <span className="text-xs text-[#726b5e]">
                本人確認書類は申込み時には不要です。仮査定にご納得いただいた後、「発送確定フォーム」で身分証明書の写真のみご提出いただきます（顔写真は不要です）。
              </span>
            </div>
          ) : (
            <Field
              label="買取希望商品の本数"
              hint="アダルトDVD・ブルーレイは5本以上から買取可能です。コミックのみ（10冊以上）のお申し込みは、仮査定申請をご利用ください。"
              required
            >
              <input
                type="number"
                inputMode="numeric"
                name="quantity"
                min={5}
                required
                className={inputCls}
              />
            </Field>
          )}

          {course === "speed" && (
            <div className="flex flex-col gap-5 border-t border-[#ece6dc] pt-5">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-[#26221e]">
                  本人確認書類
                </h4>
                <p className="text-xs text-[#726b5e] leading-relaxed">
                  古物営業法に基づき、ご本人様の顔写真と身分証明書の写真をご提出いただきます（必須）。
                </p>
              </div>
              <Field
                label="ご本人様の顔写真"
                required
                hint="本人確認のため、正面を向いたご自身の写真をアップロードしてください。"
              >
                <input
                  type="file"
                  name="selfie_photo"
                  accept="image/jpeg,image/png"
                  required
                  onChange={(e) => handleSingleFileChange(e, setSelfiePhoto)}
                  className={inputCls}
                />
              </Field>
              {selfiePhoto && (
                <p className="text-xs text-[#5c554d] -mt-3">
                  {selfiePhoto.name}（{(selfiePhoto.size / 1024 / 1024).toFixed(1)}MB）
                </p>
              )}
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
            </div>
          )}

          {course === "provisional" && (
            <>
              <Field
                label="買取商品の内容"
                required
                hint="レーベル名・タイトルなど、わかる範囲でご記入ください。タイトルより、レーベル名・品番の方が査定がスムーズです。"
              >
                <textarea
                  name="product_details"
                  rows={4}
                  required
                  placeholder="例: エスワン 3本、デマンド 5本、品番不明1本 など（レーベル名+本数、わかれば品番もご記入ください）"
                  className={inputCls}
                />
              </Field>
              <Field
                label="商品の画像"
                required
                hint="査定希望商品はすべて、背表紙が見える写真をアップロードしてください（品番確認のため）。画像がない商品は最低価格での査定となります。（jpg/png形式、最大20枚まで。選択した画像は自動的に圧縮してから送信します。）"
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
              {imagesError && (
                <p className="text-xs text-[#b3242b] -mt-3">{imagesError}</p>
              )}
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
              高買屋では5箱まで無料で発送用の段ボールをお送りいたします。ご自身でご用意いただくと査定額に＋{boxBonus.amount}上乗せいたします（ディスクのみ・レンタル品等を除く{boxBonusMinCount}点以上の場合。セット商品は点数に関わらず1点としてカウントします）。
            </p>
            <select name="box_option" className={inputCls} defaultValue="">
              <option value="" disabled>
                選択してください
              </option>
              <option value="段ボールが必要（無料）">
                段ボールが必要（無料）
              </option>
              <option value={`自分で用意する（+${boxBonus.amount}・ディスクのみ・レンタル品等を除く${boxBonusMinCount}点以上の場合）`}>
                {`自分で用意する（+${boxBonus.amount}・ディスクのみ・レンタル品等を除く${boxBonusMinCount}点以上の場合）`}
              </option>
            </select>
          </div>

          {course === "speed" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold text-[#26221e]">
                お支払い方法
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
                      value={paymentLabels.bank}
                      required
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
                    alt="PayPay"
                    width={96}
                    height={96}
                    className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-lg"
                  />
                  <span className="flex items-start gap-2 flex-1">
                    <input
                      type="radio"
                      name="payment_method"
                      value={paymentLabels.paypay}
                      required
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
          )}
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
            {course === "provisional" ? (
              <>
                <SummaryRow label="DVD本数" value={summary.dvd_count} />
                <SummaryRow label="ブルーレイ本数" value={summary.bd_count} />
                <SummaryRow label="コミック冊数" value={summary.comic_count} />
                <SummaryRow label="その他（点数）" value={summary.other_count} />
              </>
            ) : (
              <SummaryRow label="買取希望商品の本数" value={summary.quantity} />
            )}
            {course === "speed" && (
              <>
                <SummaryRow
                  label="ご本人様の顔写真"
                  value={selfiePhoto ? selfiePhoto.name : ""}
                />
                <SummaryRow
                  label="身分証明書の写真"
                  value={idPhoto ? idPhoto.name : ""}
                />
              </>
            )}
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
            {course === "speed" && (
              <>
                <SummaryRow label="お支払い方法" value={summary.payment_method} />
                <SummaryRow
                  label="PayPay受け取り用QRコード"
                  value={paypayQrPhoto ? paypayQrPhoto.name : ""}
                />
              </>
            )}
          </div>

          {course === "speed" && (
            <label className="flex items-start gap-2 text-xs text-[#5c554d]">
              <input type="checkbox" required className="mt-0.5" />
              発送前であればキャンセル可能ですが、商品発送後はキャンセルできないことに同意します。
            </label>
          )}
          <label className="flex items-start gap-2 text-xs text-[#5c554d]">
            <input type="checkbox" required className="mt-0.5" />
            利用規約・プライバシーポリシーに同意の上、この内容で申し込みます。
          </label>
        </div>

        {/*
          他のステップ用div（className="hidden" = display:none）の中には置かない。
          Turnstileはdisplay:noneの間はバックグラウンドでの検証・reset()後の
          再検証が止まってしまうため、ステップに関わらず常に表示状態で保持する。
        */}
        <Turnstile
          ref={turnstileRef}
          onVerify={() => setTurnstileReady(true)}
          onExpire={() => setTurnstileReady(false)}
          onError={() => setTurnstileReady(false)}
        />

        {compressing && (
          <p className="text-xs text-[#726b5e] flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 border-2 border-[#b3242b] border-t-transparent rounded-full animate-spin" />
            画像を処理しています…
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-[#b3242b]">
            {errorMessage ||
              "送信に失敗しました。お手数ですがお電話(022-343-1588)でもお問い合わせいただけます。"}
          </p>
        )}

        {step === 1 && quantityError && (
          <p
            ref={quantityErrorRef}
            role="alert"
            className="text-xs text-[#b3242b] font-semibold"
          >
            {quantityError}
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
              key="next"
              type="button"
              onClick={goNext}
              disabled={compressing}
              className="flex-1 bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full hover:bg-[#8f1c22] disabled:opacity-60"
            >
              {compressing ? "画像を処理しています…" : "次へ"}
            </button>
          ) : (
            <button
              key="submit"
              type="submit"
              disabled={status === "sending" || compressing || !turnstileReady}
              className="flex-1 bg-[#b3242b] text-white text-sm font-bold py-4 rounded-full hover:bg-[#8f1c22] disabled:opacity-60"
            >
              {status === "sending"
                ? "送信中…"
                : !turnstileReady
                ? "確認中…"
                : "この内容で申し込む"}
            </button>
          )}
        </div>
      </form>
    </div>
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
