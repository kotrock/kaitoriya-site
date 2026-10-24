import { campaign, newBonusConditions, boxBonus } from "@/data/site";

// 現在時刻（日本時間基準）がキャンペーン期間内かどうかを判定する。
// サーバーコンポーネント内でリクエストごとに呼び出す想定のため、呼び出し側のページは
// 静的生成ではなく動的レンダリング（revalidateによるISR、またはforce-dynamic）にする必要がある。
// 静的生成のままだとビルド時点の日付で結果が固定されてしまう。
export function isCampaignActive(now = new Date()) {
  if (!campaign.active) return false;
  const start = new Date(`${campaign.startDate}T00:00:00+09:00`);
  const end = new Date(`${campaign.endDate}T23:59:59+09:00`);
  return now >= start && now <= end;
}

// 現在適用されるボーナス額（キャンペーン中はcampaignBonus、それ以外はnormalBonus）。
export function getCurrentBonus(now = new Date()) {
  return isCampaignActive(now) ? campaign.campaignBonus : campaign.normalBonus;
}

// 終了日を「11/2」のような短い月/日形式で返す。日本時間の日付表記として扱うため、
// Dateのタイムゾーン変換は使わずcampaign.endDate（YYYY-MM-DD）の文字列を直接分解する。
export function getCampaignEndDateShort() {
  const [, month, day] = campaign.endDate.split("-");
  return `${Number(month)}/${Number(day)}`;
}

// 初回特典の対象拡大（5本からのtier1追加）・段ボール特典の対象本数引き下げなど、
// 新しい特典条件の適用期間内かどうかを判定する。
export function isNewBonusConditionsActive(now = new Date()) {
  const start = new Date(`${newBonusConditions.startDate}T00:00:00+09:00`);
  const end = new Date(`${newBonusConditions.endDate}T23:59:59+09:00`);
  return now >= start && now <= end;
}

// 段ボール自前用意特典の対象本数（新条件適用期間中は5本以上、期間外は10本以上）。
export function getBoxBonusMinCount(now = new Date()) {
  return isNewBonusConditionsActive(now) ? boxBonus.newMinCount : boxBonus.oldMinCount;
}

// 新条件の終了日を「2026年12月31日」のような表記で返す。
export function getNewBonusConditionsEndDateLong() {
  const [y, m, d] = newBonusConditions.endDate.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}
