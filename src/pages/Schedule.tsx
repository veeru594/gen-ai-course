import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  scheduleDays,
  scheduleBlocks,
  scheduleHours,
  dayGrid,
  blockForDay,
  teachingDays,
  type DayGridKey,
  type ScheduleDay,
} from "../data/schedule";
import { programHours } from "../data/modules";
import "./Schedule.css";

const TEACHING = scheduleDays.filter((d) => !d.weekend);
const FIRST_DAY = TEACHING[0].day;
const LAST_DAY = TEACHING[TEACHING.length - 1].day;

function fieldFor(day: ScheduleDay, key: DayGridKey): string | undefined {
  switch (key) {
    case "domain":
      return day.domain;
    case "aptitude":
      return day.aptitude;
    case "softSkill":
      return day.softSkill;
    case "lab":
      return day.lab;
    case "lunch":
      return undefined;
  }
}

export function Schedule() {
  const [selected, setSelected] = useState<number>(FIRST_DAY);

  const day = useMemo(
    () => scheduleDays.find((d) => d.day === selected) ?? TEACHING[0],
    [selected],
  );
  const block = blockForDay(day.day) ?? scheduleBlocks[0];

  const step = useCallback((dir: -1 | 1) => {
    setSelected((cur) => {
      const idx = TEACHING.findIndex((d) => d.day === cur);
      const next = Math.min(Math.max(idx + dir, 0), TEACHING.length - 1);
      return TEACHING[next].day;
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowLeft") {
        step(-1);
      } else if (e.key === "ArrowRight") {
        step(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  // position of this day within its own block (teaching days only)
  const blockTeaching = TEACHING.filter(
    (d) => d.day >= block.from && d.day <= block.to,
  );
  const posInBlock = blockTeaching.findIndex((d) => d.day === day.day) + 1;
  const blockPct = Math.round((posInBlock / blockTeaching.length) * 100);

  const atStart = day.day === FIRST_DAY;
  const atEnd = day.day === LAST_DAY;

  return (
    <div className="container schedule-page">
      <header className="schedule-head">
        <p className="meta schedule-eyebrow">
          Delivery plan · {teachingDays} teaching days · {scheduleDays.length}{" "}
          calendar days
        </p>
        <h1>The 90-day run</h1>
        <p className="schedule-intro">
          The program as it is actually delivered, day by day. Each working day
          holds a fixed rhythm — a morning concept, an aptitude hour, lunch, a
          soft-skills hour, then an afternoon lab that builds the morning by
          hand. Step through it.
        </p>
      </header>

      <section className="schedule-hours" aria-label="Hours by component">
        {scheduleHours.map((h) => (
          <div key={h.label} className="schedule-hours-cell">
            <span className="schedule-hours-num">{h.hours}</span>
            <span className="schedule-hours-label meta">{h.label}</span>
          </div>
        ))}
        <div className="schedule-hours-cell is-total">
          <span className="schedule-hours-num">{programHours.total}</span>
          <span className="schedule-hours-label meta">Total Hours</span>
        </div>
      </section>

      <nav className="schedule-blockrail" aria-label="Jump to a teaching block">
        {scheduleBlocks.map((b) => (
          <button
            key={b.kind}
            type="button"
            data-module={b.module}
            className={`schedule-chip${b.kind === block.kind ? " is-on" : ""}${b.kind === "capstone" ? " is-capstone" : ""}`}
            aria-pressed={b.kind === block.kind}
            onClick={() => setSelected(b.from)}
          >
            <span className="schedule-chip-dot" aria-hidden="true" />
            {b.name}
            <span className="schedule-chip-range meta">
              D{b.from}–{b.to}
            </span>
          </button>
        ))}
      </nav>

      <div
        className={`schedule-stage${block.kind === "capstone" ? " is-capstone" : ""}`}
        data-module={block.module}
      >
        {/* left — the day, drawn as a proportional time column */}
        <section className="schedule-reader" aria-live="polite">
          <div className="schedule-reader-head">
            <div>
              <p className="meta schedule-daynum">
                Day {String(day.day).padStart(2, "0")} / {scheduleDays.length}
              </p>
              <h2 className="schedule-daytitle">{day.domain}</h2>
              <p className="meta schedule-blocktag">
                <span className="schedule-blocktag-dot" aria-hidden="true" />
                {block.name} · {posInBlock} of {blockTeaching.length}
              </p>
            </div>
            <div className="schedule-nav">
              <button
                type="button"
                className="schedule-navbtn"
                onClick={() => step(-1)}
                disabled={atStart}
                aria-label="Previous teaching day"
              >
                ←
              </button>
              <button
                type="button"
                className="schedule-navbtn"
                onClick={() => step(1)}
                disabled={atEnd}
                aria-label="Next teaching day"
              >
                →
              </button>
            </div>
          </div>

          <div className="schedule-timecol">
            {dayGrid.map((g) => {
              const value = fieldFor(day, g.key);
              return (
                <div
                  key={g.key}
                  className={`schedule-slot tone-${g.tone}`}
                  style={{ flexGrow: g.mins }}
                >
                  <span className="schedule-slot-time meta">
                    {g.start}
                    <br />
                    {g.end}
                  </span>
                  <span className="schedule-slot-body">
                    <span className="schedule-slot-label meta">{g.label}</span>
                    {value && (
                      <span className="schedule-slot-text">{value}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* right — module context for the selected block */}
        <aside className="schedule-context" aria-label="Module context">
          <p className="meta schedule-context-eyebrow">Module context</p>
          <h3 className="schedule-context-title">{block.name}</h3>
          <p className="meta schedule-context-part">{block.part}</p>
          <p className="schedule-context-blurb">{block.blurb}</p>
          <ul className="schedule-context-focus">
            {block.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="schedule-progress">
            <p className="meta schedule-progress-row">
              <span>Block progress at day {day.day}</span>
              <span>
                {posInBlock} / {blockTeaching.length} · {blockPct}%
              </span>
            </p>
            <div
              className="schedule-progress-track"
              role="progressbar"
              aria-valuenow={blockPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span
                className="schedule-progress-fill"
                style={{ width: `${blockPct}%` }}
              />
            </div>
          </div>
          {block.kind !== "capstone" && (
            <Link className="schedule-context-link" to={`/module/${block.module}`}>
              Open Module {block.number} →
            </Link>
          )}
        </aside>
      </div>

      {/* full-run mini-map */}
      <section className="schedule-minimap" aria-label="All 90 days">
        <p className="meta schedule-minimap-hint">
          Every day · weekends dimmed · ← → to move
        </p>
        <ol className="schedule-minimap-track">
          {scheduleDays.map((d) => {
            const b = blockForDay(d.day);
            const isSel = d.day === day.day;
            return (
              <li key={d.day}>
                <button
                  type="button"
                  data-module={b?.module}
                  className={`schedule-tick${d.weekend ? " is-weekend" : ""}${isSel ? " is-sel" : ""}${b?.kind === "capstone" ? " is-capstone" : ""}`}
                  disabled={d.weekend}
                  onClick={() => setSelected(d.day)}
                  aria-label={
                    d.weekend ? `Day ${d.day}, rest` : `Day ${d.day}: ${d.domain}`
                  }
                  aria-current={isSel ? "true" : undefined}
                  title={d.weekend ? `Day ${d.day} · rest` : `Day ${d.day} · ${d.domain}`}
                />
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
