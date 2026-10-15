"use client";

// 追加ライブラリなしのCanvas APIのみで画像を圧縮・リサイズするユーティリティ。
//
// EXIFの回転について: createImageBitmapの { imageOrientation: "from-image" } を使うことで、
// デコード時点でEXIFの回転情報が反映された状態のビットマップが得られるため、手動での
// EXIFバイナリ解析は行わない（モダンブラウザ全般で対応。iOS Safariは15.4以降で対応）。
//
// HEIC等、ブラウザがデコードできない形式はcreateImageBitmapが例外を投げるため、
// UnsupportedImageErrorとして呼び出し側に伝える。

export class UnsupportedImageError extends Error {}

const OUTPUT_MIME = "image/jpeg";

async function decodeImage(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new UnsupportedImageError(
      `「${file.name}」はこの形式を処理できませんでした。JPEGまたはPNG形式で保存し直してから再度お試しください。`
    );
  }
}

function drawToCanvas(bitmap, maxDimension) {
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("画像の変換に失敗しました。"))),
      OUTPUT_MIME,
      quality
    );
  });
}

async function compressOnce(bitmap, originalName, maxDimension, quality) {
  const canvas = drawToCanvas(bitmap, maxDimension);
  const blob = await canvasToBlob(canvas, quality);
  const newName = originalName.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: OUTPUT_MIME, lastModified: Date.now() });
}

// 身分証明書・顔写真など、判読性を優先したい画像向けの段階。
// 他の画像より高い品質・解像度の下限を保つ。
const PRIORITY_STEPS = [
  { maxDimension: 1800, quality: 0.85 },
  { maxDimension: 1800, quality: 0.75 },
  { maxDimension: 1600, quality: 0.7 },
  { maxDimension: 1400, quality: 0.65 },
  { maxDimension: 1200, quality: 0.6 },
];

// 商品画像など、枚数が多くなりうる画像向けの段階。目標サイズに収まるまで
// 優先画像より踏み込んで解像度・品質を下げる。
const STANDARD_STEPS = [
  { maxDimension: 1800, quality: 0.8 },
  { maxDimension: 1600, quality: 0.7 },
  { maxDimension: 1400, quality: 0.6 },
  { maxDimension: 1100, quality: 0.5 },
  { maxDimension: 900, quality: 0.4 },
];

// 1枚の画像を、targetSize以下になるまで段階的に圧縮する。
// jpg/png以外（HEIC等）はUnsupportedImageErrorを投げる。
// targetSizeを下回れなくても、最後の段階の結果をそのまま返す
// （judgeabilityの下限を優先するため、無理に劣化させ続けない）。
export async function compressImageToTarget(file, { targetSize, priority = false } = {}) {
  if (!file || !(file instanceof File)) return file;

  const bitmap = await decodeImage(file);
  try {
    const steps = priority ? PRIORITY_STEPS : STANDARD_STEPS;
    let result = null;
    for (const step of steps) {
      result = await compressOnce(bitmap, file.name, step.maxDimension, step.quality);
      if (!targetSize || result.size <= targetSize) break;
    }
    // 圧縮後の方が大きくなってしまった場合（元々小さい画像等）は元のファイルを使う。
    return result && result.size < file.size ? result : file;
  } finally {
    bitmap.close?.();
  }
}

// 複数ファイルを、合計サイズ目標に向けて圧縮する。
// priorityがtrueの画像には大きめの個別予算を割り当て、残りをその他の画像で等分する。
export async function compressImagesToBudget(files, { totalBudget, priority = false }) {
  if (!files || files.length === 0) return [];
  const perFileTarget = priority
    ? Math.max(totalBudget / files.length, 900 * 1024)
    : totalBudget / files.length;

  const results = [];
  for (const file of files) {
    results.push(
      await compressImageToTarget(file, { targetSize: perFileTarget, priority })
    );
  }
  return results;
}
