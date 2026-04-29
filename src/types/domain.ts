export type EventType =
  | "earnings"
  | "guidance"
  | "analyst_upgrade"
  | "sector_rotation"
  | "macro"
  | "news"
  | "other";

export type EventImpact = "bullish" | "bearish" | "neutral";

export type ActionCategory =
  | "hold"
  | "trim"
  | "watch"
  | "avoid chase"
  | "consider entry on pullback";

export type ChaseRisk = "low" | "medium" | "high";

export type ScoreCategory = "priority watch" | "watch" | "neutral" | "low priority";

export interface PortfolioPosition {
  ticker: string;
  companyName: string;
  quantity: number;
  costPrice: number;
  currentPrice: number;
  sector: string;
  themeTags: string[];
}

export interface PositionAnalysis extends PortfolioPosition {
  costBasis: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  portfolioWeight: number;
  judgment: string;
  action: ActionCategory;
}

export interface ConcentrationItem {
  name: string;
  value: number;
  weight: number;
}

export interface PortfolioAnalysis {
  positions: PositionAnalysis[];
  totalCost: number;
  totalMarketValue: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPnLPercent: number;
  sectorConcentration: ConcentrationItem[];
  themeConcentration: ConcentrationItem[];
  singlePositionRisks: PositionAnalysis[];
  themeRisks: ConcentrationItem[];
}

export interface WatchlistItem {
  ticker: string;
  companyName: string;
  sector: string;
  theme: string;
  reason: string;
  risk: string;
  cleanlinessScore: number;
  momentumScore: number;
  lastReviewedAt: string;
}

export interface WatchlistAnalysis extends WatchlistItem {
  cleanLogic: boolean;
  judgment: string;
  action: ActionCategory;
}

export interface MarketEvent {
  date: string;
  ticker: string;
  eventType: EventType;
  headline: string;
  summary: string;
  impact: EventImpact;
  source: string;
  confidence: number;
}

export interface DailyGainer {
  date: string;
  ticker: string;
  gainPercent: number;
  reason: string;
  theme: string;
  followUpNeeded: boolean;
}

export interface DailyGainerAnalysis extends DailyGainer {
  chaseRisk: ChaseRisk;
  cleanLogic: boolean;
  catalystType: string;
  judgment: string;
  action: ActionCategory;
}

export interface StockScoreInput {
  ticker: string;
  companyName?: string;
  catalystScore: number;
  fundamentalsScore: number;
  momentumScore: number;
  valuationRisk: number;
  concentrationRisk: number;
  cleanlinessScore: number;
}

export interface StockScore extends StockScoreInput {
  opportunityScore: number;
  category: ScoreCategory;
  rationale: string;
}

export interface LocalData {
  portfolio: PortfolioPosition[];
  watchlist: WatchlistItem[];
  events: MarketEvent[];
  gainers: DailyGainer[];
}
