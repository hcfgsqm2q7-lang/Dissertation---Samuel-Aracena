const pptxgen = require("pptxgenjs");

// Same "Warm Terracotta" palette used throughout this project's decks.
const P = "B85042";
const SAND = "E7E8D1";
const SAGE = "A7BEAE";
const INK = "2B2523";
const MUTED = "7A6E68";
const W = "FFFFFF";
const CARD = "F7F5F1";
const DARK2 = "3A3330";

const OUT = "/tmp/claude-0/-home-user-Dissertation---Samuel-Aracena/26e7f948-4ee1-5b87-9b0d-dd7ba7c483a3/scratchpad/deck/2026_09_05_slides_casual.pptx";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Samuel Aracena";
pres.title = "Two final checks, per 2026-09-02 feedback";

const SW = 13.3, SH = 7.5, M = 0.62;

function darkSlide() { const s = pres.addSlide(); s.background = { color: INK }; return s; }
function lightSlide() { const s = pres.addSlide(); s.background = { color: W }; return s; }
function header(s, title, sub) {
  s.addText(title, { x: M, y: 0.5, w: SW - 2 * M, h: 0.55, margin: 0, fontFace: "Cambria", fontSize: 24, bold: true, color: INK });
  if (sub) s.addText(sub, { x: M, y: 1.06, w: SW - 2 * M, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 12, color: MUTED, italic: true });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: fill || CARD },
    shadow: { type: "outer", angle: 90, blur: 6, offset: 0.03, color: "000000", opacity: 0.08 } });
}
function subhead(s, text, x, y, w, col) {
  s.addText(text, { x, y, w, h: 0.3, margin: 0, fontFace: "Cambria", fontSize: 13.5, bold: true, color: col || INK });
}
function statTile(s, x, y, w, h, value, label, col) {
  card(s, x, y, w, h);
  s.addText(value, { x: x + 0.22, y: y + 0.12, w: w - 0.44, h: h * 0.5, margin: 0, fontFace: "Cambria", fontSize: 27, bold: true, color: col || P });
  s.addText(label, { x: x + 0.22, y: y + h * 0.54, w: w - 0.44, h: h * 0.42, margin: 0, fontFace: "Calibri", fontSize: 10.3, color: MUTED, lineSpacing: 12.5 });
}
function bulletsBlock(s, items, x, y, w, h, opts) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: (opts && opts.gap) || 7 } })),
    Object.assign({ x, y, w, h, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: INK, lineSpacing: 15 }, opts || {}));
}
function footNote(s, text, yy) {
  s.addText(text, { x: M, y: yy || 6.58, w: SW - 2 * M, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 10, italic: true, color: MUTED, lineSpacing: 12.5 });
}
function sectionSlide(tag, title, sub, accent) {
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: 10.1, y: -1.7, w: 5.4, h: 5.4, fill: { color: accent || P }, transparency: 82 });
  s.addShape(pres.ShapeType.ellipse, { x: -1.4, y: 4.6, w: 3.6, h: 3.6, fill: { color: SAGE }, transparency: 88 });
  s.addText(tag.toUpperCase(), { x: M, y: 2.55, w: 10, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 13, bold: true, color: SAGE, charSpacing: 3 });
  s.addText(title, { x: M, y: 3.0, w: 11.2, h: 1.5, margin: 0, fontFace: "Cambria", fontSize: 30, bold: true, color: W, lineSpacing: 36 });
  if (sub) s.addText(sub, { x: M, y: 4.4, w: 9.8, h: 1.2, margin: 0, fontFace: "Calibri", fontSize: 13.5, color: SAND, lineSpacing: 18 });
  return s;
}

// =========================================================
// 1. TITLE
// =========================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: 10.4, y: -1.5, w: 5.2, h: 5.2, fill: { color: P }, transparency: 82 });
  s.addShape(pres.ShapeType.ellipse, { x: 11.6, y: 4.4, w: 3.4, h: 3.4, fill: { color: SAGE }, transparency: 88 });
  s.addText("RESPONDING TO THE 2026-09-02 FEEDBACK", { x: M, y: 1.75, w: 10, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 13, bold: true, color: SAGE, charSpacing: 2.5 });
  s.addText("Two last checks,\nboth wrapped up", { x: M, y: 2.25, w: 10.4, h: 1.9, margin: 0, fontFace: "Cambria", fontSize: 36, bold: true, color: W, lineSpacing: 42 });
  s.addText("We ran your top two priorities, district fixed effects and attachment-content bias by topic, exactly as asked, using the data we already had on hand.",
    { x: M, y: 4.3, w: 9.6, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 14, color: SAND, lineSpacing: 19 });
  s.addText("Samuel Aracena   ·   MSc Dissertation   ·   Somalia, Admin2 × Month",
    { x: M, y: 6.5, w: 9, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED });
}

// =========================================================
// SECTION: CHECK 1
// =========================================================
sectionSlide("Check 1 · First priority", "The district fixed-effects\nrobustness model", "Does the conflict-vs-vegetation-stress result hold up once we account for everything permanent about a district, its accessibility, population, NGO presence, political importance, by design?");

// =========================================================
// 3. CHECK 1 (1 of 2): method and results
// =========================================================
{
  const s = lightSlide();
  header(s, "What district fixed effects bring to Task 13", "Comparing each district to itself over the year, instead of comparing different districts to each other");

  card(s, M, 1.5, SW - 2 * M, 1.55);
  subhead(s, "Why clustered standard errors alone don't cut it", M + 0.24, 1.66, 10, P);
  s.addText("Task 13's clustered standard errors fix the problem of counting 12 correlated monthly rows per district as if they were independent. What they don't fix is a district's own permanent traits, how accessible it is, its population, whether NGOs are already based there, any of which could drive both its conflict level and its reporting level without one actually causing the other. Fixed effects take care of exactly that: anything that stays the same about a district month to month gets automatically controlled for, measured or not.",
    { x: M + 0.24, y: 1.98, w: SW - 2 * M - 0.48, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5 });

  card(s, M, 3.2, SW - 2 * M, 1.05, INK);
  s.addText("reports ~ conflict_z + vhi_stress_z + C(month) + C(district)",
    { x: M + 0.24, y: 3.36, w: 10, h: 0.4, margin: 0, fontFace: "Courier New", fontSize: 14.5, bold: true, color: W });
  s.addText("Everything else stays exactly like Task 13: same standardised predictors, same Banadir exclusion (876 rows, 73 districts), same cluster-robust standard errors on top. The only new addition is C(district).",
    { x: M + 0.24, y: 3.82, w: SW - 2 * M - 0.48, h: 0.4, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: SAND, lineSpacing: 13.5 });

  const tbl = [
    [{ text: "", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } },
     { text: "Task 13 (cluster-robust only)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } },
     { text: "This check (district fixed effects)", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } }],
    ["Conflict IRR", "1.69, 95% CI [1.42, 2.01], p < 0.0001", { text: "1.02, 95% CI [0.95, 1.10], p = 0.61", options: { bold: true, color: P } }],
    ["Vegetation-stress IRR", "1.00, not significant", "1.08, 95% CI [0.97, 1.20], p = 0.16"],
    ["Effect-size comparison (Wald)", "chi2 = 9.04, p = 0.0026", { text: "chi2 = 0.81, p = 0.37", options: { bold: true, color: P } }],
  ];
  s.addTable(tbl, { x: M, y: 4.45, w: SW - 2 * M, colW: [3.3, 4.38, 4.38],
    fontFace: "Calibri", fontSize: 11.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.48, valign: "middle", autoPage: false });

  footNote(s, "Fitting 73 extra district dummies needed a different optimiser (L-BFGS) than the one used elsewhere in the notebook, but we double-checked it holds up: three separate optimisers all landed on the same answer.");
}

// =========================================================
// 4. CHECK 1 (2 of 2): why, and what it means
// =========================================================
{
  const s = lightSlide();
  header(s, "Why the conflict effect shrank, and what that does (and doesn't) tell us", "");

  card(s, M, 1.5, SW - 2 * M, 2.1);
  subhead(s, "The simple reason: conflict barely changes within a district", M + 0.24, 1.66, 10, P);
  const st = [["70.4%", "of conflict's variation happens between districts, basically a fixed fact about the place"],
              ["29.6%", "happens within a district over the year, its own ups and downs month to month"]];
  let x = M + 0.24;
  st.forEach(([v, l]) => { statTile(s, x, 2.0, 5.6, 1.45, v, l, P); x += 5.85; });

  card(s, M, 3.75, SW - 2 * M, 1.35, INK);
  s.addText("Fixed effects wipe out all between-district comparison by design, so they can only pick up on the within-district share of what's happening. Conflict just doesn't have much of that to work with. Vegetation stress is basically the opposite story (78.9% within, 21.1% between), which is why its number barely budged.",
    { x: M + 0.24, y: 3.9, w: SW - 2 * M - 0.48, h: 1.05, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });

  card(s, M, 5.25, SW - 2 * M, 1.25, SAND);
  s.addText("This doesn't mean Task 13's result was wrong. It means it was largely, maybe mostly, a between-district pattern, exactly the kind of thing unmeasured, persistent district traits could also explain. The evidence that a district's own conflict spikes drive its own reporting spikes is weak and not statistically significant, though the confidence interval (0.95 to 1.10) still leaves room for a real effect this design just doesn't have the power to catch from only 12 months per district.",
    { x: M + 0.24, y: 5.38, w: SW - 2 * M - 0.48, h: 1.05, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: P, lineSpacing: 13.5 });
}

// =========================================================
// SECTION: CHECK 2
// =========================================================
sectionSlide("Check 2 · Second priority", "Attachment-content bias\nby report topic", "Geographic detail getting trapped in attachments is already known to be the main reason our geoparser misses things, but is it more common for one kind of report than another?", SAGE);

// =========================================================
// 6. CHECK 2 (1 of 2): method and results
// =========================================================
{
  const s = lightSlide();
  header(s, "Does geography hide in attachments more for one topic than another?", "Using the same 100-report sample we already hand-checked for Task 17, no new labelling needed");

  card(s, M, 1.5, SW - 2 * M, 1.85);
  subhead(s, "A question that could go either way", M + 0.24, 1.66, 10, P);
  s.addText("If climate or food reports trap their geography in attachments more often than conflict reports do, that gives us an alternative explanation for part of Tasks 13-15's finding, one that has nothing to do with attention: vegetation stress might be getting just as much genuine attention, it's just that more of it is invisible to a text-only geoparser. If both topics trap geography at similar rates, we can rule that out.",
    { x: M + 0.24, y: 1.98, w: SW - 2 * M - 0.48, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5 });
  s.addText("How we did it: check whether each genuinely-covered district's name actually shows up anywhere in the exported text, then sort each report as conflict-related or climate/food-related using ReliefWeb's own theme tags (there's no dedicated \"Conflict\" theme, so Protection and Human Rights / Safety and Security / Peacekeeping and Peacebuilding stand in for it).",
    { x: M + 0.24, y: 2.85, w: SW - 2 * M - 0.48, h: 0.45, margin: 0, fontFace: "Calibri", fontSize: 9.7, italic: true, color: MUTED, lineSpacing: 12.5 });

  const tbl = [
    [{ text: "", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } },
     { text: "n", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } },
     { text: "Mean per-report attachment-only rate", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } },
     { text: "Pooled", options: { bold: true, color: W, fill: { color: INK }, fontSize: 11.5 } }],
    ["Conflict-related", "16", "58.2%", "109 / 129 (84.5%)"],
    ["Climate/food-related", "17", "60.6%", "222 / 289 (76.8%)"],
  ];
  s.addTable(tbl, { x: M, y: 3.55, w: SW - 2 * M, colW: [3.2, 1.3, 4.5, 3.06],
    fontFace: "Calibri", fontSize: 11.5, color: INK,
    border: { type: "solid", pt: 0.5, color: "E2DDD6" }, rowH: 0.44, valign: "middle", autoPage: false });

  const st = [["p = 0.85", "Mann-Whitney U, per-report attachment-only rate"], ["p = 0.71", "Fisher's exact, has any attachment-only info (OR 1.48)"]];
  let x = M;
  st.forEach(([v, l]) => { statTile(s, x, 4.85, 5.9, 1.35, v, l, SAGE); x += 6.1; });

  footNote(s, "13 of the 100 reports carry both kinds of theme at once and 19 carry neither, so we compared the 33 reports (16 + 17) that fall cleanly into one group.");
}

// =========================================================
// 7. CHECK 2 (2 of 2): what this does and does not settle
// =========================================================
{
  const s = lightSlide();
  header(s, "No real difference here, and the sample's too small to rule much out", "");

  card(s, M, 1.5, SW - 2 * M, 1.9, INK);
  subhead(s, "What this does not do", M + 0.24, 1.66, 10, W);
  s.addText("It doesn't back up the attention-based explanation any further, since it doesn't show attachment-trapping is specifically a conflict-report problem the way Tasks 13-15's finding would need. But it also doesn't support the alternative explanation this check was built to catch: if anything, climate/food reports trap slightly more of their geography in attachments than conflict reports do, the opposite of what we'd need to explain away the reporting-attention gap as a text-extraction quirk.",
    { x: M + 0.24, y: 1.98, w: SW - 2 * M - 0.48, h: 1.35, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });

  card(s, M, 3.6, SW - 2 * M, 1.15, SAND);
  s.addText("With only 16 and 17 reports in each group, this comparison doesn't have much power to catch a real, moderate-sized difference. The honest takeaway: this specific alternative explanation isn't backed up by the evidence we have, but that's not the same as ruling it out for good.",
    { x: M + 0.24, y: 3.74, w: SW - 2 * M - 0.48, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: P, lineSpacing: 14.5 });

  card(s, M, 4.95, SW - 2 * M, 1.25);
  subhead(s, "A small but real side finding", M + 0.24, 5.1, 10, P);
  s.addText("Attachment-trapping shows up a lot regardless of topic, 76 to 85% of genuine district mentions either way. That backs up Task 17's original point: if we ever want to improve recall, reading attachments is where the real gains are, not refining alias matching, no matter what kind of crisis the report is about.",
    { x: M + 0.24, y: 5.4, w: SW - 2 * M - 0.48, h: 0.75, margin: 0, fontFace: "Calibri", fontSize: 10.7, color: INK, lineSpacing: 13.8 });
}

// =========================================================
// 8. BOTTOM LINE
// =========================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: -1.6, y: 3.4, w: 5.6, h: 5.6, fill: { color: P }, transparency: 84 });
  s.addText("BOTTOM LINE", { x: M, y: 1.2, w: 8, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 13, bold: true, color: SAGE, charSpacing: 3 });
  s.addText("The core finding holds up,\njust with an honest caveat", { x: M, y: 1.65, w: 10.6, h: 1.5, margin: 0, fontFace: "Cambria", fontSize: 30, bold: true, color: W, lineSpacing: 36 });

  const boxes = [
    ["Check 1", "The conflict-vs-reporting link is largely, maybe mostly, a between-district story: some districts are just chronically more visible, rather than reporting genuinely reacting to a district's own worse months. This doesn't refute Tasks 13-15, but it does put a real limit on how strongly we can read the result as causal.", P],
    ["Check 2", "That caveat isn't just a geoparser quirk either: conflict and climate/food reports lose geographic detail to attachments at basically the same rate, so this particular explanation isn't what's driving the gap.", SAGE],
  ];
  let y = 3.3;
  boxes.forEach(([t, d, col]) => {
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: SW - 2 * M, h: 1.35, rectRadius: 0.06, fill: { color: DARK2 } });
    s.addText(t.toUpperCase(), { x: M + 0.3, y: y + 0.14, w: 2.2, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: col, charSpacing: 1.2 });
    s.addText(d, { x: M + 0.3, y: y + 0.42, w: SW - 2 * M - 0.6, h: 0.88, margin: 0, fontFace: "Calibri", fontSize: 10.8, color: SAND, lineSpacing: 13.8 });
    y += 1.5;
  });

  s.addText("How we'd frame this in the dissertation: the district-level, cross-sectional link between conflict and reporting attention is solid and well documented; it's the within-district, month-to-month reactive story that now needs a caveat.",
    { x: M, y: y + 0.15, w: SW - 2 * M, h: 0.45, margin: 0, fontFace: "Calibri", fontSize: 10.5, italic: true, color: MUTED, lineSpacing: 13 });
}

pres.writeFile({ fileName: OUT }).then(f => console.log("WROTE", f));
