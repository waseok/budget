import type { ReactNode } from "react";

type SummaryCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone?: "blue" | "orange" | "green" | "pink";
};

const toneClasses = {
  blue: { icon: "bg-blue-50 text-blue-600", label: "text-blue-600" },
  orange: { icon: "bg-orange-50 text-orange-500", label: "text-orange-500" },
  green: { icon: "bg-emerald-50 text-emerald-600", label: "text-emerald-600" },
  pink: { icon: "bg-pink-50 text-pink-600", label: "text-pink-600" },
};

export function SummaryCard({
  label,
  value,
  helper,
  icon,
  tone = "blue",
}: SummaryCardProps) {
  const classes = toneClasses[tone];
  return (
    <article className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${classes.icon}`}>
          {icon}
        </div>
        <p className={`text-xs font-semibold uppercase tracking-wide font-headline ${classes.label}`}>{label}</p>
      </div>
      <h3 className="text-xl font-bold text-slate-900 font-headline m-0">{value}</h3>
      <p className="text-xs text-slate-400 mt-1 m-0">{helper}</p>
    </article>
  );
}
