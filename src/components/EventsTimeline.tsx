import { CalendarClock } from "lucide-react";
import type { MarketEvent } from "../types/domain";

interface EventsTimelineProps {
  events: MarketEvent[];
}

export function EventsTimeline({ events }: EventsTimelineProps) {
  return (
    <div className="timeline">
      {[...events]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((event) => (
          <article className={`event-item ${event.impact}`} key={`${event.date}-${event.ticker}-${event.headline}`}>
            <time dateTime={event.date}>{event.date}</time>
            <h4>
              <CalendarClock aria-hidden size={16} />
              {event.ticker} · {event.eventType} · {event.impact}
            </h4>
            <p>
              <strong>{event.headline}</strong>
            </p>
            <p>{event.summary}</p>
            <footer>
              <span>置信度 {event.confidence}/10</span>
              <span>{event.source}</span>
            </footer>
          </article>
        ))}
    </div>
  );
}
