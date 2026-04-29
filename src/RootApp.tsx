import { useMemo, useState } from "react";
import {
  Banknote,
  BriefcaseBusiness,
  Layers3,
  TrendingUp
} from "lucide-react";
import { analyzeDailyGainers } from "./analysis/gainers";
import { analyzePortfolio } from "./analysis/portfolio";
import { scoreUniverse } from "./analysis/scoring";
import { analyzeWatchlist, sortWatchlist, type WatchlistSort } from "./analysis/watchlist";
import { AppShell } from "./components/AppShell";
import { EventsTimeline } from "./components/EventsTimeline";
import { GainersGrid } from "./components/GainersGrid";
import { MetricCard } from "./components/MetricCard";
import { PositionsTable } from "./components/PositionsTable";
import { ScoresList } from "./components/ScoresList";
import { WatchlistGrid } from "./components/WatchlistGrid";
import { localData } from "./data/localData";
import { formatCurrency, formatPercent } from "./lib/format";

function SectionHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="section-heading">
      <h3>{title}</h3>
      {meta ? <span>{meta}</span> : null}
    </div>
  );
}

export function RootApp() {
  const [watchSort, setWatchSort] = useState<WatchlistSort>("clean");
  const dashboard = useMemo(() => {
    const portfolio = analyzePortfolio(localData.portfolio);
    const watchlist = analyzeWatchlist(localData.watchlist);
    const gainers = analyzeDailyGainers(localData.gainers);
    const scores = scoreUniverse({
      ...localData,
      portfolioAnalysis: portfolio
    });

    return {
      portfolio,
      watchlist,
      gainers,
      scores,
      events: localData.events
    };
  }, []);

  const sortedWatchlist = useMemo(
    () => sortWatchlist(dashboard.watchlist, watchSort),
    [dashboard.watchlist, watchSort]
  );

  return (
    <AppShell
      summary={{
        eventCount: dashboard.events.length,
        positionCount: dashboard.portfolio.positions.length,
        watchlistCount: dashboard.watchlist.length
      }}
    >
      <section id="overview" className="section-band">
        <SectionHeader title="总览" meta={`${dashboard.portfolio.positions.length} 持仓`} />
        <div className="metric-grid">
          <MetricCard
            detail="市值"
            icon={Banknote}
            label="MV"
            value={formatCurrency(dashboard.portfolio.totalMarketValue)}
          />
          <MetricCard
            detail="成本"
            icon={Layers3}
            label="Cost"
            value={formatCurrency(dashboard.portfolio.totalCost)}
          />
          <MetricCard
            detail={formatPercent(dashboard.portfolio.totalUnrealizedPnLPercent)}
            icon={TrendingUp}
            label="PnL"
            tone={dashboard.portfolio.totalUnrealizedPnL >= 0 ? "positive" : "warning"}
            value={formatCurrency(dashboard.portfolio.totalUnrealizedPnL)}
          />
          <MetricCard
            detail="数量"
            icon={BriefcaseBusiness}
            label="Pos"
            value={String(dashboard.portfolio.positions.length)}
          />
        </div>

      </section>

      <section id="positions" className="section-band">
        <SectionHeader title="持仓" />
        <PositionsTable analysis={dashboard.portfolio} />
      </section>

      <div className="market-grid">
        <section id="scores" className="section-band">
          <SectionHeader title="评分" meta="Top 10" />
          <ScoresList scores={dashboard.scores.slice(0, 10)} />
        </section>

        <section id="gainers" className="section-band">
          <SectionHeader title="异动" meta={`${dashboard.gainers.length}`} />
          <GainersGrid gainers={dashboard.gainers} />
        </section>

        <section id="watchlist" className="section-band">
          <div className="section-heading with-control">
            <h3>观察池</h3>
            <div className="segmented" role="tablist" aria-label="Watchlist sort">
              {(["clean", "momentum", "theme"] as const).map((sort) => (
                <button
                  className={watchSort === sort ? "active" : ""}
                  key={sort}
                  onClick={() => setWatchSort(sort)}
                  type="button"
                >
                  {sort === "clean" ? "Clean" : sort === "momentum" ? "Mom" : "Theme"}
                </button>
              ))}
            </div>
          </div>
          <WatchlistGrid items={sortedWatchlist} />
        </section>

        <section id="events" className="section-band">
          <SectionHeader title="事件" meta={`${dashboard.events.length}`} />
          <EventsTimeline events={dashboard.events} />
        </section>
      </div>

    </AppShell>
  );
}
