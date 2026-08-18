const pptxgen = require("pptxgenjs");

const P = "B85042";      // terracotta, dominant
const SAND = "E7E8D1";   // light ground
const SAGE = "A7BEAE";   // supporting
const INK = "2B2523";    // deep warm charcoal
const MUTED = "7A6E68";
const W = "FFFFFF";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";           // 13.3 x 7.5
pres.author = "Samuel Aracena";
pres.title = "Week of August 10, 2026";

const SW = 13.3, SH = 7.5, M = 0.62;

// ---------- helpers ----------
function darkSlide() { const s = pres.addSlide(); s.background = { color: INK }; return s; }
function lightSlide() { const s = pres.addSlide(); s.background = { color: W }; return s; }

function header(s, title, sub) {
  s.addText(title, {
    x: M, y: 0.52, w: SW - 2 * M, h: 0.6, margin: 0,
    fontFace: "Cambria", fontSize: 30, bold: true, color: INK,
  });
  if (sub) {
    s.addText(sub, {
      x: M, y: 1.14, w: SW - 2 * M, h: 0.36, margin: 0,
      fontFace: "Calibri", fontSize: 13.5, color: MUTED, italic: true,
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
    x, y, w, h, rectRadius: 0.06, fill: { color: fill || "F7F5F1" },
    shadow: { type: "outer", angle: 90, blur: 6, offset: 0.03, color: "000000", opacity: 0.08 },
  });
}
function taskHead(s, x, y, w, num, title, col) {
  badge(s, num, x, y, 0.46, col, W);
  s.addText(title, { x: x + 0.62, y: y + 0.02, w: w - 0.62, h: 0.42, margin: 0,
    fontFace: "Cambria", fontSize: 16, bold: true, color: INK });
}

// =========================================================
// 1. TITLE
// =========================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: 10.4, y: -1.5, w: 5.2, h: 5.2, fill: { color: P }, transparency: 82 });
  s.addShape(pres.ShapeType.ellipse, { x: 11.6, y: 4.4, w: 3.4, h: 3.4, fill: { color: SAGE }, transparency: 88 });

  s.addText("WEEK OF AUGUST 10, 2026", { x: M, y: 1.75, w: 9, h: 0.34, margin: 0,
    fontFace: "Calibri", fontSize: 13, bold: true, color: SAGE, charSpacing: 3 });
  s.addText("Validating the prototype,\nthen scaling to a full year", { x: M, y: 2.25, w: 9.4, h: 1.9, margin: 0,
    fontFace: "Cambria", fontSize: 40, bold: true, color: W, lineSpacing: 46 });
  s.addText("Ten validity tasks completed on the two-month Somalia prototype, the pipeline extended to all of 2024, and a new result on which kinds of crisis get observed.",
    { x: M, y: 4.35, w: 8.6, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 14.5, color: SAND });
  s.addText("Samuel Aracena   ·   MSc Dissertation   ·   Somalia, Admin2 × Month",
    { x: M, y: 6.35, w: 9, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED });
  s.addNotes("Two halves: validity work on the prototype (tasks 1-9), then the full-year extension (task 10) and the analyses it made possible.");
}

// =========================================================
// 2. RESEARCH QUESTION (tasks 1 & 2)
// =========================================================
{
  const s = lightSlide();
  header(s, "Tasks 1 and 2: the research question, fixed", "Framed around humanitarian observability");

  card(s, M, 1.66, SW - 2 * M, 1.26, INK);
  s.addText("How unevenly do humanitarian data sources observe different places and crisis mechanisms, and what are the consequences for food-insecurity analysis?",
    { x: M + 0.32, y: 1.84, w: SW - 2 * M - 0.64, h: 0.92, margin: 0,
      fontFace: "Cambria", fontSize: 18, italic: true, color: W, lineSpacing: 26 });

  const subs = [
    ["Where are the gaps, and\nare they systematic?", "Which mechanisms have the largest coverage gaps, and are those gaps random or tied to district characteristics such as conflict exposure?", "Substantially covered", SAGE],
    ["Does observability differ\nby crisis type?", "Is conflict-driven distress captured more consistently than slow-onset climate stress of comparable severity?", "Answered this week", P],
    ["Does poor observability\nmean being wrong?", "In weakly covered districts, does this dataset's assessment diverge further from IPC's official classification?", "Not started", MUTED],
  ];
  let x = M;
  subs.forEach(([t, d, status, col], i) => {
    card(s, x, 3.18, 3.92, 3.0);
    badge(s, i + 1, x + 0.26, 3.4, 0.44, col, W);
    s.addText(t, { x: x + 0.82, y: 3.4, w: 2.9, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 14.5, bold: true, color: INK });
    s.addText(d, { x: x + 0.26, y: 4.14, w: 3.42, h: 1.4, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });
    s.addText(status.toUpperCase(), { x: x + 0.26, y: 5.6, w: 3.42, h: 0.32, margin: 0, fontFace: "Calibri", fontSize: 10, bold: true, color: col, charSpacing: 1 });
    x += 4.06;
  });
}

// =========================================================
// 3. TASKS 3 & 4
// =========================================================
{
  const s = lightSlide();
  header(s, "Tasks 3 and 4: the market features", "Evaluated as one family, then given a country-agnostic layer on top");

  // Task 3
  taskHead(s, M, 1.62, 6.0, 3, "Missingness and redundancy", P);
  card(s, M, 2.16, 6.0, 4.05);
  s.addText([
    { text: "All 12 commodity features share identical missingness at 79 of 148 district-months (53.4%), because every one depends on the same thing: whether a market exists in that district at all.", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
    { text: "Wheat flour and rice are highly correlated (r = 0.89 on price, r = 0.61 on anomaly score), both being imported staples driven by shared exchange-rate and import costs.", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
    { text: "Sugar is almost uncorrelated with everything else (r = 0.02 to 0.21), so it carries genuinely independent information that a single combined index would destroy.", options: { bullet: true, breakLine: true, paraSpaceAfter: 9 } },
    { text: "Decision: all four commodities kept. Wheat flour and rice flagged as the pair to merge first if the feature set ever needs to shrink.", options: { bullet: true } },
  ], { x: M + 0.28, y: 2.36, w: 5.5, h: 3.7, margin: 0, fontFace: "Calibri", fontSize: 12, color: INK, lineSpacing: 16 });

  // Task 4
  taskHead(s, 7.1, 1.62, 5.6, 4, "Harmonised market-anomaly layer", SAGE);
  card(s, 7.1, 2.16, SW - M - 7.1, 4.05, INK);
  s.addText("Four new features, computable no matter which commodities a country tracks:",
    { x: 7.36, y: 2.32, w: 5.2, h: 0.36, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND });

  const feats = [
    ["commodities_tracked_count", "how many commodities have data that district-month"],
    ["market_anomaly_mean", "average anomaly score across available commodities"],
    ["market_anomaly_max", "the single highest anomaly among them"],
    ["market_stress_count", "how many exceed a stress threshold of 1.0"],
  ];
  let y = 2.78;
  feats.forEach(([n, d]) => {
    s.addText(n, { x: 7.36, y, w: 5.2, h: 0.26, margin: 0, fontFace: "Courier New", fontSize: 11, bold: true, color: SAGE });
    s.addText(d, { x: 7.36, y: y + 0.24, w: 5.2, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND });
    y += 0.62;
  });

  s.addText("Coverage is close to all-or-nothing: 62 district-months report all four commodities, 85 report none, and only one reports a partial set. The 1.0 stress threshold is a documented modelling choice, since WFP's exact cutoffs were not available.",
    { x: 7.36, y: 5.34, w: 5.2, h: 0.82, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });
}

// =========================================================
// 4. TASKS 5 & 6
// =========================================================
{
  const s = lightSlide();
  header(s, "Tasks 5 and 6: two features that did not survive testing", "One removed outright, five rewritten");

  // Task 5
  taskHead(s, M, 1.62, 6.0, 5, "conflict_events_per_1000_km2", P);
  card(s, M, 2.16, 6.0, 4.05);
  s.addText("Renamed from conflict_density to describe what it actually measures: events per unit area, not humanitarian intensity or exposure. Then tested to see whether it adds anything beyond the plain event count it is derived from.",
    { x: M + 0.28, y: 2.34, w: 5.5, h: 0.86, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });

  const t5 = [
    [{ text: "What was tested", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Result", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } }],
    ["Correlation with plain event count", "r = 0.96"],
    ["Same, only districts with ≥1 event", "r = 0.85"],
    ["Correlation with district area", "r = −0.34 (−0.64 if conflict-affected)"],
    ["Predicting fatalities: count vs density", "0.776 vs 0.727"],
  ];
  s.addTable(t5, { x: M + 0.28, y: 3.3, w: 5.5, colW: [2.9, 2.6],
    fontFace: "Calibri", fontSize: 10.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.34, valign: "middle", autoPage: false });

  s.addText("Dropped. It tracks how big a district is more than anything humanitarian, and predicts severity worse than the plain count. This reverses an earlier decision to keep it.",
    { x: M + 0.28, y: 5.24, w: 5.5, h: 0.82, margin: 0, fontFace: "Calibri", fontSize: 11.5, bold: true, color: P, lineSpacing: 15 });

  // Task 6
  taskHead(s, 7.1, 1.62, 5.6, 6, "Percentage change replaced", SAGE);
  card(s, 7.1, 2.16, SW - M - 7.1, 4.05, INK);
  s.addText("Percentage change is undefined when the previous month is zero, and explodes when the previous month is small. Both problems affect the conflict trend and all four commodity price trends.",
    { x: 7.36, y: 2.34, w: 5.2, h: 0.86, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });

  const t6 = [
    [{ text: "", options: { fill: { color: "3A3330" } } },
     { text: "Percentage", options: { bold: true, color: W, fill: { color: "3A3330" }, fontSize: 11 } },
     { text: "Log difference", options: { bold: true, color: W, fill: { color: "3A3330" }, fontSize: 11 } }],
    [{ text: "Conflict trend missing", options: { color: W } }, { text: "99 / 148", options: { color: W } }, { text: "74 / 148", options: { color: SAGE } }],
    [{ text: "District going 1 → 7 events", options: { color: W } }, { text: "+600%", options: { color: W } }, { text: "1.39", options: { color: SAGE } }],
    [{ text: "Largest sugar price jump", options: { color: W } }, { text: "+709%", options: { color: W } }, { text: "2.09", options: { color: SAGE } }],
  ];
  s.addTable(t6, { x: 7.36, y: 3.3, w: 5.2, colW: [2.3, 1.45, 1.45],
    fontFace: "Calibri", fontSize: 10.5,
    border: { type: "solid", pt: 0.5, color: "4A423E" }, fill: { color: "3A3330" },
    rowH: 0.34, valign: "middle", autoPage: false });

  s.addText("Replaced rather than kept alongside, so the feature count is unchanged. The remaining 74 missing values are unavoidable first-month observations.",
    { x: 7.36, y: 5.24, w: 5.2, h: 0.82, margin: 0, fontFace: "Calibri", fontSize: 11.5, bold: true, color: SAGE, lineSpacing: 15 });
}

// =========================================================
// 5. TASK 7 (1 of 2) — the manual validation
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 7 (1 of 2): validating the ReliefWeb geoparsing", "The district-matching had never been checked against real report text");

  s.addText("Method: two independent random samples, each of 15 matched and 15 unmatched reports, read and classified by hand.",
    { x: M, y: 1.62, w: SW - 2 * M, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 12.5, color: INK });

  card(s, M, 2.06, 6.0, 2.05);
  s.addText("PRECISION", { x: M + 0.28, y: 2.22, w: 3, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 10.5, bold: true, color: P, charSpacing: 1.5 });
  s.addText("43%", { x: M + 0.28, y: 2.5, w: 1.7, h: 0.72, margin: 0, fontFace: "Cambria", fontSize: 42, bold: true, color: P });
  s.addText("13 of 30 matched reports were genuinely about the district they matched.\nSample 1: 8/15 (53%).  Sample 2: 5/15 (33%).",
    { x: M + 2.0, y: 2.52, w: 3.75, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14 });

  card(s, 7.1, 2.06, SW - M - 7.1, 2.05, INK);
  s.addText("RECALL", { x: 7.36, y: 2.22, w: 3, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 10.5, bold: true, color: SAGE, charSpacing: 1.5 });
  s.addText("1", { x: 7.36, y: 2.5, w: 1.0, h: 0.72, margin: 0, fontFace: "Cambria", fontSize: 42, bold: true, color: SAGE });
  s.addText("confirmed miss across 30 unmatched reports. A flood-response report naming Baardheere went uncaught, because the district was stored under the GADM spelling \"Baar Dheere\" with no alias.",
    { x: 7.36 + 1.15, y: 2.5, w: 4.05, h: 1.1, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14 });

  s.addText("Why the false matches happened", { x: M, y: 4.34, w: 6, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 16, bold: true, color: INK });
  const causes = [
    ["Datelines", "National press releases naming a district only in the opening dateline, such as \"Mogadishu, the UK has donated…\"."],
    ["Reference bulletins", "Price and livestock bulletins listing many districts purely as comparison points, not because anything happened there."],
    ["Missing aliases", "Districts stored under a spelling the reports never use, so genuine mentions were never found."],
  ];
  let x = M;
  causes.forEach(([t, d]) => {
    card(s, x, 4.82, 3.92, 1.4, SAND);
    s.addText(t, { x: x + 0.24, y: 4.96, w: 3.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: P });
    s.addText(d, { x: x + 0.24, y: 5.28, w: 3.5, h: 0.84, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });
    x += 4.06;
  });

  s.addText("What this established: the feature reflects text mentioning a district, not a confirmed event location. That was always how it was named, but now there is a measured number behind the caution.",
    { x: M, y: 6.42, w: SW - 2 * M, h: 0.46, margin: 0, fontFace: "Calibri", fontSize: 11.5, italic: true, color: MUTED });
}

// =========================================================
// 6. TASK 7 (2 of 2) — the fixes and final result
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 7 (2 of 2): what was done about it", "Precision filters, then a three-stage alias expansion");

  card(s, M, 1.6, 6.0, 2.3);
  s.addText("Precision filters", { x: M + 0.28, y: 1.74, w: 5, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, color: INK });
  s.addText([
    { text: "Datelines stripped from the report body before matching, so a district named only there no longer counts.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: "Bulletins excluded by title. A district-count threshold was tried first and rejected: the Livestock Price Bulletin names four districts, exactly as many as a genuine UNHCR update.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: "Both rules were checked against six hand-labelled cases first and got all six right.", options: { bullet: true } },
  ], { x: M + 0.28, y: 2.1, w: 5.5, h: 1.72, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14 });

  card(s, 7.1, 1.6, SW - M - 7.1, 2.3, INK);
  s.addText("Alias expansion, 16 → 65 of 74 districts", { x: 7.36, y: 1.74, w: 5, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, color: W });
  s.addText([
    { text: "Reused the ACLED naming crosswalk already built, taking coverage from 16 to 30 districts.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: "Parsed GADM's own variant-name field, which had sat unused in the boundary file since download, reaching 65 districts.", options: { bullet: true, breakLine: true, paraSpaceAfter: 7 } },
    { text: "Manual research on the remaining nine found real variants for two more, and confirmed seven genuinely have a single spelling.", options: { bullet: true } },
  ], { x: 7.36, y: 2.1, w: 5.2, h: 1.72, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14 });

  s.addText("Final result", { x: M, y: 4.1, w: 6, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 16, bold: true, color: INK });
  const tbl = [
    [{ text: "Stage", options: { bold: true, color: W, fill: { color: INK } } },
     { text: "Reports matched", options: { bold: true, color: W, fill: { color: INK } } },
     { text: "Districts covered", options: { bold: true, color: W, fill: { color: INK } } }],
    ["Original, unvalidated", "108 / 220", "44 / 74"],
    ["Precision filters only", "95 / 220", "43 / 74"],
    [{ text: "Filters plus full alias expansion", options: { bold: true } },
     { text: "99 / 220", options: { bold: true, color: P } },
     { text: "50 / 74", options: { bold: true, color: P } }],
  ];
  s.addTable(tbl, { x: M, y: 4.56, w: 7.2, colW: [3.2, 2.0, 2.0],
    fontFace: "Calibri", fontSize: 11.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.4, valign: "middle", autoPage: false });

  card(s, 8.2, 4.56, SW - M - 8.2, 1.6, SAND);
  s.addText("Fewer reports, more districts", { x: 8.46, y: 4.7, w: 4.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: P });
  s.addText("Matching fewer reports than the unvalidated version is the intended outcome, since low-precision matches were deliberately removed. District coverage still rose, because the alias work recovered genuine mentions that had been missed.",
    { x: 8.46, y: 5.02, w: 4.2, h: 1.06, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });

  s.addText("Known limitation: the dateline rule has at least one false negative. A report on a mortar attack at Aden Adde airport is genuinely about Mogadishu, but the only mention sits in the dateline the rule strips.",
    { x: M, y: 6.42, w: SW - 2 * M, h: 0.46, margin: 0, fontFace: "Calibri", fontSize: 11.5, italic: true, color: MUTED });
}

// =========================================================
// 7. TASK 8
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 8: three things “coverage” was quietly conflating", "A complete table does not mean a fully observed country");

  const cols = [
    ["Structural\navailability", "Could this source produce a value here at all, even in principle?", "Measurable", SAGE],
    ["Recorded\ncoverage", "Does the dataset actually contain a value for this district-month?", "Measurable", SAGE],
    ["True\nobservability", "How well does that value reflect what was really happening?", "Mostly not measurable", P],
  ];
  let x = M;
  cols.forEach(([t, d, tag, col]) => {
    card(s, x, 1.66, 3.92, 1.94);
    s.addText(t, { x: x + 0.28, y: 1.82, w: 3.3, h: 0.64, margin: 0, fontFace: "Cambria", fontSize: 17, bold: true, color: INK });
    s.addText(d, { x: x + 0.28, y: 2.5, w: 3.36, h: 0.72, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 14 });
    s.addText(tag.toUpperCase(), { x: x + 0.28, y: 3.24, w: 3.36, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 9.5, bold: true, color: col, charSpacing: 1 });
    x += 4.06;
  });

  const tbl = [
    [{ text: "Mechanism", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "Structural", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "Recorded", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } },
     { text: "True observability", options: { bold: true, color: W, fill: { color: INK }, fontSize: 12 } }],
    ["Conflict (ACLED)", "100%", "100%", "Unknown. A zero may mean no event, or no report of one."],
    ["Climate (CHIRPS / VHI)", "100%", "100%", "Strong. Satellites do not depend on local reporting."],
    ["Market (WFP)", "47%", "47%", "Mixed. Depends on enumerator visits and vendor choice."],
    ["Reporting (ReliefWeb)", "~100%", "68%", "Weakest. About 43% precision on matched reports."],
  ];
  s.addTable(tbl, { x: M, y: 3.86, w: SW - 2 * M, colW: [2.6, 1.5, 1.5, 6.46],
    fontFace: "Calibri", fontSize: 11.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.42, valign: "middle", autoPage: false });

  s.addText("Market and reporting both fall short of full coverage, but for different reasons. Market's gap is forced by structure, since a price cannot exist where no market does. Reporting's is not, so falling short means something was genuinely missed.",
    { x: M, y: 6.22, w: SW - 2 * M, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED });
}

// =========================================================
// 8. TASK 9
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 9: the pilot results, reframed as exploratory", "Two months of one country cannot support firm conclusions");

  card(s, M, 1.62, 6.0, 2.5);
  s.addText("Pilot 1 · Does market coverage track conflict?", { x: M + 0.28, y: 1.78, w: 5.5, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 14.5, bold: true, color: INK });
  const t1 = [
    [{ text: "Measure", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "With market", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "Without", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } },
     { text: "p", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11 } }],
    ["Conflict events", "4.57", "3.24", "0.18"],
    ["Fatalities", "4.61", "7.37", "0.47"],
  ];
  s.addTable(t1, { x: M + 0.28, y: 2.2, w: 5.5, colW: [2.0, 1.3, 1.1, 1.1],
    fontFace: "Calibri", fontSize: 11, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.34, valign: "middle", autoPage: false });
  s.addText("No significant difference on either measure, and the direction was not even consistent. Density was excluded here, following its removal in Task 5.",
    { x: M + 0.28, y: 3.4, w: 5.5, h: 0.62, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14 });

  card(s, 7.1, 1.62, SW - M - 7.1, 2.5, INK);
  s.addText("Pilot 2 · Does reporting follow conflict?", { x: 7.36, y: 1.78, w: 5.2, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 14.5, bold: true, color: W });
  s.addText([
    { text: "Same month, all districts: r = 0.32, p < 0.001.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Excluding the capital barely moved it, to r = 0.29.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "January was strong (r = 0.48) but February was not significant, and with only two months there was no way to tell which was typical.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "January conflict against February reports suggested a one-month lag, testable on exactly one pair of months.", options: { bullet: true } },
  ], { x: 7.36, y: 2.16, w: 5.2, h: 1.86, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14 });

  card(s, M, 4.32, SW - 2 * M, 1.9, SAND);
  s.addText("How these are presented", { x: M + 0.3, y: 4.48, w: 6, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, color: P });
  s.addText("Both experiments exist to show that the integrated dataset can support cross-mechanism questions that no single source could answer alone. They are demonstrations of what the dataset makes possible, not findings about Somalia. With 74 districts observed over two months, neither result should be read as evidence of a real-world pattern, and both are written up as hypotheses to carry into the full study rather than as conclusions.",
    { x: M + 0.3, y: 4.84, w: SW - 2 * M - 0.6, h: 1.24, margin: 0, fontFace: "Calibri", fontSize: 12, color: INK, lineSpacing: 16 });
}

// =========================================================
// 9. SECTION BREAK
// =========================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: -1.6, y: 3.4, w: 5.6, h: 5.6, fill: { color: P }, transparency: 84 });
  s.addText("TASK 10", { x: M, y: 2.5, w: 8, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 13, bold: true, color: SAGE, charSpacing: 3 });
  s.addText("Extending to the full year", { x: M, y: 2.95, w: 10, h: 0.95, margin: 0, fontFace: "Cambria", fontSize: 40, bold: true, color: W });
  s.addText("Only after the validity checks above were complete. Two months became twelve and 148 district-months became 888, with the feature set left exactly as validated.",
    { x: M, y: 4.05, w: 8.4, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 14.5, color: SAND });
}

// =========================================================
// 10. TASK 10 (1 of 3) — the build
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 10 (1 of 3): building the full 2024 panel", "Same pipeline, same features, six times the observations");

  const st = [["888", "district-months\n74 × 12", P], ["30", "columns, identical\nto the prototype", INK], ["0", "features added\nor dropped", SAGE]];
  let x = M;
  st.forEach(([v, l, c]) => {
    card(s, x, 1.62, 2.6, 1.5);
    s.addText(v, { x: x + 0.24, y: 1.74, w: 2.1, h: 0.66, margin: 0, fontFace: "Cambria", fontSize: 34, bold: true, color: c });
    s.addText(l, { x: x + 0.26, y: 2.42, w: 2.2, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED });
    x += 2.76;
  });

  card(s, 8.9, 1.62, SW - M - 8.9, 1.5, SAND);
  s.addText("Consistency check", { x: 9.14, y: 1.76, w: 3.4, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: INK });
  s.addText("Market missingness is 52.8% across the full year against 53.4% in the prototype, as expected since market availability does not change month to month.",
    { x: 9.14, y: 2.08, w: 3.5, h: 0.94, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 });

  s.addText("Two things worth flagging", { x: M, y: 3.36, w: 8, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 17, bold: true, color: INK });

  card(s, M, 3.82, 6.0, 2.4);
  s.addText("Reporting coverage improved sharply", { x: M + 0.26, y: 3.98, w: 5.4, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: INK });
  s.addText("District-level ReliefWeb coverage rose from 50 of 74 districts in the prototype to 73 of 74 across the year. Only SO_BANDER_BEYLA was never mentioned in any report in all of 2024, and it also has no market, making it the one district invisible to both non-satellite sources.",
    { x: M + 0.26, y: 4.32, w: 5.5, h: 1.76, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });

  card(s, 6.9, 3.82, SW - M - 6.9, 2.4, INK);
  s.addText("A leap-year edge case, documented", { x: 7.16, y: 3.98, w: 5.4, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: W });
  s.addText("NOAA's 52 weekly vegetation files do not evenly divide a 366-day year. Week 52 ends on 29 December, leaving two days uncovered, so December is normalised by the days actually observed. The day-weighting was checked to reproduce the prototype's hand-written January and February weights exactly before being trusted.",
    { x: 7.16, y: 4.32, w: 5.4, h: 1.76, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });
}

// =========================================================
// 11. TASK 10 (2 of 3) — re-running the pilots
// =========================================================
{
  const s = lightSlide();
  header(s, "Task 10 (2 of 3): re-running the pilots on 888 rows", "Identical code, six times the sample");

  const tbl = [
    [{ text: "Test", options: { bold: true, color: W, fill: { color: INK } } },
     { text: "Two months (148)", options: { bold: true, color: W, fill: { color: INK } } },
     { text: "Full year (888)", options: { bold: true, color: W, fill: { color: INK } } },
     { text: "Verdict", options: { bold: true, color: W, fill: { color: INK } } }],
    ["Market coverage vs conflict events", "p = 0.18, not significant", "p = 0.0001, significant", { text: "Changed", options: { bold: true, color: P } }],
    ["Market coverage vs fatalities", "p = 0.47, not significant", "p = 0.087, still not significant", "Held"],
    ["Reporting attention vs conflict", "r = 0.32", "r = 0.366, p < 0.0001", "Held, stronger"],
    ["Same, excluding the capital", "r = 0.29", "r = 0.338", "Held"],
    ["Conflict leading reporting by a month", "One pair available", "r = 0.382 across 11 pairs", "Held at scale"],
  ];
  s.addTable(tbl, { x: M, y: 1.62, w: SW - 2 * M, colW: [4.3, 3.0, 3.0, 1.76],
    fontFace: "Calibri", fontSize: 12, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.46, valign: "middle", autoPage: false });

  card(s, M, 4.96, 6.0, 1.36, SAND);
  s.addText("10 of 12 months significant on their own", { x: M + 0.26, y: 5.1, w: 5.4, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: INK });
  s.addText("The conflict-to-reporting relationship holds independently in every month except February and April, rather than resting on one or two unusual months.",
    { x: M + 0.26, y: 5.44, w: 5.5, h: 0.76, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 14 });

  card(s, 6.9, 4.96, SW - M - 6.9, 1.36, INK);
  s.addText("Why Task 9's caution was right", { x: 7.16, y: 5.1, w: 5.4, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: W });
  s.addText("One result genuinely changed once the sample grew. Presenting the pilots as exploratory rather than conclusive was the correct call, and the full year is what settled them.",
    { x: 7.16, y: 5.44, w: 5.4, h: 0.76, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 14 });
}

// =========================================================
// 12. TASK 10 (3 of 3) — the new finding
// =========================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: 9.9, y: -1.9, w: 5.8, h: 5.8, fill: { color: P }, transparency: 80 });

  s.addText("TASK 10 (3 OF 3) · NEW THIS WEEK", { x: M, y: 0.85, w: 9, h: 0.32, margin: 0, fontFace: "Calibri", fontSize: 12.5, bold: true, color: SAGE, charSpacing: 3 });
  s.addText("Two districts, comparable severity,\nvery different attention", { x: M, y: 1.3, w: 9.6, h: 1.35, margin: 0, fontFace: "Cambria", fontSize: 31, bold: true, color: W, lineSpacing: 39 });
  s.addText("The full year made sub-question 2 testable for the first time. The prototype contained almost no vegetation stress; 2024 contains 143 district-months below the conventional stress threshold.",
    { x: M, y: 2.72, w: 9.0, h: 0.8, margin: 0, fontFace: "Calibri", fontSize: 13, color: SAND });

  const boxes = [
    ["Severe conflict", "6.65", "mean reports that month", "88.2%", "received any report", P],
    ["Severe climate stress", "2.67", "mean reports that month", "65.7%", "received any report", SAGE],
  ];
  let x = M;
  boxes.forEach(([t, v, l, v2, l2, col]) => {
    s.addShape(pres.ShapeType.roundRect, { x, y: 3.68, w: 4.5, h: 2.3, rectRadius: 0.06, fill: { color: "3A3330" } });
    s.addText(t.toUpperCase(), { x: x + 0.3, y: 3.86, w: 3.9, h: 0.3, margin: 0, fontFace: "Calibri", fontSize: 10.5, bold: true, color: col, charSpacing: 1.5 });
    s.addText(v, { x: x + 0.3, y: 4.18, w: 2.0, h: 0.7, margin: 0, fontFace: "Cambria", fontSize: 38, bold: true, color: W });
    s.addText(l, { x: x + 0.3, y: 4.9, w: 2.2, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED });
    s.addText(v2, { x: x + 2.5, y: 4.28, w: 1.8, h: 0.54, margin: 0, fontFace: "Cambria", fontSize: 25, bold: true, color: col });
    s.addText(l2, { x: x + 2.5, y: 4.84, w: 1.9, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED });
    x += 4.74;
  });

  s.addShape(pres.ShapeType.roundRect, { x: 10.08, y: 3.68, w: 2.6, h: 2.3, rectRadius: 0.06, fill: { color: P } });
  s.addText("p = 0.000064", { x: 10.24, y: 4.36, w: 2.28, h: 0.4, margin: 0, align: "center", fontFace: "Cambria", fontSize: 16, bold: true, color: W });
  s.addText("68 vs 67\ndistrict-months", { x: 10.24, y: 4.8, w: 2.28, h: 0.6, margin: 0, align: "center", fontFace: "Calibri", fontSize: 11, color: "FBEAE7" });

  s.addText("Severity is the worst decile on each axis, with district-months severe on both excluded. Limits: severity is relative to Somalia in 2024, not to absolute human need; the test measures same-month attention only, so slow-onset stress may be reported late rather than never; and it uses reporting of any kind, not food-security reporting specifically.",
    { x: M, y: 6.22, w: 12.06, h: 0.72, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: SAND, lineSpacing: 14 });
  s.addNotes("A third of severely drought-stressed district-months passed with no report naming the district at all, against roughly one in eight for conflict.");
}

// =========================================================
// 13. NEXT STEPS
// =========================================================
{
  const s = lightSlide();
  header(s, "Next steps", "Ready means the data is already in hand; blocked means an external download is needed");

  const groups = [
    ["Sub-question 1", P, [
      "Build the logistic regression model, with month as a control  ·  Ready",
      "Measure how much each additional source actually contributes  ·  Ready",
    ]],
    ["Sub-question 2", P, [
      "Repeat the severity comparison on food and nutrition reporting only  ·  Ready",
      "Test whether slow-onset stress is reported late rather than never  ·  Ready",
      "Test whether attention scales smoothly with severity  ·  Ready",
    ]],
    ["Sub-question 3", SAGE, [
      "Define this dataset's own derived assessment, which does not yet exist  ·  Ready",
      "Obtain the IPC export and run the divergence comparison  ·  Blocked",
      "Fallback: test whether the four sources agree with each other  ·  Ready",
    ]],
    ["Strengthening", MUTED, [
      "Show how district rankings shift once observability is accounted for  ·  Ready",
      "Confirm results survive the 43% geoparsing precision  ·  Ready",
      "Produce observability maps from the boundary data  ·  Ready",
    ]],
  ];
  let y = 1.62;
  groups.forEach(([t, col, items]) => {
    const h = 0.40 + items.length * 0.26;
    card(s, M, y, SW - 2 * M, h);
    s.addText(t, { x: M + 0.26, y: y + 0.13, w: 3.0, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: col });
    s.addText(items.map((it, i) => ({ text: it, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 3 } })),
      { x: M + 3.3, y: y + 0.12, w: 8.4, h: h - 0.2, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 });
    y += h + 0.10;
  });

  s.addText("Sequencing: the ready items under sub-question 2 are quick. Defining the derived assessment unblocks half of sub-question 3 without waiting for anything. The IPC download has the longest lead time and should start first.",
    { x: M, y: 6.46, w: SW - 2 * M, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 11.5, italic: true, color: MUTED });
}

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-Dissertation---Samuel-Aracena/f0ee5e0f-2568-5898-b6c4-4b4040e35512/scratchpad/deck/2026_08_10_slides.pptx" })
  .then(f => console.log("WROTE", f));
