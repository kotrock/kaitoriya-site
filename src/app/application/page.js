import PageHero from "@/components/PageHero";
import ApplicationForm from "@/components/ApplicationForm";
import LineBanner from "@/components/LineBanner";

export const metadata = {
  title: "買取お申込みフォーム | アダルトDVD高価買取の高買屋",
  description: "アダルトDVD・ブルーレイの無料査定はこちらからお申し込みください。",
};

export default function ApplicationPage() {
  return (
    <>
      <PageHero
        eyebrow="APPLY"
        title="買取お申込みフォーム"
        lead="査定は何本でも無料です。まずはお気軽にお申し込みください。"
      />
      <section className="w-full px-6 md:px-8 pt-10">
        <div className="max-w-[700px] mx-auto">
          <LineBanner />
        </div>
      </section>
      <section className="w-full px-6 md:px-8 py-14">
        <ApplicationForm />
      </section>
    </>
  );
}
