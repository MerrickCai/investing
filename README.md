# 投资观察与持仓分析

本项目是一个本地 React 投资工作台，用于跟踪美股持仓、观察池、市场事件、每日高涨幅股票和机会评分。

## 运行

```bash
npm install
npm run dev
```

默认地址：

```text
http://127.0.0.1:5173/
```

## 数据文件

```text
data/
  portfolio.json
  watchlist.json
  events.json
  daily-gainers.json
```

## 页面功能

- 组合总览：总市值、总成本、总浮盈亏、持仓数量。
- 持仓分析：市值、仓位、浮盈亏、板块、主题、动作判断。
- 风险标记：单票超过 20%，单一主题超过 50%。
- 今日异动：高涨幅股票、催化类型、追高风险、逻辑是否干净。
- Opportunity Score：按综合机会分输出前 10 名。
- 观察池：按 clean、momentum、theme 排序。
- 事件记录：财报、指引、评级、板块轮动、宏观、新闻等。

## 项目结构

```text
src/
  main.tsx
  RootApp.tsx
  styles.css
  analysis/
    events.ts
    gainers.ts
    portfolio.ts
    scoring.ts
    watchlist.ts
  components/
    AppShell.tsx
    ConcentrationBars.tsx
    EventsTimeline.tsx
    GainersGrid.tsx
    MetricCard.tsx
    PositionsTable.tsx
    ScoresList.tsx
    WatchlistGrid.tsx
  data/
    localData.ts
  lib/
    format.ts
  types/
    domain.ts
data/
  portfolio.json
  watchlist.json
  events.json
  daily-gainers.json
index.html
vite.config.js
```

## 检查

```bash
npm run typecheck
```
