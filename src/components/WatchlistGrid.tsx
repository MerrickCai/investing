import { BadgeCheck, Gauge } from "lucide-react";
import type { WatchlistAnalysis } from "../types/domain";

interface WatchlistGridProps {
  items: WatchlistAnalysis[];
}

export function WatchlistGrid({ items }: WatchlistGridProps) {
  return (
    <div className="watch-grid">
      {items.map((item) => (
        <article className="watch-card" key={item.ticker}>
          <header>
            <div>
              <span className="ticker">{item.ticker}</span>
              <small>{item.companyName}</small>
            </div>
            <span className="tag">{item.theme}</span>
          </header>
          <div className="meta-row">
            <span className="tag">
              <BadgeCheck aria-hidden size={13} />
              clean {item.cleanlinessScore}/10
            </span>
            <span className="tag">
              <Gauge aria-hidden size={13} />
              momentum {item.momentumScore}/10
            </span>
            <span className="tag">{item.cleanLogic ? "cleanLogic" : "needs proof"}</span>
            <span className="tag">{item.action}</span>
          </div>
          <p>{item.reason}</p>
          <footer>
            <span>{item.risk}</span>
            <span>{item.lastReviewedAt}</span>
          </footer>
        </article>
      ))}
    </div>
  );
}
