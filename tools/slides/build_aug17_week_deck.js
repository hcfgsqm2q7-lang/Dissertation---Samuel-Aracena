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
  s.addText(title, { x: M, y: 0.52, w: SW - 2 * M, h: 0.6, margin: 0,
    fontFace: "Cambria", fontSize: 27, bold: true, color: INK });
  if (sub) s.addText(sub, { x: M, y: 1.14, w: SW - 2 * M, h: 0.36, margin: 0,
    fontFace: "Calibri", fontSize: 13, color: MUTED, italic: true });
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

// =========================================================
// TITLE
// =========================================================
{
  const s = darkSlide();
  s.addText("Week of August 17, 2026", { x: M, y: 2.7, w: SW - 2 * M, h: 1.0, margin: 0,
    fontFace: "Cambria", fontSize: 40, bold: true, color: W });
  s.addText("This week's work: geoparser validation, correcting for repeated\ndistrict-months, strengthening the conflict-vs-climate result, source complementarity,\nfinal feature formulas, and the source-level table.",
    { x: M, y: 3.7, w: SW - 2 * M, h: 1.1, margin: 0, fontFace: "Calibri", fontSize: 14, color: SAND, lineSpacing: 19 });
  s.addText("Somalia humanitarian observability dissertation", { x: M, y: 6.5, w: SW - 2 * M, h: 0.4, margin: 0,
    fontFace: "Calibri", fontSize: 11.5, color: SAGE, italic: true });
}

// =========================================================
// 1.1 GEOPARSER -- WHAT WE DID
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
// 1.2 GEOPARSER -- RESULTS
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

  s.addText("Read plainly: when the geoparser says a report is about a district, it is right roughly four times out of five, at either level of detail.",
    { x: M, y: 3.72, w: SW - 2 * M, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 12.5, italic: true, color: INK, lineSpacing: 16 });

  card(s, M, 4.4, 6.0, 2.42, INK);
  tag(s, "Why the pair-level recall is low", M + 0.26, 4.56, P);
  s.addText("The geoparser can only work with a report's title and exported body text. It has no access to images, tables or attached files, so recall can only ever be as good as what that exported text contains.",
    { x: M + 0.26, y: 4.9, w: 5.5, h: 1.8, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 15 });

  card(s, 6.9, 4.4, SW - M - 6.9, 2.42, SAGE);
  s.addText("97.4%", { x: 7.16, y: 4.56, w: 5.2, h: 0.8, margin: 0, fontFace: "Cambria", fontSize: 34, bold: true, color: INK });
  s.addText("recall, once restricted to only the district mentions that were actually present in the report's exported text",
    { x: 7.16, y: 5.4, w: 5.2, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 11, color: INK, lineSpacing: 14 });
}

// =========================================================
// 1.3 GEOPARSER -- ATTACHMENTS AND LIMITATIONS
// =========================================================
{
  const s = lightSlide();
  header(s, "The real limitation: attachments and PDFs, not matching quality", "Confirmed by opening the reports directly");

  card(s, M, 1.66, SW - 2 * M, 2.0, INK);
  s.addText("What we found", { x: M + 0.3, y: 1.82, w: 6, h: 0.32, margin: 0, fontFace: "Cambria", fontSize: 14.5, bold: true, color: SAGE });
  s.addText("Of every district a human labeller said a report was genuinely about, 80.5% of those district names never appear anywhere in the report's exported title or body text at all. They only exist inside attached files ReliefWeb does not index as text.",
    { x: M + 0.3, y: 2.18, w: SW - 2 * M - 0.6, h: 1.3, margin: 0, fontFace: "Calibri", fontSize: 12.5, color: SAND, lineSpacing: 17 });

  card(s, M, 3.86, 6.0, 1.9);
  s.addText("The clearest example", { x: M + 0.26, y: 4.02, w: 5.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: P });
  s.addText("Weekly cholera/AWD bulletins list their real district-by-district breakdown only inside a table in an attached PDF. ReliefWeb files them as an ordinary \"Situation Report\", with nothing in the metadata to say the substance lives in an attachment. The exported body is just a one-line summary, no district named at all.",
    { x: M + 0.26, y: 4.36, w: 5.5, h: 1.35, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 14 });

  card(s, 6.9, 3.86, SW - M - 6.9, 1.9);
  s.addText("What this is not", { x: 7.16, y: 4.02, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: P });
  bullets(s, [
    "The five genuine misses in the whole sample all come from one report, and are a deliberate design choice (price bulletins are excluded on purpose), not an error",
    "Reading PDF attachments reliably is a materially different, less reliable engineering problem, and is out of scope for this project",
  ], 7.16, 4.36, 5.2, 1.4, { size: 10.5, color: MUTED, lineSpacing: 13 });

  card(s, M, 5.94, SW - 2 * M, 0.92, SAND);
  s.addText("Bottom line: precision (81-79%), not recall, is the figure to trust for this method. Recall should be read as \"recall on what a text-based method can structurally see\", not \"recall on everything a human could find in the full report\".",
    { x: M + 0.3, y: 6.06, w: SW - 2 * M - 0.6, h: 0.7, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 14 });
}

// =========================================================
// 2.1 REPEATED DISTRICT-MONTHS -- THE PROBLEM
// =========================================================
{
  const s = lightSlide();
  header(s, "Correcting for repeated district-months", "Each of the 74 districts contributes 12 rows to the panel");

  card(s, M, 1.66, SW - 2 * M, 1.5, INK);
  s.addText("The issue", { x: M + 0.3, y: 1.8, w: 5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: SAGE });
  s.addText("A district's conflict level, market status and reporting attention this month are largely the same underlying district carrying forward, not a fresh, independent observation. Treating all 888 rows as 888 independent pieces of evidence can turn a genuinely null result into one that looks statistically significant.",
    { x: M + 0.3, y: 2.14, w: SW - 2 * M - 0.6, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 12, color: SAND, lineSpacing: 16 });

  tag(s, "The one genuine violation found: does market access track conflict?", M, 3.42, P, 8);

  card(s, M, 3.78, 6.0, 2.5);
  s.addText("Naive reading (888 rows, wrong)", { x: M + 0.26, y: 3.94, w: 5.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK });
  statRow(s, M + 0.26, 4.3, 5.5, [
    { value: "p = 0.0001", label: "conflict events, market vs no market" },
  ]);
  s.addText("Statistically significant: looks like a real relationship.", { x: M + 0.26, y: 5.5, w: 5.5, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: MUTED, lineSpacing: 14 });

  card(s, 6.9, 3.78, SW - M - 6.9, 2.5, SAGE);
  s.addText("Corrected (n = 74 districts, right)", { x: 7.16, y: 3.94, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK });
  statRow(s, 7.16, 4.3, 5.2, [
    { value: "p = 0.188", label: "same test, one row per district", color: INK },
  ]);
  s.addText("Not significant. The naive result was entirely an artefact of counting each district twelve times over.", { x: 7.16, y: 5.5, w: 5.2, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: INK, lineSpacing: 14 });
}

// =========================================================
// 2.2 REPEATED DISTRICT-MONTHS -- EVERYTHING ELSE, BOTTOM LINE
// =========================================================
{
  const s = lightSlide();
  header(s, "Checking every other result, and what survives", "Three different strengths of the same problem, three different fixes");

  const rows = [
    ["Time-varying correlations", "Conflict vs reports, rainfall vs reports, VHI vs conflict",
      "Checked with a district-cluster bootstrap (resampling whole districts, not rows). All three survive with confidence intervals well clear of zero.", SAGE],
    ["One exception", "Vegetation health (VHI) vs reports",
      "Its cluster-robust confidence interval crosses zero. The earlier r=-0.11 figure should be read as inconclusive, not a confirmed effect.", P],
    ["Conflict-vs-climate reporting gap", "Collapsed to one row per district (n=18 vs n=41)",
      "Survives, but weakens: p=0.000064 falls to p=0.0067 once repeated conflict-heavy districts stop being over-counted.", SAND],
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
// 3.1 CONFLICT VS CLIMATE -- DIFFERENT THRESHOLDS
// =========================================================
{
  const s = lightSlide();
  header(s, "Strengthening the conflict-vs-climate reporting result", "The original test, and why the wording changed");

  card(s, M, 1.66, SW - 2 * M, 1.7, INK);
  s.addText("The original result", { x: M + 0.3, y: 1.8, w: 5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: SAGE });
  statRow(s, M + 0.3, 2.16, SW - 2 * M - 0.6, [
    { value: "6.65", label: "avg reports, relatively extreme conflict", color: P },
    { value: "2.67", label: "avg reports, relatively extreme climate stress", color: SAND },
    { value: "p = 0.000064", label: "the difference is unlikely to be chance", color: SAGE },
  ]);

  card(s, M, 3.6, SW - 2 * M, 1.0, SAND);
  s.addText("Wording note: the two groups are matched on their position within Somalia's own 2024 distribution, not on equal humanitarian severity. \"Relatively extreme conflict/climate-stress observations\", never \"comparable severity\".",
    { x: M + 0.3, y: 3.72, w: SW - 2 * M - 0.6, h: 0.8, margin: 0, fontFace: "Calibri", fontSize: 11.5, italic: true, color: INK, lineSpacing: 15 });

  tag(s, "Different thresholds, as asked", M, 4.86, P, 6);
  card(s, M, 5.16, SW - 2 * M, 1.3);
  const th = [["5%", "strictest, ~44 per group"], ["10%", "original result"], ["20%", "loosest, ~155 vs 117"]];
  let x3 = M + 0.3;
  th.forEach(([v, d]) => {
    s.addText(v, { x: x3, y: 5.3, w: 3.6, h: 0.5, margin: 0, fontFace: "Cambria", fontSize: 20, bold: true, color: INK });
    s.addText(d + "  --  p < 0.001", { x: x3, y: 5.86, w: 3.6, h: 0.5, margin: 0, fontFace: "Calibri", fontSize: 10, color: MUTED });
    x3 += 3.7;
  });
}

// =========================================================
// 3.2 CONFLICT VS CLIMATE -- CONTINUOUS CHECK
// =========================================================
{
  const s = lightSlide();
  header(s, "A continuous check, not just thresholds", "Does reporting rise steadily with intensity, on either axis?");

  card(s, M, 1.7, 6.0, 3.0);
  s.addText("Conflict quintiles", { x: M + 0.26, y: 1.86, w: 5.5, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: P });
  s.addText("1.40  →  5.66 reports", { x: M + 0.26, y: 2.2, w: 5.5, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 22, bold: true, color: INK });
  s.addText("Reporting rises in a close to straight line from the least-conflict group to the most-conflict group.",
    { x: M + 0.26, y: 2.9, w: 5.5, h: 1.6, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15 });

  card(s, 6.9, 1.7, SW - M - 6.9, 3.0, INK);
  s.addText("Climate-stress quintiles", { x: 7.16, y: 1.86, w: 5.2, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: SAGE });
  s.addText("No steady rise", { x: 7.16, y: 2.2, w: 5.2, h: 0.6, margin: 0, fontFace: "Cambria", fontSize: 22, bold: true, color: W });
  s.addText("The worst-stress group sits a little higher than the middle groups (4.01 vs ~2.0), but there is no climbing pattern the way conflict shows.",
    { x: 7.16, y: 2.9, w: 5.2, h: 1.6, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: SAND, lineSpacing: 15 });

  card(s, M, 4.9, SW - 2 * M, 1.5, SAND);
  s.addText("What's left open: \"extreme\" is defined relative to Somalia's own 2024 data, not an outside measure of human impact. This result says how the reporting system responds to different kinds of signal. It does not say the underlying suffering in the two groups was ever equal.",
    { x: M + 0.3, y: 5.04, w: SW - 2 * M - 0.6, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 12, italic: true, color: INK, lineSpacing: 16 });
}

// =========================================================
// 4.1 SOURCE COMPLEMENTARITY -- MECHANISMS OBSERVED
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

  card(s, M, 5.66, SW - 2 * M, 1.16);
  s.addText("Market vs reporting overlap: of the 383 district-months market covers, 79 (20.6%) are ones reporting missed. Of the 534 reporting covers, 230 (43.1%) are ones market missed. Genuinely complementary, not redundant.",
    { x: M + 0.3, y: 5.8, w: SW - 2 * M - 0.6, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 });
}

// =========================================================
// 4.2 SOURCE COMPLEMENTARITY -- DISTRICT LEVEL
// =========================================================
{
  const s = lightSlide();
  header(s, "Does this hold at the district level too?", "Month to month vs. which districts appear in the dataset at all");

  card(s, M, 1.7, 6.0, 3.4);
  tag(s, "Month to month: complementary", M + 0.24, 1.86, SAGE);
  s.addText("Market fills in real gaps reporting leaves in an average month, and reporting fills in gaps market leaves.",
    { x: M + 0.24, y: 2.2, w: 5.5, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 12, color: MUTED, lineSpacing: 16 });

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
// 5.1 FEATURE FORMULAS -- OVERVIEW
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
// 5.2 FEATURE FORMULAS -- PEWI AND THE THRESHOLD
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
// 6.1 SOURCE-LEVEL TABLE -- COLLECTION AND COVERAGE
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
// 6.2 SOURCE-LEVEL TABLE -- ZERO, MISSING, LIMITATIONS
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
    card(s, M, ry + 0.4, SW - 2 * M, 1.14);
    const iw = (SW - 2 * M) / 4;
    items.forEach(([n, d], i) => {
      s.addText(n, { x: M + i * iw + 0.2, y: ry + 0.52, w: iw - 0.3, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 10.5, bold: true, color: INK });
      s.addText(d, { x: M + i * iw + 0.2, y: ry + 0.8, w: iw - 0.3, h: 0.68, margin: 0, fontFace: "Calibri", fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    });
    ry += 1.74;
  });

  card(s, M, ry + 0.06, SW - 2 * M, 0.9, INK);
  s.addText("None of the four is a neutral, ground-truthed measure. Each one sees Somalia through the lens of who is watching, and why.",
    { x: M + 0.3, y: ry + 0.2, w: SW - 2 * M - 0.6, h: 0.6, margin: 0, fontFace: "Calibri", fontSize: 12, italic: true, color: SAND });
}

// =========================================================
// 7.1 NEXT STEPS -- SHARPENING THE THREE SUB-QUESTIONS
// =========================================================
{
  const s = lightSlide();
  header(s, "Next steps: sharpening the three sub-questions further", "Identified this week, not yet built");

  const items = [
    ["1", "One table, coverage by month", "Pull the scattered month-by-month coverage numbers for every source into a single table, so the weakest months are visible at a glance."],
    ["2", "Is market placement itself systematic?", "Market presence has only been checked against conflict. Check it against region and district size too, the same treatment reporting coverage already got."],
    ["3", "Do the sources agree on where the crisis is?", "So far we've only checked whether sources cover the same places. Check whether conflict-severe districts are also the ones with stressed markets, or whether the two point elsewhere."],
    ["4", "A note on how fine-grained each source is", "The research question asks about granularity by name. Document each source's native resolution, from exact GPS points down to a whole document, before it collapses to one number per district."],
  ];
  let y7 = 1.7;
  items.forEach(([n, t, d]) => {
    card(s, M, y7, SW - 2 * M, 1.16);
    badge(s, n, M + 0.2, y7 + 0.18, 0.42, P, W);
    s.addText(t, { x: M + 0.8, y: y7 + 0.14, w: 4.05, h: 0.9, margin: 0, fontFace: "Cambria", fontSize: 12.5, bold: true, color: INK, valign: "middle", lineSpacing: 15 });
    s.addText(d, { x: 5.85, y: y7 + 0.12, w: SW - M - 5.85 - 0.3, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13, valign: "middle" });
    y7 += 1.32;
  });
}

// =========================================================
// 7.2 NEXT STEPS -- DATA QUALITY FINDINGS READY TO WRITE UP
// =========================================================
{
  const s = lightSlide();
  header(s, "Next steps: data-quality findings, already checked", "Verified against the actual data this week; ready to write up");

  const items = [
    ["Conflict location precision", "22.4% of Somalia's 2024 conflict events are only approximately located, not pinned to an exact site, and it varies sharply by district (0-69%)."],
    ["The market/PEWI gap, quantified", "147 of 1,676 basket-commodity price records (8.8%) have a price but no PEWI score, concentrated in 3 districts missing it all year."],
    ["Price outlier check", "Ran a check for implausible prices. Came back clean, nothing to report beyond confirming it was checked."],
    ["Trend features miss more than prices", "The price-change features are missing 56.8% of the time, versus 52.8% for the prices they're built from, since a trend needs two consecutive months."],
    ["\"Whole basket or nothing\" reporting", "A market reports all four basket foods in a month, or none of them, almost never a partial mix. A genuine, previously undocumented pattern in how WFP collects prices."],
  ];
  let y8 = 1.7;
  const colW = (SW - 2 * M - 0.24) / 2;
  items.forEach((it, i) => {
    const cx = M + (i % 2) * (colW + 0.24);
    const cy = y8 + Math.floor(i / 2) * 1.62;
    card(s, cx, cy, colW, 1.46, SAND);
    s.addText(it[0], { x: cx + 0.22, y: cy + 0.14, w: colW - 0.44, h: 0.34, margin: 0, fontFace: "Cambria", fontSize: 12, bold: true, color: INK });
    s.addText(it[1], { x: cx + 0.22, y: cy + 0.5, w: colW - 0.44, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 10, color: INK, lineSpacing: 13 });
  });

  card(s, M, 6.5, SW - 2 * M, 0.46, INK);
  s.addText("None require new data. All reuse the datasets already in the repository.",
    { x: M + 0.3, y: 6.58, w: SW - 2 * M - 0.6, h: 0.32, margin: 0, fontFace: "Calibri", fontSize: 11, italic: true, color: SAND });
}

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-Dissertation---Samuel-Aracena/f617b219-b21d-55dd-bcca-f625cfd1129d/scratchpad/2026_08_17_week_slides.pptx" })
  .then(f => console.log("WROTE", f));
