type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  id?: string;
};

export default function SectionHeading({ eyebrow, title, subtitle, id }: SectionHeadingProps) {
  return (
    <div id={id} className="text-center max-w-4xl mx-auto">
      {eyebrow ? (
        <div className="text-sm uppercase tracking-widest text-blue-600 font-semibold mb-4">{eyebrow}</div>
      ) : null}
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-slate-900">{title}</h2>
      {subtitle ? (
        <p className="text-xl text-slate-600 leading-relaxed">{subtitle}</p>
      ) : null}
    </div>
  );
}


