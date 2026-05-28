import { useState, useEffect, useRef } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMonthLong(monthIndex) {
  return new Date(2000, monthIndex, 1).toLocaleString("en-US", { month: "long" });
}

function getMonthShort(monthIndex) {
  return new Date(2000, monthIndex, 1).toLocaleString("en-US", { month: "short" });
}

function fmtDate(d) {
  if (!d) return "";
  return `${d.getDate()} ${getMonthShort(d.getMonth())} ${d.getFullYear()}`;
}

function sameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DaysGrid({ viewYear, viewMonth, startDate, endDate, hoverDate, onPick, onHover, onLeave }) {
  const first = new Date(viewYear, viewMonth, 1);
  let startDay = first.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const lo = startDate && endDate ? (startDate < endDate ? startDate : endDate) : startDate;
  const hi = startDate && endDate ? (startDate < endDate ? endDate : startDate) : null;
  const hovLo = startDate && hoverDate && !endDate ? (startDate < hoverDate ? startDate : hoverDate) : null;
  const hovHi = startDate && hoverDate && !endDate ? (startDate < hoverDate ? hoverDate : startDate) : null;

  const dayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(<div key={`e${i}`} />);

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const isStart = lo && sameDay(date, lo);
    const isEnd = (hi && sameDay(date, hi)) || (!endDate && hoverDate && sameDay(date, hoverDate));
    const inRange =
      (lo && hi && date > lo && date < hi) ||
      (hovLo && hovHi && date > hovLo && date < hovHi);
    const isEdge = isStart || isEnd;
    const bothEdges = isStart && isEnd;

    const cellClass = [
      "text-center text-[13px] py-[5px] cursor-pointer select-none",
      bothEdges
        ? "bg-[#1e3a5f] text-white font-medium rounded"
        : isStart
        ? "bg-[#1e3a5f] text-white font-medium rounded-l"
        : isEnd
        ? "bg-[#1e3a5f] text-white font-medium rounded-r"
        : inRange
        ? "bg-[#e8eef6] text-[#1e3a5f] rounded-none"
        : "text-[#1e3a5f] rounded hover:bg-[#eef2f8]",
    ].join(" ");

    cells.push(
      <div
        key={d}
        className={cellClass}
        onClick={() => onPick(date)}
        onMouseEnter={() => onHover(date)}
        onMouseLeave={onLeave}
      >
        {d}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-[2px] mb-1">
        {dayLabels.map(label => (
          <div key={label} className="text-center text-[11px] text-[#aaa] py-[2px]">{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[2px]">{cells}</div>
    </>
  );
}

function MonthGrid({ viewMonth, onPick }) {
  const months = Array.from({ length: 12 }, (_, i) => ({ index: i, label: getMonthShort(i) }));
  return (
    <div className="grid grid-cols-3 gap-1">
      {months.map(({ index, label }) => (
        <div
          key={index}
          onClick={() => onPick(index)}
          className={[
            "text-center text-[13px] py-2 rounded cursor-pointer select-none",
            index === viewMonth
              ? "bg-[#1e3a5f] text-white font-medium"
              : "text-[#1e3a5f] hover:bg-[#eef2f8]",
          ].join(" ")}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function YearGrid({ viewYear, yearRangeStart, onPick }) {
  const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);
  return (
    <div className="grid grid-cols-3 gap-1">
      {years.map(y => (
        <div
          key={y}
          onClick={() => onPick(y)}
          className={[
            "text-center text-[13px] py-2 rounded cursor-pointer select-none",
            y === viewYear
              ? "bg-[#1e3a5f] text-white font-medium"
              : "text-[#1e3a5f] hover:bg-[#eef2f8]",
          ].join(" ")}
        >
          {y}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
/**
 * BtDateRangePicker
 *
 * Props:
 *  - value: { min: Date | null, max: Date | null }
 *  - onChange: (value: { min: Date | null, max: Date | null }) => void
 *  - isValid: boolean | undefined   (false triggers red border + error)
 *  - errorMessage: string
 *  - disabled: boolean
 *  - placeholder: string
 *  - className: string
 */
export function BtDateRangePicker({
  value = { min: null, max: null },
  onChange,
  isValid,
  errorMessage = "Invalid date range",
  disabled = false,
  placeholder = "Select date range",
  className = "",
}) {
  const startDate = value?.min ?? null;
  const endDate   = value?.max ?? null;

  const now = new Date();
  const [viewYear, setViewYear]           = useState(now.getFullYear());
  const [viewMonth, setViewMonth]         = useState(now.getMonth());
  const [yearRangeStart, setYearRangeStart] = useState(now.getFullYear() - 6);
  const [view, setView]                   = useState("days"); // "days" | "months" | "years"
  const [open, setOpen]                   = useState(false);
  const [isFocused, setIsFocused]         = useState(false);
  const [hoverDate, setHoverDate]         = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setIsFocused(false);
        if (startDate && !endDate) onChange({ min: null, max: null });
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [startDate, endDate]);

  function toggleOpen() {
    if (disabled) return;
    setOpen(prev => { setIsFocused(!prev); return !prev; });
  }

  function pickDate(date) {
    if (!startDate || endDate) {
      onChange({ min: date, max: null });
    } else {
      let min = startDate, max = date;
      if (max < min) [min, max] = [max, min];
      onChange({ min, max });
      setOpen(false);
      setIsFocused(false);
    }
  }

  function clearRange(e) {
    e.stopPropagation();
    onChange({ min: null, max: null });
    setHoverDate(null);
  }

  function navPrev() {
    if (view === "days") {
      if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
      else setViewMonth(m => m - 1);
    } else if (view === "months") {
      setViewYear(y => y - 1);
    } else {
      setYearRangeStart(s => s - 12);
    }
  }

  function navNext() {
    if (view === "days") {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
      else setViewMonth(m => m + 1);
    } else if (view === "months") {
      setViewYear(y => y + 1);
    } else {
      setYearRangeStart(s => s + 12);
    }
  }

  const label = startDate && endDate
    ? `${fmtDate(startDate)}  →  ${fmtDate(endDate)}`
    : startDate
    ? `${fmtDate(startDate)}  →  ...`
    : placeholder;

  const boxBorder = isValid === false
    ? "border-red-600"
    : isFocused
    ? "border-blue-600"
    : "border-[#1e3a5f]";

  const headerBtnClass = "bg-transparent border-none cursor-pointer text-sm font-medium text-[#1e3a5f] px-1.5 py-0.5 rounded hover:bg-[#eef2f8]";
  const navBtnClass    = "bg-transparent border-none cursor-pointer text-lg text-gray-500 px-1.5 py-0.5 hover:bg-[#eef2f8] rounded";

  let headerTitle;
  if (view === "days") {
    headerTitle = (
      <div className="flex gap-1">
        <button onClick={() => setView("months")} className={headerBtnClass}>{getMonthLong(viewMonth)}</button>
        <button onClick={() => setView("years")}  className={headerBtnClass}>{viewYear}</button>
      </div>
    );
  } else if (view === "months") {
    headerTitle = <button onClick={() => setView("years")} className={headerBtnClass}>{viewYear}</button>;
  } else {
    headerTitle = (
      <span className="text-sm font-medium text-[#1e3a5f]">
        {yearRangeStart} – {yearRangeStart + 11}
      </span>
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>

      {/* Input box */}
      <div
        onClick={toggleOpen}
        className={[
          "flex items-center gap-2 px-2 h-8 rounded border-2 border-solid bg-white select-none",
          boxBorder,
          disabled ? "opacity-75 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <svg className="shrink-0 text-gray-400" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className={`flex-1 text-[13px] truncate ${startDate ? "text-[#1e3a5f]" : "text-gray-400"}`}>
          {label}
        </span>
        {startDate && (
          <span onClick={clearRange} className="text-[13px] text-gray-300 cursor-pointer hover:text-gray-500">✕</span>
        )}
      </div>

      {/* Error message */}
      {isValid === false && (
        <p className="text-red-600 text-xs mt-0.5">{errorMessage}</p>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-[100] bg-white border border-[#dde3ec] rounded-lg p-3 w-[300px] shadow-lg">

          {/* Month/year nav header */}
          <div className="flex items-center justify-between mb-2.5">
            <button onClick={navPrev} className={navBtnClass}>‹</button>
            {headerTitle}
            <button onClick={navNext} className={navBtnClass}>›</button>
          </div>

          {view === "days" && (
            <>
              <DaysGrid
                viewYear={viewYear} viewMonth={viewMonth}
                startDate={startDate} endDate={endDate} hoverDate={hoverDate}
                onPick={pickDate}
                onHover={date => { if (startDate && !endDate) setHoverDate(date); }}
                onLeave={() => setHoverDate(null)}
              />
              <p className="text-center text-[12px] text-gray-400 mt-2.5">
                {(!startDate || endDate) ? "Click to pick start date" : "Click to pick end date"}
              </p>
            </>
          )}

          {view === "months" && (
            <MonthGrid viewMonth={viewMonth} onPick={m => { setViewMonth(m); setView("days"); }} />
          )}

          {view === "years" && (
            <YearGrid
              viewYear={viewYear} yearRangeStart={yearRangeStart}
              onPick={y => { setViewYear(y); setYearRangeStart(y - 6); setView("months"); }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dateRange, setDateRange] = useState({ min: null, max: null });

  return (
    <div className="font-sans p-8 max-w-sm">
      <h3 className="text-[#1e3a5f] font-semibold mb-4">Date Range Picker</h3>

      <BtDateRangePicker
        value={dateRange}
        onChange={setDateRange}
      />

      {dateRange.min && dateRange.max && (
        <p className="mt-4 text-[13px] text-green-800">
          ✓ {dateRange.min.toLocaleDateString()} → {dateRange.max.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
