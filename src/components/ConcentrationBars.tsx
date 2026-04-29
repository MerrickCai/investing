import type { ConcentrationItem } from "../types/domain";
import { formatPercent } from "../lib/format";

interface ConcentrationBarsProps {
  title: string;
  items: ConcentrationItem[];
}

export function ConcentrationBars({ title, items }: ConcentrationBarsProps) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <h4>{title}</h4>
        <span>{items.length} 组</span>
      </div>
      <div className="bar-list">
        {items.slice(0, 8).map((item) => (
          <div className="bar-row" key={item.name}>
            <div className="bar-meta">
              <span>{item.name}</span>
              <strong>{formatPercent(item.weight)}</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${Math.min(100, item.weight)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
