import type { ReactNode } from "react";

type SummaryCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone?: "blue" | "orange" | "green" | "pink";
};

export function SummaryCard({
  label,
  value,
  helper,
  icon,
  tone = "blue",
}: SummaryCardProps) {
  return (
    <article className={`summary-card tone-${tone}`}>
      <div className="summary-head">
        <div className="summary-icon">{icon}</div>
        <p className="eyebrow">{label}</p>
      </div>
      <h3>{value}</h3>
      <p className="muted">{helper}</p>
    </article>
  );
}
