import type { PropsWithChildren } from "react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  Gauge,
  LineChart,
  Radar,
  TrendingUp
} from "lucide-react";

interface AppShellProps extends PropsWithChildren {
  summary: {
    positionCount: number;
    watchlistCount: number;
    eventCount: number;
  };
}

const navItems = [
  { icon: Gauge, label: "总览", href: "#overview" },
  { icon: BriefcaseBusiness, label: "持仓", href: "#positions" },
  { icon: TrendingUp, label: "异动", href: "#gainers" },
  { icon: BarChart3, label: "评分", href: "#scores" },
  { icon: Radar, label: "观察池", href: "#watchlist" },
  { icon: CalendarClock, label: "事件", href: "#events" }
];

export function AppShell({ children, summary }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand-mark" href="#overview" aria-label="Investing dashboard home">
          <LineChart aria-hidden size={16} strokeWidth={2.3} />
          <strong>Investing</strong>
        </a>
        <nav className="nav-stack" aria-label="Dashboard navigation">
          {navItems.map(({ href, icon: Icon, label }) => (
            <a href={href} key={href}>
              <Icon aria-hidden size={14} strokeWidth={2.2} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="header-stats" aria-label="Dashboard counts">
          <span>
            <BriefcaseBusiness aria-hidden size={13} />
            {summary.positionCount}
          </span>
          <span>
            <Radar aria-hidden size={13} />
            {summary.watchlistCount}
          </span>
          <span>
            <Activity aria-hidden size={13} />
            {summary.eventCount}
          </span>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
}
