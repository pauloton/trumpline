"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const BG_IMG = "/Trumple_BG.jpg";

const C = {
  bg:       "#0A1628",
  card:     "rgba(255,255,255,0.07)",
  cardOver: "rgba(255,255,255,0.13)",
  locked:   "#F5C518",
  border:   "rgba(255,255,255,0.12)",
  borderHi: "rgba(255,255,255,0.28)",
  red:      "#B22234",
  gold:     "#F5C518",
  text:     "#ffffff",
  dim:      "rgba(255,255,255,0.45)",
  dimmer:   "rgba(255,255,255,0.25)",
  dimmest:  "rgba(255,255,255,0.08)",
};

function shuffleArray(arr) {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function formatTime(ms) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  return { display: mins + ":" + secs.toString().padStart(2,"0") + "." + centis.toString().padStart(2,"0") };
}

// stars = what you EARN if you solve it on this attempt
// failedAttempts = wrong Lock-Its so far (0, 1, 2)
// After 3 failed attempts → game over, never reaches complete
function getStars(failedAttempts) {
  if (failedAttempts === 0) return 3;
  if (failedAttempts === 1) return 2;
  return 1; // failedAttempts === 2
}

const MAX_ATTEMPTS = 3; // game over after this many failed lock-ins

function getStats() {
  if (typeof window === "undefined") return { played: 0, perfects: 0, best: null };
  try {
    return {
      played:   parseInt(localStorage.getItem("trumple_played")   || "0", 10),
      perfects: parseInt(localStorage.getItem("trumple_perfects") || "0", 10),
      best:     parseInt(localStorage.getItem("trumple_best")     || "0", 10) || null,
    };
  } catch { return { played: 0, perfects: 0, best: null }; }
}
function saveStats(timeMs, stars) {
  if (typeof window === "undefined") return;
  try {
    const prev = getStats();
    localStorage.setItem("trumple_played",   String(prev.played + 1));
    localStorage.setItem("trumple_perfects", String(prev.perfects + (stars === 3 ? 1 : 0)));
    if (timeMs && (!prev.best || timeMs < prev.best)) localStorage.setItem("trumple_best", String(timeMs));
  } catch {}
}

function useTimer() {
  const [time, setTime] = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);
  const runRef   = useRef(false);
  const tick = useCallback(() => {
    if (!runRef.current) return;
    setTime(Date.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);
  const start = useCallback(() => {
    startRef.current = Date.now(); runRef.current = true;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);
  const stop = useCallback(() => {
    runRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);
  return { time, start, stop };
}

const WORDS_3 = ["Beautiful!", "Tremendous!", "Like nobody's ever seen!", "The greatest in history!", "Unbelievable!", "Phenomenal!", "Record-breaking!"];
const WORDS_2 = ["Terrific!", "Outstanding!", "Brilliant!", "Incredible!", "Fantastic!", "Huge!", "The best!"];
const WORDS_1 = ["Amazing!", "Winning!", "Never before!"];
function getCelebWord(stars) {
  const list = stars === 3 ? WORDS_3 : stars === 2 ? WORDS_2 : WORDS_1;
  return list[Math.floor(Math.random() * list.length)];
}

const SHARE_CTAS = ["Share your score!", "Spread the chaos!", "Tell them!", "Pass it on!", "Think you can beat this?"];
const shareCta = SHARE_CTAS[Math.floor(Math.random() * SHARE_CTAS.length)];

function Confetti({ active }) {
  const pieces = useRef(
    Array.from({ length: 70 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 1.4,
      duration: 1.6 + Math.random() * 1.4,
      color: ["#B22234","#B22234","#ffffff","#ffffff","#1C3F8C","#1C3F8C","#F5C518"][i % 7],
      size: 5 + Math.random() * 7, drift: (Math.random() - 0.5) * 80, rot: Math.random() * 360,
    }))
  ).current;
  if (!active) return null;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:9999 }}>
      {pieces.map(pc => (
        <div key={pc.id} style={{
          position:"absolute", top:0, left:pc.x+"%",
          width:pc.size+"px", height:(pc.size*0.45)+"px",
          background:pc.color, borderRadius:"2px",
          "--cdrift":pc.drift+"px", "--crot":(pc.rot+540)+"deg",
          animation:"confettiFall "+pc.duration+"s ease-in "+pc.delay+"s both",
        }}/>
      ))}
    </div>
  );
}

function StarDisplay({ stars, size = 28, celebrate = false }) {
  const [vis, setVis] = useState(celebrate ? 0 : stars);
  useEffect(() => {
    if (!celebrate) { setVis(stars); return; }
    setVis(0);
    const timers = [];
    for (let i = 1; i <= stars; i++)
      timers.push(setTimeout(() => setVis(i), 200 + i * 145));
    return () => timers.forEach(clearTimeout);
  }, [celebrate, stars]);
  return (
    <div style={{ display:"flex", gap:"8px" }}>
      {Array.from({ length: stars }, (_, i) => {
        const filled = i + 1 <= vis;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24"
            fill={filled ? C.gold : "none"} stroke={C.gold} strokeWidth="2" strokeLinejoin="round"
            style={{
              opacity: filled ? 1 : 0.15, transform: filled ? "scale(1.15)" : "scale(0.9)",
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              animation: filled && celebrate ? "starPop 0.35s ease "+(0.17+(i+1)*0.145)+"s both" : "none",
            }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        );
      })}
    </div>
  );
}

function AnimatedLogo() {
  const word = "TRUMPLE";
  const letters = word.split("");
  const n = letters.length;
  const [positions, setPositions] = useState(() => {
    const idx = letters.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  });
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    let current = [...positions];
    let tick = 0; const CHAOS = 22; let step = 0;
    const interval = setInterval(() => {
      tick++;
      if (tick <= CHAOS) {
        for (let k = 0; k < 4; k++) {
          const a = Math.floor(Math.random() * n);
          const b = Math.floor(Math.random() * n);
          [current[a], current[b]] = [current[b], current[a]];
        }
        setPositions([...current]);
      } else {
        let moved = false;
        for (let i = step; i < n; i++) {
          if (current[i] !== i) {
            const from = current.indexOf(step);
            [current[from], current[step]] = [current[step], current[from]];
            setPositions([...current]); step++; moved = true; break;
          } else { step++; }
        }
        if (!moved || current.every((v, i) => v === i)) { clearInterval(interval); setSolved(true); }
      }
    }, 65);
    return () => clearInterval(interval);
  }, []);

  const lw = "clamp(2.4rem, 8.4vw, 4.8rem)";
  const fs = "clamp(2.4rem, 8.4vw, 4.8rem)";
  const h  = "clamp(3rem, 10.5vw, 5.7rem)";

  return (
    <div style={{ position:"relative", height:h, width:"calc("+lw+" * "+n+")", margin:"0 auto" }}>
      {letters.map((letter, correctIdx) => {
        const dispIdx = positions.indexOf(correctIdx);
        return (
          <span key={correctIdx} style={{
            position:"absolute", left:"calc("+lw+" * "+dispIdx+")", top:0,
            width:lw, textAlign:"center", fontSize:fs, fontWeight:900,
            fontFamily:"'Nunito', sans-serif",
            color: solved ? C.text : C.dimmer,
            transition:"left 0.16s cubic-bezier(0.34,1.56,0.64,1), color 0.5s ease",
            lineHeight:1.1, userSelect:"none",
          }}>{letter}</span>
        );
      })}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100dvh" }}>
      <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:900, fontSize:"2.2rem", color:C.text }}>TRUMPLE</div>
      <div style={{ marginTop:"1rem", color:C.dimmer, fontSize:"0.8rem", fontFamily:"'JetBrains Mono', monospace", animation:"pulse 1.5s ease infinite" }}>
        Loading today&apos;s chaos...
      </div>
    </div>
  );
}

function ErrorScreen() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100dvh", padding:"2rem", textAlign:"center" }}>
      <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:900, fontSize:"2.2rem", color:C.text }}>TRUMPLE</div>
      <div style={{ marginTop:"1.5rem", color:C.dim, fontSize:"0.9rem" }}>No puzzle today</div>
      <div style={{ marginTop:"0.5rem", color:C.dimmer, fontSize:"0.75rem" }}>Check back tomorrow!</div>
    </div>
  );
}

function IntroScreen({ onStart, puzzle }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);
  const dateLabel = new Date(puzzle.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday:"long", month:"long", day:"numeric", year:"numeric"
  });
  return (
    <div style={{
      position:"fixed", inset:0,
      backgroundImage: "url(" + BG_IMG + ")",
      backgroundSize:"cover", backgroundPosition:"center bottom",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"2rem", textAlign:"center",
      opacity: show ? 1 : 0,
      transition:"opacity 0.8s ease",
    }}>
      {/* subtle dark overlay so text stays crisp */}
      <div style={{ position:"absolute", inset:0, background:"rgba(10,22,40,0.45)", pointerEvents:"none" }}/>

      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <AnimatedLogo />
        <div style={{ fontSize:"0.8rem", color:C.dimmer, fontFamily:"'JetBrains Mono', monospace", margin:"0.5rem 0 0.8rem" }}>
          {dateLabel}
        </div>
        <button onClick={onStart} style={{
          background:C.red, color:"#ffffff", border:"none", borderRadius:"14px",
          padding:"1rem 3rem", fontSize:"1.05rem", fontWeight:700, cursor:"pointer",
          fontFamily:"'Space Grotesk', sans-serif", letterSpacing:"0.05em",
          transition:"transform 0.2s ease", boxShadow:"0 4px 24px rgba(178,34,52,0.5)",
          display:"block", margin:"0 auto", textAlign:"center", width:"clamp(220px, 65vw, 280px)",
        }}
          onMouseEnter={e => e.target.style.transform="scale(1.05)"}
          onMouseLeave={e => e.target.style.transform="scale(1)"}
        >SORT THE CHAOS</button>
      </div>
    </div>
  );
}

function RevealScreen({ events, onRevealComplete }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (revealed < events.length) { const t = setTimeout(() => setRevealed(r => r+1), 400); return () => clearTimeout(t); }
    else { const t = setTimeout(onRevealComplete, 800); return () => clearTimeout(t); }
  }, [revealed, events.length, onRevealComplete]);
  return (
    <div style={{ width:"100%", maxWidth:"440px", margin:"0 auto", padding:"1rem 0.75rem", height:"100dvh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ height:"1rem", flexShrink:0 }}/>
      <div style={{ display:"flex", flexDirection:"column", gap:"clamp(0.3rem,1vh,0.6rem)", flex:1, minHeight:0 }}>
        {events.map((event, i) => (
          <div key={event.id} style={{
            background:C.card, border:"1px solid "+C.border, borderRadius:"12px",
            padding:"clamp(0.5rem,1.2vh,1rem) clamp(1rem,3vw,1.5rem)",
            display:"flex", alignItems:"center", justifyContent:"center", flex:1, minHeight:0, overflow:"hidden",
            opacity: i < revealed ? 1 : 0, transform: i < revealed ? "translateX(0)" : "translateX(-20px)",
            transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <div style={{ fontSize:"clamp(0.92rem,2.6vw,1.08rem)", fontWeight:600, color:C.text, fontFamily:"'DM Sans', sans-serif", lineHeight:1.18, textAlign:"center" }}>
              {event.title}
            </div>
          </div>
        ))}
      </div>
      {revealed >= events.length && (
        <div style={{ textAlign:"center", marginTop:"1.5rem", fontSize:"0.85rem", color:C.dimmer, fontFamily:"'JetBrains Mono', monospace", animation:"pulse 1s ease infinite" }}>Shuffling...</div>
      )}
    </div>
  );
}

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
  const touchData = useRef({ active:false, index:null, startY:0, clone:null, startTop:0 });
  const eventsRef = useRef(events);
  eventsRef.current = events;

  const handleDragStart = (e, i) => { if (lockedCorrect[events[i]?.id]) return; setDragIndex(i); e.dataTransfer.effectAllowed="move"; };
  const handleDragOver  = (e, i) => { e.preventDefault(); setOverIndex(i); };
  const handleDrop = (e, ti) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== ti && !lockedCorrect[events[dragIndex]?.id])
      onReorder(reorderAroundLocks(events, dragIndex, ti, lockedCorrect));
    setDragIndex(null); setOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setOverIndex(null); };

  const handleTouchStart = useCallback((e, index) => {
    if (lockedCorrect[eventsRef.current[index]?.id]) return;
    const touch = e.touches[0]; const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clone = target.cloneNode(true);
    Object.assign(clone.style, { position:"fixed", left:rect.left+"px", top:rect.top+"px", width:rect.width+"px", zIndex:9999, opacity:"0.9", transform:"scale(1.04)", boxShadow:"0 8px 32px rgba(0,0,0,0.4)", pointerEvents:"none", transition:"none" });
    document.body.appendChild(clone);
    touchData.current = { active:true, index, startY:touch.clientY, clone, startTop:rect.top };
    overIndexRef.current = null; target.style.opacity="0.2";
    const onMove = (ev) => {
      ev.preventDefault();
      const t = ev.touches[0];
      touchData.current.clone.style.top = (touchData.current.startTop + t.clientY - touchData.current.startY)+"px";
      const items = listRef.current?.children; let found = null;
      for (let i = 0; i < items.length; i++) {
        const r = items[i].getBoundingClientRect();
        if (t.clientY >= r.top && t.clientY <= r.bottom && i !== touchData.current.index) { found = i; break; }
      }
      overIndexRef.current = found; setOverIndex(found);
    };
    const onEnd = () => {
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      if (touchData.current.clone?.parentNode) touchData.current.clone.parentNode.removeChild(touchData.current.clone);
      const from = touchData.current.index; const to = overIndexRef.current;
      if (from !== null && to !== null && from !== to && !lockedCorrect[eventsRef.current[from]?.id])
        onReorder(reorderAroundLocks(eventsRef.current, from, to, lockedCorrect));
      if (listRef.current?.children[from]) listRef.current.children[from].style.opacity="1";
      touchData.current = { active:false, index:null, startY:0, clone:null, startTop:0 };
      overIndexRef.current = null; setDragIndex(null); setOverIndex(null);
    };
    document.addEventListener("touchmove", onMove, { passive:false });
    document.addEventListener("touchend", onEnd);
  }, [lockedCorrect, onReorder]);

  return (
    <div ref={listRef} style={{ display:"flex", flexDirection:"column", gap:"clamp(0.25rem,1vh,0.55rem)", flex:1, minHeight:0 }}>
      {events.map((event, index) => {
        const isLocked = !!lockedCorrect[event.id];
        const isWrong  = !!wrongCards[event.id];
        const isOver   = overIndex === index;
        return (
          <div key={event.id} draggable={!isLocked}
            onDragStart={e => handleDragStart(e, index)} onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)} onDragEnd={handleDragEnd}
            onTouchStart={e => handleTouchStart(e, index)}
            style={{
              background: isLocked ? C.locked : isOver ? C.cardOver : C.card,
              border: isLocked ? "none" : isOver ? "1px solid "+C.borderHi : "1px solid "+C.border,
              borderRadius:"12px", padding:"clamp(0.4rem,1.2vh,1rem) clamp(1rem,3vw,1.5rem)",
              display:"flex", alignItems:"center", justifyContent:"center",
              flex:1, minHeight:0, overflow:"hidden",
              cursor: isLocked ? "default" : "grab", userSelect:"none",
              opacity: dragIndex === index ? 0.3 : 1,
              transition: isLocked ? "background 0.3s ease" : "none",
              animation: isWrong ? "shake 0.4s ease" : isLocked ? "celebrate 0.5s ease" : "none",
            }}>
            <div style={{ fontSize:"clamp(0.92rem,2.6vw,1.08rem)", fontWeight:600, color: isLocked ? C.bg : C.text, fontFamily:"'DM Sans', sans-serif", lineHeight:1.18, textAlign:"center" }}>
              {event.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Live star row shown during play, dims one star per failed attempt
function LiveStars({ failedAttempts }) {
  const total = MAX_ATTEMPTS;
  return (
    <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
      {Array.from({ length: total }, (_, i) => {
        const active = i < (total - failedAttempts);
        return (
          <svg key={i} width="18" height="18" viewBox="0 0 24 24"
            fill={active ? C.gold : "none"}
            stroke={active ? C.gold : C.dimmer}
            strokeWidth="2" strokeLinejoin="round"
            style={{ transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)", transform: active ? "scale(1)" : "scale(0.8)", opacity: active ? 1 : 0.3 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        );
      })}
    </div>
  );
}

// Game Over screen, shows correct answer with hints
function GameOverScreen({ events, onViewChain, onMount }) {
  const [stats, setStats] = useState({ played: 0, perfects: 0, best: null });
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      onMount();
      saveStats(null, 0); // counts as played, no time, no perfect
      setStats(getStats());
    }
  }, [onMount]);

  const msg = "I tried to sort the Trumple chaos \uD83C\uDDFA\uD83C\uDDF8 Can you do better? \u2014 trumple.vercel.app";
  const shareLinks = {
    wa: "https://wa.me/?text=" + encodeURIComponent(msg),
    x:  "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg),
    fb: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("https://trumple.vercel.app"),
    ig: "https://www.instagram.com/",
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem 1.25rem", maxWidth:"440px", margin:"0 auto", minHeight:"100dvh", justifyContent:"center" }}>
      {/* Game over header */}
      <div style={{ fontSize:"2rem", fontWeight:900, fontFamily:"'Space Grotesk', sans-serif", color:C.red, letterSpacing:"-0.01em" }}>Game Over.</div>
      <div style={{ fontSize:"0.8rem", color:C.dimmer, fontFamily:"'JetBrains Mono', monospace", marginTop:"0.4rem", marginBottom:"1.25rem" }}>Here&apos;s what the order was:</div>

      {/* Correct answer, compact cards */}
      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:"0.3rem" }}>
        {events.map((ev, i) => (
          <div key={ev.id} style={{ background:C.card, border:"1px solid "+C.border, borderRadius:"10px", padding:"0.55rem 1rem", display:"flex", alignItems:"baseline", gap:"0.6rem" }}>
            <span style={{ fontSize:"0.6rem", color:C.dimmer, fontFamily:"'JetBrains Mono', monospace", fontWeight:700, flexShrink:0 }}>{ev.year}</span>
            <span style={{ fontSize:"0.82rem", fontWeight:600, color:C.text, fontFamily:"'DM Sans', sans-serif", lineHeight:1.3 }}>{ev.title}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ marginTop:"1.25rem", display:"flex", gap:"0.5rem", width:"100%" }}>
        {[
          { label:"PLAYED",         val: stats.played   || 1 },
          { label:"PERFECT SCORES", val: stats.perfects || 0 },
          { label:"BEST",           val: stats.best ? formatTime(stats.best).display : "-" },
        ].map(({ label, val }) => (
          <div key={label} style={{ flex:1, background:C.card, border:"1px solid "+C.border, borderRadius:"12px", padding:"0.75rem 0.4rem", textAlign:"center" }}>
            <div style={{ fontSize:"0.48rem", color:C.dimmer, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.3rem", lineHeight:1.3 }}>{label}</div>
            <div style={{ fontSize:"0.95rem", fontWeight:700, fontFamily:"'JetBrains Mono', monospace", color:C.text }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Share */}
      <div style={{ fontSize:"0.9rem", fontWeight:700, color:C.text, fontFamily:"'Space Grotesk', sans-serif", marginTop:"1.5rem", marginBottom:"0.6rem" }}>Think you can beat this?</div>
      <div style={{ display:"flex", gap:"0.6rem", width:"100%" }}>
        {[["ig", shareLinks.ig], ["wa", shareLinks.wa], ["x", shareLinks.x], ["fb", shareLinks.fb]].map(([k, href]) => (
          <a key={k} href={href} target="_blank" rel="noopener noreferrer" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:C.card, border:"1px solid "+C.border, borderRadius:"14px", padding:"0.9rem 0", textDecoration:"none" }}>
            {k === "ig" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1" fill={C.text} stroke="none"/></svg>}
            {k === "wa" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>}
            {k === "x"  && <svg width="20" height="20" viewBox="0 0 24 24" fill={C.text}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
            {k === "fb" && <svg width="20" height="20" viewBox="0 0 24 24" fill={C.text}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
          </a>
        ))}
      </div>
    </div>
  );
}

function PlayingScreen({ events, lockedCorrect, wrongCards, onReorder, onLockIn, timeDisplay, failedAttempts=0, isReadOnly=false, onBackToResults }) {
  const allCorrect = events.length > 0 && events.every(ev => lockedCorrect[ev.id]);
  const lockedCount = Object.keys(lockedCorrect).length;

  if (isReadOnly) {
    return (
      <div style={{ width:"100%", maxWidth:"440px", margin:"0 auto", padding:"1rem 0.75rem", height:"100dvh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, marginBottom:"0.75rem" }}>
          <button onClick={onBackToResults} style={{ background:"transparent", border:"none", color:C.dim, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontSize:"0.85rem" }}>&#8592; Back to Score</button>
          <div style={{ fontSize:"0.68rem", color:C.dimmer, fontFamily:"'JetBrains Mono', monospace", textTransform:"uppercase", letterSpacing:"0.05em" }}>Correct Order</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"clamp(0.25rem,1vh,0.55rem)", flex:1, minHeight:0 }}>
          {events.map(event => (
            <div key={event.id} style={{ background:C.locked, borderRadius:"12px", padding:"clamp(0.4rem,1.2vh,1rem) clamp(1rem,3vw,1.5rem)", display:"flex", alignItems:"center", justifyContent:"center", flex:1, minHeight:0, overflow:"hidden" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"clamp(0.92rem,2.6vw,1.08rem)", fontWeight:600, color:C.bg, fontFamily:"'DM Sans', sans-serif", lineHeight:1.18 }}>{event.title}</div>
                <div style={{ fontSize:"clamp(0.6rem,1.6vw,0.72rem)", color:"rgba(10,22,40,0.6)", marginTop:"0.15rem", fontFamily:"'JetBrains Mono', monospace" }}>{event.hint}</div>
                <div style={{ fontSize:"clamp(0.6rem,1.6vw,0.7rem)", color:"rgba(10,22,40,0.4)", marginTop:"0.08rem", fontFamily:"'JetBrains Mono', monospace", fontWeight:700 }}>{event.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width:"100%", maxWidth:"440px", margin:"0 auto", padding:"1rem 0.75rem", height:"100dvh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Header: stars left, timer right */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, marginBottom:"0.5rem" }}>
        <LiveStars failedAttempts={failedAttempts}/>
        <div style={{ fontSize:"clamp(1.1rem,3.2vw,1.35rem)", fontFamily:"'JetBrains Mono', monospace", color:C.gold, fontWeight:700, letterSpacing:"0.04em" }}>{timeDisplay}</div>
      </div>
      <div style={{ height:"3px", background:C.dimmest, borderRadius:"2px", marginBottom:"0.6rem", flexShrink:0 }}>
        <div style={{ height:"100%", width:((lockedCount/7)*100)+"%", background:C.red, borderRadius:"2px", transition:"width 0.4s ease" }}/>
      </div>
      <DraggableList events={events} lockedCorrect={lockedCorrect} wrongCards={wrongCards} onReorder={onReorder}/>
      {!allCorrect && (
        <button onClick={onLockIn} style={{
          marginTop:"clamp(0.5rem,1.5vh,1rem)", background:C.red, color:"#fff",
          border:"none", borderRadius:"14px", padding:"clamp(0.7rem,1.8vh,1rem) 2rem",
          fontSize:"clamp(0.9rem,2.5vw,1.05rem)", fontWeight:900, cursor:"pointer",
          fontFamily:"'Space Grotesk', sans-serif", letterSpacing:"0.04em",
          flexShrink:0, width:"100%", transition:"transform 0.15s ease",
          boxShadow:"0 4px 18px rgba(178,34,52,0.4)",
        }}
          onMouseEnter={e => e.currentTarget.style.transform="scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
        >Lock It In!</button>
      )}
      {allCorrect && (
        <div style={{ textAlign:"center", marginTop:"1rem", fontSize:"0.85rem", color:C.dim, fontFamily:"'JetBrains Mono', monospace", animation:"pulse 1s ease infinite", flexShrink:0 }}>Chaos sorted...</div>
      )}
    </div>
  );
}

function ShareIcons({ time }) {
  const { display } = formatTime(time);
  const msg = "Huge win! I solved Trumple in " + display + ". Can you? \u2014 trumple.vercel.app";
  const waUrl = "https://wa.me/?text=" + encodeURIComponent(msg);
  const xUrl  = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg);
  const fbUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("https://trumple.vercel.app") + "&quote=" + encodeURIComponent(msg);
  const igUrl = "https://www.instagram.com/";
  const iconBtn = (href, svg) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      flex:1, display:"flex", alignItems:"center", justifyContent:"center",
      background:C.card, border:"1px solid "+C.border, borderRadius:"14px",
      padding:"0.9rem 0", textDecoration:"none", transition:"background 0.15s, transform 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background=C.cardOver; e.currentTarget.style.transform="scale(1.07)"; }}
      onMouseLeave={e => { e.currentTarget.style.background=C.card; e.currentTarget.style.transform="scale(1)"; }}
    >{svg}</a>
  );
  return (
    <div style={{ display:"flex", gap:"0.6rem", width:"100%" }}>
      {iconBtn(igUrl, <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r="1" fill={C.text} stroke="none"/></svg>)}
      {iconBtn(waUrl, <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>)}
      {iconBtn(xUrl,  <svg width="22" height="22" viewBox="0 0 24 24" fill={C.text}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>)}
      {iconBtn(fbUrl, <svg width="22" height="22" viewBox="0 0 24 24" fill={C.text}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>)}
    </div>
  );
}

function CompleteScreen({ time, failedAttempts, onViewChain, firstVisit, onMount }) {
  const stars = getStars(failedAttempts);
  const { display } = formatTime(time);
  const [celebWord] = useState(() => getCelebWord(stars));
  const [showConfetti, setShowConfetti] = useState(false);
  const [stats, setStats] = useState({ played: 0, perfects: 0, best: null });
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true; onMount(); saveStats(time, stars); setStats(getStats());
      if (firstVisit) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); }
    }
  }, [firstVisit, onMount, time, stars]);

  const bestDisplay = stats.best ? formatTime(stats.best).display : display;

  return (
    <>
      <Confetti active={showConfetti}/>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem 1.25rem", maxWidth:"440px", margin:"0 auto", minHeight:"100dvh", justifyContent:"center" }}>
        <StarDisplay stars={stars} size={32} celebrate={firstVisit}/>
        <div style={{ marginTop:"0.6rem", fontSize:"1.6rem", fontWeight:900, fontFamily:"'Space Grotesk', sans-serif", color:C.gold, letterSpacing:"-0.01em" }}>{celebWord}</div>
        <div style={{ marginTop:"1rem", fontSize:"clamp(3rem,12vw,4.5rem)", fontWeight:700, fontFamily:"'JetBrains Mono', monospace", color:C.text, letterSpacing:"-0.02em", lineHeight:1 }}>{display}</div>
        <div style={{ marginTop:"1rem", display:"flex", gap:"0.5rem", width:"100%" }}>
          {[
            { label:"PLAYED",         val: stats.played   || 1 },
            { label:"PERFECT SCORES", val: stats.perfects || 0 },
            { label:"BEST",           val: bestDisplay },
          ].map(({ label, val }) => (
            <div key={label} style={{ flex:1, background:C.card, border:"1px solid "+C.border, borderRadius:"12px", padding:"0.75rem 0.4rem", textAlign:"center" }}>
              <div style={{ fontSize:"0.48rem", color:C.dimmer, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.3rem", lineHeight:1.3 }}>{label}</div>
              <div style={{ fontSize:"1rem", fontWeight:700, fontFamily:"'JetBrains Mono', monospace", color:C.text }}>{val}</div>
            </div>
          ))}
        </div>
        <button onClick={onViewChain} style={{ marginTop:"0.75rem", background:"transparent", border:"1px solid "+C.border, borderRadius:"10px", padding:"0.5rem 1.25rem", color:C.dim, fontFamily:"'DM Sans', sans-serif", fontSize:"0.8rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.4rem" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          See correct order
        </button>
        <div style={{ fontSize:"0.95rem", fontWeight:700, color:C.text, fontFamily:"'Space Grotesk', sans-serif", marginTop:"1.5rem", marginBottom:"0.6rem" }}>{shareCta}</div>
        <ShareIcons time={time}/>
      </div>
    </>
  );
}

const SCREENS = { LOADING:"loading", ERROR:"error", INTRO:"intro", REVEAL:"reveal", PLAYING:"playing", CHAIN_VIEW:"chain_view", COMPLETE:"complete", GAME_OVER:"game_over" };

export default function TrumpleApp() {
  const [screen, setScreen]             = useState(SCREENS.LOADING);
  const [puzzle, setPuzzle]             = useState(null);
  const [answerOrder, setAnswerOrder]   = useState([]);
  const [yearMap, setYearMap]           = useState({});
  const [events, setEvents]             = useState([]);
  const [revealEvents, setRevealEvents] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedCorrect, setLockedCorrect] = useState({});
  const [wrongCards, setWrongCards]     = useState({});
  const confettiShown = useRef(false);
  const gameOverShown = useRef(false);
  const timer = useTimer();

  useEffect(() => {
    const localDate = new Date().toLocaleDateString("en-CA");
    fetch("/api/trump-puzzle?date=" + localDate)
      .then(r => { if (!r.ok) throw new Error("No puzzle"); return r.json(); })
      .then(data => { setPuzzle(data.puzzle); setAnswerOrder(data.answerOrder); setYearMap(data.yearMap); setScreen(SCREENS.INTRO); })
      .catch(() => setScreen(SCREENS.ERROR));
  }, []);

  const handleStart = () => {
    const evts = puzzle.events.map(e => ({ ...e, year: yearMap[e.id] }));
    const shuffled = shuffleArray(evts);
    setEvents(shuffled); setRevealEvents(shuffled);
    setFailedAttempts(0); setLockedCorrect({}); setWrongCards({});
    setScreen(SCREENS.REVEAL);
  };

  const handleRevealComplete = useCallback(() => {
    const evts = puzzle.events.map(e => ({ ...e, year: yearMap[e.id] }));
    setEvents(shuffleArray(evts)); setScreen(SCREENS.PLAYING); timer.start();
  }, [timer, puzzle, yearMap]);

  const handleReorder = useCallback((newEvents) => setEvents(newEvents), []);

  const handleLockIn = () => {
    const newLocked = { ...lockedCorrect }; const newWrong = {};
    let anyNewCorrect = false;

    events.forEach((ev, i) => {
      if (lockedCorrect[ev.id]) return;
      if (ev.id === answerOrder[i]) { newLocked[ev.id] = true; anyNewCorrect = true; }
      else newWrong[ev.id] = true;
    });

    const allCorrect = Object.keys(newLocked).length === 7;
    setLockedCorrect(newLocked); setWrongCards(newWrong);
    setTimeout(() => setWrongCards({}), 800);

    if (allCorrect) {
      timer.stop();
      setTimeout(() => setScreen(SCREENS.COMPLETE), 3200);
      return;
    }

    // Wrong, burn a star
    const newFailed = failedAttempts + 1;
    setFailedAttempts(newFailed);

    if (newFailed >= MAX_ATTEMPTS) {
      // Reveal correct order for game over screen
      timer.stop();
      // Sort events into correct answer order for display
      const sorted = [...answerOrder].map(id => events.find(ev => ev.id === id) || revealEvents.find(ev => ev.id === id));
      setEvents(sorted.filter(Boolean));
      setTimeout(() => setScreen(SCREENS.GAME_OVER), 1000);
    }
  };

  return (
    <div style={{ background:C.bg, minHeight:"100dvh", color:C.text, fontFamily:"'DM Sans', sans-serif", overflow:"hidden" }}>
      <style>{globalStyles}</style>
      {screen === SCREENS.LOADING    && <LoadingScreen/>}
      {screen === SCREENS.ERROR      && <ErrorScreen/>}
      {screen === SCREENS.INTRO      && puzzle && <IntroScreen puzzle={puzzle} onStart={handleStart}/>}
      {screen === SCREENS.REVEAL     && <RevealScreen events={revealEvents} onRevealComplete={handleRevealComplete}/>}
      {screen === SCREENS.PLAYING    && <PlayingScreen events={events} lockedCorrect={lockedCorrect} wrongCards={wrongCards} onReorder={handleReorder} onLockIn={handleLockIn} timeDisplay={formatTime(timer.time).display} failedAttempts={failedAttempts}/>}
      {screen === SCREENS.CHAIN_VIEW && <PlayingScreen events={events} lockedCorrect={lockedCorrect} wrongCards={{}} onReorder={()=>{}} onLockIn={()=>{}} timeDisplay="" isReadOnly={true} onBackToResults={() => setScreen(SCREENS.COMPLETE)}/>}
      {screen === SCREENS.COMPLETE   && <CompleteScreen time={timer.time} failedAttempts={failedAttempts} onViewChain={() => setScreen(SCREENS.CHAIN_VIEW)} firstVisit={!confettiShown.current} onMount={() => { confettiShown.current = true; }}/>}
      {screen === SCREENS.GAME_OVER  && <GameOverScreen events={events} onMount={() => { gameOverShown.current = true; }}/>}
    </div>
  );
}

const globalStyles = "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&family=Space+Grotesk:wght@300;400;600;700;900&family=DM+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');" +
  "* { box-sizing: border-box; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }" +
  "body { background: #0A1628; margin: 0; overflow: hidden; }" +
  "html { overflow: hidden; }" +
  "::-webkit-scrollbar { display: none; }" +
  "@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }" +
  "@keyframes celebrate { 0%{transform:scale(1)} 25%{transform:scale(1.03) rotate(-0.5deg)} 50%{transform:scale(1.05) rotate(0.5deg)} 75%{transform:scale(1.03) rotate(-0.3deg)} 100%{transform:scale(1)} }" +
  "@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }" +
  "@keyframes starPop { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.5);opacity:1} 75%{transform:scale(0.9)} 100%{transform:scale(1.15);opacity:1} }" +
  "@keyframes confettiFall { 0%{transform:translateY(-10px) translateX(0) rotate(0deg);opacity:1} 85%{opacity:1} 100%{transform:translateY(110vh) translateX(var(--cdrift)) rotate(var(--crot));opacity:0} }";
