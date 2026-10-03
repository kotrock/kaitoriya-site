import { campaign } from "@/data/site";

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
