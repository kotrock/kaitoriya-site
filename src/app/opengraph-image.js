import { ImageResponse } from "next/og";
import { join } from "node:path";
import sharp from "sharp";

export const alt = "高買屋 | アダルトDVD・ブルーレイ高価買取";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "高買屋";
const TAGLINE = "アダルトDVD・ブルーレイ高価買取";
const BADGE = "定価の最大50%買取";

async function loadGoogleFont(weight, text) {
  const url = `https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@${weight}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const match = css.match(
    /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/
  );
  if (match) {
    const res = await fetch(match[1]);
    if (res.ok) return await res.arrayBuffer();
  }
  throw new Error(`Zen Kaku Gothic New (weight ${weight}) の読み込みに失敗しました`);
}

const [fontBold, fontBlack, logoBuffer] = await Promise.all([
  loadGoogleFont(700, TAGLINE + BADGE),
  loadGoogleFont(900, TITLE),
  sharp(join(process.cwd(), "public", "favicon-source-v2.png"))
    .resize(240, 240)
    .png()
    .toBuffer(),
]);

const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(180deg, #201a17 0%, #2c231e 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUrl}
            alt=""
            width={120}
            height={120}
            style={{ borderRadius: "50%" }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Zen Kaku Gothic New",
              fontWeight: 900,
              fontSize: 80,
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            {TITLE}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Zen Kaku Gothic New",
            fontWeight: 700,
            fontSize: 24,
            color: "#cfc6bc",
            marginTop: 24,
            marginLeft: 160,
          }}
        >
          {TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 80,
            bottom: 80,
            alignItems: "center",
            background: "#b3242b",
            color: "#ffffff",
            fontFamily: "Zen Kaku Gothic New",
            fontWeight: 700,
            fontSize: 32,
            padding: "20px 40px",
            borderRadius: 999,
          }}
        >
          {BADGE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zen Kaku Gothic New", data: fontBold, weight: 700, style: "normal" },
        { name: "Zen Kaku Gothic New", data: fontBlack, weight: 900, style: "normal" },
      ],
    }
  );
}
