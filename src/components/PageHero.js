export default function PageHero({ eyebrow, title, lead }) {
  return (
    <section className="w-full bg-gradient-to-b from-[#201a17] to-[#2c231e] text-white px-6 md:px-8 py-14">
      <div className="max-w-[800px] mx-auto text-center flex flex-col gap-3">
        {eyebrow && (
          <div className="text-[13px] font-bold tracking-wide text-[#e8a97a]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold">{title}</h1>
        {lead && (
          <p className="text-sm leading-loose text-[#cfc6bc]">{lead}</p>
        )}
      </div>
    </section>
  );
}
