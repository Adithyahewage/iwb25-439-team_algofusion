import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  items?: string[];
  className?: string;
};

export default function FeatureCard({ title, description, icon, items, className }: FeatureCardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200/60 p-8 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 group${className ? ` ${className}` : ""}`}>
      {icon ? (
        <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100 text-blue-600 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-600 leading-relaxed mb-0">{description}</p>
      {items && items.length > 0 ? (
        <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-slate-700 text-left">
          {items.map((item) => (
            <li key={item} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}


