"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// COLOURS — Stars & Stripes
// ============================================================
const C = {
  bg:       "#0A1628",   // deep navy
  card:     "rgba(255,255,255,0.07)",
  cardOver: "rgba(255,255,255,0.13)",
  locked:   "#B22234",   // US flag red — locked/correct cards
  border:   "rgba(255,255,255,0.12)",
  borderHi: "rgba(255,255,255,0.28)",
  red:      "#B22234",   // primary accent
  gold:     "#F5C518",   // stars
  text:     "#ffffff",
  dim:      "rgba(255,255,255,0.45)",
  dimmer:   "rgba(255,255,255,0.25)",
  dimmest:  "rgba(255,255,255,0.08)",
};

// ============================================================
// UTILITIES
// ============================================================
function shuffleArray(arr) {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function formatTime(ms) {
  const totalSeconds = ms / 1000;
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const centis = Math.floor((ms % 1000) / 10);
  return { display: `${mins}:${secs.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}` };
}

function getStars(attempts) {
  if (attempts === 1) return 3;
  if (attempts <= 3) return 2;
  return 1;
}

function useTimer() {
  const [time, setTime] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const tick = useCallback(() => {
    if (!runningRef.current) return;
    setTime(Date.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);
  const start = useCallback(() => {
    startRef.current = Date.now();
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);
  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);
  return { time, start, stop };
}

// ============================================================
// CELEBRATORY WORDS — Trump-speak
// ============================================================
const WORDS_3 = ["Beautiful!", "Tremendous!", "Like nobody's ever seen!", "The greatest in history!", "Unbelievable!", "Phenomenal!", "Record-breaking!"];
const WORDS_2 = ["Terrific!", "Outstanding!", "Brilliant!", "Incredible!", "Fantastic!", "Huge!", "The best!"];
const WORDS_1 = ["Amazing!", "Winning!", "Never before!"];
function getCelebWord(stars) {
  const list = stars === 3 ? WORDS_3 : stars === 2 ? WORDS_2 : WORDS_1;
  return list[Math.floor(Math.random() * list.length)];
}

// ============================================================
// SHARE CTAs
// ============================================================
const SHARE_CTAS = ["Share your score!", "Spread the chaos!", "Tell them!", "Share the trouble!", "Pass it on!", "Send it!", "Think you know better?"];
const shareCta = SHARE_CTAS[Math.floor(Math.random() * SHARE_CTAS.length)];

// ============================================================
// PLAYER ID
// ============================================================
function getPlayerId() {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("trumpline_player_id");
  if (!id) {
    id = "player_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("trumpline_player_id", id);
  }
  return id;
}

// ============================================================
// CONFETTI
// ============================================================
function Confetti({ active }) {
  const pieces = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.4,
      duration: 1.6 + Math.random() * 1.4,
      color: ["#B22234", "#F5C518", "#ffffff", "#0A1628", "#3C6DB0"][i % 5],
      size: 5 + Math.random() * 7,
      drift: (Math.random() - 0.5) * 80,
      rot: Math.random() * 360,
    }))
  ).current;
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9999 }}>
      {pieces.map(pc => (
        <div key={pc.id} style={{
          position: "absolute", top: 0, left: `${pc.x}%`,
          width: `${pc.size}px`, height: `${pc.size * 0.45}px`,
          background: pc.color, borderRadius: "2px",
          "--cdrift": `${pc.drift}px`, "--crot": `${pc.rot + 540}deg`,
          animation: `confettiFall ${pc.duration}s ease-in ${pc.delay}s both`,
        }} />
      ))}
    </div>
  );
}

// ============================================================
// STAR DISPLAY
// ============================================================
function StarDisplay({ stars, size = 28, celebrate = false }) {
  const [visibleStars, setVisibleStars] = useState(celebrate ? 0 : stars);
  useEffect(() => {
    if (!celebrate) { setVisibleStars(stars); return; }
    setVisibleStars(0);
    const timers = [];
    for (let i = 1; i <= stars; i++)
      timers.push(setTimeout(() => setVisibleStars(i), 200 + i * 145));
    return () => timers.forEach(clearTimeout);
  }, [celebrate, stars]);
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {Array.from({ length: stars }, (_, i) => {
        const filled = i + 1 <= visibleStars;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24"
            fill={filled ? C.gold : "none"} stroke={C.gold} strokeWidth="2" strokeLinejoin="round"
            style={{
              opacity: filled ? 1 : 0.15,
              transform: filled ? "scale(1.15)" : "scale(0.9)",
              transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              animation: filled && celebrate ? `starPop 0.35s ease ${0.17 + (i + 1) * 0.145}s both` : "none",
            }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
}

// ============================================================
// SCREEN: LOADING
// ============================================================
function LoadingScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh" }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
        <span style={{ fontSize: "2.2rem", fontWeight: 900, color: C.red }}>TRUMP</span>
        <span style={{ fontSize: "2.2rem", fontWeight: 300, color: C.text }}>LINE</span>
      </div>
      <div style={{ marginTop: "1rem", color: C.dimmer, fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace", animation: "pulse 1.5s ease infinite" }}>
        Loading today&apos;s chaos...
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", padding: "2rem", textAlign: "center" }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
        <span style={{ fontSize: "2.2rem", fontWeight: 900, color: C.red }}>TRUMP</span>
        <span style={{ fontSize: "2.2rem", fontWeight: 300, color: C.text }}>LINE</span>
      </div>
      <div style={{ marginTop: "1.5rem", color: C.dim, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif" }}>{message || "No puzzle today"}</div>
      <div style={{ marginTop: "0.5rem", color: C.dimmer, fontSize: "0.75rem" }}>Check back tomorrow!</div>
    </div>
  );
}

// ============================================================
// SCREEN: INTRO — animated LINE logo
// ============================================================
function AnimatedLogo() {
  const letters = "LINE".split("");
  const [positions, setPositions] = useState(() => {
    const indices = letters.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    let current = [...positions];
    let tick = 0;
    const CHAOS_TICKS = 18;
    let step = 0;
    const interval = setInterval(() => {
      tick++;
      if (tick <= CHAOS_TICKS) {
        for (let k = 0; k < 3; k++) {
          const a = Math.floor(Math.random() * current.length);
          const b = Math.floor(Math.random() * current.length);
          [current[a], current[b]] = [current[b], current[a]];
        }
        setPositions([...current]);
      } else {
        for (let i = step; i < current.length; i++) {
          if (current[i] !== i) {
            const fromIdx = current.indexOf(step);
            [current[fromIdx], current[step]] = [current[step], current[fromIdx]];
            setPositions([...current]); step++; break;
          } else { step++; }
        }
        if (current.every((v, i) => v === i)) { clearInterval(interval); setSolved(true); }
      }
    }, 75);
    return () => clearInterval(interval);
  }, []);

  const fontSize = "clamp(2.4rem, 8vw, 4.5rem)";
  const letterWidth = "clamp(1.6rem, 5.5vw, 3rem)";

  return (
    <div style={{ position: "relative", height: "clamp(3.2rem, 9.5vw, 5.2rem)", width: `calc(${letterWidth} * 4)`, margin: "0 auto" }}>
      {letters.map((letter, correctIndex) => {
        const currentDisplayIndex = positions.indexOf(correctIndex);
        return (
          <span key={correctIndex} style={{
            position: "absolute", left: `calc(${letterWidth} * ${currentDisplayIndex})`, top: 0,
            width: letterWidth, textAlign: "center", fontSize, fontWeight: 300,
            fontFamily: "'Space Grotesk', sans-serif",
            color: solved ? C.text : C.dimmer,
            transition: "left 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease",
            lineHeight: 1.1, userSelect: "none",
          }}>{letter}</span>
        );
      })}
    </div>
  );
}

function IntroScreen({ onStart, puzzle }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  const dateLabel = new Date(puzzle.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric"
  });

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100dvh", padding: "2rem", textAlign: "center",
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      {/* TRUMP — static, red */}
      <div style={{ fontSize: "clamp(2.4rem, 8vw, 4.5rem)", fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", color: C.red, letterSpacing: "-0.01em", lineHeight: 1 }}>
        TRUMP
      </div>
      {/* LINE — animated scramble */}
      <AnimatedLogo />

      <div style={{ fontSize: "0.8rem", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", margin: "1.2rem 0 2.8rem" }}>
        {dateLabel}
      </div>

      <button onClick={onStart} style={{
        background: C.red, color: "#ffffff", border: "none", borderRadius: "14px",
        padding: "1rem 3rem", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer",
        fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.05em",
        transition: "all 0.2s ease", boxShadow: "0 4px 20px rgba(178,34,52,0.4)",
      }}
        onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.target.style.transform = "scale(1)"}
      >SORT THE CHAOS</button>
    </div>
  );
}

// ============================================================
// SCREEN: REVEAL
// ============================================================
function RevealScreen({ events, onRevealComplete }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (revealed < events.length) {
      const t = setTimeout(() => setRevealed(r => r + 1), 400);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onRevealComplete, 800);
      return () => clearTimeout(t);
    }
  }, [revealed, events.length, onRevealComplete]);

  return (
    <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto", padding: "1rem 0.75rem", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: "1rem", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.3rem, 1vh, 0.6rem)", flex: 1, minHeight: 0 }}>
        {events.map((event, index) => (
          <div key={event.id} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px",
            padding: "clamp(0.5rem, 1.2vh, 1rem) clamp(1rem, 3vw, 1.5rem)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flex: 1, minHeight: 0, overflow: "hidden",
            opacity: index < revealed ? 1 : 0,
            transform: index < revealed ? "translateX(0)" : "translateX(-20px)",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <div style={{ fontSize: "clamp(0.82rem, 2.3vw, 0.98rem)", fontWeight: 600, color: C.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3, textAlign: "center" }}>
              {event.title}
            </div>
          </div>
        ))}
      </div>
      {revealed >= events.length && (
        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", animation: "pulse 1s ease infinite" }}>
          Shuffling...
        </div>
      )}
    </div>
  );
}

// ============================================================
// SCREEN: PLAYING
// ============================================================
function reorderAroundLocks(events, fromIndex, toIndex, lockedCorrect) {
  const dragged = events[fromIndex];
  const result = new Array(events.length).fill(null);
  events.forEach((ev, i) => { if (lockedCorrect[ev.id]) result[i] = ev; });
  const unlocked = events.filter((ev, i) => !lockedCorrect[ev.id] && i !== fromIndex);
  let insertAt = 0;
  for (let i = 0; i < toIndex; i++) { if (!result[i]) insertAt++; }
  unlocked.splice(insertAt, 0, dragged);
  let ui = 0;
  for (let i = 0; i < result.length; i++) { if (!result[i]) result[i] = unlocked[ui++]; }
  return result;
}

function DraggableList({ events, lockedCorrect, wrongCards, onReorder }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const overIndexRef = useRef(null);
  const listRef = useRef(null);
  const touchData = useRef({ active: false, index: null, startY: 0, clone: null, startTop: 0 });
  const eventsRef = useRef(events);
  eventsRef.current = events;

  const handleDragStart = (e, index) => {
    if (lockedCorrect[events[index]?.id]) return;
    setDragIndex(index); e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, index) => { e.preventDefault(); setOverIndex(index); };
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== targetIndex && !lockedCorrect[events[dragIndex]?.id])
      onReorder(reorderAroundLocks(events, dragIndex, targetIndex, lockedCorrect));
    setDragIndex(null); setOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setOverIndex(null); };

  const handleTouchStart = useCallback((e, index) => {
    if (lockedCorrect[eventsRef.current[index]?.id]) return;
    const touch = e.touches[0]; const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clone = target.cloneNode(true);
    Object.assign(clone.style, {
      position: "fixed", left: rect.left + "px", top: rect.top + "px",
      width: rect.width + "px", zIndex: 9999, opacity: "0.9",
      transform: "scale(1.04)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      pointerEvents: "none", transition: "none",
    });
    document.body.appendChild(clone);
    touchData.current = { active: true, index, startY: touch.clientY, clone, startTop: rect.top };
    overIndexRef.current = null;
    target.style.opacity = "0.2";

    const onTouchMove = (ev) => {
      ev.preventDefault();
      const t = ev.touches[0];
      touchData.current.clone.style.top = (touchData.current.startTop + t.clientY - touchData.current.startY) + "px";
      const items = listRef.current?.children;
      let foundOver = null;
      for (let i = 0; i < items.length; i++) {
        const r = items[i].getBoundingClientRect();
        if (t.clientY >= r.top && t.clientY <= r.bottom && i !== touchData.current.index) { foundOver = i; break; }
      }
      overIndexRef.current = foundOver; setOverIndex(foundOver);
    };
    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      if (touchData.current.clone?.parentNode) touchData.current.clone.parentNode.removeChild(touchData.current.clone);
      const from = touchData.current.index; const to = overIndexRef.current;
      if (from !== null && to !== null && from !== to && !lockedCorrect[eventsRef.current[from]?.id])
        onReorder(reorderAroundLocks(eventsRef.current, from, to, lockedCorrect));
      if (listRef.current?.children[from]) listRef.current.children[from].style.opacity = "1";
      touchData.current = { active: false, index: null, startY: 0, clone: null, startTop: 0 };
      overIndexRef.current = null; setDragIndex(null); setOverIndex(null);
    };
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
  }, [lockedCorrect, onReorder]);

  return (
    <div ref={listRef} style={{ display: "flex", flexDirection: "column", gap: "clamp(0.25rem, 1vh, 0.55rem)", flex: 1, minHeight: 0 }}>
      {events.map((event, index) => {
        const isLocked = !!lockedCorrect[event.id];
        const isWrong = !!wrongCards[event.id];
        const isOver = overIndex === index;
        return (
          <div key={event.id} draggable={!isLocked}
            onDragStart={e => handleDragStart(e, index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={e => handleTouchStart(e, index)}
            style={{
              background: isLocked ? C.locked : isOver ? C.cardOver : C.card,
              border: isLocked ? "none" : isOver ? `1px solid ${C.borderHi}` : `1px solid ${C.border}`,
              borderRadius: "12px",
              padding: "clamp(0.4rem, 1.2vh, 1rem) clamp(1rem, 3vw, 1.5rem)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flex: 1, minHeight: 0, overflow: "hidden",
              cursor: isLocked ? "default" : "grab", userSelect: "none",
              opacity: dragIndex === index ? 0.3 : 1,
              transition: isLocked ? "background 0.3s ease" : "none",
              animation: isWrong ? "shake 0.4s ease" : isLocked ? "celebrate 0.5s ease" : "none",
            }}>
            <div style={{
              fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)", fontWeight: 600,
              color: C.text, fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.3, textAlign: "center",
            }}>
              {event.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlayingScreen({ events, lockedCorrect, wrongCards, onReorder, onLockIn, timeDisplay, isReadOnly = false, onBackToResults }) {
  const allCorrect = events.length > 0 && events.every(ev => lockedCorrect[ev.id]);
  const lockedCount = Object.keys(lockedCorrect).length;

  // Chain view — read-only sorted answer
  if (isReadOnly) {
    return (
      <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto", padding: "1rem 0.75rem", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, marginBottom: "0.75rem" }}>
          <button onClick={onBackToResults} style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}>← Back to Score</button>
          <div style={{ fontSize: "0.68rem", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>Correct Order</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.25rem, 1vh, 0.55rem)", flex: 1, minHeight: 0 }}>
          {events.map(event => (
            <div key={event.id} style={{
              background: C.locked, borderRadius: "12px",
              padding: "clamp(0.4rem, 1.2vh, 1rem) clamp(1rem, 3vw, 1.5rem)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flex: 1, minHeight: 0, overflow: "hidden",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)", fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{event.title}</div>
                <div style={{ fontSize: "clamp(0.6rem, 1.6vw, 0.72rem)", color: "rgba(255,255,255,0.6)", marginTop: "0.15rem", fontFamily: "'JetBrains Mono', monospace" }}>{event.hint}</div>
                <div style={{ fontSize: "clamp(0.6rem, 1.6vw, 0.7rem)", color: "rgba(255,255,255,0.4)", marginTop: "0.08rem", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{event.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto", padding: "1rem 0.75rem", height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header — timer only, no logo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, marginBottom: "0.5rem" }}>
        <div style={{ fontSize: "0.7rem", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>oldest → newest</div>
        <div style={{ fontSize: "clamp(0.95rem, 2.8vw, 1.1rem)", fontFamily: "'JetBrains Mono', monospace", color: C.text, fontWeight: 600 }}>{timeDisplay}</div>
      </div>
      {/* Progress bar */}
      <div style={{ height: "3px", background: C.dimmest, borderRadius: "2px", marginBottom: "0.6rem", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${(lockedCount / 7) * 100}%`, background: C.red, borderRadius: "2px", transition: "width 0.4s ease" }} />
      </div>
      {/* Cards */}
      <DraggableList events={events} lockedCorrect={lockedCorrect} wrongCards={wrongCards} onReorder={onReorder} />
      {/* Lock it in */}
      {!allCorrect && (
        <button onClick={onLockIn} style={{
          marginTop: "clamp(0.5rem, 1.5vh, 1rem)", background: C.red, color: "#fff",
          border: "none", borderRadius: "14px", padding: "clamp(0.7rem, 1.8vh, 1rem) 2rem",
          fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)", fontWeight: 700, cursor: "pointer",
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.04em",
          flexShrink: 0, width: "100%", transition: "transform 0.15s ease",
          boxShadow: "0 4px 16px rgba(178,34,52,0.35)",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >Lock it in!</button>
      )}
      {allCorrect && (
        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: C.dim, fontFamily: "'JetBrains Mono', monospace", animation: "pulse 1s ease infinite", flexShrink: 0 }}>
          Chaos sorted...
        </div>
      )}
    </div>
  );
}

// ============================================================
// SHARE ICONS
// ============================================================
function ShareIcons({ stars, time }) {
  const { display } = formatTime(time);
  const msg = `I sorted the Trumpline chaos in ${display} 🇺🇸 Can you? — trumpline.vercel.app`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
  const igUrl = "https://www.instagram.com/";

  const btnStyle = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px",
    padding: "0.6rem 0", cursor: "pointer", display: "flex", flexDirection: "column",
    alignItems: "center", gap: "0.3rem", flex: 1, transition: "background 0.15s ease",
  };
  const labelStyle = { fontSize: "0.58rem", color: C.dim, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" };

  return (
    <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
      <button style={btnStyle} onClick={() => { navigator.clipboard.writeText(msg); window.open(igUrl, "_blank"); }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1" fill={C.text} stroke="none"/></svg>
        <span style={labelStyle}>INSTAGRAM</span>
      </button>
      <button style={btnStyle} onClick={() => window.open(waUrl, "_blank")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span style={labelStyle}>WHATSAPP</span>
      </button>
      <button style={btnStyle} onClick={() => window.open(xUrl, "_blank")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill={C.text}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        <span style={labelStyle}>X / TWITTER</span>
      </button>
      <button style={btnStyle} onClick={() => navigator.clipboard.writeText(msg)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span style={labelStyle}>COPY</span>
      </button>
    </div>
  );
}

// ============================================================
// SCREEN: COMPLETE
// ============================================================
function CompleteScreen({ time, attempts, puzzle, onViewChain, firstVisit, onMount }) {
  const stars = getStars(attempts);
  const { display } = formatTime(time);
  const [celebWord] = useState(() => getCelebWord(stars));
  const [showConfetti, setShowConfetti] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      onMount();
      if (firstVisit) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); }
    }
  }, [firstVisit, onMount]);

  return (
    <>
      <Confetti active={showConfetti} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1.5rem 1.5rem", maxWidth: "440px", margin: "0 auto", minHeight: "100dvh", justifyContent: "center" }}>

        <StarDisplay stars={stars} size={34} celebrate={firstVisit} />

        <div style={{ marginTop: "0.75rem", fontSize: "1.8rem", fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", color: C.gold, letterSpacing: "-0.01em" }}>
          {celebWord}
        </div>

        {/* Score card */}
        <div style={{ marginTop: "1.25rem", background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "1.25rem 1.5rem", width: "100%", display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "0.6rem", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Time</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: C.text }}>{display}</div>
          </div>
          <div style={{ width: "1px", background: C.border }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "0.6rem", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Attempts</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: C.text }}>{attempts}</div>
          </div>
          <div style={{ width: "1px", background: C.border }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "0.6rem", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Stars</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: C.gold }}>{"★".repeat(stars)}</div>
          </div>
        </div>

        {/* View chain */}
        <button onClick={onViewChain} style={{ marginTop: "0.75rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "0.5rem 1.25rem", color: C.dim, fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          See correct order
        </button>

        {/* Share */}
        <div style={{ fontSize: "1rem", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif", marginTop: "1.5rem", marginBottom: "0.6rem" }}>
          {shareCta}
        </div>
        <ShareIcons stars={stars} time={time} />

        <div style={{ fontSize: "0.62rem", color: C.dimmer, fontFamily: "'JetBrains Mono', monospace", marginTop: "1.25rem" }}>
          Fresh chaos every day
        </div>
      </div>
    </>
  );
}

// ============================================================
// APP ROOT
// ============================================================
const SCREENS = { LOADING: "loading", ERROR: "error", INTRO: "intro", REVEAL: "reveal", PLAYING: "playing", CHAIN_VIEW: "chain_view", COMPLETE: "complete" };

export default function TrumplineApp() {
  const [screen, setScreen] = useState(SCREENS.LOADING);
  const [puzzle, setPuzzle] = useState(null);
  const [answerOrder, setAnswerOrder] = useState([]);
  const [yearMap, setYearMap] = useState({});
  const [events, setEvents] = useState([]);
  const [revealEvents, setRevealEvents] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [lockedCorrect, setLockedCorrect] = useState({});
  const [wrongCards, setWrongCards] = useState({});
  const confettiShown = useRef(false);
  const timer = useTimer();

  useEffect(() => {
    const localDate = new Date().toLocaleDateString("en-CA");
    fetch(`/api/trump-puzzle?date=${localDate}`)
      .then(r => { if (!r.ok) throw new Error("No puzzle"); return r.json(); })
      .then(data => {
        setPuzzle(data.puzzle);
        setAnswerOrder(data.answerOrder);
        setYearMap(data.yearMap);
        setScreen(SCREENS.INTRO);
      })
      .catch(() => setScreen(SCREENS.ERROR));
  }, []);

  const handleStart = () => {
    const evts = puzzle.events.map(e => ({ ...e, year: yearMap[e.id] }));
    const shuffled = shuffleArray(evts);
    setEvents(shuffled); setRevealEvents(shuffled);
    setAttempts(0); setLockedCorrect({}); setWrongCards({});
    setScreen(SCREENS.REVEAL);
  };

  const handleRevealComplete = useCallback(() => {
    const evts = puzzle.events.map(e => ({ ...e, year: yearMap[e.id] }));
    setEvents(shuffleArray(evts));
    setScreen(SCREENS.PLAYING);
    timer.start();
  }, [timer, puzzle, yearMap]);

  const handleReorder = useCallback((newEvents) => setEvents(newEvents), []);

  const handleLockIn = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const newLocked = { ...lockedCorrect }; const newWrong = {};
    events.forEach((ev, i) => {
      if (lockedCorrect[ev.id]) return;
      if (ev.id === answerOrder[i]) newLocked[ev.id] = true;
      else newWrong[ev.id] = true;
    });
    setLockedCorrect(newLocked); setWrongCards(newWrong);
    setTimeout(() => setWrongCards({}), 800);
    if (Object.keys(newLocked).length === 7) {
      timer.stop();
      setTimeout(() => setScreen(SCREENS.COMPLETE), 3200);
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100dvh", color: C.text, fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{globalStyles}</style>
      {screen === SCREENS.LOADING && <LoadingScreen />}
      {screen === SCREENS.ERROR && <ErrorScreen />}
      {screen === SCREENS.INTRO && puzzle && <IntroScreen puzzle={puzzle} onStart={handleStart} />}
      {screen === SCREENS.REVEAL && <RevealScreen events={revealEvents} onRevealComplete={handleRevealComplete} />}
      {screen === SCREENS.PLAYING && (
        <PlayingScreen events={events} lockedCorrect={lockedCorrect} wrongCards={wrongCards}
          onReorder={handleReorder} onLockIn={handleLockIn} timeDisplay={formatTime(timer.time).display} />
      )}
      {screen === SCREENS.CHAIN_VIEW && (
        <PlayingScreen events={events} lockedCorrect={lockedCorrect} wrongCards={{}}
          onReorder={() => {}} onLockIn={() => {}} timeDisplay=""
          isReadOnly={true} onBackToResults={() => setScreen(SCREENS.COMPLETE)} />
      )}
      {screen === SCREENS.COMPLETE && puzzle && (
        <CompleteScreen time={timer.time} attempts={attempts} puzzle={puzzle}
          onViewChain={() => setScreen(SCREENS.CHAIN_VIEW)}
          firstVisit={!confettiShown.current} onMount={() => { confettiShown.current = true; }} />
      )}
    </div>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700;900&family=DM+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
  body { background: #0A1628; margin: 0; overflow: hidden; }
  html { overflow: hidden; }
  ::-webkit-scrollbar { display: none; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  @keyframes celebrate { 0%{transform:scale(1)} 25%{transform:scale(1.03) rotate(-0.5deg)} 50%{transform:scale(1.05) rotate(0.5deg)} 75%{transform:scale(1.03) rotate(-0.3deg)} 100%{transform:scale(1)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes starPop { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.5);opacity:1} 75%{transform:scale(0.9)} 100%{transform:scale(1.15);opacity:1} }
  @keyframes confettiFall { 0%{transform:translateY(-10px) translateX(0) rotate(0deg);opacity:1} 85%{opacity:1} 100%{transform:translateY(110vh) translateX(var(--cdrift)) rotate(var(--crot));opacity:0} }
`;
