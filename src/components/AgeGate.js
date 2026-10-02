"use client";

import { useEffect, useState } from "react";
import { company } from "@/data/site";

const STORAGE_KEY = "kaitoriya_age_verified";
const VALID_DURATION_MS = 24 * 60 * 60 * 1000; // 24時間
const SAFE_EXIT_URL = "https://www.google.com";

export default function AgeGate() {
  // Start hidden on the server render; only show once we've checked
  // the viewer's own browser storage, so returning visitors aren't
  // re-asked on every page load.
  const [status, setStatus] = useState("checking"); // checking | ask | verified

  useEffect(() => {
    // One-time read of client-only storage to decide whether to show the
    // gate; this must run after mount since localStorage isn't available
    // during server rendering, so a single setState here is intentional.
    let next = "ask";
    try {
      const verifiedAt = Number(window.localStorage.getItem(STORAGE_KEY));
      if (verifiedAt && Date.now() - verifiedAt < VALID_DURATION_MS) {
        next = "verified";
      }
    } catch {
      // Private browsing / blocked storage: fall through and ask every time.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(next);
  }, []);

  function verify() {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Ignore — worst case we ask again next visit.
    }
    setStatus("verified");
  }

  function leave() {
    window.location.href = SAFE_EXIT_URL;
  }

  if (status === "checking" || status === "verified") return null;

  return (
    <div className="fixed inset-0 z-100 bg-[#26221e]/95 flex items-center justify-center p-6">
      <div className="w-full max-w-[460px] bg-white rounded-2xl p-10 text-center flex flex-col gap-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#fbeceb] flex items-center justify-center mx-auto text-[#b3242b] font-bold">
          18+
        </div>
        <h2 className="text-xl font-bold text-[#26221e] leading-relaxed">
          当サイトはアダルトコンテンツ（成人向け商品）を取り扱っています
        </h2>
        <p className="text-sm leading-loose text-[#5c554d]">
          あなたは18歳以上ですか？
          <br />
          18歳未満の方のアクセスはご遠慮いただいております。
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={leave}
            className="flex-1 py-4 rounded-full border border-[#d8d2c8] bg-white text-[#5c554d] text-sm font-bold cursor-pointer hover:bg-[#f7f3ee]"
          >
            いいえ
          </button>
          <button
            onClick={verify}
            className="flex-1 py-4 rounded-full border-none bg-[#b3242b] text-white text-sm font-bold cursor-pointer hover:bg-[#8f1c22]"
          >
            はい、18歳以上です
          </button>
        </div>
        <p className="text-[11px] text-[#726b5e]">
          古物営業法に基づく表記　{company.antiqueLicense}
        </p>
      </div>
    </div>
  );
}
