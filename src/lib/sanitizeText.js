// メール本文に差し込むお客様の入力値から、改行・制御文字を取り除く。
// 攻撃者が改行入りの値（例:お名前欄）を送信して、メール本文に偽の追加行を
// 紛れ込ませる（テンプレート偽装・なりすまし）のを防ぐための簡易サニタイズ。
export function sanitizeForEmail(value) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}
