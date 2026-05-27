import { useState, useEffect, useRef } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MSHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmt(d) {
  if (!d) return "";
  return `${d.getDate()} ${MSHORT[d.getMonth()]} ${d.getFullYear()}`;
}
function sameDay(a, b) { return a && b && a.toDateString() === b.toDateString(); }

// ─── Days grid ───────────────────────────────────────────────────────────────
function DaysGrid({ viewYear, viewMonth, startDate, endDate, hoverDate, onPick, onHover, onLeave }) {
  const first = new Date(viewYear, viewMonth, 1);
  let sd = first.getDay();
  sd = sd === 0 ? 6 : sd - 1;
  const dim = new Date(viewYear, viewMonth + 1, 0).getDate();

  const lo = startDate && endDate ? (startDate < endDate ? startDate : endDate) : startDate;
  const hi = startDate && endDate ? (startDate < endDate ? endDate : startDate) : null;
  const hovLo = startDate && hoverDate && !endDate ? (startDate < hoverDate ? startDate : hoverDate) : null;
  const hovHi = startDate && hoverDate && !endDate ? (startDate < hoverDate ? hoverDate : startDate) : null;

  const cells = [];
  for (let i = 0; i < sd; i++) cells.push(<div key={`e${i}`} />);

  for (let d = 1; d <= dim; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const isStart = lo && sameDay(date, lo);
    const isEnd = (hi && sameDay(date, hi)) || (!endDate && hoverDate && sameDay(date, hoverDate));
    const inRange = (lo && hi && date > lo && date < hi) || (hovLo && hovHi && date > hovLo && date < hovHi);

    let bg = "transparent", color = "#1e3a5f", radius = "4px", fontWeight = "400";
    if ((isStart || isEnd) && !(isStart && isEnd)) {
      bg = "#1e3a5f"; color = "#fff"; fontWeight = "500";
      radius = isStart ? "4px 0 0 4px" : "0 4px 4px 0";
    } else if (isStart && isEnd) {
      bg = "#1e3a5f"; color = "#fff"; fontWeight = "500"; radius = "4px";
    } else if (inRange) {
      bg = "#e8eef6"; radius = "0";
    }

    cells.push(
      <div key={d} onClick={() => onPick(date)} onMouseEnter={() => onHover(date)} onMouseLeave={onLeave}
        style={{ textAlign:"center", fontSize:"13px", padding:"5px 0", borderRadius:radius, cursor:"pointer",
          background:bg, color, fontWeight, userSelect:"none" }}>
        {d}
      </div>
    );
  }

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px", marginBottom:"4px" }}>
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:"11px", color:"#aaa", padding:"2px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px" }}>{cells}</div>
    </>
  );
}

// ─── Month picker ─────────────────────────────────────────────────────────────
function MonthGrid({ viewMonth, onPick }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"4px" }}>
      {MSHORT.map((m, i) => (
        <div key={m} onClick={() => onPick(i)}
          style={{ textAlign:"center", fontSize:"13px", padding:"8px 2px", borderRadius:"4px",
            cursor:"pointer", userSelect:"none",
            background: i === viewMonth ? "#1e3a5f" : "transparent",
            color: i === viewMonth ? "#fff" : "#1e3a5f",
            fontWeight: i === viewMonth ? 500 : 400,
          }}>
          {m}
        </div>
      ))}
    </div>
  );
}

// ─── Year picker ──────────────────────────────────────────────────────────────
function YearGrid({ viewYear, yearRangeStart, onPick }) {
  const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"4px" }}>
      {years.map(y => (
        <div key={y} onClick={() => onPick(y)}
          style={{ textAlign:"center", fontSize:"13px", padding:"8px 2px", borderRadius:"4px",
            cursor:"pointer", userSelect:"none",
            background: y === viewYear ? "#1e3a5f" : "transparent",
            color: y === viewYear ? "#fff" : "#1e3a5f",
            fontWeight: y === viewYear ? 500 : 400,
          }}>
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

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [yearRangeStart, setYearRangeStart] = useState(today.getFullYear() - 6);
  const [view, setView] = useState("days"); // "days" | "months" | "years"
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false); setIsFocused(false);
        if (startDate && !endDate) onChange({ min: null, max: null });
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [startDate, endDate]);

  function toggleOpen() {
    if (disabled) return;
    setOpen(o => { setIsFocused(!o); return !o; });
  }

  function pickDate(date) {
    if (!startDate || endDate) {
      onChange({ min: date, max: null });
    } else {
      let min = startDate, max = date;
      if (max < min) [min, max] = [max, min];
      onChange({ min, max });
      setOpen(false); setIsFocused(false);
    }
  }

  function clearRange(e) {
    e.stopPropagation();
    onChange({ min: null, max: null });
    setHoverDate(null);
  }

  function navPrev() {
    if (view === "days") {
      if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1);
    } else if (view === "months") {
      setViewYear(y => y - 1);
    } else {
      setYearRangeStart(s => s - 12);
    }
  }

  function navNext() {
    if (view === "days") {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1);
    } else if (view === "months") {
      setViewYear(y => y + 1);
    } else {
      setYearRangeStart(s => s + 12);
    }
  }

  const borderColor = isValid === false ? "#dc2626" : isFocused ? "#2563eb" : "#1e3a5f";

  const label = startDate && endDate
    ? `${fmt(startDate)}  →  ${fmt(endDate)}`
    : startDate ? `${fmt(startDate)}  →  ...`
    : placeholder;

  let headerTitle = null;
  if (view === "days") {
    headerTitle = (
      <div style={{ display:"flex", gap:"4px" }}>
        <button onClick={() => setView("months")} style={btnStyle}>{MONTHS[viewMonth]}</button>
        <button onClick={() => setView("years")} style={btnStyle}>{viewYear}</button>
      </div>
    );
  } else if (view === "months") {
    headerTitle = <button onClick={() => setView("years")} style={btnStyle}>{viewYear}</button>;
  } else {
    headerTitle = <span style={{ fontSize:"14px", fontWeight:500, color:"#1e3a5f" }}>{yearRangeStart} – {yearRangeStart + 11}</span>;
  }

  return (
    <div ref={containerRef} className={className} style={{ position:"relative", display:"inline-block", width:"100%" }}>
      <div onClick={toggleOpen} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"0 8px",
        borderRadius:"4px", border:`2px solid ${borderColor}`, height:"2rem", cursor:disabled ? "not-allowed" : "pointer",
        opacity:disabled ? 0.75 : 1, background:"#fff", userSelect:"none", boxSizing:"border-box" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span style={{ flex:1, fontSize:"13px", color:startDate ? "#1e3a5f" : "#888", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
          {label}
        </span>
        {startDate && (
          <span onClick={clearRange} style={{ fontSize:"13px", color:"#aaa", cursor:"pointer" }}>✕</span>
        )}
      </div>

      {isValid === false && (
        <p style={{ color:"#dc2626", fontSize:"12px", margin:"2px 0 0" }}>{errorMessage}</p>
      )}

      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:100,
          background:"#fff", border:"1px solid #dde3ec", borderRadius:"8px", padding:"12px",
          width:"300px", boxShadow:"0 4px 16px rgba(0,0,0,0.08)", boxSizing:"border-box" }}>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
            <button onClick={navPrev} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"18px", color:"#666", padding:"2px 6px" }}>‹</button>
            {headerTitle}
            <button onClick={navNext} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"18px", color:"#666", padding:"2px 6px" }}>›</button>
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
              <p style={{ textAlign:"center", fontSize:"12px", color:"#aaa", margin:"10px 0 0" }}>
                {(!startDate || endDate) ? "Click to pick start date" : "Click to pick end date"}
              </p>
            </>
          )}

          {view === "months" && (
            <MonthGrid viewMonth={viewMonth} onPick={m => { setViewMonth(m); setView("days"); }} />
          )}

          {view === "years" && (
            <YearGrid viewYear={viewYear} yearRangeStart={yearRangeStart}
              onPick={y => { setViewYear(y); setYearRangeStart(y - 6); setView("months"); }} />
          )}
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  background: "none", border: "none", cursor: "pointer",
  fontSize: "14px", fontWeight: 500, color: "#1e3a5f",
  padding: "2px 6px", borderRadius: "4px",
};

// ─── Demo ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dateRange, setDateRange] = useState({ min: null, max: null });

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", padding:"2rem", maxWidth:400 }}>
      <h3 style={{ color:"#1e3a5f", marginBottom:"1rem" }}>Date Range Picker</h3>

      <BtDateRangePicker
        value={dateRange}
        onChange={setDateRange}
      />

      {dateRange.min && dateRange.max && (
        <p style={{ marginTop:"1rem", fontSize:"13px", color:"#166534" }}>
          ✓ {dateRange.min.toLocaleDateString()} → {dateRange.max.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
