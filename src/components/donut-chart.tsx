type DonutChartProps = {
  value: number;
  centerTitle: string;
  centerSubtitle?: string;
  tone?: "blue" | "orange" | "green";
};

const toneMap = {
  blue: { stroke: "#1d4ed8", glow: "rgba(29, 78, 216, 0.18)" },
  orange: { stroke: "#ea580c", glow: "rgba(234, 88, 12, 0.16)" },
  green: { stroke: "#0f766e", glow: "rgba(15, 118, 110, 0.16)" },
};

export function DonutChart({
  value,
  centerTitle,
  centerSubtitle,
  tone = "blue",
}: DonutChartProps) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference - (normalized / 100) * circumference;
  const palette = toneMap[tone];

  return (
    <div className="donut-card">
      <div className="donut-wrap">
        <svg viewBox="0 0 120 120" className="donut-svg" aria-hidden="true">
          <circle cx="60" cy="60" r={radius} className="donut-track" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="donut-progress"
            style={{
              stroke: palette.stroke,
              strokeDasharray: circumference,
              strokeDashoffset: dash,
            }}
          />
        </svg>
        <div className="donut-center">
          <strong>{Math.round(normalized)}%</strong>
          {centerSubtitle ? <span className="donut-subtitle">{centerSubtitle}</span> : null}
        </div>
      </div>
      <p className="donut-name">{centerTitle}</p>
    </div>
  );
}
