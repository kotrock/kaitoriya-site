import Link from "next/link";
import { company, footerLinks } from "@/data/site";

export default function Footer() {
  return (
    <footer className="w-full px-6 md:px-8 py-12 pb-8 bg-[#1a1613] text-[#cfc6bc]">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <div className="flex justify-between flex-wrap gap-6">
          <div>
            <div className="text-base font-extrabold text-white">
              {company.name}
            </div>
            <div className="text-xs mt-1.5 leading-relaxed">
              {company.legalName}
              <br />
              {company.postalCode} {company.address}
              <br />
              TEL：{company.phone}（受付 {company.phoneHours}）
            </div>
          </div>
          <div className="flex gap-8 text-xs flex-wrap">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="h-px bg-white/10" />
        <div className="text-[11px] text-[#8f887d] leading-relaxed">
          古物営業法に基づく表記　{company.antiqueLicense}
          <br />
          Copyright © アダルトDVD高価買取の{company.name} All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
