import { Flame, Gauge, Sparkles } from "lucide-react";
import type { DailyGainerAnalysis } from "../types/domain";
import { formatPercent } from "../lib/format";

interface GainersGridProps {
  gainers: DailyGainerAnalysis[];
}

function riskClass(risk: string): string {
  if (risk === "high") return "danger";
  if (risk === "medium") return "warning";
  return "positive";
}

export function GainersGrid({ gainers }: GainersGridProps) {
  return (
    <div className="tile-grid">
      {gainers.map((item) => (
        <article className="tile" key={`${item.date}-${item.ticker}`}>
          <header>
            <div>
              <span className="ticker">{item.ticker}</span>
              <small>{item.date} · {item.theme}</small>
            </div>
            <strong className="gain">+{formatPercent(item.gainPercent)}</strong>
          </header>
          <div className="meta-row">
            <span className="tag">
              <Sparkles aria-hidden size={13} />
              {item.catalystType}
            </span>
            <span className={`tag ${riskClass(item.chaseRisk)}`}>
              <Flame aria-hidden size={13} />
              chase {item.chaseRisk}
            </span>
            <span className="tag">
              <Gauge aria-hidden size={13} />
              {item.cleanLogic ? "cleanLogic" : "needs proof"}
            </span>
            <span className="tag">{item.action}</span>
            {item.followUpNeeded ? <span className="tag warning">follow up</span> : null}
          </div>
          <p>{item.reason}</p>
        </article>
      ))}
    </div>
  );
}
