const pptxgen = require("pptxgenjs");

const P = "B85042", SAND = "E7E8D1", SAGE = "A7BEAE", INK = "2B2523", MUTED = "7A6E68", W = "FFFFFF";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Samuel Aracena";
pres.title = "Next steps";

const SW = 13.3, SH = 7.5, M = 0.62;

function darkSlide() { const s = pres.addSlide(); s.background = { color: INK }; return s; }
function lightSlide() { const s = pres.addSlide(); s.background = { color: W }; return s; }
function header(s, title, sub) {
  s.addText(title, { x: M, y: 0.52, w: SW - 2 * M, h: 0.6, margin: 0,
    fontFace: "Cambria", fontSize: 29, bold: true, color: INK });
  if (sub) s.addText(sub, { x: M, y: 1.14, w: SW - 2 * M, h: 0.36, margin: 0,
    fontFace: "Calibri", fontSize: 13.5, color: MUTED, italic: true });
}
function badge(s, n, x, y, d, fill, txtColor) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill || P } });
  s.addText(String(n), { x, y, w: d, h: d, margin: 0, align: "center", valign: "middle",
    fontFace: "Cambria", fontSize: d > 0.5 ? 15 : 12, bold: true, color: txtColor || W });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06,
    fill: { color: fill || "F7F5F1" },
    shadow: { type: "outer", angle: 90, blur: 6, offset: 0.03, color: "000000", opacity: 0.08 } });
}
function tag(s, text, x, y, col, w) {
  s.addText(text.toUpperCase(), { x, y, w: w || 2.2, h: 0.26, margin: 0,
    fontFace: "Calibri", fontSize: 9.5, bold: true, color: col, charSpacing: 1.2 });
}

// =========================================================
// A. WHERE THE RESEARCH QUESTION STANDS
// =========================================================
{
  const s = lightSlide();
  header(s, "Next steps: where the research question stands", "The main question has two parts, and they are in very different states");

  card(s, M, 1.62, SW - 2 * M, 1.1, INK);
  s.addText("How unevenly do humanitarian data sources observe different places and crisis mechanisms, and what are the consequences for food-insecurity analysis?",
    { x: M + 0.32, y: 1.78, w: SW - 2 * M - 0.64, h: 0.8, margin: 0,
      fontFace: "Cambria", fontSize: 16.5, italic: true, color: W, lineSpacing: 24 });

  card(s, M, 2.98, 6.0, 3.3);
  tag(s, "Mostly answered", M + 0.28, 3.14, SAGE);
  s.addText("Part one: how unevenly do\nsources observe the country?", { x: M + 0.28, y: 3.44, w: 5.4, h: 0.62, margin: 0,
    fontFace: "Cambria", fontSize: 15, bold: true, color: INK });
  s.addText([
    { text: "By source: coverage runs from 47% of districts for market data up to 100% for satellite data.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: "By district: one district, Bander Beyla, was not seen by any source except satellites all year.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: "By month: reporting reached as few as 34 districts in one month and 54 in another. Market coverage never moved.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: "By crisis type: districts in severe conflict got 6.65 reports on average, against 2.67 for districts in equally severe drought.", options: { bullet: true } },
  ], { x: M + 0.28, y: 4.16, w: 5.5, h: 2.0, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 });

  card(s, 6.9, 2.98, SW - M - 6.9, 3.3, INK);
  tag(s, "Still open", 7.16, 3.14, P);
  s.addText("Part two: and does that\nunevenness actually matter?", { x: 7.16, y: 3.44, w: 5.2, h: 0.62, margin: 0,
    fontFace: "Cambria", fontSize: 15, bold: true, color: W });
  s.addText("So far nothing shows that these gaps change any conclusion. We know some districts are watched far less closely than others. We have not shown that watching a district less closely gives you a wrong picture of it, rather than simply a thinner one.",
    { x: 7.16, y: 4.16, w: 5.2, h: 1.16, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });
  s.addText("Sub-question 3 is the test for this, and it is the main priority for the coming weeks.",
    { x: 7.16, y: 5.4, w: 5.2, h: 0.66, margin: 0, fontFace: "Calibri", fontSize: 12, bold: true, color: SAGE, lineSpacing: 15 });

  s.addNotes("Half the question is mostly answered, half is untouched. The plan is built around closing the second half.");
}

// =========================================================
// B. THE MODEL, EXPLAINED
// =========================================================
{
  const s = lightSlide();
  header(s, "The planned model, explained", "A logistic regression, and what it is actually for");

  card(s, M, 1.6, 6.0, 2.16);
  s.addText("What it is", { x: M + 0.26, y: 1.74, w: 5.4, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: P });
  s.addText("A logistic regression predicts a yes or no outcome using several pieces of information at once. Here the outcome is simple: was this district mentioned in any humanitarian report this month, yes or no.\n\nThe useful part is not the prediction itself. It is that the model reports how much each piece of information matters once the others are already taken into account.",
    { x: M + 0.26, y: 2.08, w: 5.5, h: 1.6, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });

  card(s, 6.9, 1.6, SW - M - 6.9, 2.16, INK);
  s.addText("Why we need it", { x: 7.16, y: 1.74, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: SAGE });
  s.addText("So far each factor has been checked on its own. Conflict looked strong, market status looked strong, region looked strong. But these overlap: districts with lots of conflict often also have markets, and often sit in the same regions.\n\nChecking them one at a time cannot tell us which factor is really driving coverage and which only looked important because it sits alongside another one.",
    { x: 7.16, y: 2.08, w: 5.2, h: 1.6, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });

  s.addText("What goes into it", { x: M, y: 3.94, w: 6, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, color: INK });
  card(s, M, 4.34, 6.0, 1.34, SAND);
  s.addText([
    { text: "Outcome: was the district mentioned that month, across all 888 district-months.", options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
    { text: "Factors: how much conflict occurred, whether the district has a market, which region it is in, and its rainfall and vegetation conditions.", options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
    { text: "Month is included as a control, because coverage rises and falls month to month for reasons none of the other factors explain.", options: { bullet: true } },
  ], { x: M + 0.26, y: 4.48, w: 5.5, h: 1.1, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: INK, lineSpacing: 13 });

  s.addText("How it helps", { x: 6.9, y: 3.94, w: 5.78, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, color: INK });
  card(s, 6.9, 4.34, SW - M - 6.9, 1.34, SAND);
  s.addText([
    { text: "Separates real effects from ones that only looked important because they sit alongside another factor.", options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
    { text: "Replaces a list of separate correlations with one measure of how well the pattern is explained overall.", options: { bullet: true, breakLine: true, paraSpaceAfter: 5 } },
    { text: "Names the exceptions: districts covered far less, or far more, than expected. Those are the interesting cases.", options: { bullet: true } },
  ], { x: 7.16, y: 4.48, w: 5.2, h: 1.1, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: INK, lineSpacing: 13 });

  card(s, M, 5.86, SW - 2 * M, 0.96, INK);
  s.addText("Why this matters for the dissertation: the research question asks whether the gaps are systematic. At the moment that claim rests on several separate correlations, which a reader has to combine in their head. The model turns it into one statement that can be defended: knowing a handful of facts about a district, we can or cannot explain whether it gets observed.",
    { x: M + 0.3, y: 5.98, w: SW - 2 * M - 0.6, h: 0.74, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });
}

// =========================================================
// C. SUB-QUESTIONS 1 AND 2
// =========================================================
{
  const s = lightSlide();
  header(s, "Remaining work on sub-questions 1 and 2", "Both are mostly answered. These items make the existing answers hold up");

  badge(s, 1, M, 1.58, 0.44, SAGE, W);
  s.addText("Where are the gaps, and are they systematic?", { x: M + 0.58, y: 1.6, w: 6.5, h: 0.4, margin: 0,
    fontFace: "Cambria", fontSize: 16, bold: true, color: INK });
  tag(s, "Mostly answered", 10.4, 1.68, SAGE);

  card(s, M, 2.12, 6.0, 1.6);
  s.addText("Build the model described on the previous slide", { x: M + 0.26, y: 2.26, w: 5.4, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: P });
  s.addText("This is the main analytical piece still outstanding. It turns the separate correlations already found into a single result showing which factors genuinely explain coverage, and which districts do not fit the pattern.",
    { x: M + 0.26, y: 2.6, w: 5.5, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });

  card(s, 6.9, 2.12, SW - M - 6.9, 1.6);
  s.addText("Measure what each extra source adds", { x: 7.16, y: 2.26, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: P });
  s.addText("We know only one district is missed by every source, which answers the question in the narrowest way possible. We do not know how much each source adds beyond the last. Adding them one at a time and watching coverage climb turns that single observation into a real number.",
    { x: 7.16, y: 2.6, w: 5.2, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });

  badge(s, 2, M, 3.96, 0.44, P, W);
  s.addText("Does observability differ by crisis type?", { x: M + 0.58, y: 3.98, w: 6.5, h: 0.4, margin: 0,
    fontFace: "Cambria", fontSize: 16, bold: true, color: INK });
  tag(s, "Answered this week", 10.4, 4.06, P);

  const sq2 = [
    ["Repeat it using food and nutrition reports only",
     "This week's result counted reports of any kind. Since the project is about food insecurity, the sharper question is whether food and nutrition reporting shows the same bias towards conflict. Those columns have existed since the prototype and have never been used."],
    ["Check whether drought is reported late, not never",
     "Droughts build slowly, so reporting may simply arrive months later rather than not at all. Only a one-month delay has been tested, and only for conflict. If drought does get attention later, the honest conclusion becomes noticed late instead of ignored."],
    ["Check whether attention grows with severity",
     "The current test compares only the worst cases on each side. Seeing whether reporting rises steadily as conflict worsens, while staying flat however bad the drought gets, would make the same point far more strongly."],
  ];
  let x = M;
  sq2.forEach(([t, d]) => {
    card(s, x, 4.5, 3.92, 1.9, SAND);
    s.addText(t, { x: x + 0.24, y: 4.64, w: 3.5, h: 0.44, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: INK });
    s.addText(d, { x: x + 0.24, y: 5.12, w: 3.5, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 10, color: MUTED, lineSpacing: 12 });
    x += 4.06;
  });

  s.addText("All of these use data already in hand. None depend on anything from outside.",
    { x: M, y: 6.54, w: SW - 2 * M, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 11.5, italic: true, color: MUTED });
}

// =========================================================
// D. SUB-QUESTION 3
// =========================================================
{
  const s = lightSlide();
  header(s, "Sub-question 3: the only route to “does it matter”", "The priority. Does thin coverage give a wrong picture, or just a thinner one?");

  card(s, M, 1.6, SW - 2 * M, 0.86, INK);
  s.addText("The test: in districts we already know are poorly covered, does our dataset disagree with IPC's official food-insecurity assessment more than it does in well-covered districts? If it does, thin coverage means less trustworthy data, not just less data.",
    { x: M + 0.3, y: 1.72, w: SW - 2 * M - 0.6, h: 0.64, margin: 0, fontFace: "Calibri", fontSize: 12.5, color: W, lineSpacing: 16 });

  s.addText("Two things are holding this up, not one", { x: M, y: 2.66, w: 8, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 16, bold: true, color: INK });

  card(s, M, 3.1, 6.0, 2.5);
  tag(s, "Waiting on a download", M + 0.26, 3.24, P);
  s.addText("We do not have the IPC data yet", { x: M + 0.26, y: 3.5, w: 5.4, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: INK });
  s.addText([
    { text: "IPC publishes district-level assessments covering Somalia in 2024, but the site cannot be reached from the working environment, so the file has to be downloaded by hand.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "IPC publishes two or three times a year, not monthly, so we need a clear rule for spreading each assessment across the months it covers.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "IPC may name districts differently, which would mean a fourth round of the name-matching already done for WFP, ACLED and ReliefWeb.", options: { bullet: true } },
  ], { x: M + 0.26, y: 3.86, w: 5.5, h: 1.66, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });

  card(s, 6.9, 3.1, SW - M - 6.9, 2.5, SAND);
  tag(s, "Scheduled for next week", 7.16, 3.24, SAGE);
  s.addText("Defining our own summary measure", { x: 7.16, y: 3.5, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: INK });
  s.addText("The comparison needs a single measure on our side, summarising what this dataset indicates about each district. That measure has not been defined yet. The harmonised market-anomaly features built in Task 4 were designed as its ingredients, and the remaining step is to combine them into one defensible summary.\n\nUntil it exists, an IPC file arriving tomorrow would have nothing to be placed beside it. This work depends on nothing external and is scheduled for completion next week.",
    { x: 7.16, y: 3.86, w: 5.2, h: 1.66, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });

  card(s, M, 5.76, SW - 2 * M, 1.1, INK);
  s.addText("Backup plan if IPC does not work out", { x: M + 0.3, y: 5.88, w: 4.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: SAGE });
  s.addText("Check whether our four sources agree with each other instead. If they tell the same story in well-covered districts but contradict each other where coverage is thin, that says something real about reliability without needing any outside benchmark. Worth planning on purpose, because this sub-question is currently the only path to the second half of the main question, and it rests on a download that may not work.",
    { x: M + 5.1, y: 5.86, w: 6.9, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: SAND, lineSpacing: 13 });
}

// =========================================================
// E. STRENGTHENING + ORDER OF WORK
// =========================================================
{
  const s = lightSlide();
  header(s, "Supporting work, and the order of the coming weeks", "Three items that strengthen the argument, then how the work is sequenced");

  const items = [
    ["Show what actually changes", "Rank the districts by how bad their situation looks in our data, then rank them again allowing for how well each is observed. If districts that looked fine move up the list, that is a clear demonstration of why uneven coverage matters."],
    ["Check the reporting results hold up", "Manual checking found that only about 43% of matched reports were genuinely about the district they matched. Re-running the main results using only the most confident matches would show whether the conclusions survive."],
    ["Draw observability maps", "The district boundaries have been in the project from the start and have only been used to calculate areas. Simple coloured maps of coverage by district and by source make the argument much easier to follow than a table."],
  ];
  let x = M;
  items.forEach(([t, d]) => {
    card(s, x, 1.6, 3.92, 2.2);
    s.addText(t, { x: x + 0.26, y: 1.76, w: 3.4, h: 0.42, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: P });
    s.addText(d, { x: x + 0.26, y: 2.24, w: 3.44, h: 1.44, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });
    x += 4.06;
  });

  s.addText("Order of work, and the reason for it", { x: M, y: 4.0, w: 8, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 16, bold: true, color: INK });

  const seq = [
    ["1", "Request the IPC data", "It takes the longest and is the only thing we cannot do ourselves, so it should start first even though the analysis using it comes later.", P],
    ["2", "Define what our dataset says", "Scheduled for next week. Opens up half of sub-question 3 without waiting for IPC, and is needed whichever route that sub-question takes.", P],
    ["3", "Finish the sub-question 2 checks", "Quick, use data already in hand, and strengthen the newest finding, which is the one most likely to be challenged.", SAGE],
    ["4", "Build the model", "The main analytical piece, turning several separate correlations into one statement that can be defended.", SAGE],
    ["5", "Supporting work and maps", "Robustness checks and visuals, once the core analysis is settled.", MUTED],
  ];
  let y = 4.46;
  seq.forEach(([n, t, d, col]) => {
    badge(s, n, M, y, 0.34, col, W);
    s.addText(t, { x: M + 0.5, y: y - 0.02, w: 3.6, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK });
    s.addText(d, { x: M + 4.2, y: y - 0.03, w: 7.9, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });
    y += 0.46;
  });
}

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-Dissertation---Samuel-Aracena/f0ee5e0f-2568-5898-b6c4-4b4040e35512/scratchpad/deck/2026_08_10_next_steps.pptx" })
  .then(f => console.log("WROTE", f));
