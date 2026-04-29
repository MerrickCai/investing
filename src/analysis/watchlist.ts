import type { ActionCategory, WatchlistAnalysis, WatchlistItem } from "../types/domain";

export type WatchlistSort = "clean" | "momentum" | "theme";

function actionFor(item: WatchlistItem): ActionCategory {
  if (item.cleanlinessScore >= 8 && item.momentumScore >= 7) return "consider entry on pullback";
  if (item.momentumScore >= 8 && item.cleanlinessScore < 7) return "avoid chase";
  return "watch";
}

function judgmentFor(item: WatchlistItem): string {
  if (item.cleanlinessScore >= 8 && item.momentumScore >= 8) return "逻辑干净且动量强，优先等回踩或事件确认。";
  if (item.cleanlinessScore >= 8) return "基本面线索清楚，等待资金或财报进一步验证。";
  if (item.momentumScore >= 8) return "动量领先于基本面验证，追高风险需要降权。";
  return "暂时观察，除非出现新催化，否则不用提高优先级。";
}

export function analyzeWatchlist(items: WatchlistItem[]): WatchlistAnalysis[] {
  return items.map((item) => ({
    ...item,
    cleanLogic: item.cleanlinessScore >= 8,
    judgment: judgmentFor(item),
    action: actionFor(item)
  }));
}

export function sortWatchlist(items: WatchlistAnalysis[], sortBy: WatchlistSort): WatchlistAnalysis[] {
  const sorted = [...items];

  if (sortBy === "clean") {
    return sorted.sort((a, b) => b.cleanlinessScore - a.cleanlinessScore || b.momentumScore - a.momentumScore);
  }

  if (sortBy === "momentum") {
    return sorted.sort((a, b) => b.momentumScore - a.momentumScore || b.cleanlinessScore - a.cleanlinessScore);
  }

  return sorted.sort((a, b) => a.theme.localeCompare(b.theme) || b.cleanlinessScore - a.cleanlinessScore);
}
