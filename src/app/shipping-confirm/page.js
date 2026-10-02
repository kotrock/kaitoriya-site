import PageHero from "@/components/PageHero";
import ShippingConfirmForm from "@/components/ShippingConfirmForm";

export const metadata = {
  title: "発送確定フォーム | アダルトDVD高価買取の高買屋",
  description:
    "仮査定額にご納得いただいた方向けの発送確定フォームです。本人確認書類とお振込み先情報をご提出の上、商品をご発送ください。",
  alternates: {
    canonical: "/shipping-confirm",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ShippingConfirmPage() {
  return (
    <>
      <PageHero
        eyebrow="SHIPPING"
        title="発送確定フォーム"
        lead="仮査定額にご納得いただいた方は、こちらから本人確認書類とお振込み先情報をご提出の上、商品をご発送ください。ご提出時点でご成約となります。"
      />
      <section className="w-full px-6 md:px-8 py-14">
        <ShippingConfirmForm />
      </section>
    </>
  );
}
