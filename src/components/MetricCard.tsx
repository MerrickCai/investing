import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "neutral" | "positive" | "warning";
}

export function MetricCard({ detail, icon: Icon, label, tone = "neutral", value }: MetricCardProps) {
  return (
    <article className={`metric metric-${tone}`}>
      <div className="metric-topline">
        <span>{label}</span>
        <Icon aria-hidden size={18} strokeWidth={2.2} />
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
