const pptxgen = require("pptxgenjs");

const P = "B85042", SAND = "E7E8D1", SAGE = "A7BEAE", INK = "2B2523", MUTED = "7A6E68", W = "FFFFFF";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Samuel Aracena";
pres.title = "Week of August 17";

const SW = 13.3, SH = 7.5, M = 0.62;

function darkSlide() { const s = pres.addSlide(); s.background = { color: INK }; return s; }
function lightSlide() { const s = pres.addSlide(); s.background = { color: W }; return s; }
function header(s, title, sub) {
  s.addText(title, { x: M, y: 0.5, w: SW - 2 * M, h: 0.6, margin: 0,
    fontFace: "Cambria", fontSize: 25, bold: true, color: INK });
  if (sub) s.addText(sub, { x: M, y: 1.08, w: SW - 2 * M, h: 0.36, margin: 0,
    fontFace: "Calibri", fontSize: 12.5, color: MUTED, italic: true });
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
  s.addText(text.toUpperCase(), { x, y, w: w || 2.4, h: 0.26, margin: 0,
    fontFace: "Calibri", fontSize: 9.5, bold: true, color: col, charSpacing: 1.2 });
}
function bullets(s, items, x, y, w, h, opts) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: opts && opts.gap || 6 } })),
    { x, y, w, h, margin: 0, fontFace: "Calibri", fontSize: (opts && opts.size) || 11, color: (opts && opts.color) || INK, lineSpacing: (opts && opts.lineSpacing) || 14 });
}
function statRow(s, x, y, w, stats) {
  const cw = w / stats.length;
  stats.forEach((st, i) => {
    const cx = x + i * cw;
    s.addText(st.value, { x: cx, y, w: cw, h: 0.62, margin: 0, align: "center",
      fontFace: "Cambria", fontSize: 26, bold: true, color: st.color || P });
    s.addText(st.label, { x: cx, y: y + 0.6, w: cw, h: 0.5, margin: 0, align: "center",
      fontFace: "Calibri", fontSize: 9.5, color: MUTED, lineSpacing: 11 });
  });
}
function footNote(s, text) {
  s.addText(text, { x: M, y: 6.72, w: SW - 2 * M, h: 0.26, margin: 0,
    fontFace: "Calibri", fontSize: 9, italic: true, color: MUTED });
}

// =========================================================
// TITLE
// =========================================================
{
  const s = darkSlide();
  s.addText("Week of August 17, 2026", { x: M, y: 2.5, w: SW - 2 * M, h: 1.0, margin: 0,
    fontFace: "Cambria", fontSize: 38, bold: true, color: W });
  s.addText("Working through the outstanding to-do list: geoparser validation, correcting for\nrepeated district-months, strengthening the conflict-vs-climate result, source\ncomplementarity, final feature formulas, and the source-level table.",
    { x: M, y: 3.5, w: SW - 2 * M, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 14, color: SAND, lineSpacing: 19 });
  s.addText("Somalia humanitarian observability dissertation  --  a self-contained summary of this week's work", { x: M, y: 6.5, w: SW - 2 * M, h: 0.4, margin: 0,
    fontFace: "Calibri", fontSize: 11.5, color: SAGE, italic: true });
}

// =========================================================
// CONTEXT RECAP
// =========================================================
{
  const s = lightSlide();
  header(s, "Where this fits", "The research question and the dataset this week's work builds on");

  card(s, M, 1.6, SW - 2 * M, 1.24, INK);
  s.addText("How do heterogeneous humanitarian data sources differ in their spatial and temporal coverage, granularity, missingness and measurement reliability when integrated into a common subnational framework?",
    { x: M + 0.3, y: 1.74, w: SW - 2 * M - 0.6, h: 1.0, margin: 0, fontFace: "Cambria", fontSize: 15, italic: true, color: W, lineSpacing: 20 });

  const subq = [
    ["1", "Where are the gaps?", "Which districts, periods and mechanisms are well or poorly observed"],
    ["2", "Are the gaps systematic?", "Do they depend on how the data is collected: satellite, survey, event monitoring, reporting"],
    ["3", "What does combining sources add?", "Which are complementary, which add little on their own"],
  ];
  let x = M;
  const cw = (SW - 2 * M - 2 * 0.22) / 3;
  subq.forEach(([n, t, d]) => {
    card(s, x, 3.1, cw, 1.5);
    badge(s, n, x + 0.2, 3.28, 0.42, P, W);
    s.addText(t, { x: x + 0.76, y: 3.26, w: cw - 0.96, h: 0.5, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: INK, valign: "middle", lineSpacing: 14 });
    s.addText(d, { x: x + 0.22, y: 3.9, w: cw - 0.44, h: 0.66, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    x += cw + 0.22;
  });

  card(s, M, 4.86, SW - 2 * M, 1.6, SAND);
  s.addText("The panel this all runs on", { x: M + 0.3, y: 5.0, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: INK });
  statRow(s, M + 0.3, 5.32, SW - 2 * M - 0.6, [
    { value: "888", label: "district-months (74 districts x 12 months, 2024)", color: P },
    { value: "4", label: "sources: conflict (ACLED), climate (CHIRPS/VHI),\nmarket (WFP), reporting (ReliefWeb)", color: P },
    { value: "23", label: "engineered features across those 4 sources", color: P },
  ]);

  footNote(s, "This week continues directly from last week's chapter and works through the remaining items on the outstanding to-do list, one at a time.");
}

// =========================================================
// GEOPARSER 1: WHAT IT DOES
// =========================================================
{
  const s = lightSlide();
  header(s, "What the geoparser actually does", "Six rules, applied consistently, before any validation begins");

  s.addText("It matches each ReliefWeb report's text against a list of district names and aliases, to tag which of Somalia's 74 districts the report is about.",
    { x: M, y: 1.56, w: SW - 2 * M, h: 0.44, margin: 0, fontFace: "Calibri", fontSize: 12.5, italic: true, color: MUTED });

  const rules = [
    ["1", "Only title + body text", "No attachment, image or linked file is ever read, only the exported title and body."],
    ["2", "Datelines stripped", "A leading \"Mogadishu -\" is removed first, since it says where a report was filed from, not what it is about."],
    ["3", "Alias matching", "Each district is matched against its name plus a merged alias list covering 65 of 74 districts, built from the WFP crosswalk, the ACLED crosswalk, GADM's own spelling variants, and manual research."],
    ["4", "Bulletin exclusion", "Reports titled as a price/supply/market bulletin are excluded entirely; they list many districts as comparison points, not because anything happened there."],
    ["5", "No word boundaries", "A known limitation, not an oversight: matching is substring-based, so \"Sheekh\" the district also matches inside \"Hassan Sheikh Mohamud\", the president's name."],
    ["6", "No limit per report", "A single report can be tied to any number of districts; there is no cap."],
  ];
  let x = M, y = 2.2;
  const cw = (SW - 2 * M - 0.24) / 2, ch = 1.46;
  rules.forEach((r, i) => {
    const cx = M + (i % 2) * (cw + 0.24);
    const cy = y + Math.floor(i / 2) * (ch + 0.16);
    card(s, cx, cy, cw, ch);
    badge(s, r[0], cx + 0.18, cy + 0.16, 0.38, P, W);
    s.addText(r[1], { x: cx + 0.68, y: cy + 0.12, w: cw - 0.9, h: 0.46, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: INK, valign: "middle" });
    s.addText(r[2], { x: cx + 0.22, y: cy + 0.64, w: cw - 0.44, h: 0.76, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    x += cw + 0.24;
  });
}

// =========================================================
// GEOPARSER 2: BUILDING THE SAMPLE
// =========================================================
{
  const s = lightSlide();
  header(s, "ReliefWeb geoparser: final validation", "A blind, manual check of the final method against human judgement");

  const steps = [
    ["1", "Draw a fresh sample", "100 reports from March-December only. January and February were excluded, since those were the exact reports used while building and tuning the method."],
    ["2", "Split it evenly", "50 reports the geoparser matched to a district, 50 it did not. This makes it possible to measure both precision and recall properly, not just one."],
    ["3", "Label it blind", "The geoparser's own predictions were hidden from the labelling sheet. Districts were identified by reading each report from scratch, with no hint of what the method had guessed."],
    ["4", "Compare afterwards", "Only once labelling was done were the human labels joined against a separate answer key holding the geoparser's predictions, and precision, recall and F1 computed."],
  ];
  let x = M;
  const cw = (SW - 2 * M - 3 * 0.22) / 4;
  steps.forEach(([n, t, d]) => {
    card(s, x, 1.7, cw, 3.5);
    badge(s, n, x + 0.24, 1.94, 0.5, P, W);
    s.addText(t, { x: x + 0.24, y: 2.58, w: cw - 0.48, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: INK, lineSpacing: 15 });
    s.addText(d, { x: x + 0.24, y: 3.24, w: cw - 0.48, h: 1.8, margin: 0, fontFace: "Calibri", fontSize: 10, color: MUTED, lineSpacing: 13 });
    x += cw + 0.22;
  });

  card(s, M, 5.5, SW - 2 * M, 1.32, INK);
  s.addText("Why this matters: the validation had to test the final method, on reports it had never seen, with the labeller unable to see what the method predicted. All three conditions are met here.",
    { x: M + 0.3, y: 5.64, w: SW - 2 * M - 0.6, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 12, color: SAND, lineSpacing: 16 });
}

// =========================================================
// GEOPARSER 3: RESULTS
// =========================================================
{
  const s = lightSlide();
  header(s, "Results: strong precision, and a recall figure that needs care", "All 100 reports labelled and scored");

  card(s, M, 1.66, SW - 2 * M, 1.86);
  const cols = [
    { h: "", rows: ["Report x district pairs", "Report level"] },
    { h: "Precision", rows: ["81.1%", "78.8%"] },
    { h: "Recall", rows: ["16.7%", "56.8%"] },
    { h: "F1", rows: ["27.7%", "66.0%"] },
  ];
  const tx = M + 0.3, tw = SW - 2 * M - 0.6;
  const colW = [tw * 0.34, tw * 0.22, tw * 0.22, tw * 0.22];
  let cx = tx;
  cols.forEach((c, i) => {
    s.addText(c.h, { x: cx, y: 1.82, w: colW[i], h: 0.3, margin: 0, fontFace: "Calibri", fontSize: 10.5, bold: true, color: MUTED, align: i === 0 ? "left" : "center" });
    c.rows.forEach((v, r) => {
      s.addText(v, { x: cx, y: 2.2 + r * 0.58, w: colW[i], h: 0.5, margin: 0,
        fontFace: i === 0 ? "Calibri" : "Cambria", fontSize: i === 0 ? 12.5 : 18, bold: i !== 0, color: INK,
        align: i === 0 ? "left" : "center", valign: "middle" });
    });
    cx += colW[i];
  });

  s.addText("Read plainly: when the geoparser says a report is about a district, it is right roughly four times out of five, at either level of detail. Recall is where the two levels diverge sharply: the geoparser is usually right that a report is about at least one district, but often misses other districts that same report also genuinely covers.",
    { x: M, y: 3.72, w: SW - 2 * M, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 12, color: INK, lineSpacing: 16 });

  card(s, M, 4.78, 6.0, 2.04, INK);
  tag(s, "Why the pair-level recall is low", M + 0.26, 4.94, P);
  s.addText("The geoparser can only work with a report's title and exported body text. It has no access to images, tables or attached files, so recall can only ever be as good as what that exported text contains. Explained fully on the next slide.",
    { x: M + 0.26, y: 5.28, w: 5.5, h: 1.4, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 15 });

  card(s, 6.9, 4.78, SW - M - 6.9, 2.04, SAGE);
  s.addText("97.4%", { x: 7.16, y: 4.94, w: 5.2, h: 0.7, margin: 0, fontFace: "Cambria", fontSize: 30, bold: true, color: INK });
  s.addText("recall, once restricted to only the district mentions that were actually present in the report's exported text",
    { x: 7.16, y: 5.66, w: 5.2, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 11, color: INK, lineSpacing: 14 });
}

// =========================================================
// GEOPARSER 4: ATTACHMENTS / PDF FINDING
// =========================================================
{
  const s = lightSlide();
  header(s, "The real limitation: attachments and PDFs, not matching quality", "Confirmed by opening the reports directly");

  card(s, M, 1.66, SW - 2 * M, 1.7, INK);
  s.addText("What we found", { x: M + 0.3, y: 1.8, w: 6, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 14.5, bold: true, color: SAGE });
  s.addText("Of every district a human labeller said a report was genuinely about, 80.5% of those district names never appear anywhere in the report's exported title or body text at all. They only exist inside attached files ReliefWeb does not index as text.",
    { x: M + 0.3, y: 2.16, w: SW - 2 * M - 0.6, h: 1.1, margin: 0, fontFace: "Calibri", fontSize: 12.5, color: SAND, lineSpacing: 17 });

  card(s, M, 3.56, 6.0, 1.9);
  s.addText("The clearest example", { x: M + 0.26, y: 3.72, w: 5.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: P });
  s.addText("Weekly cholera/AWD bulletins list their real district-by-district breakdown only inside a table in an attached PDF. ReliefWeb files them as an ordinary \"Situation Report\", with nothing in the metadata to say the substance lives in an attachment. The exported body is just a one-line summary, no district named at all.",
    { x: M + 0.26, y: 4.06, w: 5.5, h: 1.35, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 14 });

  card(s, 6.9, 3.56, SW - M - 6.9, 1.9);
  s.addText("What this is not", { x: 7.16, y: 3.72, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: P });
  bullets(s, [
    "The five genuine misses in the whole sample all come from one report, and are a deliberate design choice (price bulletins are excluded on purpose), not an error",
    "Reading PDF attachments reliably is a materially different, less reliable engineering problem, and is out of scope for this project",
  ], 7.16, 4.06, 5.2, 1.4, { size: 10.5, color: MUTED, lineSpacing: 13 });

  card(s, M, 5.64, SW - 2 * M, 1.0, SAND);
  s.addText("Bottom line: the geoparser cannot read attachments or images, only exported text. That single structural fact, not a matching failure, explains almost the entire gap between the pair-level and restricted recall figures.",
    { x: M + 0.3, y: 5.78, w: SW - 2 * M - 0.6, h: 0.76, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 });
}

// =========================================================
// GEOPARSER 5: LIMITATIONS
// =========================================================
{
  const s = lightSlide();
  header(s, "Geoparser validation: limitations", "What is still open, stated plainly");

  const lims = [
    ["A small number of place names remain unresolved", "Garadag has no match under any spelling in ACLED or GADM. Mataban is a real district that GADM does not include as its own Admin2 unit at all. Neither has much effect on the headline numbers, since both fall in the lower-priority \"mentioned in passing\" category."],
    ["The attachment-content gap is out of scope for this project", "Reading attached PDFs and extracting tabular data from them is a substantially different and less reliable engineering problem than text matching, and would need its own validation exercise. It is documented as a genuine, measured limit, not a bug to fix."],
    ["Precision, not recall, is the trustworthy headline figure", "Recall here should be read as \"recall on district mentions that are structurally visible to a text-based method\", not \"recall on everything a human could determine from the full report\". Those are two different things."],
  ];
  let y = 1.7;
  lims.forEach(([t, d]) => {
    card(s, M, y, SW - 2 * M, 1.6);
    s.addText(t, { x: M + 0.3, y: y + 0.16, w: SW - 2 * M - 0.6, h: 0.4, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: P });
    s.addText(d, { x: M + 0.3, y: y + 0.58, w: SW - 2 * M - 0.6, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });
    y += 1.78;
  });
}

// =========================================================
// REPEATED DISTRICT-MONTHS 1: THE PROBLEM
// =========================================================
{
  const s = lightSlide();
  header(s, "Why repeated district-months are a statistical trap", "12 rows per district is not the same as 12 independent observations");

  card(s, M, 1.8, SW - 2 * M, 2.2, INK);
  s.addText("888 rows, but only 74 real \"units\"", { x: M + 0.3, y: 2.0, w: SW - 2 * M - 0.6, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, color: SAGE });
  s.addText("Each of the 74 districts contributes 12 rows to the panel, one per month. A district's conflict level, market status and reporting attention this month is largely the same underlying district carrying forward, not a fresh, independent measurement. Treating all 888 rows as 888 independent pieces of evidence silently multiplies the effective sample size, and can turn a genuinely null result into one that looks statistically significant.",
    { x: M + 0.3, y: 2.4, w: SW - 2 * M - 0.6, h: 1.5, margin: 0, fontFace: "Calibri", fontSize: 13, color: SAND, lineSpacing: 18 });

  card(s, M, 4.3, SW - 2 * M, 1.6, SAND);
  s.addText("The fix, in general terms", { x: M + 0.3, y: 4.44, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: INK });
  s.addText("Every bivariate result in the full-year panel was checked for this, using one of three fixes depending on how the variable behaves: collapsing to one row per district when a variable is fixed at district level, a district-cluster bootstrap when a variable genuinely changes month to month, or confirming a model already accounts for it (clustered standard errors). All three are shown across the next few slides.",
    { x: M + 0.3, y: 4.76, w: SW - 2 * M - 0.6, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 });

  footNote(s, "This is a known statistical issue called pseudo-replication.");
}

// =========================================================
// REPEATED DISTRICT-MONTHS 2: THE ONE REAL VIOLATION
// =========================================================
{
  const s = lightSlide();
  header(s, "The one genuine violation found, and its fix", "Does market access track conflict?");

  card(s, M, 1.7, 6.0, 2.7);
  s.addText("Naive reading (888 rows, wrong)", { x: M + 0.26, y: 1.86, w: 5.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK });
  statRow(s, M + 0.26, 2.22, 5.5, [
    { value: "p = 0.0001", label: "conflict events, market vs no market" },
  ]);
  s.addText("Statistically significant: looks like a real relationship.", { x: M + 0.26, y: 3.42, w: 5.5, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: MUTED, lineSpacing: 14 });

  card(s, 6.9, 1.7, SW - M - 6.9, 2.7, SAGE);
  s.addText("Corrected (n = 74 districts, right)", { x: 7.16, y: 1.86, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK });
  statRow(s, 7.16, 2.22, 5.2, [
    { value: "p = 0.188", label: "same test, one row per district", color: INK },
  ]);
  s.addText("Not significant. The naive result was entirely an artefact of counting each district twelve times over.", { x: 7.16, y: 3.42, w: 5.2, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: INK, lineSpacing: 14 });

  card(s, M, 4.6, SW - 2 * M, 1.7, INK);
  s.addText("What was actually done", { x: M + 0.3, y: 4.74, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: SAGE });
  s.addText("has_market_coverage is fixed at the district level, it never changes month to month, so pooling all 888 rows was double-counting each district twelve times over. The fix: collapse the 888-row panel down to 74 rows, one per district (taking each district's own average conflict level across its 12 months), and re-run the exact same comparison on that smaller, correct table. The naive figures are kept in the notebook next to the correction, not deleted, so the artefact stays visible.",
    { x: M + 0.3, y: 5.06, w: SW - 2 * M - 0.6, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 15 });
}

// =========================================================
// REPEATED DISTRICT-MONTHS 3: HOW THE CLUSTER BOOTSTRAP WORKS
// =========================================================
{
  const s = lightSlide();
  header(s, "How the district-cluster bootstrap actually works", "The method behind the results on the next slide");

  const steps = [
    ["1", "The normal approach would repeat the mistake", "A standard bootstrap resamples individual rows at random. Doing that here would repeat exactly the problem being fixed: an over-represented district's rows could get drawn many times, as if they were many different districts."],
    ["2", "Resample whole districts instead", "Pick 74 districts at random, allowing the same district to be picked more than once (\"with replacement\"). Every time a district is picked, take all 12 of its rows together, as one unit."],
    ["3", "Recompute, and repeat 3,000 times", "Calculate the correlation on that resampled table. Then throw it away and repeat the whole process, 3,000 separate times, each with a fresh random set of 74 districts."],
    ["4", "Look at the spread of the 3,000 results", "If the middle 95% of those 3,000 results comfortably avoids zero, the relationship holds up regardless of which specific districts happened to be drawn. If that range crosses zero, the effect cannot be trusted once repetition is accounted for."],
  ];
  let x = M;
  const cw = (SW - 2 * M - 3 * 0.22) / 4;
  steps.forEach(([n, t, d]) => {
    card(s, x, 1.7, cw, 4.2);
    badge(s, n, x + 0.24, 1.94, 0.5, P, W);
    s.addText(t, { x: x + 0.24, y: 2.58, w: cw - 0.48, h: 0.85, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: INK, lineSpacing: 14 });
    s.addText(d, { x: x + 0.24, y: 3.5, w: cw - 0.48, h: 2.2, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    x += cw + 0.22;
  });

  footNote(s, "This same method is what \"district-cluster bootstrap\" refers to everywhere else in this deck and in the notebook.");
}

// =========================================================
// REPEATED DISTRICT-MONTHS 4: EVERYTHING ELSE, BOTTOM LINE
// =========================================================
{
  const s = lightSlide();
  header(s, "Checking every other result, and what survives", "Three different strengths of the same problem, three different fixes");

  const rows = [
    ["Time-varying correlations", "Conflict vs reports, rainfall vs reports, VHI vs conflict",
      "Checked with the district-cluster bootstrap explained on the previous slide. All three survive with confidence intervals well clear of zero.", SAGE],
    ["One exception", "Vegetation health (VHI) vs reports",
      "Its cluster-robust confidence interval crosses zero. The earlier r=-0.11 figure should be read as inconclusive, not a confirmed effect.", P],
    ["Conflict-vs-climate reporting gap", "Collapsed to one row per district (n=18 vs n=41)",
      "Survives, but weakens: p=0.000064 falls to p=0.0067 once repeated conflict-heavy districts stop being over-counted. Full detail in the next section.", SAND],
    ["Logistic regression", "Already clusters its standard errors by district",
      "No correction was needed. It would have had the same problem built in from the start had it not.", SAGE],
  ];
  let y = 1.6;
  rows.forEach(([t, sub, d, col]) => {
    card(s, M, y, SW - 2 * M, 1.1);
    s.addShape(pres.ShapeType.rect, { x: M, y, w: 0.08, h: 1.1, fill: { color: col } });
    s.addText(t, { x: M + 0.3, y: y + 0.1, w: 3.6, h: 0.4, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK });
    s.addText(sub, { x: M + 0.3, y: y + 0.48, w: 3.6, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 9.5, italic: true, color: MUTED, lineSpacing: 12 });
    s.addText(d, { x: 4.5, y: y + 0.14, w: SW - M - 4.5 - 0.3, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: INK, lineSpacing: 13, valign: "middle" });
    y += 1.22;
  });

  s.addText("Bottom line: nothing in the notebook's headline findings depended on a repeated-district-months artefact once corrected, except the naive market/conflict result, which was never a real finding.",
    { x: M, y: 6.6, w: SW - 2 * M, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 10.5, italic: true, color: MUTED });
}

// =========================================================
// CONFLICT VS CLIMATE 1: ORIGINAL RESULT
// =========================================================
{
  const s = lightSlide();
  header(s, "Strengthening the conflict-vs-climate reporting result", "The original test, and why the wording changed");

  card(s, M, 1.7, SW - 2 * M, 1.9, INK);
  s.addText("The original result", { x: M + 0.3, y: 1.86, w: 5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: SAGE });
  statRow(s, M + 0.3, 2.22, SW - 2 * M - 0.6, [
    { value: "6.65", label: "avg reports, relatively extreme conflict", color: P },
    { value: "2.67", label: "avg reports, relatively extreme climate stress", color: SAND },
    { value: "p = 0.000064", label: "the difference is unlikely to be chance", color: SAGE },
  ]);
  s.addText("\"Relatively extreme\" means the worst 10% of all 888 district-months on that one measure: conflict event count, or vegetation-health stress, checked separately.",
    { x: M + 0.3, y: 3.2, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Calibri", fontSize: 10, italic: true, color: SAND });

  card(s, M, 3.86, SW - 2 * M, 1.5, SAND);
  s.addText("Wording note", { x: M + 0.3, y: 4.0, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: INK });
  s.addText("The two groups are matched on their position within Somalia's own 2024 distribution, not on equal humanitarian severity. Wording changed throughout to \"relatively extreme conflict / climate-stress observations\", never \"comparable severity\".",
    { x: M + 0.3, y: 4.32, w: SW - 2 * M - 0.6, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 });

  footNote(s, "Five robustness checks follow across the next five slides, each explaining exactly what was done before showing what it found.");
}

// =========================================================
// CONFLICT VS CLIMATE 2: THRESHOLDS -- METHOD AND RESULT
// =========================================================
{
  const s = lightSlide();
  header(s, "Check 1: does it hold at different thresholds?", "Method: repeat the exact same comparison, only changing where \"extreme\" is drawn");

  card(s, M, 1.62, SW - 2 * M, 0.94, INK);
  s.addText("What was done: the original comparison marked a district-month \"extreme\" if it fell in the worst 10% of Somalia's 2024 distribution. That exact same comparison was repeated twice more, once marking only the worst 5% as extreme (a stricter bar) and once marking the worst 20% as extreme (a looser bar).",
    { x: M + 0.26, y: 1.74, w: SW - 2 * M - 0.52, h: 0.72, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14 });

  const th = [
    ["5%", "Strictest", "~44 district-months per group", "p < 0.001"],
    ["10%", "Original result", "68 vs 67 district-months", "p = 0.000064"],
    ["20%", "Loosest", "~155 vs 117 district-months", "p < 0.001"],
  ];
  let x = M;
  const cw = (SW - 2 * M - 2 * 0.24) / 3;
  th.forEach(([v, tag2, d, p]) => {
    card(s, x, 2.76, cw, 2.1, v === "10%" ? INK : "F7F5F1");
    const dark = v === "10%";
    s.addText(v, { x: x + 0.24, y: 2.92, w: cw - 0.48, h: 0.7, margin: 0, fontFace: "Cambria", fontSize: 32, bold: true, color: dark ? SAGE : P });
    s.addText(tag2, { x: x + 0.24, y: 3.66, w: cw - 0.48, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: dark ? W : INK });
    s.addText(d, { x: x + 0.24, y: 3.98, w: cw - 0.48, h: 0.44, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: dark ? SAND : MUTED, lineSpacing: 12 });
    s.addText(p, { x: x + 0.24, y: 4.44, w: cw - 0.48, h: 0.35, margin: 0, fontFace: "Calibri", fontSize: 11.5, bold: true, color: dark ? SAGE : P });
    x += cw + 0.24;
  });

  card(s, M, 5.12, SW - 2 * M, 1.2, SAND);
  s.addText("Result: the gap holds at every threshold tested, and every p-value stays well under 0.001. The size moves a little (largest at the strictest cutoff, since the most extreme district-months attract the most reporting), but the direction and significance never change. This rules out the result being a one-threshold coincidence.",
    { x: M + 0.3, y: 5.26, w: SW - 2 * M - 0.6, h: 0.94, margin: 0, fontFace: "Calibri", fontSize: 11, color: INK, lineSpacing: 15 });
}

// =========================================================
// CONFLICT VS CLIMATE 3: CONTINUOUS CHECK -- METHOD
// =========================================================
{
  const s = lightSlide();
  header(s, "Check 2: a continuous version, not just two extreme groups", "Method: splitting the full range into five equal-sized groups");

  const steps = [
    ["1", "Rank every district-month", "All 888 district-months were ranked by their conflict-event count, from the lowest to the highest."],
    ["2", "Split into 5 equal groups", "That ranked list was cut into 5 quintiles, each holding 20% of the data: quintile 1 is the least conflict-affected fifth, quintile 5 is the most conflict-affected fifth."],
    ["3", "Average reports within each group", "The mean number of reports that month was calculated separately for each of the 5 quintiles, giving 5 numbers to compare instead of 2."],
    ["4", "Repeat the same 3 steps for climate", "The identical process was run a second time, independently, ranking and splitting district-months by vegetation-health stress instead of conflict."],
  ];
  let x = M;
  const cw = (SW - 2 * M - 3 * 0.22) / 4;
  steps.forEach(([n, t, d]) => {
    card(s, x, 1.7, cw, 3.6);
    badge(s, n, x + 0.24, 1.94, 0.5, P, W);
    s.addText(t, { x: x + 0.24, y: 2.58, w: cw - 0.48, h: 0.7, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: INK, lineSpacing: 14 });
    s.addText(d, { x: x + 0.24, y: 3.36, w: cw - 0.48, h: 1.9, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    x += cw + 0.22;
  });

  footNote(s, "This tests whether reporting rises smoothly as intensity increases, rather than only checking whether the two extreme ends differ.");
}

// =========================================================
// CONFLICT VS CLIMATE 4: CONTINUOUS CHECK -- RESULT
// =========================================================
{
  const s = lightSlide();
  header(s, "Check 2 result: does reporting rise steadily with intensity?", "Same method, applied separately to conflict and to climate stress");

  card(s, M, 1.7, 6.0, 3.4);
  s.addText("Conflict quintiles", { x: M + 0.26, y: 1.86, w: 5.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: P });
  s.addText("1.40  ->  5.66 reports", { x: M + 0.26, y: 2.2, w: 5.5, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 22, bold: true, color: INK });
  s.addText("Reporting rises in a close to straight line from the least-conflict group to the most-conflict group, across all five groups.",
    { x: M + 0.26, y: 2.9, w: 5.5, h: 1.8, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });

  card(s, 6.9, 1.7, SW - M - 6.9, 3.4, INK);
  s.addText("Climate-stress quintiles", { x: 7.16, y: 1.86, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: SAGE });
  s.addText("No steady rise", { x: 7.16, y: 2.2, w: 5.2, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 22, bold: true, color: W });
  s.addText("The worst-stress group sits a little higher than the middle groups (4.01 vs ~2.0), but there is no climbing pattern the way conflict shows.",
    { x: 7.16, y: 2.9, w: 5.2, h: 1.8, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });

  s.addText("Together, the threshold and continuous checks agree: reporting responds clearly and continuously to conflict, and shows no reliable, independent response to climate stress.",
    { x: M, y: 5.3, w: SW - 2 * M, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 12, italic: true, color: INK, lineSpacing: 16 });
}

// =========================================================
// CONFLICT VS CLIMATE 5: FOOD/NUTRITION-ONLY + REPORTED-LATE
// =========================================================
{
  const s = lightSlide();
  header(s, "Checks 3 and 4: a narrower report type, and a time delay", "Two smaller checks, method and result together");

  card(s, M, 1.66, 6.0, 4.2);
  tag(s, "Check 3: food and nutrition reports only", M + 0.24, 1.82, P, 5.4);
  s.addText("Method", { x: M + 0.24, y: 2.14, w: 5.5, h: 0.28, margin: 0, fontFace: "Cambria", fontSize: 11.5, bold: true, color: INK });
  s.addText("Repeated the exact same worst-10% comparison as the original result, but counted only reports ReliefWeb itself tags with the theme \"Food and Nutrition\", instead of every report.",
    { x: M + 0.24, y: 2.44, w: 5.5, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 14 });
  s.addText("Result", { x: M + 0.24, y: 3.5, w: 5.5, h: 0.28, margin: 0, fontFace: "Cambria", fontSize: 11.5, bold: true, color: INK });
  s.addText("3.21 vs 2.09 reports (p = 0.016)", { x: M + 0.24, y: 3.8, w: 5.5, h: 0.4, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, color: P });
  s.addText("Same direction, but weaker. Food/nutrition-specific reporting still favours conflict, just less strongly than reporting overall.",
    { x: M + 0.24, y: 4.3, w: 5.5, h: 1.4, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 14 });

  card(s, 6.9, 1.66, SW - M - 6.9, 4.2, INK);
  tag(s, "Check 4: is climate stress simply reported late?", 7.16, 1.82, SAGE, 5.0);
  s.addText("Method", { x: 7.16, y: 2.14, w: 5.2, h: 0.28, margin: 0, fontFace: "Cambria", fontSize: 11.5, bold: true, color: W });
  s.addText("For every extreme climate-stress month, reports were counted not just that same month, but cumulatively across the 1, 2 and 3 months that followed, to see whether attention catches up on a delay.",
    { x: 7.16, y: 2.44, w: 5.2, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: SAND, lineSpacing: 14 });
  s.addText("Result", { x: 7.16, y: 3.5, w: 5.2, h: 0.28, margin: 0, fontFace: "Cambria", fontSize: 11.5, bold: true, color: W });
  s.addText("17.47 vs 6.82 reports over 3 months (p = 0.0001)", { x: 7.16, y: 3.8, w: 5.2, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 15, bold: true, color: SAGE });
  s.addText("No. The gap does not shrink over time; if anything it widens slightly. Climate stress is not \"noticed late\", it attracts less attention throughout.",
    { x: 7.16, y: 4.5, w: 5.2, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: SAND, lineSpacing: 14 });
}

// =========================================================
// CONFLICT VS CLIMATE 6: DISTRICT-LEVEL CHECK
// =========================================================
{
  const s = lightSlide();
  header(s, "Check 5: treating districts, not district-months, as the unit", "The same repeated-district-months concern, applied to this specific result");

  card(s, M, 1.66, SW - 2 * M, 1.4, INK);
  s.addText("Why this check was needed", { x: M + 0.3, y: 1.8, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: SAGE });
  s.addText("The extreme-conflict group draws on a much smaller pool of distinct districts (18) than the extreme-climate group (41). A handful of chronically conflict-affected districts could be supplying most of the conflict group's 68 district-months between them.",
    { x: M + 0.3, y: 2.12, w: SW - 2 * M - 0.6, h: 0.85, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 15 });

  card(s, M, 3.24, 6.0, 2.5);
  s.addText("Method", { x: M + 0.26, y: 3.4, w: 5.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: P });
  bullets(s, [
    "Collapsed each group down to one row per distinct district (18 rows vs 41 rows) and re-ran the comparison",
    "Separately, applied the district-cluster bootstrap (explained earlier) to the original, row-level statistic",
  ], M + 0.26, 3.74, 5.5, 1.8, { size: 10.5, color: MUTED, lineSpacing: 14, gap: 8 });

  card(s, 6.9, 3.24, SW - M - 6.9, 2.5, SAGE);
  s.addText("Result", { x: 7.16, y: 3.4, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK });
  s.addText("p = 0.000064  ->  p = 0.0067", { x: 7.16, y: 3.72, w: 5.2, h: 0.5, margin: 0, fontFace: "Cambria", fontSize: 18, bold: true, color: INK });
  s.addText("Bootstrap 95% CI: [0.57, 7.54], excluding zero", { x: 7.16, y: 4.24, w: 5.2, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: INK });
  s.addText("Survives, but weaker. Direction and significance hold; the effective sample size does not.",
    { x: 7.16, y: 4.72, w: 5.2, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: INK, lineSpacing: 14 });
}

// =========================================================
// CONFLICT VS CLIMATE 7: SUMMARY, WHAT REMAINS OPEN
// =========================================================
{
  const s = lightSlide();
  header(s, "All five checks together, and what remains open", "Strengthens the result, with one honest limitation left standing");

  card(s, M, 1.7, SW - 2 * M, 2.9, INK);
  s.addText("Summary", { x: M + 0.3, y: 1.84, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: SAGE });
  bullets(s, [
    "Holds at every threshold tested, from the strictest (5%) to the loosest (20%)",
    "Rises close to monotonically with conflict intensity; shows no comparable rise with climate stress",
    "Persists, in a weaker form, when restricted to food and nutrition reporting specifically",
    "Does not close over the three months following an extreme month, so climate stress is not simply reported late",
    "Survives collapsing each group to one row per district, though at markedly weaker significance",
  ], M + 0.3, 2.2, SW - 2 * M - 0.6, 2.3, { size: 12, color: SAND, lineSpacing: 17, gap: 10 });

  card(s, M, 4.76, SW - 2 * M, 1.9, SAND);
  s.addText("What's left open", { x: M + 0.3, y: 4.9, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: INK });
  s.addText("\"Extreme\" is defined relative to Somalia's own 2024 data, not an outside measure of human impact. None of the five checks above can resolve this. This result says how the reporting system responds to different kinds of signal; it does not say the underlying suffering in the two groups was ever equal.",
    { x: M + 0.3, y: 5.22, w: SW - 2 * M - 0.6, h: 1.3, margin: 0, fontFace: "Calibri", fontSize: 12, color: INK, lineSpacing: 16 });
}

// =========================================================
// SOURCE COMPLEMENTARITY 1: MECHANISMS OBSERVED
// =========================================================
{
  const s = lightSlide();
  header(s, "Measuring source complementarity", "How many of the four mechanisms cover each district-month?");

  card(s, M, 1.7, SW - 2 * M, 1.5, INK);
  s.addText("Conflict and climate are recorded everywhere by construction (zero-filled events, satellite has no gaps). So every district-month starts with a floor of 2 of 4. All the real variation comes from market and reporting.",
    { x: M + 0.3, y: 1.86, w: SW - 2 * M - 0.6, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 12.5, color: SAND, lineSpacing: 17 });

  const bars = [["2 of 4", "31.0%", SAND], ["3 of 4", "34.8%", SAGE], ["4 of 4", "34.2%", P]];
  let x4 = M;
  const bw = (SW - 2 * M - 0.4) / 3;
  bars.forEach(([t, v, col]) => {
    card(s, x4, 3.5, bw, 1.9, col);
    s.addText(v, { x: x4, y: 3.68, w: bw, h: 0.8, margin: 0, align: "center", fontFace: "Cambria", fontSize: 30, bold: true, color: INK });
    s.addText(t + " mechanisms observed", { x: x4, y: 4.5, w: bw, h: 0.7, margin: 0, align: "center", fontFace: "Calibri", fontSize: 11, color: INK });
    x4 += bw + 0.2;
  });

  footNote(s, "31.0% of district-months (275) sit at the floor of 2. 34.8% (309) reach 3. 34.2% (304) reach all 4. No district-month is ever observed by 0 or 1 mechanism.");
}

// =========================================================
// SOURCE COMPLEMENTARITY 2: OVERLAP + UNIQUE CONTRIBUTION
// =========================================================
{
  const s = lightSlide();
  header(s, "Do market and reporting overlap, or add different things?", "Genuinely complementary, not redundant");

  card(s, M, 1.7, SW - 2 * M, 1.9);
  const rows = [
    ["Both market and reporting observed", "304", "34.2%"],
    ["Market only (reporting silent that month)", "79", "8.9%"],
    ["Reporting only (market silent that month)", "230", "25.9%"],
    ["Neither observed", "275", "31.0%"],
  ];
  let ry = 1.86;
  rows.forEach(([t, n, pct]) => {
    s.addText(t, { x: M + 0.3, y: ry, w: 6.8, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, valign: "middle" });
    s.addText(n, { x: 8.3, y: ry, w: 1.4, h: 0.4, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: P, align: "right", valign: "middle" });
    s.addText(pct, { x: 9.9, y: ry, w: 1.6, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, align: "right", valign: "middle" });
    ry += 0.42;
  });

  card(s, M, 3.8, SW - 2 * M, 1.5, INK);
  s.addText("Each source's own unique contribution", { x: M + 0.3, y: 3.94, w: SW - 2 * M - 0.6, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: SAGE });
  statRow(s, M + 0.3, 4.28, SW - 2 * M - 0.6, [
    { value: "20.6%", label: "of market's 383 covered district-months,\nreporting would have missed on its own", color: P },
    { value: "43.1%", label: "of reporting's 534 covered district-months,\nmarket would have missed on its own", color: SAND },
  ]);

  s.addText("Reporting is the bigger and more independent contributor: it covers more district-months outright, and a much larger share of what it covers, market simply cannot reach (39 of 74 districts have no market at all).",
    { x: M, y: 5.5, w: SW - 2 * M, h: 0.7, margin: 0, fontFace: "Calibri", fontSize: 11.5, italic: true, color: INK, lineSpacing: 15 });
}

// =========================================================
// SOURCE COMPLEMENTARITY 3: DISTRICT LEVEL
// =========================================================
{
  const s = lightSlide();
  header(s, "Does this hold at the district level too?", "Month to month vs. which districts appear in the dataset at all");

  card(s, M, 1.7, 6.0, 3.4);
  tag(s, "Month to month: complementary", M + 0.24, 1.86, SAGE);
  s.addText("Market fills in real gaps reporting leaves in an average month, and reporting fills in gaps market leaves. Each source genuinely widens what gets seen, beyond what the other alone would show.",
    { x: M + 0.24, y: 2.2, w: 5.5, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 12, color: MUTED, lineSpacing: 16 });

  card(s, 6.9, 1.7, SW - M - 6.9, 3.4, INK);
  tag(s, "Which districts get seen at all: not complementary", 7.16, 1.86, P, 4.8);
  s.addText("32 / 0 / 41", { x: 7.16, y: 2.24, w: 5.2, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 24, bold: true, color: W });
  s.addText("Districts reached by both, by market only, and by reporting only. Every district with a market is also reached by reporting. Reporting alone reaches 41 districts market never touches.",
    { x: 7.16, y: 2.94, w: 5.2, h: 1.6, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });

  card(s, M, 5.3, SW - 2 * M, 1.5, SAND);
  s.addText("Bottom line: combining sources is worth doing for the finer, month-level picture. For the coarser question of which districts exist in this dataset at all, reporting is carrying nearly the whole load on its own. SO_BANDER_BEYLA remains the one district neither source reaches, all year.",
    { x: M + 0.3, y: 5.44, w: SW - 2 * M - 0.6, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 });
}

// =========================================================
// FEATURES 1: OVERVIEW
// =========================================================
{
  const s = lightSlide();
  header(s, "Every feature now has an exact formula", "23 features across the four sources, documented in one place");

  const groups = [
    ["Conflict", "3", "Zero-filled event counts and fatalities, plus a log-difference trend"],
    ["Climate", "2", "Monthly rainfall and a day-weighted average of the weekly vegetation index"],
    ["Market", "16", "Prices in USD, log-difference trends, WFP's own PEWI score per commodity, and 4 summary counts"],
    ["Reporting", "2", "Report counts by district, and a food-and-nutrition subset"],
  ];
  let x5 = M;
  const gw = (SW - 2 * M - 3 * 0.2) / 4;
  groups.forEach(([t, n, d]) => {
    card(s, x5, 1.7, gw, 2.6);
    s.addText(n, { x: x5 + 0.2, y: 1.86, w: gw - 0.4, h: 0.7, margin: 0, fontFace: "Cambria", fontSize: 30, bold: true, color: P });
    s.addText(t, { x: x5 + 0.2, y: 2.56, w: gw - 0.4, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 13, bold: true, color: INK });
    s.addText(d, { x: x5 + 0.2, y: 2.94, w: gw - 0.4, h: 1.3, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    x5 += gw + 0.2;
  });

  card(s, M, 4.5, SW - 2 * M, 2.3, INK);
  s.addText("The log-difference distinction", { x: M + 0.3, y: 4.64, w: SW - 2 * M - 0.6, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: SAGE });
  bullets(s, [
    "conflict_trend_log uses log1p (log of 1+x), because a district can genuinely have 0 conflict events in a month, and log(0) is undefined",
    "The market trend features use a plain log instead, since a valid price is never 0",
    "Both replaced percentage change, which breaks when the previous month is zero",
  ], M + 0.3, 5.0, SW - 2 * M - 0.6, 1.6, { size: 11.5, color: SAND, lineSpacing: 15 });
}

// =========================================================
// FEATURES 2: CONFLICT + CLIMATE, FEATURE BY FEATURE
// =========================================================
{
  const s = lightSlide();
  header(s, "Conflict and climate features, one by one", "5 of the 23, all fully documented");

  const feats = [
    ["conflict_event_count", "Count of ACLED events in that district and month", "Zero-filled: no matching events means 0, not a missing gap."],
    ["fatalities", "Sum of ACLED's fatalities field, same events", "Also zero-filled the same way."],
    ["conflict_trend_log", "log1p(events_t) - log1p(events_t-1)", "How conflict activity changed since last month, on a log scale. Missing for each district's first month."],
    ["rainfall_mean_mm", "Zonal mean of that month's CHIRPS raster", "Average rainfall across the district, in millimetres. Never missing."],
    ["vegetation_health_index_mean", "Day-weighted average of the weekly VHI rasters overlapping the month", "VHI is published weekly, not monthly, so each week is weighted by its overlap with the target month. Never missing."],
  ];
  let y = 1.66;
  feats.forEach(([n, f, d]) => {
    card(s, M, y, SW - 2 * M, 0.98);
    s.addText(n, { x: M + 0.24, y: y + 0.1, w: 3.2, h: 0.78, margin: 0, fontFace: "Cambria", fontSize: 11.5, bold: true, color: P, valign: "middle", lineSpacing: 14 });
    s.addText(f, { x: 4.0, y: y + 0.1, w: 3.9, h: 0.78, margin: 0, fontFace: "Calibri", fontSize: 10, italic: true, color: INK, valign: "middle", lineSpacing: 13 });
    s.addText(d, { x: 8.05, y: y + 0.1, w: SW - M - 8.05 - 0.24, h: 0.78, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: MUTED, valign: "middle", lineSpacing: 12 });
    y += 1.1;
  });
}

// =========================================================
// FEATURES 3: MARKET FEATURES, BY FORMULA GROUP
// =========================================================
{
  const s = lightSlide();
  header(s, "Market features, by formula group", "16 features, 7 distinct formula patterns (4 are per-commodity)");

  const feats = [
    ["{c}_price_usd  (x4)", "price_local / exchange_rate_to_usd", "USD price for wheat flour, rice, sugar, oil. Averaged across markets if more than one reports in a district."],
    ["{c}_trend_log  (x4)", "log(price_t) - log(price_t-1)", "Month-over-month change, log scale. Missing whenever either month's price is missing."],
    ["{c}_pewi_score  (x4)", "Taken directly from WFP's own \"Pewi\" column", "Not computed by this pipeline. Full explanation next slide."],
    ["commodities_tracked_count", "Count of the 4 commodities with a non-null pewi_score", "Never missing; 0 is a valid value."],
    ["market_anomaly_mean / max", "Mean / max of the non-null pewi_score values", "Missing only when all four commodities are missing."],
    ["market_stress_count", "Count of commodities with pewi_score > 1.0", "Never missing. What the 1.0 threshold means is resolved on the PEWI slide."],
  ];
  let y = 1.5;
  feats.forEach(([n, f, d]) => {
    card(s, M, y, SW - 2 * M, 0.78);
    s.addText(n, { x: M + 0.24, y: y + 0.06, w: 3.2, h: 0.66, margin: 0, fontFace: "Cambria", fontSize: 10.5, bold: true, color: P, valign: "middle", lineSpacing: 12 });
    s.addText(f, { x: 4.0, y: y + 0.06, w: 3.9, h: 0.66, margin: 0, fontFace: "Calibri", fontSize: 9, italic: true, color: INK, valign: "middle", lineSpacing: 11 });
    s.addText(d, { x: 8.05, y: y + 0.06, w: SW - M - 8.05 - 0.24, h: 0.66, margin: 0, fontFace: "Calibri", fontSize: 8.5, color: MUTED, valign: "middle", lineSpacing: 10 });
    y += 0.88;
  });
}

// =========================================================
// FEATURES 4: REPORTING + INTRO TO PEWI
// =========================================================
{
  const s = lightSlide();
  header(s, "Reporting features, and what comes next", "The last 2 of 23, plus why PEWI needs its own slide");

  card(s, M, 1.7, SW - 2 * M, 2.0);
  const feats = [
    ["reports_mentioning_district_count", "Count of Somalia reports that month whose title + body match the district's name or an alias", "After stripping datelines and excluding price bulletins, matched case-insensitively without word boundaries."],
    ["food_nutrition_report_count", "Subset of the above where ReliefWeb's own \"themes\" field contains \"Food and Nutrition\"", "wash_report_count was dropped for never being used; this one was kept, since food insecurity remains the project's application domain."],
  ];
  let y = 1.86;
  feats.forEach(([n, f, d]) => {
    s.addText(n, { x: M + 0.26, y, w: SW - 2 * M - 0.52, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: P });
    s.addText(f, { x: M + 0.26, y: y + 0.32, w: SW - 2 * M - 0.52, h: 0.3, margin: 0, fontFace: "Calibri", fontSize: 10.5, italic: true, color: INK });
    s.addText(d, { x: M + 0.26, y: y + 0.64, w: SW - 2 * M - 0.52, h: 0.3, margin: 0, fontFace: "Calibri", fontSize: 10, color: MUTED });
    y += 0.98;
  });

  card(s, M, 3.9, SW - 2 * M, 2.9, INK);
  s.addText("Two items that needed their own explanation", { x: M + 0.3, y: 4.04, w: SW - 2 * M - 0.6, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: SAGE });
  bullets(s, [
    "What PEWI actually is, since {c}_pewi_score, market_anomaly_mean/max and market_stress_count all depend on it, and it was never defined anywhere in the notebook until this week",
    "Whether the 1.0 threshold behind market_stress_count is a real, sourced cutoff or an arbitrary one that would need a sensitivity analysis or should be dropped",
  ], M + 0.3, 4.42, SW - 2 * M - 0.6, 1.6, { size: 12, color: SAND, lineSpacing: 17, gap: 12 });
}

// =========================================================
// FEATURES 5: PEWI + THRESHOLD RESOLVED
// =========================================================
{
  const s = lightSlide();
  header(s, "PEWI, defined, and the market-stress threshold resolved", "Two items that needed their own explanation");

  card(s, M, 1.7, 6.0, 3.5);
  s.addText("What PEWI is", { x: M + 0.26, y: 1.86, w: 5.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: P });
  s.addText("Price Early Warning Indicator, WFP's own name for a method more widely known as ALPS (Alert for Price Spikes). It measures how far a commodity's price sits from its own normal seasonal pattern, in standardised units, so it can be compared across commodities with very different price levels.",
    { x: M + 0.26, y: 2.2, w: 5.5, h: 1.4, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 15 });
  s.addText("This pipeline takes WFP's own \"Pewi\" column directly; nothing is recomputed.", { x: M + 0.26, y: 3.7, w: 5.5, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 10.5, italic: true, color: P });

  const phases = [["Normal", "up to 0.25"], ["Stress", "0.25 - 1.0"], ["Alert", "1.0 - 2.0"], ["Crisis", "above 2.0"]];
  let py = 4.3;
  phases.forEach(([n, r]) => {
    s.addText(n, { x: M + 0.26, y: py, w: 1.9, h: 0.3, margin: 0, fontFace: "Calibri", fontSize: 10.5, bold: true, color: INK });
    s.addText(r, { x: M + 2.4, y: py, w: 3.2, h: 0.3, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED });
    py += 0.3;
  });

  card(s, 6.9, 1.7, SW - M - 6.9, 3.5, INK);
  s.addText("The 1.0 threshold is resolved, not dropped", { x: 7.16, y: 1.86, w: 5.2, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: SAGE });
  s.addText("It turns out to be exactly WFP's own Stress/Alert boundary, not an arbitrary cutoff. No sensitivity analysis was needed.",
    { x: 7.16, y: 2.5, w: 5.2, h: 0.8, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });
  s.addText("The one correction: the name", { x: 7.16, y: 3.4, w: 5.2, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: P });
  s.addText("market_stress_count actually counts commodities in WFP's Alert-or-Crisis phase, not WFP's own Stress phase (0.25-1.0). The column keeps its existing name, already used throughout the notebook, but the correct reading is Alert-or-worse.",
    { x: 7.16, y: 3.76, w: 5.2, h: 1.3, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 15 });
}

// =========================================================
// SOURCE-LEVEL TABLE 1: COLLECTION AND COVERAGE
// =========================================================
{
  const s = lightSlide();
  header(s, "How each source actually observes Somalia", "The dissertation's key table, condensed for this update");

  const CW = 5.9, GAP = 0.26;
  const X1 = M, X2 = M + CW + GAP;
  const CH = 2.5, ROWGAP = 0.18;
  const Y1 = 1.62, Y2 = Y1 + CH + ROWGAP;

  const sources = [
    { x: X1, y: Y1, name: "Conflict (ACLED)", tagText: "100% recorded coverage", tagCol: SAGE,
      bullets: ["Event coding from local media and monitoring partners; 65.3% \"Local partner\" sourced, 31.2% cite no source at all", "Could cover 100% of districts; actually covers 100% (zero-filled)"] },
    { x: X2, y: Y1, name: "Climate (CHIRPS / VHI)", tagText: "100% recorded coverage", tagCol: SAGE,
      bullets: ["Satellite imagery only, no ground survey needed, so no dependence on local access or reporting", "Could cover 100% of districts; actually covers 100%"] },
    { x: X1, y: Y2, name: "Market (WFP / PEWI)", tagText: "43-47% of district-months", tagCol: P,
      bullets: ["Weekly visits by WFP's own enumerators, only to markets that are safe and accessible to reach", "Could cover 47% of districts (needs a market); actually covers 43.1% by the PEWI score used in this panel"] },
    { x: X2, y: Y2, name: "Reporting (ReliefWeb)", tagText: "60% of months, 99% of districts", tagCol: P,
      bullets: ["Reports self-submitted by humanitarian organisations, no fixed schedule or obligation to report", "Could cover ~100% of districts; actually covers 60.1% of district-months, 73 of 74 districts at least once"] },
  ];
  sources.forEach(src => {
    card(s, src.x, src.y, CW, CH);
    s.addText(src.name, { x: src.x + 0.26, y: src.y + 0.14, w: CW - 0.52, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: INK });
    tag(s, src.tagText, src.x + 0.26, src.y + 0.46, src.tagCol, CW - 0.52);
    bullets(s, src.bullets, src.x + 0.26, src.y + 0.78, CW - 0.52, CH - 0.9, { size: 10.5, color: MUTED, lineSpacing: 13, gap: 7 });
  });
}

// =========================================================
// SOURCE-LEVEL TABLE 2: ZERO, MISSING, LIMITATIONS
// =========================================================
{
  const s = lightSlide();
  header(s, "What a zero means, what missing means, and the main risk", "Same table, the harder-to-summarise rows");

  const rowDefs = [
    ["What a zero means", [
      ["Conflict", "No recorded event: genuine calm, or violence nobody reported"],
      ["Climate", "A real, meaningful reading, not a gap"],
      ["Market", "Not valid for a price itself; only the summary counts can read 0"],
      ["Reporting", "The most literal zero: no report matched"],
    ]],
    ["Main measurement risk", [
      ["Conflict", "Tracks media presence more than violence itself"],
      ["Climate", "The most reliable of the four, but weaker where rain gauges are sparse"],
      ["Market", "Reflects accessible trade hubs, not a random sample of Somalia"],
      ["Reporting", "No word-boundary matching; favours conflict over climate stress"],
    ]],
  ];
  let ry = 1.7;
  rowDefs.forEach(([title, items]) => {
    s.addText(title, { x: M, y: ry, w: SW - 2 * M, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 14, bold: true, color: P });
    card(s, M, ry + 0.4, SW - 2 * M, 1.1);
    const iw = (SW - 2 * M) / 4;
    items.forEach(([n, d], i) => {
      s.addText(n, { x: M + i * iw + 0.2, y: ry + 0.52, w: iw - 0.3, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 10.5, bold: true, color: INK });
      s.addText(d, { x: M + i * iw + 0.2, y: ry + 0.8, w: iw - 0.3, h: 0.68, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    });
    ry += 1.68;
  });

  card(s, M, ry, SW - 2 * M, 0.86);
  s.addText("None of the four is a neutral, ground-truthed measure. Each one sees Somalia through the lens of who is watching, and why.",
    { x: M + 0.3, y: ry + 0.14, w: SW - 2 * M - 0.6, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 12, italic: true, color: INK });
}

// =========================================================
// NEXT STEPS A1: FINDINGS THAT NEED NO FURTHER ANALYSIS
// =========================================================
{
  const s = lightSlide();
  header(s, "Next steps, part 1: findings already in hand", "Checked against the actual data this week. No further analysis needed, only writing up");

  s.addText("These five were investigated and verified this week. Nothing further needs to be computed; each is a finished result waiting to be written into the dissertation.",
    { x: M, y: 1.56, w: SW - 2 * M, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED });

  const items = [
    ["Conflict location precision", "22.4% of Somalia's 2024 conflict events are only approximately located, not pinned to an exact site, and it varies sharply by district (0-69%)."],
    ["The market/PEWI gap, quantified", "147 of 1,676 basket-commodity price records (8.8%) have a price but no PEWI score, concentrated in 3 districts missing it all year."],
    ["Price outlier check", "Ran a check for implausible prices. Came back clean, nothing to report beyond confirming it was checked."],
    ["Trend features miss more than prices", "The price-change features are missing 56.8% of the time, versus 52.8% for the prices they're built from, since a trend needs two consecutive months."],
    ["\"Whole basket or nothing\" reporting", "A market reports all four basket foods in a month, or none of them, almost never a partial mix. A genuine, previously undocumented pattern in how WFP collects prices."],
  ];
  let y8 = 2.1;
  const colW = (SW - 2 * M - 0.24) / 2;
  items.forEach((it, i) => {
    const cx = M + (i % 2) * (colW + 0.24);
    const cy = y8 + Math.floor(i / 2) * 1.6;
    card(s, cx, cy, colW, 1.44, SAND);
    s.addText(it[0], { x: cx + 0.22, y: cy + 0.14, w: colW - 0.44, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: INK });
    s.addText(it[1], { x: cx + 0.22, y: cy + 0.5, w: colW - 0.44, h: 0.88, margin: 0, fontFace: "Calibri", fontSize: 10, color: INK, lineSpacing: 13 });
  });

  card(s, M, 6.5, SW - 2 * M, 0.46, INK);
  s.addText("None require new data. All reuse the datasets already in the repository.",
    { x: M + 0.3, y: 6.58, w: SW - 2 * M - 0.6, h: 0.32, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: SAND });
}

// =========================================================
// NEXT STEPS A2: NEW ANALYSIS STILL TO RUN
// =========================================================
{
  const s = lightSlide();
  header(s, "Next steps, part 2: new analysis still to run", "Identified this week, not yet built, each one sharpens one of the three sub-questions");

  const items = [
    ["1", "One table, coverage by month", "Pull the scattered month-by-month coverage numbers for every source into a single table, so the weakest months are visible at a glance."],
    ["2", "Is market placement itself systematic?", "Market presence has only been checked against conflict. Check it against region and district size too, the same treatment reporting coverage already got."],
    ["3", "Do the sources agree on where the crisis is?", "So far we've only checked whether sources cover the same places. Check whether conflict-severe districts are also the ones with stressed markets, or whether the two point elsewhere."],
    ["4", "A note on how fine-grained each source is", "The research question asks about granularity by name. Document each source's native resolution, from exact GPS points down to a whole document, before it collapses to one number per district."],
  ];
  let y7 = 1.7;
  items.forEach(([n, t, d]) => {
    card(s, M, y7, SW - 2 * M, 1.1);
    badge(s, n, M + 0.2, y7 + 0.18, 0.42, P, W);
    s.addText(t, { x: M + 0.8, y: y7 + 0.14, w: 4.05, h: 0.82, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK, valign: "middle", lineSpacing: 15 });
    s.addText(d, { x: 5.85, y: y7 + 0.1, w: SW - M - 5.85 - 0.3, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13, valign: "middle" });
    y7 += 1.24;
  });
}

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-Dissertation---Samuel-Aracena/f617b219-b21d-55dd-bcca-f625cfd1129d/scratchpad/2026_08_17_week_slides.pptx" })
  .then(f => console.log("WROTE", f));
