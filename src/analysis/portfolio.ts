import type {
  ConcentrationItem,
  PortfolioAnalysis,
  PortfolioPosition,
  PositionAnalysis
} from "../types/domain";
import { round } from "../lib/format";

function classifyPosition(position: PortfolioPosition, pnlPercent: number, weight: number): string {
  const themeText = position.themeTags.join(", ").toLowerCase();

  if (weight > 20) return "仓位过重，先看集中度，不把上涨当成加仓理由。";
  if (themeText.includes("ai") && pnlPercent > 15) return "AI 基建扩散交易有利润垫，继续验证基本面催化。";
  if (themeText.includes("turnaround")) return "反转预期驱动，需要持续确认公司改善，不适合无脑追高。";
  if (pnlPercent < -8) return "走势落后，检查原始买入理由是否失效。";
  if (pnlPercent > 20) return "涨幅已兑现一部分预期，适合检查是否需要降风险。";

  return "持仓逻辑仍可观察，重点看下一次事件验证。";
}

function classifyAction(pnlPercent: number, weight: number): PositionAnalysis["action"] {
  if (weight > 20 || pnlPercent > 25) return "trim";
  if (pnlPercent < -12) return "watch";
  return "hold";
}

function concentrationBy(
  positions: PositionAnalysis[],
  totalMarketValue: number,
  getNames: (position: PositionAnalysis) => string[]
): ConcentrationItem[] {
  const totals = new Map<string, number>();

  for (const position of positions) {
    for (const name of getNames(position)) {
      totals.set(name, (totals.get(name) ?? 0) + position.marketValue);
    }
  }

  return [...totals.entries()]
    .map(([name, value]) => ({
      name,
      value: round(value),
      weight: totalMarketValue > 0 ? round((value / totalMarketValue) * 100) : 0
    }))
    .sort((a, b) => b.weight - a.weight);
}

export function analyzePortfolio(portfolio: PortfolioPosition[]): PortfolioAnalysis {
  const totalCost = portfolio.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  const totalMarketValue = portfolio.reduce((sum, item) => sum + item.quantity * item.currentPrice, 0);

  const positions = portfolio
    .map((item) => {
      const costBasis = item.quantity * item.costPrice;
      const marketValue = item.quantity * item.currentPrice;
      const unrealizedPnL = marketValue - costBasis;
      const unrealizedPnLPercent = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;
      const portfolioWeight = totalMarketValue > 0 ? (marketValue / totalMarketValue) * 100 : 0;

      return {
        ...item,
        costBasis: round(costBasis),
        marketValue: round(marketValue),
        unrealizedPnL: round(unrealizedPnL),
        unrealizedPnLPercent: round(unrealizedPnLPercent),
        portfolioWeight: round(portfolioWeight),
        judgment: classifyPosition(item, unrealizedPnLPercent, portfolioWeight),
        action: classifyAction(unrealizedPnLPercent, portfolioWeight)
      };
    })
    .sort((a, b) => b.marketValue - a.marketValue);

  const totalUnrealizedPnL = totalMarketValue - totalCost;
  const sectorConcentration = concentrationBy(positions, totalMarketValue, (position) => [position.sector]);
  const themeConcentration = concentrationBy(positions, totalMarketValue, (position) => position.themeTags);

  return {
    positions,
    totalCost: round(totalCost),
    totalMarketValue: round(totalMarketValue),
    totalUnrealizedPnL: round(totalUnrealizedPnL),
    totalUnrealizedPnLPercent: totalCost > 0 ? round((totalUnrealizedPnL / totalCost) * 100) : 0,
    sectorConcentration,
    themeConcentration,
    singlePositionRisks: positions.filter((position) => position.portfolioWeight > 20),
    themeRisks: themeConcentration.filter((theme) => theme.weight > 50)
  };
}
