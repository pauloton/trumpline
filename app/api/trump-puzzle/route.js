import { NextResponse } from "next/server";

// ============================================================
// EVENT POOL, spanning 2015–2025
// Grouped into 6 eras. Each week draws 1 from each of the
// first 5 eras, and 2 from Era F (2025) = 7 total.
//
// TO ADD AN EVENT: append to the right era. Done.
// ============================================================
const POOL = {

  // Era A: 2015–2016, The Rise
  A: [
    { id: "a1", title: "Trump descends the Trump Tower escalator to announce his presidential run, calling Mexican immigrants 'rapists'", hint: "June 16, 2015", year: 2015 },
    { id: "a2", title: "Trump calls John McCain 'not a war hero, I like people who weren't captured'", hint: "Iowa Family Leadership Summit, July 2015", year: 2015 },
    { id: "a3", title: "Trump calls for a 'total and complete shutdown of Muslims entering the United States'", hint: "December 2015", year: 2015 },
    { id: "a4", title: "Access Hollywood tape leaked: Trump caught on mic boasting about groping women without consent", hint: "Billy Bush. A bus. A hot mic.", year: 2016 },
    { id: "a5", title: "Trump refuses to commit to accepting the election results at the final presidential debate", hint: "Clinton called it 'horrifying'", year: 2016 },
    { id: "a6", title: "Trump wins the 2016 presidential election, shocking pollsters and pundits worldwide", hint: "The night everyone got it wrong", year: 2016 },
    { id: "a7", title: "Trump settles the Trump University fraud lawsuit for $25 million, no admission of wrongdoing", hint: "Students claimed they were defrauded of thousands", year: 2016 },
    { id: "a8", title: "Sean Spicer insists Trump's inauguration had 'the largest audience ever', aerial photos prove otherwise", hint: "Alternative facts. Day one.", year: 2017 },
  ],

  // Era B: 2017–2018, First Term Chaos
  B: [
    { id: "b1",  title: "Trump signs the Muslim travel ban on day 7 of his presidency, chaos erupts at airports across America", hint: "Courts block it. He tries twice more.", year: 2017 },
    { id: "b2",  title: "Michael Flynn resigns as National Security Advisor after just 24 days, lied to the VP about Russia calls", hint: "The shortest NSA tenure in history", year: 2017 },
    { id: "b3",  title: "Trump fires FBI Director James Comey, later admitting it was because of 'the Russia thing'", hint: "Then told Russian officials in the Oval Office the very next day", year: 2017 },
    { id: "b4",  title: "Anthony Scaramucci is fired as White House Communications Director after just 10 days", hint: "An all-time record even by Trump standards", year: 2017 },
    { id: "b5",  title: "Trump says there were 'very fine people on both sides' after a white nationalist rally in Charlottesville kills a protester", hint: "A remark that follows him still", year: 2017 },
    { id: "b6",  title: "Trump tweets that North Korea's nuclear button is 'much bigger and more powerful' than Kim Jong-un's", hint: "New Year's Day, 2018", year: 2018 },
    { id: "b7",  title: "Trump launches a trade war with China, imposing tariffs on $34 billion of Chinese goods", hint: "China retaliates immediately, dollar for dollar", year: 2018 },
    { id: "b8",  title: "Trump meets Kim Jong-un in Singapore, the first sitting US president to meet a North Korean leader", hint: "A historic handshake. No deal ever followed.", year: 2018 },
    { id: "b9",  title: "Trump's 'zero tolerance' policy separates over 2,000 migrant children from their parents at the border", hint: "Children in cages. Global outrage.", year: 2018 },
    { id: "b10", title: "Jeff Sessions resigns as Attorney General the day after the midterms, pushed out by Trump", hint: "'I don't have an Attorney General', Trump, for months", year: 2018 },
  ],

  // Era C: 2019–2020, Impeachment I & COVID
  C: [
    { id: "c1", title: "Trump asks Ukraine's president to 'do us a favour' and investigate Biden, triggering his first impeachment", hint: "July 25, 2019. The 'perfect phone call'.", year: 2019 },
    { id: "c2", title: "Trump is impeached for the first time by the House of Representatives, acquitted by the Senate", hint: "Charges: abuse of power and obstruction of Congress", year: 2019 },
    { id: "c3", title: "Trump orders the drone strike assassination of Iranian General Qasem Soleimani in Baghdad", hint: "The world braced for World War Three", year: 2020 },
    { id: "c4", title: "Trump says the coronavirus is 'totally under control' and will disappear 'like a miracle'", hint: "February 2020. It did not disappear.", year: 2020 },
    { id: "c5", title: "Trump suggests injecting disinfectant as a possible COVID treatment at a White House briefing", hint: "Bleach manufacturers issued safety warnings", year: 2020 },
    { id: "c6", title: "Trump refuses to commit to a peaceful transfer of power if he loses the 2020 election", hint: "Asked directly by a reporter. Did not answer.", year: 2020 },
    { id: "c7", title: "Trump fires Defense Secretary Mark Esper by tweet the day after the 2020 election", hint: "Esper had refused to use the military against protesters", year: 2020 },
    { id: "c8", title: "Trump signs the USMCA to replace NAFTA, which he had called 'the worst trade deal ever made'", hint: "His signature legislative win of the first term", year: 2020 },
  ],

  // Era D: 2021–2022, Jan 6 & Aftermath
  D: [
    { id: "d1", title: "January 6: A mob of Trump supporters storms the US Capitol as Congress certifies the 2020 election results", hint: "The first breach of the Capitol since 1814", year: 2021 },
    { id: "d2", title: "Trump is impeached for the second time, for incitement of insurrection following January 6", hint: "First president in history to be impeached twice", year: 2021 },
    { id: "d3", title: "Trump calls Putin 'very savvy' and 'a genius' after Russia recognises breakaway Ukrainian regions", hint: "Days before the full invasion of Ukraine", year: 2022 },
    { id: "d4", title: "FBI raids Mar-a-Lago and recovers over 300 classified documents Trump took from the White House", hint: "Including documents marked Top Secret/SCI", year: 2022 },
    { id: "d5", title: "Trump announces his 2024 presidential campaign from Mar-a-Lago, three days after the midterms", hint: "Two federal indictments still to come at that point", year: 2022 },
    { id: "d6", title: "Trump calls for the 'termination' of parts of the US Constitution to reinstate him after the 2020 election", hint: "Even senior Republicans distanced themselves", year: 2022 },
    { id: "d7", title: "Elon Musk acquires Twitter and immediately reinstates Trump's account, banned since January 7, 2021", hint: "Trump returns to the platform he helped build", year: 2022 },
  ],

  // Era E: 2023–2024, Indictments & Return
  E: [
    { id: "e1", title: "Trump becomes the first former US president to be criminally indicted, hush money payments to Stormy Daniels", hint: "Manhattan DA Alvin Bragg. 34 counts.", year: 2023 },
    { id: "e2", title: "Trump is indicted a second time, for allegedly mishandling classified documents at Mar-a-Lago", hint: "The boxes in the bathroom. The pool in the background.", year: 2023 },
    { id: "e3", title: "Trump is indicted a third time, for allegedly conspiring to overturn the 2020 election results", hint: "Jack Smith. Four federal counts.", year: 2023 },
    { id: "e4", title: "Trump is indicted a fourth time in Georgia, for allegedly conspiring to overturn the state's 2020 results", hint: "RICO charges. 18 co-defendants.", year: 2023 },
    { id: "e5", title: "Trump wins the Iowa caucuses with over 51%, a record margin for a non-incumbent Republican", hint: "The primary was effectively over that night", year: 2024 },
    { id: "e6", title: "Supreme Court rules presidents have broad immunity from criminal prosecution for official acts", hint: "A landmark ruling that reshapes the presidency forever", year: 2024 },
    { id: "e7", title: "Trump survives an assassination attempt at a Pennsylvania rally, a bullet grazes his right ear", hint: "He pumps his fist. The photo goes around the world.", year: 2024 },
    { id: "e8", title: "Trump becomes the first former US president convicted of felony crimes, guilty on all 34 counts", hint: "Hush money. Manhattan. Unanimous verdict.", year: 2024 },
    { id: "e9", title: "Trump wins the 2024 presidential election, defeating Kamala Harris decisively", hint: "Only the second president in history to serve non-consecutive terms", year: 2024 },
  ],

  // Era F: 2025, Second Term (2 always drawn per week)
  F: [
    { id: "f1",  title: "Trump is sentenced to 'unconditional discharge' in the hush money case, no jail, no fine, no probation", hint: "The most anticlimactic sentencing in legal history", year: 2025 },
    { id: "f2",  title: "Trump pardons approximately 1,500 January 6 defendants on his first day back in office", hint: "Including those convicted of violent offences", year: 2025 },
    { id: "f3",  title: "Trump signs an executive order attempting to end birthright citizenship, courts block it within hours", hint: "14th Amendment. Still applies.", year: 2025 },
    { id: "f4",  title: "Trump fires six inspectors general in an overnight purge with no warning or explanation", hint: "The government's own internal watchdogs, gone", year: 2025 },
    { id: "f5",  title: "Elon Musk's DOGE team is granted access to sensitive US Treasury payment systems", hint: "Controlling the flow of $6 trillion in federal payments", year: 2025 },
    { id: "f6",  title: "USAID is effectively dissolved, thousands of employees placed on leave overnight", hint: "Decades of foreign aid infrastructure dismantled in days", year: 2025 },
    { id: "f7",  title: "Trump imposes sweeping 25% tariffs on Canada and Mexico, America's two largest trading partners", hint: "Ottawa and Mexico City were blindsided", year: 2025 },
    { id: "f8",  title: "Trump and Vance publicly ambush and berate Zelensky in the Oval Office on live television", hint: "'You're gambling with World War Three'", year: 2025 },
    { id: "f9",  title: "SignalGate: Defense Secretary Hegseth accidentally adds The Atlantic's editor to a classified chat about Yemen strikes", hint: "The journalist published every word of it", year: 2025 },
    { id: "f10", title: "Trump unveils tariffs on nearly every country on 'Liberation Day', global markets immediately crater", hint: "April 2, 2025. Nobody felt liberated.", year: 2025 },
    { id: "f11", title: "Trump announces a 90-day pause on most tariffs after stock markets lose trillions in two days", hint: "'It takes courage and strength to be flexible'", year: 2025 },
    { id: "f12", title: "The US deports migrants to El Salvador, paying the country to house them in a notorious mega-prison", hint: "President Bukele was happy to oblige", year: 2025 },
    { id: "f13", title: "Trump fires General CQ Brown, Chairman of the Joint Chiefs, and the other Joint Chiefs along with him", hint: "Unprecedented mass firing of the entire military leadership", year: 2025 },
    { id: "f14", title: "Trump administration freezes $2.2 billion in federal grants to Harvard University", hint: "The largest funding freeze of any American university", year: 2025 },
    { id: "f15", title: "Harvard refuses to comply with the Trump administration's demands and sues to block the funding freeze", hint: "President Garber: 'We will not surrender'", year: 2025 },
    { id: "f16", title: "US and China agree to a 90-day tariff truce, dramatically reducing rates on both sides", hint: "Markets surge. Economists exhale.", year: 2025 },
    { id: "f17", title: "Trump visits Saudi Arabia, Qatar and the UAE, his first foreign trip of the second term", hint: "Hundreds of billions in investment deals announced", year: 2025 },
    { id: "f18", title: "Trump signs the 'One Big Beautiful Bill', sweeping tax cuts paired with major spending reductions", hint: "Critics say it adds trillions to the national debt", year: 2025 },
    { id: "f19", title: "Musk publicly falls out with Trump over the 'Big Beautiful Bill', calling it a 'betrayal'", hint: "The DOGE bromance ends loudly on social media", year: 2025 },
    { id: "f20", title: "Trump renames the Gulf of Mexico the 'Gulf of America' by executive order", hint: "Apple Maps updated it within days", year: 2025 },
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

  // Sort oldest → newest = correct answer order
  const events = [a, b, c, d, e, f1, f2].sort((x, y) =>
    x.year !== y.year ? x.year - y.year : (x.id < y.id ? -1 : 1)
  );

  // Renumber ids 1–7 for the game engine
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
