import portfolioJson from "../../data/portfolio.json";
import watchlistJson from "../../data/watchlist.json";
import eventsJson from "../../data/events.json";
import gainersJson from "../../data/daily-gainers.json";
import type { DailyGainer, LocalData, MarketEvent, PortfolioPosition, WatchlistItem } from "../types/domain";

export const localData: LocalData = {
  portfolio: portfolioJson as PortfolioPosition[],
  watchlist: watchlistJson as WatchlistItem[],
  events: eventsJson as MarketEvent[],
  gainers: gainersJson as DailyGainer[]
};
