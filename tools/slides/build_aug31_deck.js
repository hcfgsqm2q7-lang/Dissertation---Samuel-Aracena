const pptxgen = require("pptxgenjs");

// Same "Warm Terracotta" palette used in the Aug 10 and Aug 25 decks, for visual continuity.
const P = "B85042";      // terracotta, dominant
const SAND = "E7E8D1";   // light ground
const SAGE = "A7BEAE";   // supporting
const INK = "2B2523";    // deep warm charcoal
const MUTED = "7A6E68";
const W = "FFFFFF";
const CARD = "F7F5F1";
const DARK2 = "3A3330";

const REPO = "/home/user/Dissertation---Samuel-Aracena";
const OUT = "/tmp/claude-0/-home-user-Dissertation---Samuel-Aracena/26e7f948-4ee1-5b87-9b0d-dd7ba7c483a3/scratchpad/deck/2026_08_31_slides.pptx";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Samuel Aracena";
pres.title = "Week of August 24, 2026";

const SW = 13.3, SH = 7.5, M = 0.62;

// ---------- helpers ----------
function darkSlide() { const s = pres.addSlide(); s.background = { color: INK }; return s; }
function lightSlide() { const s = pres.addSlide(); s.background = { color: W }; return s; }

function header(s, title, sub) {
  s.addText(title, {
    x: M, y: 0.5, w: SW - 2 * M, h: 0.55, margin: 0,
    fontFace: "Cambria", fontSize: 25, bold: true, color: INK,
  });
  if (sub) {
    s.addText(sub, {
      x: M, y: 1.06, w: SW - 2 * M, h: 0.34, margin: 0,
      fontFace: "Calibri", fontSize: 12.5, color: MUTED, italic: true,
    });
  }
}
function badge(s, n, x, y, d, fill, txtColor) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill || P } });
  s.addText(String(n), {
    x, y, w: d, h: d, margin: 0, align: "center", valign: "middle",
    fontFace: "Cambria", fontSize: d > 0.5 ? 15 : 12, bold: true, color: txtColor || W,
  });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06, fill: { color: fill || CARD },
    shadow: { type: "outer", angle: 90, blur: 6, offset: 0.03, color: "000000", opacity: 0.08 },
  });
}
function subhead(s, text, x, y, w, col) {
  s.addText(text, { x, y, w, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: col || INK });
}
function taskHead(s, x, y, w, num, title, col) {
  badge(s, num, x, y, 0.44, col, W);
  s.addText(title, { x: x + 0.6, y: y + 0.01, w: w - 0.6, h: 0.42, margin: 0,
    fontFace: "Cambria", fontSize: 15.5, bold: true, color: INK });
}
function sectionSlide(tag, title, sub, accent) {
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: 10.1, y: -1.7, w: 5.4, h: 5.4, fill: { color: accent || P }, transparency: 82 });
  s.addShape(pres.ShapeType.ellipse, { x: -1.4, y: 4.6, w: 3.6, h: 3.6, fill: { color: SAGE }, transparency: 88 });
  s.addText(tag.toUpperCase(), { x: M, y: 2.55, w: 10, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 13, bold: true, color: SAGE, charSpacing: 3 });
  s.addText(title, { x: M, y: 3.0, w: 11.2, h: 1.5, margin: 0, fontFace: "Cambria", fontSize: 32, bold: true, color: W, lineSpacing: 38 });
  if (sub) {
    s.addText(sub, { x: M, y: 4.5, w: 9.8, h: 1.1, margin: 0, fontFace: "Calibri", fontSize: 14, color: SAND, lineSpacing: 19 });
  }
  return s;
}
function statTile(s, x, y, w, h, value, label, col) {
  card(s, x, y, w, h);
  s.addText(value, { x: x + 0.22, y: y + 0.12, w: w - 0.44, h: h * 0.5, margin: 0,
    fontFace: "Cambria", fontSize: 28, bold: true, color: col || P });
  s.addText(label, { x: x + 0.22, y: y + h * 0.54, w: w - 0.44, h: h * 0.42, margin: 0,
    fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });
}
function bulletsBlock(s, items, x, y, w, h, opts) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: (opts && opts.gap) || 7 } })),
    Object.assign({ x, y, w, h, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 }, opts || {}));
}
function footNote(s, text, yy) {
  s.addText(text, { x: M, y: yy || 6.58, w: SW - 2 * M, h: 0.38, margin: 0, fontFace: "Calibri", fontSize: 10, italic: true, color: MUTED, lineSpacing: 12 });
}

// =========================================================
// 1. TITLE (unchanged)
// =========================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: 10.4, y: -1.5, w: 5.2, h: 5.2, fill: { color: P }, transparency: 82 });
  s.addShape(pres.ShapeType.ellipse, { x: 11.6, y: 4.4, w: 3.4, h: 3.4, fill: { color: SAGE }, transparency: 88 });

  s.addText("WEEK OF AUGUST 24, 2026", { x: M, y: 1.65, w: 9, h: 0.34, margin: 0,
    fontFace: "Calibri", fontSize: 13, bold: true, color: SAGE, charSpacing: 3 });
  s.addText("Closing the outstanding list,\nthen closing the gaps that remained", { x: M, y: 2.15, w: 10.2, h: 1.9, margin: 0,
    fontFace: "Cambria", fontSize: 36, bold: true, color: W, lineSpacing: 42 });
  s.addText("All ten items from the 2026-08-27 to-do list, worked through point by point, followed by a full self-audit against that same feedback that found and closed five further gaps before this reached you.",
    { x: M, y: 4.15, w: 9.4, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 14, color: SAND, lineSpacing: 19 });
  s.addText("Samuel Aracena   ·   MSc Dissertation   ·   Somalia, Admin2 × Month",
    { x: M, y: 6.5, w: 9, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED });
  s.addNotes("This deck covers everything built in the notebook this week: the ten items from the professor's 2026-08-27 feedback, plus five further gaps found and closed on a full self-audit against that same feedback.");
}

// =========================================================
// 2. THE TO-DO LIST (professor's items only, no self-audit)
// =========================================================
{
  const s = lightSlide();
  header(s, "What the 2026-08-27 feedback asked for", "Ten items, worked through point by point, in this order");

  const items = [
    ["Resolve the WFP observed-versus-forecast issue first", "A month-by-month audit for 2024 showing how many market records are observed, forecast and missing."],
    ["Run one final model for reporting attention", "Conflict intensity, vegetation stress, month controls, and district effects or district-clustered SEs; standardise both predictors."],
    ["Compare the effect sizes clearly", "How much reporting attention changes when conflict increases versus when vegetation stress increases."],
    ["Repeat the same analysis on Food and Nutrition reports only", "Checks whether the result is driven by conflict-specific reporting or holds within food-insecurity-relevant reporting too."],
    ["Produce one central visualisation", "Crisis intensity against expected reporting attention, one curve for conflict and one for vegetation stress."],
    ["Run a simple humanitarian blind-spots analysis", "No WFP market information and no ReliefWeb reporting, but high conflict or vegetation stress in the sources available."],
    ["Complete the final ReliefWeb validation correctly", "Adjust recall and F1 for the stratified validation design, or rerun on a simple random sample. Report P/R/F1 clearly."],
    ["Finalise the source-quality table", "For all four sources: granularity, collection mechanism, structural availability, recorded coverage, meaning of zero, meaning of missing, main limitation."],
    ["Correct the remaining terminology", "ACLED locations not always exact GPS; rename market_stress_count; distinguish price/PEWI/market-presence coverage; use \"recorded coverage\"."],
    ["Produce the month-by-month coverage table", "For each month of 2024, the percentage of districts covered by each source."],
  ];
  let y = 1.44;
  const rowH = 0.505;
  items.forEach(([t, d], i) => {
    badge(s, i + 1, M, y + 0.02, 0.36, i % 2 === 0 ? P : INK, W);
    s.addText(t, { x: M + 0.52, y: y - 0.03, w: 5.1, h: rowH, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: INK, lineSpacing: 14 });
    s.addText(d, { x: M + 5.8, y: y - 0.03, w: 5.9, h: rowH, margin: 0, fontFace: "Calibri", fontSize: 10.3, color: MUTED, lineSpacing: 13 });
    if (i < items.length - 1) {
      s.addShape(pres.ShapeType.line, { x: M, y: y + rowH - 0.02, w: SW - 2 * M, h: 0, line: { color: "E2DDD6", width: 0.75 } });
    }
    y += rowH;
  });
  footNote(s, "Also requested and satisfied throughout: keep IPC optional and descriptive, and do not expand the project with new datasets, countries or a prediction task until these ten items were complete.");
}

// =========================================================
// 3. TASK 11 (1 of 2): Table 11.1 and how the audit works
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 11: auditing Somalia 2024 on its own terms", "35 markets x 4 basket commodities x 12 months = 1,680 possible cells, the pipeline's own scope, checked directly");

  s.addText("Table 11.1 · month-by-month audit, Somalia 2024, 4 basket commodities", { x: M, y: 1.5, w: 6, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: P });
  const rows11 = [
    ["January", "136", "0", "4", "140", "97.1%"], ["February", "140", "0", "0", "140", "100.0%"],
    ["March", "140", "0", "0", "140", "100.0%"], ["April", "140", "0", "0", "140", "100.0%"],
    ["May", "140", "0", "0", "140", "100.0%"], ["June", "140", "0", "0", "140", "100.0%"],
    ["July", "140", "0", "0", "140", "100.0%"], ["August", "140", "0", "0", "140", "100.0%"],
    ["September", "140", "0", "0", "140", "100.0%"], ["October", "140", "0", "0", "140", "100.0%"],
    ["November", "140", "0", "0", "140", "100.0%"], ["December", "140", "0", "0", "140", "100.0%"],
  ];
  const hdr11 = ["Month", "Observed", "Forecast", "Missing", "Total", "% Observed"].map(t =>
    ({ text: t, options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } }));
  s.addTable([hdr11, ...rows11], { x: M, y: 1.84, w: 6.2, colW: [1.5, 1.05, 0.95, 0.9, 0.8, 1.0],
    fontFace: "Calibri", fontSize: 10, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.38, valign: "middle", autoPage: false });

  card(s, 7.1, 1.5, SW - M - 7.1, 5.0, INK);
  subhead(s, "How the audit works", 7.36, 1.66, 5.2, W);
  s.addText("WFP's price export carries a Data Type field. Aggregated means a real enumerator visit produced that month's price. Forecast means no visit had happened yet, and the number is generated by one of WFP's own time-series models instead, named in a Forecast Methodology column (SHW, GSI, or an ARIMA variant).",
    { x: 7.36, y: 2.02, w: 5.2, h: 1.15, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });
  s.addText("Method: build the same universe fact_market_somalia builds internally before pivoting, a grid of every (district, commodity, month) combination that could possibly exist: the 35 districts WFP monitors for these 4 commodities, times the 4 commodities, times the 12 months of 2024.",
    { x: 7.36, y: 3.28, w: 5.2, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });
  s.addText("Every one of the 1,680 cells in that grid is checked against the Data Type field directly, and classified Observed, Forecast, or Missing (no record of any kind for that cell).",
    { x: 7.36, y: 4.4, w: 5.2, h: 0.85, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });
  s.addText("Why this matters now: this specific 4-commodity, Somalia-only, 2024-only slice was never actually checked against Data Type before, only assumed to inherit the wider export's properties.",
    { x: 7.36, y: 5.4, w: 5.2, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 10.5, italic: true, color: SAGE, lineSpacing: 13.5 });
}

// =========================================================
// 4. TASK 11 (2 of 2): result, and the precise caveat
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 11: the result, and one caveat that keeps it exact", "Somalia 2024's own market data was never touched by the forecast problem");

  const st = [["99.8%", "of the 1,680 possible cells are genuinely observed (1,676 of 1,680)", P],
              ["0", "cells are forecast, for any of the 4 basket commodities, in any month of 2024", INK],
              ["4", "missing cells, all Banadir in January, a documented collection gap, not a forecast issue", SAGE]];
  let x = M;
  st.forEach(([v, l, col]) => { statTile(s, x, 1.5, 3.9, 1.9, v, l, col); x += 4.06; });

  card(s, M, 3.6, SW - 2 * M, 1.15, SAND);
  s.addText("So: every basket-commodity price this dissertation's panel actually uses for Somalia 2024 is observed, never forecast.",
    { x: M + 0.26, y: 3.76, w: SW - 2 * M - 0.52, h: 0.85, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, italic: true, color: P, lineSpacing: 19 });

  card(s, M, 4.95, SW - 2 * M, 1.5, INK);
  subhead(s, "A precise caveat, so this claim stays exact", M + 0.26, 5.1, 9, W);
  s.addText("Forecast rows do exist for Somalia within 2024 itself: exactly 4, all for sorghum (red and white) in Afmadow, dated November and December 2024. Sorghum is not one of the four basket commodities this pipeline uses, so these rows never enter the panel regardless of any filter. They do not appear anywhere in Table 11.1, because that table's universe is scoped to the 4 basket commodities only, not because they were hidden or excluded after the fact.",
    { x: M + 0.26, y: 5.42, w: SW - 2 * M - 0.52, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 10.7, color: SAND, lineSpacing: 13.8 });

  footNote(s, "This settles the item the previous feedback flagged as most urgent: before trusting the full-year market analysis, this needed to be resolved explicitly, and it now is.");
}

// =========================================================
// 5. TASK 12 (1 of 2): all countries, Table 12.1
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 12: does Somalia's cleanliness generalise?", "All 4 countries, 2015-2024, every commodity WFP tracks: 117,124 rows");

  s.addText("Why do this at all, given the pilot only uses Somalia's 4 commodities in 2024?", { x: M, y: 1.48, w: SW - 2 * M, h: 0.26, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: P });
  bulletsBlock(s, [
    "A 99.8%-observed result for one country in one year could be an accident of timing rather than a general property of WFP data.",
    "Any future extension of this project to Ethiopia, Kenya or South Sudan, or to years before 2024, would inherit whatever forecast contamination those countries and years carry.",
    "It directly answers which commodities carry the most forecast-generated data, useful if this basket ever changes.",
  ], M, 1.8, SW - 2 * M, 1.15, { gap: 5, fontSize: 11 });

  s.addText("Table 12.1 · observed vs forecast by country, 2015-2024", { x: M, y: 3.15, w: 6, h: 0.26, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: P });
  const t1 = [
    [{ text: "Country", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Observed", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Forecast", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Total", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "% Observed", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } }],
    ["Kenya", "14,175", "129", "14,304", "99.1%"],
    ["Somalia", "24,387", "817", "25,204", "96.8%"],
    ["Ethiopia", "34,310", "1,766", "36,076", "95.1%"],
    ["South Sudan", "39,303", "2,237", "41,540", "94.6%"],
  ];
  s.addTable(t1, { x: M, y: 3.5, w: 8.0, colW: [2.2, 1.5, 1.4, 1.4, 1.5],
    fontFace: "Calibri", fontSize: 11.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.42, valign: "middle", autoPage: false });

  card(s, 9.05, 3.5, SW - M - 9.05, 2.35, SAGE);
  s.addText("Somalia sits second-cleanest of the 4", { x: 9.3, y: 3.64, w: 3.35, h: 0.4, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: DARK2, lineSpacing: 15 });
  s.addText("Behind Kenya (99.1%), ahead of Ethiopia (95.1%) and South Sudan (94.6%). Somalia's own 2024, 96.8% observed across all commodities, all year.",
    { x: 9.3, y: 4.1, w: 3.35, h: 1.6, margin: 0, fontFace: "Calibri", fontSize: 10, color: DARK2, lineSpacing: 13 });

  footNote(s, "This audit uses the newer 2015-2024, all-country export pulled 2026-08-30, closing the gap the pilot's own 2024-2027 export could not.");
}

// =========================================================
// 6. TASK 12 (2 of 2): by year, and the conclusion
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 12: by year, and which commodities carry the risk", "2024 turns out to be the least clean year on record, not the most");

  s.addText("Table 12.1b · observed vs forecast by year, all 4 countries", { x: M, y: 1.48, w: 6, h: 0.26, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: P });
  const t2rows = [
    ["2015", "2,412", "192", "2,604", "92.6%"], ["2016", "2,184", "26", "2,210", "98.8%"], ["2017", "3,254", "40", "3,294", "98.8%"],
    ["2018", "3,734", "30", "3,764", "99.2%"], ["2019", "3,439", "30", "3,469", "99.1%"], ["2020", "13,560", "381", "13,941", "97.3%"],
    ["2021", "17,157", "168", "17,325", "99.0%"], ["2022", "18,578", "247", "18,825", "98.7%"], ["2023", "21,960", "972", "22,932", "95.8%"],
    [{ text: "2024", options: { bold: true } }, { text: "25,897", options: { bold: true } }, { text: "2,863", options: { bold: true, color: P } }, { text: "28,760", options: { bold: true } }, { text: "90.0%", options: { bold: true, color: P } }],
  ];
  const t2hdr = ["Year", "Observed", "Forecast", "Total", "% Observed"].map(t =>
    ({ text: t, options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } }));
  s.addTable([t2hdr, ...t2rows], { x: M, y: 1.82, w: 7.4, colW: [1.2, 1.6, 1.4, 1.6, 1.6],
    fontFace: "Calibri", fontSize: 10.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.32, valign: "middle", autoPage: false });

  card(s, 8.25, 1.82, SW - M - 8.25, 3.5, INK);
  subhead(s, "2015-2019 average 97-99% observed", 8.5, 1.96, 4, W);
  s.addText("2024 alone drops to 90.0% (2,863 of 28,760 rows forecast), the lowest of any year in the decade. Even so, Somalia's own 4-commodity 2024 slice sits at 100% for 11 of 12 months (Task 11): the general decline elsewhere in the export does not touch the specific slice this pipeline uses.",
    { x: 8.5, y: 2.3, w: 4.1, h: 1.55, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: SAND, lineSpacing: 13.5 });
  subhead(s, "Which commodities carry the risk", 8.5, 3.95, 4, W);
  s.addText("Maize (white), Sorghum, Wheat and Fuel (Super Petrol) carry the most forecast rows of any commodity, 2015-2024. None are in this dissertation's own basket (wheat flour, rice, sugar, oil).",
    { x: 8.5, y: 4.28, w: 4.1, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: SAND, lineSpacing: 13.5 });

  card(s, M, 5.55, SW - 2 * M, 0.9, SAND);
  s.addText("Result: 112,175 of 117,124 rows (95.8%) are observed across the full decade, all 4 countries. This settles the question from above: Somalia's cleanliness is not an accident of timing, and the data used throughout this dissertation is mostly made up of observed values, not forecast ones, at every scale checked.",
    { x: M + 0.24, y: 5.66, w: SW - 2 * M - 0.48, h: 0.7, margin: 0, fontFace: "Calibri", fontSize: 10.7, color: P, bold: true, lineSpacing: 13.8 });

  footNote(s, "Forecast volume for Somalia grows sharply from 2025 onward (6,908 rows in 2025), outside this dissertation's window, a separate fact from the one this audit needed to establish.");
}

// =========================================================
// SECTION: TASK 13
// =========================================================
sectionSlide("Task 13", "One model comparing conflict\nand vegetation stress directly", "A negative binomial model, compared throughout against the logistic regression built earlier in this notebook, and detailed here step by step.");

// =========================================================
// 7. TASK 13 (1 of 4): comparison with the earlier logistic regression
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 13: two different models, answering two different questions", "Why a second model was needed at all, given the logistic regression already built");

  card(s, M, 1.5, 5.95, 4.9);
  subhead(s, "Earlier: logistic regression", M + 0.26, 1.68, 5.4, INK);
  s.addText("\"Which districts get observed\"", { x: M + 0.26, y: 2.0, w: 5.4, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: MUTED });
  bulletsBlock(s, [
    "Outcome: was the district mentioned at all that month (binary, 0/1).",
    "Predictors, all together: conflict activity, market coverage, rainfall, vegetation health, region, month. Cluster-robust SEs by district.",
    "Built to test whether coverage gaps are systematic: can a handful of district characteristics predict whether a district gets covered at all?",
    "Result: conflict OR 2.01, market-coverage OR 3.20, both climate variables OR ~1.00 (not significant). Out-of-sample AUC 0.715.",
  ], M + 0.26, 2.36, 5.5, 3.7, { gap: 9, fontSize: 11 });

  card(s, 6.75, 1.5, SW - M - 6.75, 4.9, INK);
  subhead(s, "Now: negative binomial (Task 13)", 7.0, 1.68, 5.4, W);
  s.addText("\"When conflict rises versus when vegetation stress rises, does reporting react equally?\"", { x: 7.0, y: 2.0, w: 5.4, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: SAND });
  bulletsBlock(s, [
    "Outcome: how many reports that month (a count, not a yes/no).",
    "Predictors: only conflict intensity and vegetation stress, standardised onto the same scale, plus month as a control. No market, region or rainfall: they would only dilute a direct, two-way comparison.",
    "Built to ask a narrower, sharper question the logistic model was never designed for: are these two specific crisis signals answered by the same amount of attention, notch for notch?",
    "This is the model the 2026-08-27 feedback specifically asked for.",
  ], 7.0, 2.44, 5.4, 3.6, { color: SAND, gap: 9, fontSize: 11 });
}

// =========================================================
// 8. TASK 13 (2 of 4): specification and standardisation
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 13: model specification, in full", "What goes in, how it is standardised, and why that makes a notch of either predictor comparable");

  card(s, M, 1.5, SW - 2 * M, 1.5);
  subhead(s, "Why negative binomial, not linear regression or Poisson", M + 0.24, 1.66, 10, P);
  s.addText("The outcome, `reports_mentioning_district_count`, is a count: 0, 1, 2 and so on, never negative. Ordinary linear regression would happily predict a negative number of reports, so it is the wrong tool. Poisson regression is built for counts, but assumes the variance equals the mean; here the variance is over 6 times the mean, a large overdispersion, so negative binomial regression, which allows variance to exceed the mean, is the correct choice.",
    { x: M + 0.24, y: 1.96, w: SW - 2 * M - 0.48, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5 });

  card(s, M, 3.2, SW - 2 * M, 1.1, INK);
  s.addText("reports ~ conflict_z + vhi_stress_z + C(month)", { x: M + 0.24, y: 3.36, w: 9, h: 0.4, margin: 0, fontFace: "Courier New", fontSize: 15, bold: true, color: W });
  s.addText("Month controls seasonality (some months attract more reporting nationwide for reasons unrelated to conflict or vegetation). Standard errors are clustered by district (n=74): each district contributes 12 correlated rows, not 12 independent ones, and clustering corrects the uncertainty estimates for that.",
    { x: M + 0.24, y: 3.78, w: SW - 2 * M - 0.48, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: SAND, lineSpacing: 13.5 });

  card(s, M, 4.45, SW - 2 * M, 1.9, SAND);
  subhead(s, "Standardisation: why \"one notch\" means the same thing on both axes", M + 0.24, 4.6, 10, P);
  s.addText("Conflict: `log1p(conflict_event_count)`, then z-scored (mean 0, standard deviation 1). The log1p transform removes heavy right-skew, and log1p rather than plain log because a district can genuinely have 0 events in a month, and log(0) is undefined. Vegetation stress: `-vegetation_health_index_mean`, sign-flipped so that higher always means worse, then z-scored the same way.",
    { x: M + 0.24, y: 4.9, w: SW - 2 * M - 0.48, h: 0.85, margin: 0, fontFace: "Calibri", fontSize: 10.7, color: INK, lineSpacing: 13.8 });
  s.addText("Because both predictors are built the same way, a district-month can sit, for example, 2.9 conflict notches above the Somalia-wide average (Afgooye, August 2024, 41 events) or 1.4 vegetation-stress notches below it, and \"one notch\" of either is a directly comparable movement, which is exactly what a fair effect-size comparison requires.",
    { x: M + 0.24, y: 5.78, w: SW - 2 * M - 0.48, h: 0.55, margin: 0, fontFace: "Calibri", fontSize: 10.7, italic: true, color: P, lineSpacing: 13.8 });
}

// =========================================================
// 9. TASK 13 (3 of 4): results and effect-size comparison
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 13: results, and what each number means", "An incidence rate ratio (IRR), then a direct test of the two effects against each other");

  const tbl = [
    [{ text: "Predictor", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "IRR", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "95% CI", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "p", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } }],
    ["Conflict intensity", { text: "1.69", options: { bold: true, color: P } }, "[1.42, 2.01]", "< 0.0001"],
    ["Vegetation stress", "1.00", "straddles 1.0", "not significant"],
  ];
  s.addTable(tbl, { x: M, y: 1.5, w: 6.4, colW: [2.4, 1.2, 1.7, 1.1],
    fontFace: "Calibri", fontSize: 12, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.48, valign: "middle", autoPage: false });

  s.addText("An IRR of 1.0 means no effect at all; above 1.0 means reports go up; below 1.0 means reports go down. A one-notch rise in conflict multiplies the expected number of reports by 1.69, an increase of about 69%, holding vegetation stress and month fixed. This is far from zero (the 95% CI sits entirely above 1.0) and highly unlikely to be chance. A one-notch rise in vegetation stress does not move expected reports at all, once conflict and month are held fixed.",
    { x: M, y: 3.15, w: 6.4, h: 1.75, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5 });

  card(s, 7.1, 1.5, SW - M - 7.1, 3.4, P);
  subhead(s, "Comparing the two effect sizes directly", 7.36, 1.68, 5.2, W);
  s.addText("chi2 = 9.04, p = 0.0026", { x: 7.36, y: 2.1, w: 5, h: 0.5, margin: 0, fontFace: "Cambria", fontSize: 22, bold: true, color: W });
  s.addText("A Wald test of conflict_z coefficient = vhi_stress_z coefficient, tested directly against each other, not each against zero separately. Everything so far tests each predictor against zero, separately: conflict has an effect, vegetation stress does not. That is not quite the same claim as \"reporting reacts more strongly to conflict\"; two effects can both individually clear a significance threshold and still not differ from each other. This test closes that gap.",
    { x: 7.36, y: 2.7, w: 5, h: 1.9, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: "FBEAE7", lineSpacing: 13.5 });

  card(s, M, 5.15, SW - 2 * M, 1.3, SAND);
  s.addText("Result: the conflict coefficient is about 1.70 times the size of the vegetation-stress coefficient, and this difference is itself statistically significant, not merely a difference in whether each cleared its own threshold.",
    { x: M + 0.24, y: 5.3, w: SW - 2 * M - 0.48, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 12, bold: true, italic: true, color: P, lineSpacing: 15.5 });
}

// =========================================================
// 10. TASK 13 (4 of 4): robustness checks
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 13: robustness, checked two ways", "Does the Banadir exclusion matter, and does the underlying pattern generalise out of sample?");

  card(s, M, 1.5, SW - 2 * M, 2.3);
  subhead(s, "Does excluding Banadir change the result?", M + 0.26, 1.68, 10, P);
  s.addText("Banadir is mentioned in 12 of 12 months, which causes perfect separation in the main fit, so it is excluded there and checked separately with an L2-penalised model that can include it.",
    { x: M + 0.26, y: 2.02, w: SW - 2 * M - 0.52, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5 });
  const tblb = [
    [{ text: "", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Conflict IRR", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Vegetation-stress IRR", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } }],
    ["Main fit (Banadir excluded)", "1.69", "1.00"],
    ["Robustness fit (Banadir included, L2-penalised)", { text: "1.82", options: { color: P } }, { text: "1.06", options: { color: P } }],
  ];
  s.addTable(tblb, { x: M + 0.26, y: 2.6, w: 9.5, colW: [4.7, 2.4, 2.4],
    fontFace: "Calibri", fontSize: 11, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.4, valign: "middle", autoPage: false });
  s.addText("Barely moves either estimate: the exclusion is not doing hidden work, it is a clean, low-stakes choice.",
    { x: M + 0.26, y: 3.5, w: 9.5, h: 0.3, margin: 0, fontFace: "Calibri", fontSize: 10.7, italic: true, color: SAGE });

  card(s, M, 4.0, SW - 2 * M, 2.0, INK);
  subhead(s, "Does this generalise out of sample?", M + 0.26, 4.16, 10, W);
  s.addText("A companion check uses a logistic-regression version of the underlying question (does a district get mentioned at all that month), holding out entire districts (5-fold cross-validation), so the model must generalise to places it has never seen rather than to new months of familiar places.",
    { x: M + 0.26, y: 4.5, w: SW - 2 * M - 0.52, h: 0.85, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });
  s.addText("AUC 0.715, against 0.640 with region dummies removed the naive way. Region genuinely helps generalisation once done properly, and a district's own recent history predicts coverage better than either crisis-severity variable on its own.",
    { x: M + 0.26, y: 5.42, w: SW - 2 * M - 0.52, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: SAGE, lineSpacing: 14.5 });

  footNote(s, "The interpretation stays narrow: a statement about what one reporting platform, in one country, in one year, responds to, not a general claim about humanitarian priorities.");
}

// =========================================================
// 11. TASK 14 (1 of 2): why repeat, and the specification
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 14: does the result survive a narrower, more relevant outcome?", "Identical model and predictors to Task 13; only the outcome column changes");

  card(s, M, 1.5, SW - 2 * M, 2.1);
  subhead(s, "Why repeat the identical test at all", M + 0.26, 1.68, 10, P);
  s.addText("An obvious alternative explanation for Task 13's result: perhaps conflict receives more ReliefWeb attention simply because many ReliefWeb reports are about conflict in general, regardless of humanitarian relevance. If that were the whole story, restricting the outcome to reports specifically about food and nutrition should weaken or erase the effect.",
    { x: M + 0.26, y: 2.02, w: SW - 2 * M - 0.52, h: 0.75, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });
  s.addText("This is testable cheaply because `food_nutrition_report_count` already exists in the panel: the subset of reports ReliefWeb itself tags with the theme Food and Nutrition.",
    { x: M + 0.26, y: 2.85, w: SW - 2 * M - 0.52, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });

  card(s, M, 3.85, SW - 2 * M, 1.9, INK);
  subhead(s, "Same specification, new outcome column", M + 0.26, 4.02, 10, W);
  s.addText("food_nutrition_reports ~ conflict_z + vhi_stress_z + C(month)",
    { x: M + 0.26, y: 4.36, w: 9, h: 0.4, margin: 0, fontFace: "Courier New", fontSize: 14, bold: true, color: W });
  s.addText("Same standardisation (log1p + z-score for conflict, sign-flipped + z-score for vegetation stress), same month controls, same cluster-robust SEs by district, same Banadir exclusion. Nothing about the model changed, only which reports count toward the outcome.",
    { x: M + 0.26, y: 4.85, w: SW - 2 * M - 0.52, h: 0.8, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });

  footNote(s, "If conflict still dominates within this narrower, more directly relevant subset, the alternative explanation is ruled out.");
}

// =========================================================
// 12. TASK 14 (2 of 2): results and conclusion
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 14: the pattern survives fully, and the gap is if anything wider", "Restricting to Food and Nutrition reporting only");

  const tbl2 = [
    [{ text: "", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } },
     { text: "Task 13 (all reports)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } },
     { text: "Task 14 (Food & Nutrition only)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } }],
    ["Conflict IRR", "1.69, p < 0.0001", { text: "1.77, p < 0.0001", options: { bold: true, color: P } }],
    ["Vegetation-stress IRR", "1.00, not significant", "1.04, p = 0.78, not significant"],
    ["Effect-size test (Wald)", "chi2 = 9.04, p = 0.0026", { text: "chi2 = 8.41, p = 0.0037", options: { bold: true, color: P } }],
  ];
  s.addTable(tbl2, { x: M, y: 1.5, w: SW - 2 * M, colW: [3.7, 3.8, 4.76],
    fontFace: "Calibri", fontSize: 12.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.52, valign: "middle", autoPage: false });

  card(s, M, 3.85, SW - 2 * M, 1.7, SAND);
  s.addText("Restricting to only Food and Nutrition reporting gives conflict's IRR at 1.77 against vegetation stress's 1.04, both close to the all-reports figures, with essentially the same strength of evidence for the two effects differing from each other (p = 0.0037 against p = 0.0026 in Task 13). This rules out the concern that Task 13's result is simply an artefact of ReliefWeb publishing more conflict-themed content overall: even within reporting directly about food security, conflict still dominates vegetation stress by roughly the same margin.",
    { x: M + 0.26, y: 4.0, w: SW - 2 * M - 0.52, h: 1.4, margin: 0, fontFace: "Calibri", fontSize: 12, color: INK, lineSpacing: 15.5 });

  card(s, M, 5.7, SW - 2 * M, 0.85, P);
  s.addText("Taken together across Tasks 13 and 14: humanitarian reporting attention in Somalia during 2024 responds clearly to conflict intensity and shows no measurable response to vegetation stress, whether the outcome is all reporting or only reporting specifically about food and nutrition.",
    { x: M + 0.26, y: 5.8, w: SW - 2 * M - 0.52, h: 0.65, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, italic: true, color: W, lineSpacing: 14 });
}

// =========================================================
// 13. TASK 15 (1 of 2): the figure, and how it was built
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 15: one figure for the whole result", "The same fitted model from Task 13, turned into a picture instead of a table of coefficients");

  s.addImage({ path: REPO + "/data/processed/attention_response_curve.png", x: M, y: 1.5, w: 6.9, h: 4.16 });

  card(s, 7.65, 1.5, SW - M - 7.65, 4.9, INK);
  subhead(s, "How it was built, step by step", 7.9, 1.68, 4.7, SAGE);
  bulletsBlock(s, [
    "Rank all 876 modelling-sample district-months by conflict, from calmest to most violent.",
    "Do the identical ranking a second time, completely separately, for vegetation stress. A district-month's position in one ranking has no bearing on its position in the other.",
    "For each of the 99 percentiles of each ranking, look up the actual standardised value (conflict_z or vhi_stress_z) a district-month at that percentile would have.",
    "Feed that value into the fitted Task 13 model, holding the other predictor at its sample average, and ask for the predicted report count.",
    "Average that prediction across all 12 months, so the curve reflects a typical month rather than one arbitrarily chosen one.",
  ], 7.9, 1.98, 4.7, 3.9, { color: SAND, fontSize: 10.5, gap: 9 });
}

// =========================================================
// 14. TASK 15 (2 of 2): reading the figure
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 15: what each axis means, and how to read it", "");

  card(s, M, 1.5, SW - 2 * M, 1.7);
  subhead(s, "What each axis means", M + 0.26, 1.66, 10, P);
  s.addText("X-axis: percentile position within each predictor's own 2024 distribution (1 = calmest, 99 = most extreme), not a fixed, externally-defined severity scale. Y-axis: the model's predicted expected report count for a district-month sitting at that percentile, holding the other signal at its sample average.",
    { x: M + 0.26, y: 2.0, w: SW - 2 * M - 0.52, h: 1.1, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });

  card(s, M, 3.35, SW - 2 * M, 1.9, INK);
  subhead(s, "How to interpret it", M + 0.26, 3.52, 10, W);
  s.addText("Both curves start at the same point on the left: an average district-month, with the other signal held at average. Moving right along the conflict curve (blue, circular markers), the expected report count climbs from about 1.2 at the calmest percentiles to about 7.6 at the most extreme, a roughly six-fold rise. Moving right along the vegetation-stress curve (orange, dashed, square markers) instead, the expected count stays close to a flat 2 reports throughout, never rising meaningfully above where it starts. The steepness of the slope, not the starting point, is the whole finding.",
    { x: M + 0.26, y: 3.86, w: SW - 2 * M - 0.52, h: 1.3, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });

  card(s, M, 5.45, SW - 2 * M, 1.1, SAND);
  s.addText("Why the conflict curve looks like a staircase rather than a smooth line: a genuine feature of the data, not a plotting artefact. About 40% of district-months have zero recorded conflict events, so all of those share the same conflict_z value and land on the same flat step at the low end. The vegetation-stress curve is smoother because VHI varies continuously rather than piling up at one value.",
    { x: M + 0.26, y: 5.58, w: SW - 2 * M - 0.52, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 10.7, color: P, lineSpacing: 13.8 });
}

// =========================================================
// SECTION: TASK 16
// =========================================================
sectionSlide("Task 16", "Humanitarian blind spots", "Are there places experiencing a real, severe crisis signal that neither human-generated source, market monitoring or reporting, shows up in at all?", SAGE);

// =========================================================
// 16. TASK 16 (1 of 2): definition, map, key numbers
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 16: defining a blind spot, and finding 18 of them", "Severe on conflict or vegetation stress, and simultaneously silent on both market and reporting");

  s.addImage({ path: REPO + "/data/processed/blind_spots_map.png", x: M, y: 1.5, w: 3.9, h: 5.44 });

  card(s, 4.65, 1.5, SW - M - 4.65, 1.5);
  subhead(s, "Definition", 4.9, 1.66, 7.7, P);
  s.addText("A district-month is a blind spot when it has no WFP market reading and no ReliefWeb report that same month, AND is simultaneously in the worst decile of either conflict events or vegetation stress. Conflict and climate data are always present by construction, so a blind spot here means specifically invisible to the two sources that depend on human infrastructure, not invisible in an absolute sense.",
    { x: 4.9, y: 1.98, w: 7.9, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 10.7, color: MUTED, lineSpacing: 13.8 });

  const st = [["27", "district-months (3.0% of the 888-row panel) meet both conditions at once"],
              ["18", "distinct districts affected, every one with no WFP market at all, ever"],
              ["19 / 9 / 1", "of the 27 driven by vegetation stress / by conflict / severe on both"]];
  let x = 4.65;
  st.forEach(([v, l]) => {
    statTile(s, x, 3.15, 2.6, 1.75, v, l, P);
    x += 2.72;
  });

  card(s, 4.65, 5.05, SW - M - 4.65, 1.9, INK);
  subhead(s, "Severity is real, not borderline", 4.9, 5.22, 7.7, W);
  s.addText("Conflict-driven blind spots average 16.8 events that month, well above the 3.9 national average. Vegetation-stress-driven ones average a vegetation-health score of 27.8, well below the 46.7 national average. These are genuinely extreme district-months, not marginal cases that happen to fall on the wrong side of a threshold.",
    { x: 4.9, y: 5.56, w: 7.9, h: 1.3, margin: 0, fontFace: "Calibri", fontSize: 10.8, color: SAND, lineSpacing: 14 });
}

// =========================================================
// 17. TASK 16 (2 of 2): clustering and the structural picture
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 16: a genuine cluster, and the picture underneath it", "Both the geography of the month-specific blind spots and the permanent, year-round structural gaps");

  card(s, M, 1.5, SW - 2 * M, 2.0);
  subhead(s, "A genuine geographic cluster, not scattered coincidences", M + 0.26, 1.66, 10, P);
  s.addText("The central cluster, Ceel Dheer, Xarardheere and Aadan (dark blue on the map), sits in adjacent districts rather than scattered ones, the clearest visual evidence this is a genuine geographic pattern rather than 18 unrelated coincidences. It is a geographic cluster, not an administrative one: the three districts actually span three different regions (Galguduud, Mudug, Shabeellaha Dhexe) that happen to meet at one point, so the pattern cannot be explained by one region's own reporting or market-monitoring behaviour.",
    { x: M + 0.26, y: 2.0, w: SW - 2 * M - 0.52, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 10.8, color: MUTED, lineSpacing: 14 });
  s.addText("A second, more diffuse cluster runs along the southern districts (Baraawe, Qoryooley, Sablale, Wanla Weyn, Buaale, Jilib, Saakow), each appearing once but forming a visible corridor rather than isolated dots.",
    { x: M + 0.26, y: 3.0, w: SW - 2 * M - 0.52, h: 0.45, margin: 0, fontFace: "Calibri", fontSize: 10.8, color: MUTED, lineSpacing: 14 });

  card(s, M, 3.75, SW - 2 * M, 2.0, INK);
  subhead(s, "The structural picture underneath: dropping severity entirely", M + 0.26, 3.92, 10, W);
  s.addText("The blind spots above are month-specific: a district only appears there if, in one particular month, severity and silence coincided. The plainer, permanent question underneath asks: across the whole year, regardless of what was happening on the ground, which districts simply never have market data or reporting at all?",
    { x: M + 0.26, y: 4.26, w: SW - 2 * M - 0.52, h: 0.75, margin: 0, fontFace: "Calibri", fontSize: 10.8, color: SAND, lineSpacing: 14 });
  s.addText("39 of 74 districts (53%) have no WFP market data at all, for any month of 2024. Only one, Bander Beyla (Bari region), has zero ReliefWeb reports across the entire year, and it also has no market: the single district neither human-generated source reaches at all, in any month.",
    { x: M + 0.26, y: 5.05, w: SW - 2 * M - 0.52, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 10.8, bold: true, color: SAGE, lineSpacing: 14 });

  footNote(s, "The market side of this behaves the same way in both framings (structural, year-round); the reporting side does not, since \"no report this specific month\" affects many otherwise well-covered districts.");
}

// =========================================================
// SECTION: TASK 17
// =========================================================
sectionSlide("Task 17", "Validating the geoparser\ncorrectly", "100 reports, blind-labelled, scored against a stratified sample corrected for how it was actually drawn.", SAGE);

// =========================================================
// 19. TASK 17 (1 of 2): the stratified correction
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 17: correcting for how the validation sample was drawn", "The final geoparser needed a fresh, blind validation, on a sample corrected for its own design");

  card(s, M, 1.5, SW - 2 * M, 1.9);
  subhead(s, "Why this needed correcting", M + 0.26, 1.66, 10, P);
  s.addText("The 100-report validation sample was split 50/50 matched vs unmatched, good for finding enough examples of both outcomes to inspect, but not representative: the real population of Somalia reports (March-December 2024) is not matched/unmatched 50/50, it is 46.5% / 53.5%. Precision does not need correcting, since it is computed entirely from the reports the geoparser matched to something, which can be treated as a random draw from the population of matched reports. Recall's denominator draws from both strata, matched reports the geoparser partially missed and unmatched reports it entirely missed, so it does.",
    { x: M + 0.26, y: 2.0, w: SW - 2 * M - 0.52, h: 1.3, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5 });

  const tblg = [
    [{ text: "", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "Precision", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "Recall (naive)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "Recall (corrected)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } }],
    ["Report x district pair", "81.1%", "19.4%", { text: "17.1%", options: { bold: true, color: P } }],
    ["Report level", "78.8%", "63.1%", { text: "57.8%", options: { bold: true, color: P } }],
  ];
  s.addTable(tblg, { x: M, y: 3.6, w: 8.0, colW: [2.2, 1.8, 1.9, 2.1],
    fontFace: "Calibri", fontSize: 12, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.44, valign: "middle", autoPage: false });

  card(s, 9.05, 3.6, SW - M - 9.05, 2.9, INK);
  subhead(s, "Why pair-level recall is lower", 9.3, 3.76, 3.35, W);
  s.addText("The geoparser can only read a report's exported title and body text, never attachments or embedded tables. It is usually right that a report concerns at least one district (57.8%), but often misses other districts that same report also covers if those only appear inside an attachment (17.1%). A structural limitation, not a matching defect.",
    { x: 9.3, y: 4.1, w: 3.35, h: 2.3, margin: 0, fontFace: "Calibri", fontSize: 10.3, color: SAND, lineSpacing: 13.5 });

  footNote(s, "Precision (about 80% at either level) was always trustworthy, and is unaffected by the correction; the corrected recall figures are what this dissertation cites going forward.");
}

// =========================================================
// 20. TASK 17 (2 of 2): remediation options and the open decision
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 17: what was investigated to raise recall further", "Two options considered; one tested and found insufficient, one named as an open decision rather than made unilaterally");

  card(s, M, 1.5, 6.0, 4.9, P);
  subhead(s, "Tested: expanding the alias map", M + 0.26, 1.68, 5.5, W);
  s.addText("110 spelling variants surfaced by the validation labels, across 44 districts, were added to the pipeline's own matching vocabulary and re-run against the actual report title and body text of the 100 validation reports.",
    { x: M + 0.26, y: 2.06, w: 5.5, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 11, color: "FBEAE7", lineSpacing: 14.5 });
  s.addText("+2.2pp", { x: M + 0.26, y: 3.1, w: 2.5, h: 0.55, margin: 0, fontFace: "Cambria", fontSize: 30, bold: true, color: W });
  s.addText("pair-level recall gain (19.4% -> 21.5%)", { x: M + 0.26, y: 3.65, w: 5.2, h: 0.35, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: "FBEAE7" });
  s.addText("2.7%", { x: M + 0.26, y: 4.1, w: 2.5, h: 0.55, margin: 0, fontFace: "Cambria", fontSize: 30, bold: true, color: W });
  s.addText("of the 771 originally-missed genuine pairs recovered", { x: M + 0.26, y: 4.65, w: 5.2, h: 0.35, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: "FBEAE7" });
  s.addText("Conclusion: spelling was never the main reason for the misses. Not folded into the pipeline; the gain is too small to justify a change to a component (final_alias_map) that Task 10's own reporting-coverage figures already depend on.",
    { x: M + 0.26, y: 5.15, w: 5.5, h: 1.1, margin: 0, fontFace: "Calibri", fontSize: 10.3, italic: true, color: "FBEAE7", lineSpacing: 13.5 });

  card(s, 6.75, 1.5, SW - M - 6.75, 4.9, INK);
  subhead(s, "Not attempted: reading attachments", 7.0, 1.68, 5.4, SAGE);
  s.addText("The larger fix would be a document-reading step that downloads each report's attachment (PDF, spreadsheet or embedded table) from ReliefWeb and geoparses its text the same way the title and body already are.",
    { x: 7.0, y: 2.06, w: 5.4, h: 0.85, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });
  bulletsBlock(s, [
    "api.reliefweb.int is one of the hosts this environment's network proxy blocks outright, so even a minimal version cannot be built or tested here without a different access route.",
    "Independently of that access problem, building a new document-ingestion component is a substantial addition to the pipeline, not a correction to something already built.",
  ], 7.0, 3.0, 5.4, 1.6, { color: SAND, fontSize: 10.5, gap: 8 });
  card(s, 7.0, 4.7, 5.15, 1.5, SAGE);
  s.addText("Raised here rather than decided unilaterally: is this worth pursuing, given the scope it adds against the instruction to move toward writing?",
    { x: 7.2, y: 4.85, w: 4.75, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: DARK2, lineSpacing: 14.5 });
}

// =========================================================
// 21. TASK 18 (1 of 2): source-quality table, granularity and collection
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 18: the source-quality table, in plain language (1 of 2)", "How precise each source is, how often it updates, and how it's actually collected");

  const tbl1 = [
    [{ text: "Question", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Conflict (ACLED)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Climate (CHIRPS/VHI)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Market (WFP/PEWI)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Reporting (ReliefWeb)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } }],
    [{ text: "How precise is the location?", options: { bold: true } },
     "Each event has coordinates, but they are not always accurate: 77.5% are pinned to the real site, 22.4% only to an approximate location nearby, and 0.1% to just the general area (2,673 / 772 / 3 of 3,448 events)",
     "A grid of small squares: about 5.5km across for rainfall, about 4km for vegetation health",
     "A specific, named market stall, the most precise of the four sources",
     "A whole written report; it can only say a district is mentioned, never anything more exact"],
    [{ text: "How often is it updated?", options: { bold: true } },
     "Every event has its own date, later grouped into months for this project",
     "Rainfall is a monthly figure; vegetation health is measured weekly, then averaged into months",
     "Enumerators visit markets roughly every week; those visits are averaged into a monthly figure",
     "Whenever a report happens to be published; there is no set schedule"],
    [{ text: "How is it collected?", options: { bold: true } },
     "Compiled from local media and monitoring partners: 65.3% of events name a local partner as the source, 31.2% cite no source at all",
     "From satellite images; no one needs to visit the area",
     "WFP staff physically visit markets and record prices every week",
     "Aid organisations write and publish their own reports; nobody is required to report on any district"],
  ];
  s.addTable(tbl1, { x: M, y: 1.5, w: SW - 2 * M, colW: [2.05, 2.9, 2.4, 2.15, 2.55],
    fontFace: "Calibri", fontSize: 10, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, valign: "top", autoPage: false, rowH: [0.45, 1.7, 1.3, 1.3] });

  card(s, M, 6.15, SW - 2 * M, 0.75, SAND);
  s.addText("The fix: we no longer say ACLED locations are always exact GPS points. Instead we give the full three-level breakdown above, so this row no longer contradicts the precision numbers found elsewhere in the analysis.",
    { x: M + 0.24, y: 6.24, w: SW - 2 * M - 0.48, h: 0.58, margin: 0, fontFace: "Calibri", fontSize: 10, color: P, lineSpacing: 12.5 });
}

// =========================================================
// 22. TASK 18 (2 of 2): source-quality table, availability and limitation
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 18: the source-quality table, in plain language (2 of 2)", "Where each source could possibly reach, where it actually has data, and what a zero or a gap really means");

  const tbl2 = [
    [{ text: "Question", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } },
     { text: "Conflict", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } },
     { text: "Climate", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } },
     { text: "Market", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } },
     { text: "Reporting", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } }],
    [{ text: "Where could it possibly reach?", options: { bold: true } }, "All 74 districts, since events get recorded no matter where they happen", "All 74 districts equally; satellites see everywhere the same way", "Only 35 of 74 districts (47.3%) actually have a monitored market at all", "In theory any of the 74, but in practice limited by attention and what the text-reading tool can pick up"],
    [{ text: "Where does it actually have data?", options: { bold: true } }, "Every district-month has a number, even if that number is zero", "Every district-month has a reading; never missing", "47.2% of district-months have a price on record, 43.1% have a PEWI score", "60.1% of district-months have at least one matching report; 73 of 74 districts are mentioned at least once all year"],
    [{ text: "What does a zero mean?", options: { bold: true } }, "No event was recorded, but that could mean nothing happened, or it could mean something happened and nobody reported it; the two look identical", "A real, meaningful reading (a low number is genuine vegetation stress), not a sign of missing data", "A price is never genuinely zero; only the summary counts can validly be zero", "The clearest zero of the four: it simply means no report's text matched that district"],
    [{ text: "What does missing mean?", options: { bold: true } }, "Never happens: every district-month is filled in, even when the value is zero", "Never happens in this data; every district-month has a reading", "Either that district has no market to monitor, or, more rarely, a real market's reading just wasn't available that month", "Not really separate from zero: there is always a definite count, so the real limitation is what gets covered, not missing values"],
    [{ text: "Biggest weakness?", options: { bold: true } }, "Reflects how much media and monitoring-partner presence there is, almost as much as it reflects actual violence", "The most reliable of the four sources, though slightly less accurate in areas with fewer ground weather stations to check it against", "Reflects markets that are safe and easy for enumerators to reach, not a random sample of the whole country", "Limited by what's in the exported text; Task 17 shows most of what's missed is hiding in attachments, not a matching mistake"],
  ];
  s.addTable(tbl2, { x: M, y: 1.5, w: SW - 2 * M, colW: [2.05, 2.5, 2.55, 2.4, 2.55],
    fontFace: "Calibri", fontSize: 9.4, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, valign: "top", autoPage: false, rowH: [0.5, 0.95, 0.85, 1.05, 1.0, 1.15] });

  footNote(s, "The key distinction: ACLED and the satellite data reach 100% recorded coverage, but that is not the same as fully observing reality. A zero-filled ACLED entry and a genuinely calm district look exactly the same in the data.", 6.62);
}

// =========================================================
// 23. TASK 19: remaining terminology, corrected
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 19: the remaining terminology, corrected", "Four items requested; three already resolved elsewhere, one named clearly here for the first time");

  const items = [
    ["market_stress_count renamed", "market_alert_or_crisis_count: the feature counts WFP's Alert-or-Crisis phase (PEWI > 1.0), not its Stress phase (0.25-1.0)", "Resolved (Tasks 4, 10)"],
    ["ACLED \"exact GPS\" claim removed", "Task 18's granularity row states the full 77.5/22.4/0.1% precision breakdown directly, no contradiction left", "Resolved (Task 18)"],
    ["\"Recorded coverage\" used throughout", "Never implies full real-world observability; made explicit in every source's own \"what a zero means\" row", "Resolved (Task 18)"],
  ];
  let y = 1.5;
  items.forEach(([t, d, status]) => {
    card(s, M, y, SW - 2 * M, 0.92);
    s.addText(t, { x: M + 0.26, y: y + 0.12, w: 5.0, h: 0.7, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK, lineSpacing: 15 });
    s.addText(d, { x: M + 5.35, y: y + 0.1, w: 4.7, h: 0.75, margin: 0, fontFace: "Calibri", fontSize: 9.3, color: MUTED, lineSpacing: 12 });
    s.addText(status.toUpperCase(), { x: SW - M - 1.85, y: y + 0.34, w: 1.8, h: 0.28, margin: 0, align: "right", fontFace: "Calibri", fontSize: 9, bold: true, color: SAGE, charSpacing: 0.4 });
    y += 1.02;
  });

  card(s, M, y + 0.05, SW - 2 * M, 2.15, INK);
  subhead(s, "The fourth: three coverage terms, deliberately kept separate", M + 0.26, y + 0.2, 9, W);
  const cols3 = [["47.3%", "market-presence coverage", "35 of 74 districts; does WFP monitor any market here at all, ever"],
                 ["47.2%", "price coverage", "419 of 888 district-months have an actual recorded price"],
                 ["43.1%", "PEWI coverage", "383 of 888; differs from price because 8.8% of price records have no matching PEWI value"]];
  let x = M;
  cols3.forEach(([v, l, d]) => {
    s.addText(v, { x: x + 0.26, y: y + 0.58, w: 3.5, h: 0.45, margin: 0, fontFace: "Cambria", fontSize: 22, bold: true, color: SAGE });
    s.addText(l, { x: x + 0.26, y: y + 1.0, w: 3.7, h: 0.26, margin: 0, fontFace: "Calibri", fontSize: 10.5, bold: true, color: W });
    s.addText(d, { x: x + 0.26, y: y + 1.26, w: 3.7, h: 0.8, margin: 0, fontFace: "Calibri", fontSize: 9, color: SAND, lineSpacing: 11.5 });
    x += 4.06;
  });
}

// =========================================================
// 24. TASK 20: month-by-month coverage table
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 20: month-by-month coverage, all four sources side by side", "The last item on the list: for each month of 2024, what percentage of the 74 districts does each source cover?");

  const rows = [
    ["Jan", "66.2%", "100%", "45.9%", "51.4%"], ["Feb", "58.1%", "100%", "47.3%", "50.0%"],
    ["Mar", "56.8%", "100%", "47.3%", "60.8%"], ["Apr", "48.6%", "100%", "47.3%", "67.6%"],
    ["May", "59.5%", "100%", "47.3%", "64.9%"], ["Jun", "62.2%", "100%", "47.3%", "56.8%"],
    ["Jul", "59.5%", "100%", "47.3%", "66.2%"], ["Aug", "59.5%", "100%", "47.3%", "50.0%"],
    ["Sep", "68.9%", "100%", "47.3%", "45.9%"], ["Oct", "63.5%", "100%", "47.3%", "66.2%"],
    ["Nov", "58.1%", "100%", "47.3%", "73.0%"], ["Dec", "58.1%", "100%", "47.3%", "68.9%"],
  ];
  const header3 = [{ text: "Month", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } },
    { text: "Conflict", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } },
    { text: "Climate", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } },
    { text: "Market", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } },
    { text: "Reporting", options: { bold: true, color: W, fill: { color: INK }, fontSize: 10.5 } }];
  s.addTable([header3, ...rows], { x: M, y: 1.5, w: 6.2, colW: [1.05, 1.35, 1.2, 1.2, 1.4],
    fontFace: "Calibri", fontSize: 10.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.36, valign: "middle", autoPage: false });

  s.addText("\"Covered\" means genuine district-month presence (an event actually recorded, a report actually matched), not the year-round structural facts from Tasks 18-19. Saved to data/processed/monthly_source_coverage.csv.",
    { x: M, y: 6.0, w: 6.2, h: 0.75, margin: 0, fontFace: "Calibri", fontSize: 9.5, italic: true, color: MUTED, lineSpacing: 12.5 });

  card(s, 7.25, 1.5, SW - M - 7.25, 1.4, SAGE);
  s.addText("100%", { x: 7.5, y: 1.62, w: 2.5, h: 0.55, margin: 0, fontFace: "Cambria", fontSize: 28, bold: true, color: W });
  s.addText("Climate: flat every single month, unconditional satellite coverage", { x: 7.5, y: 2.2, w: SW - M - 7.5 - 0.2, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: DARK2, lineSpacing: 13.5 });

  card(s, 7.25, 3.05, SW - M - 7.25, 1.4, INK);
  s.addText("34-35", { x: 7.5, y: 3.17, w: 2.5, h: 0.55, margin: 0, fontFace: "Cambria", fontSize: 28, bold: true, color: W });
  s.addText("Market: near-fixed roster; January's dip to 34 is the already-documented Banadir gap", { x: 7.5, y: 3.75, w: SW - M - 7.5 - 0.2, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: SAND, lineSpacing: 13.5 });

  card(s, 7.25, 4.6, SW - M - 7.25, 1.75, P);
  s.addText("36-51 / 34-54", { x: 7.5, y: 4.72, w: SW - M - 7.5 - 0.4, h: 0.55, margin: 0, fontFace: "Cambria", fontSize: 24, bold: true, color: W });
  s.addText("districts covered, conflict / reporting: the two sources that genuinely fluctuate, reporting swinging widest of all four, nearly 20 points across the year",
    { x: 7.5, y: 5.28, w: SW - M - 7.5 - 0.4, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: "FBEAE7", lineSpacing: 13.5 });
}

pres.writeFile({ fileName: OUT }).then(f => console.log("WROTE", f));
