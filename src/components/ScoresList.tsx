import { Crown } from "lucide-react";
import type { StockScore } from "../types/domain";

interface ScoresListProps {
  scores: StockScore[];
}

export function ScoresList({ scores }: ScoresListProps) {
  return (
    <div className="score-list">
      {scores.map((score, index) => (
        <article className="score-row" key={score.ticker}>
          <span className="rank">{index === 0 ? <Crown aria-hidden size={17} /> : index + 1}</span>
          <div>
            <strong className="ticker">{score.ticker}</strong>
            <div>{score.companyName ?? ""}</div>
            <span className="tag">{score.category}</span>
          </div>
          <div>
            <div className="score-headline">
              <span>Opportunity</span>
              <strong className="score-value">{score.opportunityScore.toFixed(2)}</strong>
            </div>
            <div className="score-meter" aria-label={`${score.ticker} opportunity score`}>
              <span style={{ width: `${Math.min(100, Math.max(0, score.opportunityScore * 10))}%` }} />
            </div>
            <div className="score-breakdown">
              <span>催化 {score.catalystScore}</span>
              <span>基本面 {score.fundamentalsScore}</span>
              <span>动量 {score.momentumScore}</span>
              <span>估值风险 {score.valuationRisk}</span>
              <span>清洁度 {score.cleanlinessScore}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
