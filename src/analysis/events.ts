import type { MarketEvent } from "../types/domain";

export function eventCatalystLabel(event: MarketEvent): string {
  if (event.eventType === "earnings") return "财报验证";
  if (event.eventType === "guidance") return "指引改善";
  if (event.eventType === "sector_rotation") return "AI 基建扩散交易 / 板块轮动";
  if (event.eventType === "macro") return "宏观变量";
  if (event.eventType === "analyst_upgrade") return "卖方上修";
  return "市场消息";
}
