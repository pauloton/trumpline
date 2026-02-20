import { NextResponse } from "next/server";

// ============================================================
// WEEK → PUZZLE MAP
// Key = the Monday of that week (YYYY-MM-DD).
// One puzzle per week — same puzzle all 7 days.
// ============================================================
// ➕ TO ADD A NEW WEEK: add one line like "2026-04-27": "tw011",
//    then add the puzzle data below.
//
// ⚠️  RECENCY RULE — every puzzle must include:
//    • At least 1 event from the LAST 60 DAYS
//    • At least 1 event from the LAST 6 MONTHS
//    • At least 1 event from the LAST 12 MONTHS
//    Mix them with 4 older/thematic events to keep it fresh.
// ============================================================
const SCHEDULE = {
  "2026-02-16": "tw001",
  "2026-02-23": "tw002",
  "2026-03-02": "tw003",
  "2026-03-09": "tw004",
  "2026-03-16": "tw005",
  "2026-03-23": "tw006",
  "2026-03-30": "tw007",
  "2026-04-06": "tw008",
  "2026-04-13": "tw009",
  "2026-04-20": "tw010",
};

// ============================================================
// PUZZLE LIBRARY — 10 weekly sets
// Each puzzle mixes historical events with recent ones.
// Events stored oldest → newest (correct answer order).
// ============================================================
const PUZZLES = {

  tw001: {
    theme: "The Rise",
    events: [
      { id: 1, title: "Trump descends the Trump Tower escalator and announces his presidential run", hint: "Called Mexican immigrants 'rapists'", year: 2015 },
      { id: 2, title: "Access Hollywood tape leaked: Trump caught on mic boasting about groping women", hint: "Billy Bush. A bus. A hot mic.", year: 2016 },
      { id: 3, title: "Trump wins the 2016 presidential election, shocking the world", hint: "The night the pundits got it very wrong", year: 2016 },
      { id: 4, title: "Trump signs the Muslim travel ban — chaos erupts at airports across America", hint: "Day 7 of his first presidency", year: 2017 },
      { id: 5, title: "Trump fires FBI Director James Comey, citing 'the Russia thing'", hint: "Then told Russian officials in the Oval Office the next day", year: 2017 },
      { id: 6, title: "Trump pardons approximately 1,500 January 6 rioters on his first day back in office", hint: "Including those convicted of violent offences", year: 2025 },
      { id: 7, title: "Trump withdraws the US from the Paris Climate Agreement — for the second time", hint: "He also did this in his first term", year: 2025 },
    ],
  },

  tw002: {
    theme: "Firings & Chaos",
    events: [
      { id: 1, title: "Michael Flynn resigns as National Security Advisor after just 24 days", hint: "Lied to the VP about calls with Russia", year: 2017 },
      { id: 2, title: "Anthony Scaramucci fired as Communications Director after just 10 days", hint: "An all-time White House record", year: 2017 },
      { id: 3, title: "Jeff Sessions fired as Attorney General the day after midterm elections", hint: "Trump blamed him for recusing from the Russia probe", year: 2018 },
      { id: 4, title: "Trump impeached by the House for abuse of power and obstruction of Congress", hint: "Third US president ever impeached", year: 2019 },
      { id: 5, title: "Senate acquits Trump — Mitt Romney is the only Republican to vote guilty", hint: "'My faith is at the heart of who I am'", year: 2020 },
      { id: 6, title: "Oval Office confrontation: Trump and Vance publicly berate Zelensky on live TV", hint: "'You're not in a good position to dictate'", year: 2025 },
      { id: 7, title: "Trump announces sweeping 25% tariffs on Canada and Mexico", hint: "Markets wobbled. Ottawa fumed.", year: 2025 },
    ],
  },

  tw003: {
    theme: "Russia & Mueller",
    events: [
      { id: 1, title: "Robert Mueller appointed Special Counsel to investigate Russian election interference", hint: "8 days after Comey was fired", year: 2017 },
      { id: 2, title: "Mueller indicts 13 Russian nationals for interfering in the 2016 election", hint: "The Internet Research Agency troll farm exposed", year: 2018 },
      { id: 3, title: "Paul Manafort, Trump's former campaign chairman, convicted on 8 counts of financial fraud", hint: "Flipped, then un-flipped", year: 2018 },
      { id: 4, title: "Helsinki summit: Trump sides with Putin over his own intelligence agencies", hint: "'I don't see why it would be Russia'", year: 2018 },
      { id: 5, title: "Mueller submits his final 448-page report to Attorney General Barr", hint: "Barr's 4-page summary caused outrage", year: 2019 },
      { id: 6, title: "Trump announces massive tariffs on nearly every country on 'Liberation Day'", hint: "Global stock markets crater", year: 2025 },
      { id: 7, title: "Trump reverses most tariffs, announcing a 90-day pause after markets collapse", hint: "'It takes courage and strength to be flexible'", year: 2025 },
    ],
  },

  tw004: {
    theme: "Ukraine & Impeachment",
    events: [
      { id: 1, title: "Trump calls Zelensky asking for a 'favor' — conditioning military aid on a Biden investigation", hint: "The famous 'perfect call'", year: 2019 },
      { id: 2, title: "An anonymous whistleblower files a complaint about Trump's Ukraine call", hint: "The complaint that changed everything", year: 2019 },
      { id: 3, title: "Trump impeached a second time — for incitement of insurrection after January 6", hint: "First president impeached twice", year: 2021 },
      { id: 4, title: "Senate acquits Trump again — 57-43, falling short of the 67 votes needed", hint: "Seven Republicans broke ranks", year: 2021 },
      { id: 5, title: "FBI raids Mar-a-Lago searching for classified government documents", hint: "Trump called it 'dark times for our nation'", year: 2022 },
      { id: 6, title: "'SignalGate': Senior officials accidentally add a journalist to a Signal chat about classified Yemen strikes", hint: "Defense Secretary Hegseth shared operational details", year: 2025 },
      { id: 7, title: "Oval Office confrontation: Trump and Vance publicly berate Ukrainian President Zelensky on live TV", hint: "Broadcast live around the world", year: 2025 },
    ],
  },

  tw005: {
    theme: "COVID Chaos",
    events: [
      { id: 1, title: "Trump tells CNBC in Davos: 'We have it totally under control. It's one person.'", hint: "January 22, 2020", year: 2020 },
      { id: 2, title: "Trump calls Democrat criticism of his COVID response 'their new hoax'", hint: "Same week the CDC warned of community spread", year: 2020 },
      { id: 3, title: "Trump muses at a briefing: maybe disinfectant could be injected to kill the virus", hint: "Poison control lines flooded with calls", year: 2020 },
      { id: 4, title: "Bob Woodward book reveals Trump knew COVID was 'deadly' but chose to 'play it down'", hint: "Trump said he didn't want to 'create a panic'", year: 2020 },
      { id: 5, title: "Trump tests positive for COVID and is rushed to Walter Reed hospital", hint: "Days after a crowded Rose Garden superspreader event", year: 2020 },
      { id: 6, title: "Trump pardons approximately 1,500 January 6 rioters on his first day back in office", hint: "Including those convicted of violent offences", year: 2025 },
      { id: 7, title: "Trump announces sweeping 25% tariffs on Canada and Mexico", hint: "Upending decades of trade relations overnight", year: 2025 },
    ],
  },

  tw006: {
    theme: "The Big Lie",
    events: [
      { id: 1, title: "Biden declared winner of the 2020 election by all major US networks", hint: "Four agonising days of counting", year: 2020 },
      { id: 2, title: "Rudy Giuliani holds a press conference in a Philadelphia car park next to a dildo shop", hint: "Four Seasons Total Landscaping", year: 2020 },
      { id: 3, title: "Trump calls Georgia Secretary of State demanding he 'find 11,780 votes'", hint: "The call was recorded", year: 2021 },
      { id: 4, title: "Trump supporters storm the US Capitol while Congress certifies the election", hint: "Five people died. Hundreds jailed.", year: 2021 },
      { id: 5, title: "Trump impeached a second time — for incitement of insurrection", hint: "First president impeached twice", year: 2021 },
      { id: 6, title: "NY judge sentences Trump to 'unconditional discharge' — no jail, no probation, no fine", hint: "The most anticlimactic sentencing in history", year: 2025 },
      { id: 7, title: "Trump pardons approximately 1,500 January 6 rioters on his first day back in office", hint: "Completing the circle", year: 2025 },
    ],
  },

  tw007: {
    theme: "The Indictments",
    events: [
      { id: 1, title: "Manhattan grand jury indicts Trump on 34 felony counts over hush money payments", hint: "First ever criminal indictment of a US president", year: 2023 },
      { id: 2, title: "Federal indictment: 37 counts for illegally retaining classified documents at Mar-a-Lago", hint: "Boxes next to the ballroom. Boxes in the bathroom.", year: 2023 },
      { id: 3, title: "Federal indictment #2: 4 counts of conspiracy to overturn the 2020 election", hint: "Special Counsel Jack Smith's second bite", year: 2023 },
      { id: 4, title: "Georgia indicts Trump and 18 co-defendants under RICO for election interference", hint: "All 19 defendants must post mug shots", year: 2023 },
      { id: 5, title: "Jury finds Trump guilty on all 34 felony counts in New York", hint: "First convicted felon to run for president", year: 2024 },
      { id: 6, title: "Trump wins the 2024 presidential election — the first convicted felon elected president", hint: "A historic night, in the worst way", year: 2024 },
      { id: 7, title: "NY judge sentences Trump to 'unconditional discharge' — no jail, no probation, no fine", hint: "The most anticlimactic sentencing in history", year: 2025 },
    ],
  },

  tw008: {
    theme: "International Incidents",
    events: [
      { id: 1, title: "Trump withdraws the United States from the Paris Climate Agreement", hint: "'I was elected to represent Pittsburgh, not Paris'", year: 2017 },
      { id: 2, title: "Trump meets Kim Jong-un in Singapore — first ever US–North Korea summit", hint: "Gave Kim legitimacy, got nothing binding in return", year: 2018 },
      { id: 3, title: "Helsinki summit: Trump sides with Putin over his own intelligence agencies", hint: "'I don't see why it would be Russia'", year: 2018 },
      { id: 4, title: "US kills Iranian General Qasem Soleimani in a drone strike at Baghdad airport", hint: "Brought the US and Iran to the brink of war", year: 2020 },
      { id: 5, title: "Trump withdraws the US from the Paris Climate Agreement again — on his first day back", hint: "Second time he's done the exact same thing", year: 2025 },
      { id: 6, title: "Oval Office confrontation: Trump and Vance publicly berate Zelensky on live TV", hint: "Broadcast live around the world", year: 2025 },
      { id: 7, title: "'Liberation Day': Trump unveils massive tariffs on nearly every country — global markets crater", hint: "Even close allies weren't spared", year: 2025 },
    ],
  },

  tw009: {
    theme: "The Hush Money Saga",
    events: [
      { id: 1, title: "Trump allegedly has an affair with adult film actress Stormy Daniels at a golf tournament", hint: "Melania had just given birth to Barron", year: 2006 },
      { id: 2, title: "Michael Cohen wires Stormy Daniels $130,000 in hush money — 11 days before the election", hint: "Through a shell company, naturally", year: 2016 },
      { id: 3, title: "Rudy Giuliani accidentally confirms on live TV that Trump knew about the payment", hint: "He was supposed to be helping", year: 2018 },
      { id: 4, title: "Michael Cohen pleads guilty to campaign finance violations and says Trump 'directed' him", hint: "Federal court. Under oath.", year: 2018 },
      { id: 5, title: "Trump indicted in Manhattan on 34 felony counts linked to the Stormy Daniels payment", hint: "The first domino to fall", year: 2023 },
      { id: 6, title: "Jury convicts Trump on all 34 felony counts — first US president found guilty of a crime", hint: "The verdict was unanimous", year: 2024 },
      { id: 7, title: "NY judge sentences Trump to 'unconditional discharge' — no jail, no probation, no fine", hint: "The most anticlimactic ending in legal history", year: 2025 },
    ],
  },

  tw010: {
    theme: "Second Term Turbo",
    events: [
      { id: 1, title: "Trump pardons approximately 1,500 January 6 defendants on his first day back in office", hint: "Including those convicted of violent offences", year: 2025 },
      { id: 2, title: "Trump signs executive orders dismantling DEI programmes across the federal government", hint: "Dozens of orders signed in the first hours", year: 2025 },
      { id: 3, title: "Trump announces sweeping 25% tariffs on Canada and Mexico", hint: "Markets wobbled. Ottawa fumed.", year: 2025 },
      { id: 4, title: "Oval Office confrontation: Trump and Vance publicly berate Zelensky on live TV", hint: "'You're not in a good position to dictate'", year: 2025 },
      { id: 5, title: "'SignalGate': Senior officials accidentally add a journalist to a Signal chat discussing classified Yemen strike plans", hint: "Defense Secretary Hegseth shared operational details", year: 2025 },
      { id: 6, title: "'Liberation Day': Trump unveils massive tariffs on nearly every country — global stock markets crater", hint: "Even allies weren't spared", year: 2025 },
      { id: 7, title: "Trump reverses most tariffs, announcing a 90-day pause after markets collapse", hint: "'It takes courage and strength to be flexible'", year: 2025 },
    ],
  },

};

// ============================================================
// SEEDED SHUFFLE (same shuffle for same week, for everyone)
// ============================================================
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
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

// ============================================================
// ROUTE HANDLER
// ============================================================
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date"); // e.g. "2026-02-20"

  // Find the Monday of the week for the given date
  function getMondayOf(dateStr) {
    const d = new Date(dateStr + "T12:00:00Z");
    const day = d.getUTCDay(); // 0=Sun
    const diff = day === 0 ? 6 : day - 1;
    d.setUTCDate(d.getUTCDate() - diff);
    return d.toISOString().split("T")[0];
  }

  const weekKey = getMondayOf(dateParam || new Date().toISOString().split("T")[0]);
  const puzzleId = SCHEDULE[weekKey];

  if (!puzzleId || !PUZZLES[puzzleId]) {
    return NextResponse.json({ error: "No puzzle this week" }, { status: 404 });
  }

  const puzzle = PUZZLES[puzzleId];

  // Correct answer order (IDs oldest → newest)
  const answerOrder = puzzle.events.map((e) => e.id);

  // Seeded shuffle so everyone sees the same scramble
  const weekSeed = parseInt(weekKey.replace(/-/g, ""), 10);
  const shuffledEvents = seededShuffle(
    puzzle.events.map((e) => ({ id: e.id, title: e.title, hint: e.hint })),
    weekSeed
  );

  const yearMap = {};
  puzzle.events.forEach((e) => { yearMap[e.id] = e.year; });

  return NextResponse.json({
    puzzle: {
      id: puzzleId,
      theme: puzzle.theme,
      weekKey,
      date: dateParam || new Date().toISOString().split("T")[0],
      events: shuffledEvents,
    },
    answerOrder,
    yearMap,
  });
}
