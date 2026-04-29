import { CheckCircle2, ShieldAlert } from "lucide-react";
import type { PortfolioAnalysis } from "../types/domain";
import { formatCurrency, formatPercent } from "../lib/format";

interface PositionsTableProps {
  analysis: PortfolioAnalysis;
}

export function PositionsTable({ analysis }: PositionsTableProps) {
  const risks = [
    ...analysis.singlePositionRisks.map((item) => `${item.ticker} 单票仓位 ${formatPercent(item.portfolioWeight)}，超过 20%。`),
    ...analysis.themeRisks.map((item) => `${item.name} 主题占比 ${formatPercent(item.weight)}，超过 50%。`)
  ];

  return (
    <>
      <div className="risk-strip">
        {risks.length > 0 ? (
          risks.map((risk) => (
            <div className="risk-item" key={risk}>
              <ShieldAlert aria-hidden size={16} />
              {risk}
            </div>
          ))
        ) : (
          <div className="risk-item clean">
            <CheckCircle2 aria-hidden size={16} />
            集中度正常
          </div>
        )}
      </div>

      <div className="position-card-list">
        {analysis.positions.map((position) => (
          <article className="position-card" key={position.ticker}>
            <div>
              <strong>{position.ticker}</strong>
              <span>{position.companyName}</span>
            </div>
            <div className="position-card-value">
              <span>{formatCurrency(position.marketValue)}</span>
              <small>{formatPercent(position.portfolioWeight)}</small>
            </div>
            <p>{position.judgment}</p>
            <div className="meta-row">
              <span className="tag">{position.action}</span>
              <span className={position.unrealizedPnL >= 0 ? "tag positive" : "tag danger"}>
                {formatPercent(position.unrealizedPnLPercent)}
              </span>
              <span className="tag">{position.sector}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>股票</th>
              <th className="numeric">市值</th>
              <th className="numeric">仓位</th>
              <th className="numeric">浮盈亏</th>
              <th>板块</th>
              <th>动作</th>
            </tr>
          </thead>
          <tbody>
            {analysis.positions.map((position) => (
              <tr key={position.ticker}>
                <td>
                  <strong>{position.ticker}</strong>
                  <small>{position.companyName}</small>
                </td>
                <td className="numeric">{formatCurrency(position.marketValue)}</td>
                <td className="numeric">{formatPercent(position.portfolioWeight)}</td>
                <td className={`numeric ${position.unrealizedPnL >= 0 ? "positive" : "danger"}`}>
                  {formatCurrency(position.unrealizedPnL)}
                  <small>{formatPercent(position.unrealizedPnLPercent)}</small>
                </td>
                <td>
                  {position.sector}
                  <small>{position.themeTags.join(" / ")}</small>
                </td>
                <td>
                  <span className="tag">{position.action}</span>
                  <small>{position.judgment}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
