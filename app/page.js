import { NextResponse } from "next/server";

// ============================================================
// EVENT POOL, spanning 2015–2025
// Grouped into 6 eras. Each week draws 1 from each of the
// first 5 eras, and 2 from Era F (2025) = 7 total.
//
// TO ADD AN EVENT: append to the right era. Done.
//
// ⚠️  TITLE RULES, enforced forever:
//   • MAX 65 characters per title (fits 2 lines on mobile)
//   • NO em dashes (they are stripped automatically at serve time)
//   • Be punchy. Cut every word that is not essential.
//   • Test: count the chars before you commit.
// ============================================================
const POOL = {

  // Era A: 2015–2016, The Rise
  A: [
    { id: "a1", title: "Trump launches his run, calling Mexican immigrants 'rapists'", hint: "June 16, 2015", year: 2015 },
    { id: "a2", title: "Trump: 'I like people who weren't captured'", hint: "Iowa Family Leadership Summit, July 2015", year: 2015 },
    { id: "a3", title: "Trump calls for a complete ban on Muslims entering the US", hint: "December 2015", year: 2015 },
    { id: "a4", title: "Access Hollywood tape: Trump caught boasting about groping women", hint: "Billy Bush. A bus. A hot mic.", year: 2016 },
    { id: "a5", title: "Trump refuses to say he will accept the 2016 election result", hint: "Clinton called it 'horrifying'", year: 2016 },
    { id: "a6", title: "Trump wins the 2016 election, shocking the world", hint: "The night everyone got it wrong", year: 2016 },
    { id: "a7", title: "Trump settles Trump University fraud suit for $25 million", hint: "Students claimed they were defrauded of thousands", year: 2016 },
    { id: "a8", title: "Spicer claims Trump's inauguration was 'the largest ever'", hint: "Alternative facts. Day one.", year: 2017 },
  ],

  // Era B: 2017–2018, First Term Chaos
  B: [
    { id: "b1",  title: "Trump signs the Muslim travel ban, chaos erupts at airports", hint: "Courts block it. He tries twice more.", year: 2017 },
    { id: "b2",  title: "Flynn resigns after 24 days for lying to Pence about Russia", hint: "The shortest NSA tenure in history", year: 2017 },
    { id: "b3",  title: "Trump fires FBI Director Comey over 'the Russia thing'", hint: "Then told Russian officials in the Oval Office the very next day", year: 2017 },
    { id: "b4",  title: "Scaramucci fired as Communications Director after 10 days", hint: "An all-time record even by Trump standards", year: 2017 },
    { id: "b5",  title: "Trump says 'very fine people on both sides' at Charlottesville", hint: "A remark that follows him still", year: 2017 },
    { id: "b6",  title: "Trump tweets his nuclear button is bigger than Kim's", hint: "New Year's Day, 2018", year: 2018 },
    { id: "b7",  title: "Trump hits China with tariffs on $34 billion of goods", hint: "China retaliates immediately, dollar for dollar", year: 2018 },
    { id: "b8",  title: "Trump meets Kim Jong-un, first US president to do so", hint: "A historic handshake. No deal ever followed.", year: 2018 },
    { id: "b9",  title: "2,000+ migrant children separated from parents at the border", hint: "Children in cages. Global outrage.", year: 2018 },
    { id: "b10", title: "Sessions forced out as AG the day after the midterms", hint: "'I don't have an Attorney General', Trump, for months", year: 2018 },
  ],

  // Era C: 2019–2020, Impeachment I & COVID
  C: [
    { id: "c1", title: "Trump asks Ukraine to investigate Biden, sparking impeachment", hint: "July 25, 2019. The 'perfect phone call'.", year: 2019 },
    { id: "c2", title: "Trump impeached for the first time, acquitted by the Senate", hint: "Charges: abuse of power and obstruction of Congress", year: 2019 },
    { id: "c3", title: "Trump orders the assassination of General Soleimani in Baghdad", hint: "The world braced for World War Three", year: 2020 },
    { id: "c4", title: "Trump says COVID is 'totally under control' and will disappear", hint: "February 2020. It did not disappear.", year: 2020 },
    { id: "c5", title: "Trump suggests injecting disinfectant as a COVID treatment", hint: "Bleach manufacturers issued safety warnings", year: 2020 },
    { id: "c6", title: "Trump refuses to commit to a peaceful transfer of power", hint: "Asked directly by a reporter. Did not answer.", year: 2020 },
    { id: "c7", title: "Trump fires Defense Secretary Esper by tweet after losing", hint: "Esper had refused to use the military against protesters", year: 2020 },
    { id: "c8", title: "Trump signs the USMCA, finally replacing 'the worst deal ever'", hint: "His signature legislative win of the first term", year: 2020 },
  ],

  // Era D: 2021–2022, Jan 6 & Aftermath
  D: [
    { id: "d1", title: "January 6: Trump supporters storm the US Capitol", hint: "The first breach of the Capitol since 1814", year: 2021 },
    { id: "d2", title: "Trump impeached a second time for inciting the January 6 riot", hint: "First president in history to be impeached twice", year: 2021 },
    { id: "d3", title: "Trump calls Putin 'a genius' as Russia moves into Ukraine", hint: "Days before the full invasion of Ukraine", year: 2022 },
    { id: "d4", title: "FBI raids Mar-a-Lago, finds 300+ classified documents", hint: "Including documents marked Top Secret/SCI", year: 2022 },
    { id: "d5", title: "Trump launches 2024 campaign three days after the midterms", hint: "Two federal indictments still to come at that point", year: 2022 },
    { id: "d6", title: "Trump calls for 'termination' of parts of the Constitution", hint: "Even senior Republicans distanced themselves", year: 2022 },
    { id: "d7", title: "Musk buys Twitter and reinstates Trump's banned account", hint: "Trump returns to the platform he helped build", year: 2022 },
  ],

  // Era E: 2023–2024, Indictments & Return
  E: [
    { id: "e1", title: "Trump indicted over hush money payments to Stormy Daniels", hint: "Manhattan DA Alvin Bragg. 34 counts.", year: 2023 },
    { id: "e2", title: "Trump indicted again over classified docs at Mar-a-Lago", hint: "The boxes in the bathroom. The pool in the background.", year: 2023 },
    { id: "e3", title: "Trump indicted a third time for conspiring to overturn 2020", hint: "Jack Smith. Four federal counts.", year: 2023 },
    { id: "e4", title: "Trump indicted a fourth time in Georgia over 2020 results", hint: "RICO charges. 18 co-defendants.", year: 2023 },
    { id: "e5", title: "Trump wins Iowa with 51%, a record for a non-incumbent", hint: "The primary was effectively over that night", year: 2024 },
    { id: "e6", title: "Supreme Court grants presidents broad immunity for official acts", hint: "A landmark ruling that reshapes the presidency forever", year: 2024 },
    { id: "e7", title: "Trump survives an assassination attempt, bullet grazes his ear", hint: "He pumps his fist. The photo goes around the world.", year: 2024 },
    { id: "e8", title: "Trump convicted on all 34 felony counts", hint: "Hush money. Manhattan. Unanimous verdict.", year: 2024 },
    { id: "e9", title: "Trump wins the 2024 election, defeating Kamala Harris", hint: "Only the second president in history to serve non-consecutive terms", year: 2024 },
  ],

  // Era F: 2025, Second Term (2 always drawn per week)
  F: [
    { id: "f1",  title: "Trump sentenced to 'unconditional discharge', no jail, no fine", hint: "The most anticlimactic sentencing in legal history", year: 2025 },
    { id: "f2",  title: "Trump pardons 1,500 January 6 defendants on day one", hint: "Including those convicted of violent offences", year: 2025 },
    { id: "f3",  title: "Trump tries to end birthright citizenship, courts block it fast", hint: "14th Amendment. Still applies.", year: 2025 },
    { id: "f4",  title: "Trump fires six inspectors general overnight with no warning", hint: "The government's own internal watchdogs, gone", year: 2025 },
    { id: "f5",  title: "DOGE gains access to US Treasury payment systems", hint: "Controlling the flow of $6 trillion in federal payments", year: 2025 },
    { id: "f6",  title: "USAID dissolved, thousands of staff placed on leave overnight", hint: "Decades of foreign aid infrastructure dismantled in days", year: 2025 },
    { id: "f7",  title: "Trump hits Canada and Mexico with sweeping 25% tariffs", hint: "Ottawa and Mexico City were blindsided", year: 2025 },
    { id: "f8",  title: "Trump and Vance berate Zelensky live on TV in the Oval Office", hint: "'You're gambling with World War Three'", year: 2025 },
    { id: "f9",  title: "SignalGate: Hegseth adds a journalist to a classified war chat", hint: "The journalist published every word of it", year: 2025 },
    { id: "f10", title: "'Liberation Day': Trump hits almost every country with tariffs", hint: "April 2, 2025. Nobody felt liberated.", year: 2025 },
    { id: "f11", title: "Trump pauses most tariffs after markets lose trillions", hint: "'It takes courage and strength to be flexible'", year: 2025 },
    { id: "f12", title: "US pays El Salvador to hold deported migrants in its mega-prison", hint: "President Bukele was happy to oblige", year: 2025 },
    { id: "f13", title: "Trump fires the entire Joint Chiefs of Staff", hint: "Unprecedented mass firing of the entire military leadership", year: 2025 },
    { id: "f14", title: "Trump freezes $2.2 billion in federal grants to Harvard", hint: "The largest funding freeze of any American university", year: 2025 },
    { id: "f15", title: "Harvard refuses to comply and sues to block the funding freeze", hint: "President Garber: 'We will not surrender'", year: 2025 },
    { id: "f16", title: "US and China agree to a 90-day tariff truce", hint: "Markets surge. Economists exhale.", year: 2025 },
    { id: "f17", title: "Trump's first foreign trip: Saudi Arabia, Qatar and the UAE", hint: "Hundreds of billions in investment deals announced", year: 2025 },
    { id: "f18", title: "Trump's 'Big Beautiful Bill' passes: tax cuts, spending slashed", hint: "Critics say it adds trillions to the national debt", year: 2025 },
    { id: "f19", title: "Musk calls the 'Big Beautiful Bill' a 'betrayal' of voters", hint: "The DOGE bromance ends loudly on social media", year: 2025 },
    { id: "f20", title: "Trump renames the Gulf of Mexico the 'Gulf of America'", hint: "Apple Maps updated it within days", year: 2025 },
  ],

};

// ============================================================
// DRAW ALGORITHM
// For each era, pre-shuffle the pool with a fixed season seed
// so the rotation order isn't obvious. Then for week W, pick
// item at index W % poolSize, guarantees full cycle, no repeats
// until every item has been seen.
// ============================================================
function seededRandom(seed) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 0x100000000;
  };
}

function seededShuffle(arr, seed) {
  const rng = seededRandom(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Season seed, change once per year to refresh the rotation order
const SEASON = 2025;

function pickForWeek(pool, eraOffset, weekNum) {
  const shuffled = seededShuffle(pool, SEASON * 1000 + eraOffset);
  return shuffled[weekNum % shuffled.length];
}

function buildWeeklyPuzzle(weekNum) {
  const a = pickForWeek(POOL.A, 1, weekNum);
  const b = pickForWeek(POOL.B, 2, weekNum);
  const c = pickForWeek(POOL.C, 3, weekNum);
  const d = pickForWeek(POOL.D, 4, weekNum);
  const e = pickForWeek(POOL.E, 5, weekNum);

  // For F (20 items, 2 needed): offset second pick by half the pool size
  const f1 = pickForWeek(POOL.F, 6, weekNum);
  const f2 = pickForWeek(POOL.F, 6, weekNum + Math.floor(POOL.F.length / 2));

  // Sort oldest to newest = correct answer order
  const events = [a, b, c, d, e, f1, f2].sort((x, y) =>
    x.year !== y.year ? x.year - y.year : (x.id < y.id ? -1 : 1)
  );

  // Warn loudly in dev if any title sneaks past 65 chars
  if (process.env.NODE_ENV !== "production") {
    events.forEach(ev => {
      if (ev.title.length > 65) console.warn(`[TRUMPLE] Title too long (${ev.title.length} chars): "${ev.title}"`);
    });
  }

  // Renumber ids 1-7 for the game engine
  return events.map((ev, i) => ({ ...ev, id: i + 1 }));
}

// ============================================================
// ROUTE HANDLER
// ============================================================
const EPOCH_MONDAY = new Date("2025-01-20T12:00:00Z"); // Inauguration week = week 0

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];

  function getMondayOf(dateStr) {
    const d = new Date(dateStr + "T12:00:00Z");
    const day = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1));
    return d;
  }

  const weekMonday = getMondayOf(dateParam);
  const weekNum    = Math.round((weekMonday - EPOCH_MONDAY) / (7 * 24 * 3600 * 1000));

  if (weekNum < 0) {
    return NextResponse.json({ error: "No puzzle before launch" }, { status: 404 });
  }

  // Strip em dashes automatically at serve time
  // No future event can sneak one through, no matter who edits the pool.
  const clean = (str) => str.replace(/ \u2014 /g, ", ").replace(/\u2014/g, "-");

  const events      = buildWeeklyPuzzle(weekNum);
  const answerOrder = events.map(e => e.id);
  const shuffled    = seededShuffle(
    events.map(e => ({ id: e.id, title: clean(e.title), hint: clean(e.hint) })),
    weekNum * 999983 + 7
  );
  const yearMap     = Object.fromEntries(events.map(e => [e.id, e.year]));

  return NextResponse.json({
    puzzle: { id: "w" + weekNum, weekNum, date: dateParam, events: shuffled },
    answerOrder,
    yearMap,
  });
}
