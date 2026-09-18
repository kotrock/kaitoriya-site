import PageHero from "@/components/PageHero";

export const metadata = {
  title: "プライバシーポリシー | アダルトDVD高価買取の高買屋",
};

const sections = [
  {
    title: "個人情報保護法について",
    body: "お客様の個人情報は、買取に関する本人確認・ご連絡業務のほか、当社および関連企業の営業情報のご案内に使用させていただく場合がございます。",
  },
  {
    title: "個人情報の第三者への開示・提供について",
    list: [
      "本人からの開示請求があった場合（本人確認の上）",
      "裁判所や警察等、公的機関からの要請があった場合",
      "法令に特別の規定がある場合",
      "生命・身体・財産に対する損害のおそれがあり、本人の同意を得ることが困難な場合",
      "法令に違反する行為から当社の権利・財産・サービスを保護する必要があり、本人の同意を得ることが困難な場合",
    ],
    intro: "当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません。",
  },
  {
    title: "個人情報の安全性について",
    body: "個人情報は厳重に管理し、紛失・誤用・改ざん・外部からの不正アクセスを防止するためのセキュリティ対策を実施しております。従業員には個人情報の適正な取り扱いに関する誓約書を提出させています。",
  },
  {
    title: "個人情報の訂正・削除について",
    body: "個人情報の訂正・削除をご希望の場合は、当社までご連絡ください。ただし、古物営業法で定める項目については、法令により3年間の保管が義務付けられております。",
  },
  {
    title: "Cookieについて",
    body: "コメント投稿時に、お名前・メールアドレス・サイト情報をCookieに保存できます（1年間保持）。ログイン時は一時的なCookieで判定を行い、ログイン情報は2日間（「ログイン状態を保存する」を選択した場合は2週間）、表示オプションの選択は1年間保持されます。",
  },
  {
    title: "第三者の提供する広告配信サービスについて",
    body: "当社は、Google・Yahoo!等の広告配信サービスを利用しており、これらのサービスはCookieを利用して、お客様の訪問履歴や行動履歴を取得しています。お客様は各社が提供するオプトアウト手段により、これらの情報利用を停止することができます。",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="プライバシーポリシー" />
      <section className="w-full px-6 md:px-8 py-14">
        <div className="max-w-[700px] mx-auto flex flex-col gap-6">
          {sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-[#26221e]">
                {s.title}
              </h2>
              {s.intro && (
                <p className="text-sm leading-loose text-[#5c554d]">
                  {s.intro}
                </p>
              )}
              {s.body && (
                <p className="text-sm leading-loose text-[#5c554d]">
                  {s.body}
                </p>
              )}
              {s.list && (
                <ul className="list-disc list-inside text-sm leading-loose text-[#5c554d] flex flex-col gap-1">
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
