import type {
  DailyGainer,
  MarketEvent,
  PortfolioAnalysis,
  PortfolioPosition,
  StockScore,
  StockScoreInput,
  WatchlistItem
} from "../types/domain";
import { clampScore, round } from "../lib/format";

function categoryFor(score: number): StockScore["category"] {
  if (score >= 8) return "priority watch";
  if (score >= 6.5) return "watch";
  if (score >= 5) return "neutral";
  return "low priority";
}

function buildRationale(input: StockScoreInput, opportunityScore: number): string {
  if (opportunityScore >= 8) return "催化、基本面、动量和逻辑清洁度同时在线，适合优先跟踪。";
  if (input.valuationRisk >= 8) return "机会分被高估值风险压制，适合等回撤或新验证。";
  if (input.catalystScore >= 8 && input.momentumScore >= 8) return "催化和动量强，但仍要确认是否已经透支。";
  if (input.cleanlinessScore < 6) return "逻辑不够干净，容易变成情绪交易。";
  return "机会可观察，但需要更强催化或更好价格。";
}

function calculateOpportunityScore(input: StockScoreInput): StockScore {
  const opportunityScore = round(
    input.catalystScore * 0.3 +
      input.fundamentalsScore * 0.25 +
      input.momentumScore * 0.25 +
      input.cleanlinessScore * 0.2 -
      input.valuationRisk * 0.15
  );

  return {
    ...input,
    opportunityScore,
    category: categoryFor(opportunityScore),
    rationale: buildRationale(input, opportunityScore)
  };
}

function average(values: number[]): number {
  return values.length === 0 ? 5 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function recentEventScore(events: MarketEvent[]): number {
  const event = [...events].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!event) return 5;

  const typeBoost = event.eventType === "earnings" || event.eventType === "guidance" ? 2 : event.eventType === "sector_rotation" ? 1 : 0;
  const impactBoost = event.impact === "bullish" ? 1 : event.impact === "bearish" ? -2 : 0;
  return clampScore(event.confidence + typeBoost + impactBoost);
}

function valuationRiskFor(ticker: string, themeText: string, momentumScore: number): number {
  const highMultipleTickers = new Set(["AVGO", "ANET", "VRT", "MRVL", "ETN", "AMD"]);
  const turnaroundTickers = new Set(["INTC", "NOK", "LITE", "COHR"]);
  let risk = 5;

  if (highMultipleTickers.has(ticker)) risk += 2;
  if (turnaroundTickers.has(ticker)) risk += 1;
  if (themeText.includes("ai") && momentumScore >= 8) risk += 1;

  return clampScore(risk);
}

function fundamentalsFor(ticker: string, themeText: string): number {
  const qualityTickers = new Set(["GOOGL", "AMZN", "AVGO", "TSM", "ANET", "ETN", "VRT"]);
  const cyclicalTickers = new Set(["MU", "STX", "WDC", "NXPI"]);
  const turnaroundTickers = new Set(["INTC", "NOK", "COHR", "LITE"]);

  if (qualityTickers.has(ticker)) return 8;
  if (cyclicalTickers.has(ticker)) return themeText.includes("recovery") || themeText.includes("storage") ? 7 : 6;
  if (turnaroundTickers.has(ticker)) return 5;
  return 6;
}

function cleanScoreFor(
  watchlistItem: WatchlistItem | undefined,
  position: PortfolioPosition | undefined,
  gainers: DailyGainer[]
): number {
  if (watchlistItem) return watchlistItem.cleanlinessScore;

  const themeText = `${position?.themeTags.join(" ") ?? ""} ${gainers.map((gainer) => gainer.theme).join(" ")}`.toLowerCase();
  if (themeText.includes("power") || themeText.includes("foundry") || themeText.includes("quality")) return 8;
  if (themeText.includes("turnaround")) return 5;
  return 6;
}

export function scoreUniverse(input: {
  portfolio: PortfolioPosition[];
  watchlist: WatchlistItem[];
  events: MarketEvent[];
  gainers: DailyGainer[];
  portfolioAnalysis: PortfolioAnalysis;
}): StockScore[] {
  const tickers = new Set<string>();
  for (const item of input.portfolio) tickers.add(item.ticker.toUpperCase());
  for (const item of input.watchlist) tickers.add(item.ticker.toUpperCase());
  for (const item of input.events) tickers.add(item.ticker.toUpperCase());
  for (const item of input.gainers) tickers.add(item.ticker.toUpperCase());

  return [...tickers]
    .map((ticker) => {
      const position = input.portfolio.find((item) => item.ticker.toUpperCase() === ticker);
      const analyzedPosition = input.portfolioAnalysis.positions.find((item) => item.ticker.toUpperCase() === ticker);
      const watchlistItem = input.watchlist.find((item) => item.ticker.toUpperCase() === ticker);
      const tickerEvents = input.events.filter((item) => item.ticker.toUpperCase() === ticker);
      const tickerGainers = input.gainers.filter((item) => item.ticker.toUpperCase() === ticker);
      const themeText = [position?.themeTags.join(" "), watchlistItem?.theme, tickerGainers.map((item) => item.theme).join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const catalystScore = clampScore(
        average([
          recentEventScore(tickerEvents),
          tickerGainers.length > 0 ? Math.min(10, 5 + Math.max(...tickerGainers.map((item) => item.gainPercent)) / 2) : 5
        ])
      );
      const momentumScore = clampScore(
        average([
          watchlistItem?.momentumScore ?? 5,
          tickerGainers.length > 0 ? Math.min(10, 4 + Math.max(...tickerGainers.map((item) => item.gainPercent)) / 1.5) : 5,
          analyzedPosition && analyzedPosition.unrealizedPnLPercent > 10 ? 7 : 5
        ])
      );
      const cleanlinessScore = cleanScoreFor(watchlistItem, position, tickerGainers);
      const fundamentalsScore = fundamentalsFor(ticker, themeText);
      const valuationRisk = valuationRiskFor(ticker, themeText, momentumScore);
      const concentrationRisk = clampScore(analyzedPosition ? analyzedPosition.portfolioWeight / 2 : 3);

      return calculateOpportunityScore({
        ticker,
        companyName: watchlistItem?.companyName ?? position?.companyName,
        catalystScore,
        fundamentalsScore,
        momentumScore,
        valuationRisk,
        concentrationRisk,
        cleanlinessScore
      });
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}
