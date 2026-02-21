# Trumple Batch 1 — Copy-paste replacements for page.js

## Change 1: Celebration words
Find and replace the 3 WORDS_ constants (around line where getCelebWord is defined):

OLD:
```js
const WORDS_3 = ["Beautiful!", "Tremendous!", "Like nobody's ever seen!", "The greatest in history!", "Unbelievable!", "Phenomenal!", "Record-breaking!"];
const WORDS_2 = ["Terrific!", "Outstanding!", "Brilliant!", "Incredible!", "Fantastic!", "Huge!", "The best!"];
const WORDS_1 = ["Amazing!", "Winning!", "Never before!"];
```

NEW:
```js
const WORDS_3 = ["HUGE!", "THE BEST!", "JUST BEAUTIFUL!", "UNBELIEVABLE!", "BIG LEAGUE!", "INCREDIBLE!", "FANTASTIC!"];
const WORDS_2 = ["SO GOOD!", "VERY, VERY SPECIAL!", "A BEAUTIFUL THING!", "HISTORIC!", "TOTAL SUCCESS!"];
const WORDS_1 = ["THE GREATEST!", "ABSOLUTELY PERFECT!"];
```

---

## Change 2: IntroScreen component
Find `function IntroScreen({ onStart, puzzle }) {` and replace the entire function with:

```jsx
function IntroScreen({ onStart, puzzle }) {
  const [show, setShow] = useState(false);
  const [taglines, setTaglines] = useState(0); // 0 = none, 1–3 = reveal one by one
  const dateLabel = new Date(puzzle.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday:"long", month:"long", day:"numeric", year:"numeric"
  });

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  // After the logo animation settles (~1.8s), reveal taglines one by one
  useEffect(() => {
    if (!show) return;
    const t1 = setTimeout(() => setTaglines(1), 1900);
    const t2 = setTimeout(() => setTaglines(2), 2400);
    const t3 = setTimeout(() => setTaglines(3), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [show]);

  const TAGLINES = ["Seven Trump Events.", "Sort Them.", "Beat The Clock."];

  return (
    <div style={{
      position:"fixed", inset:0,
      backgroundImage: "url(" + BG_IMG + ")",
      backgroundSize:"cover", backgroundPosition:"center bottom",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"space-between",
      padding:"0",
      opacity: show ? 1 : 0,
      transition:"opacity 0.8s ease",
    }}>
      {/* dark overlay */}
      <div style={{ position:"absolute", inset:0, background:"rgba(10,22,40,0.45)", pointerEvents:"none" }}/>

      {/* TOP: date */}
      <div style={{ position:"relative", zIndex:1, width:"100%", textAlign:"center", paddingTop:"env(safe-area-inset-top, 1.5rem)", marginTop:"1.5rem" }}>
        <div style={{ fontSize:"0.72rem", color:C.dimmer, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.06em", textTransform:"uppercase" }}>
          {dateLabel}
        </div>
      </div>

      {/* MIDDLE: logo + taglines */}
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", flex:1, justifyContent:"center" }}>
        <AnimatedLogo />
        <div style={{ marginTop:"1.4rem", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.45rem", minHeight:"5rem" }}>
          {TAGLINES.map((line, i) => (
            <div key={i} style={{
              fontSize:"clamp(1rem, 4vw, 1.25rem)",
              fontWeight: i === 1 ? 900 : 400,
              color: i === 1 ? C.gold : C.text,
              fontFamily:"'Space Grotesk', sans-serif",
              letterSpacing: i === 1 ? "0.08em" : "0.02em",
              opacity: taglines > i ? 1 : 0,
              transform: taglines > i ? "translateY(0)" : "translateY(8px)",
              transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM: button */}
      <div style={{ position:"relative", zIndex:1, width:"100%", display:"flex", justifyContent:"center", paddingBottom:"clamp(2.5rem,8vh,5rem)" }}>
        <button onClick={onStart} style={{
          background:C.red, color:"#ffffff", border:"none", borderRadius:"14px",
          padding:"1rem 3rem", fontSize:"1.05rem", fontWeight:700, cursor:"pointer",
          fontFamily:"'Space Grotesk', sans-serif", letterSpacing:"0.05em",
          transition:"transform 0.2s ease", boxShadow:"0 4px 24px rgba(178,34,52,0.5)",
          width:"clamp(220px, 65vw, 280px)",
        }}
          onMouseEnter={e => e.target.style.transform="scale(1.05)"}
          onMouseLeave={e => e.target.style.transform="scale(1)"}
        >SORT THE CHAOS</button>
      </div>
    </div>
  );
}
```
