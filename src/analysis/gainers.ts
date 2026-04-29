import type { ActionCategory, ChaseRisk, DailyGainer, DailyGainerAnalysis } from "../types/domain";

function catalystTypeFor(gainer: DailyGainer): string {
  const text = `${gainer.reason} ${gainer.theme}`.toLowerCase();

  if (text.includes("财报") || text.includes("earnings")) return "财报验证";
  if (text.includes("指引") || text.includes("guidance")) return "指引改善";
  if (text.includes("ai") || text.includes("数据中心") || text.includes("cloud")) return "AI 基建扩散交易";
  if (text.includes("反转") || text.includes("recovery")) return "周期反转资金";

  return "纯情绪或主题扩散";
}

function chaseRiskFor(gainer: DailyGainer, cleanLogic: boolean): ChaseRisk {
  if (gainer.gainPercent >= 10 && !cleanLogic) return "high";
  if (gainer.gainPercent >= 8) return cleanLogic ? "medium" : "high";
  if (gainer.gainPercent >= 6) return cleanLogic ? "medium" : "high";
  return cleanLogic ? "low" : "medium";
}

function actionFor(chaseRisk: ChaseRisk, cleanLogic: boolean): ActionCategory {
  if (chaseRisk === "high") return "avoid chase";
  if (cleanLogic) return "consider entry on pullback";
  return "watch";
}

export function analyzeDailyGainers(gainers: DailyGainer[]): DailyGainerAnalysis[] {
  return [...gainers]
    .sort((a, b) => b.gainPercent - a.gainPercent)
    .map((gainer) => {
      const catalystType = catalystTypeFor(gainer);
      const cleanLogic =
        catalystType === "财报验证" ||
        catalystType === "指引改善" ||
        gainer.theme.toLowerCase().includes("power");
      const chaseRisk = chaseRiskFor(gainer, cleanLogic);

      return {
        ...gainer,
        chaseRisk,
        cleanLogic,
        catalystType,
        judgment:
          chaseRisk === "high"
            ? "涨幅已经领先验证，先等回踩或二次确认。"
            : "催化较明确，可以跟踪回踩后的承接质量。",
        action: actionFor(chaseRisk, cleanLogic)
      };
    });
}
