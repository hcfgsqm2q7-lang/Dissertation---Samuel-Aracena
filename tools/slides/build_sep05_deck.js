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

const OUT = "/tmp/claude-0/-home-user-Dissertation---Samuel-Aracena/26e7f948-4ee1-5b87-9b0d-dd7ba7c483a3/scratchpad/deck/2026_09_05_slides.pptx";

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
  s.addText("Two final checks,\nboth run to completion", { x: M, y: 2.25, w: 10.4, h: 1.9, margin: 0, fontFace: "Cambria", fontSize: 36, bold: true, color: W, lineSpacing: 42 });
  s.addText("Your first priority (district fixed effects) and second priority (attachment-content bias by topic), both run exactly as specified, on the data already in hand.",
    { x: M, y: 4.3, w: 9.6, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 14, color: SAND, lineSpacing: 19 });
  s.addText("Samuel Aracena   ·   MSc Dissertation   ·   Somalia, Admin2 × Month",
    { x: M, y: 6.5, w: 9, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 11.5, color: MUTED });
}

// =========================================================
// SECTION: CHECK 1
// =========================================================
sectionSlide("Check 1 · First priority", "The district fixed-effects\nrobustness model", "Does the conflict-versus-vegetation-stress result survive once every persistent, unmeasured trait of a district (accessibility, population, NGO presence, political importance) is held fixed by design?");

// =========================================================
// 3. CHECK 1 (1 of 2): method and results
// =========================================================
{
  const s = lightSlide();
  header(s, "What district fixed effects add on top of Task 13", "Comparing each district only to itself across the year, instead of comparing districts to each other");

  card(s, M, 1.5, SW - 2 * M, 1.55);
  subhead(s, "Why cluster-robust SEs are not enough on their own", M + 0.24, 1.66, 10, P);
  s.addText("Task 13's clustered standard errors correct for 12 correlated monthly rows per district being counted as if independent. They do not remove a persistent trait of a district itself (how accessible it is, its population, whether NGOs are already based there) that could drive both its conflict level and its reporting level, with no real causal link between the two. Fixed effects remove exactly that: any trait that does not change month to month, measured or not, is automatically controlled for.",
    { x: M + 0.24, y: 1.98, w: SW - 2 * M - 0.48, h: 1.0, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5 });

  card(s, M, 3.2, SW - 2 * M, 1.05, INK);
  s.addText("reports ~ conflict_z + vhi_stress_z + C(month) + C(district)",
    { x: M + 0.24, y: 3.36, w: 10, h: 0.4, margin: 0, fontFace: "Courier New", fontSize: 14.5, bold: true, color: W });
  s.addText("Identical to Task 13 in every other respect: same standardised predictors, same Banadir exclusion (876 rows, 73 districts), same cluster-robust SEs on top of the fixed effects. Only C(district) is new.",
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

  footNote(s, "Fitting 73 extra district dummies required a different optimiser (L-BFGS) than the one used elsewhere in this notebook; confirmed stable by reaching the identical answer from three separate optimisers.");
}

// =========================================================
// 4. CHECK 1 (2 of 2): why, and what it means
// =========================================================
{
  const s = lightSlide();
  header(s, "Why the conflict effect shrank, and what that does and does not mean", "");

  card(s, M, 1.5, SW - 2 * M, 2.1);
  subhead(s, "The mechanical reason: conflict barely moves within a district", M + 0.24, 1.66, 10, P);
  const st = [["70.4%", "of conflict's variation is between districts (a stable, permanent fact about a place)"],
              ["29.6%", "is within a district over the year (its own month-to-month ups and downs)"]];
  let x = M + 0.24;
  st.forEach(([v, l]) => { statTile(s, x, 2.0, 5.6, 1.45, v, l, P); x += 5.85; });

  card(s, M, 3.75, SW - 2 * M, 1.35, INK);
  s.addText("Fixed effects remove all between-district comparison by design, so they can only ever detect the within-district share of a predictor's variation. Conflict has comparatively little of that to work with; vegetation stress is the mirror image (78.9% within, 21.1% between), which is why its estimate barely moved.",
    { x: M + 0.24, y: 3.9, w: SW - 2 * M - 0.48, h: 1.05, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });

  card(s, M, 5.25, SW - 2 * M, 1.25, SAND);
  s.addText("This does not show Task 13's result was wrong. It shows it was substantially, perhaps mostly, a between-district association, exactly the kind persistent unmeasured district traits could also explain. The within-district evidence that a district's own conflict spikes drive its own reporting spikes is weak and not significant, though the confidence interval (0.95 to 1.10) is also consistent with a real effect this design lacks the power to detect from only 12 months per district.",
    { x: M + 0.24, y: 5.38, w: SW - 2 * M - 0.48, h: 1.05, margin: 0, fontFace: "Calibri", fontSize: 10.5, color: P, lineSpacing: 13.5 });
}

// =========================================================
// SECTION: CHECK 2
// =========================================================
sectionSlide("Check 2 · Second priority", "Attachment-content bias\nby report topic", "Is attachment-trapped geographic detail, already known to be the main reason for low pair-level geoparser recall, more common in one kind of report than another?", SAGE);

// =========================================================
// 6. CHECK 2 (1 of 2): method and results
// =========================================================
{
  const s = lightSlide();
  header(s, "Does geography hide in attachments more for one topic than another?", "Using the same 100-report manual validation sample built for Task 17, with no new labelling needed");

  card(s, M, 1.5, SW - 2 * M, 1.85);
  subhead(s, "The question this could answer either way", M + 0.24, 1.66, 10, P);
  s.addText("If climate or food-related reports trap their geography in attachments more often than conflict reports, that would offer an alternative, non-attention-based explanation for part of Tasks 13-15's finding: vegetation stress might attract just as much genuine attention, with more of it simply invisible to a text-only geoparser. If the two topics trap geography at similar rates, that possibility is ruled out.",
    { x: M + 0.24, y: 1.98, w: SW - 2 * M - 0.48, h: 0.95, margin: 0, fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5 });
  s.addText("Method: for each report, check whether each genuinely-covered district's name appears anywhere in the literal exported text; classify each report as conflict-related or climate/food-related using ReliefWeb's own theme tags (no dedicated \"Conflict\" theme exists, so Protection and Human Rights / Safety and Security / Peacekeeping and Peacebuilding stand in for it).",
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

  footNote(s, "13 of the 100 reports carry both kinds of theme at once and 19 carry neither, so the comparison uses the 33 reports (16 + 17) that fall cleanly into one group.");
}

// =========================================================
// 7. CHECK 2 (2 of 2): what this does and does not settle
// =========================================================
{
  const s = lightSlide();
  header(s, "No significant difference, and the sample is too small to rule much out", "");

  card(s, M, 1.5, SW - 2 * M, 1.9, INK);
  subhead(s, "What this does not do", M + 0.24, 1.66, 10, W);
  s.addText("It does not strengthen the attention-based explanation, since it does not show attachment-trapping is a conflict-specific problem the way Tasks 13-15's finding would need it to be. But it also does not support the alternative, format-mediated explanation this check was built to catch: if anything, climate/food reports trap slightly more of their geography in attachments than conflict reports do, the opposite direction from what would be needed to explain the reporting-attention asymmetry away as a text-extraction artefact.",
    { x: M + 0.24, y: 1.98, w: SW - 2 * M - 0.48, h: 1.35, margin: 0, fontFace: "Calibri", fontSize: 11, color: SAND, lineSpacing: 14.5 });

  card(s, M, 3.6, SW - 2 * M, 1.15, SAND);
  s.addText("With only 16 and 17 reports in the two groups, this comparison has limited power to detect a real difference of moderate size. The honest reading: this specific alternative explanation finds no support in the available evidence, not that it has been conclusively ruled out.",
    { x: M + 0.24, y: 3.74, w: SW - 2 * M - 0.48, h: 0.9, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: P, lineSpacing: 14.5 });

  card(s, M, 4.95, SW - 2 * M, 1.25);
  subhead(s, "A genuine, if small, side finding", M + 0.24, 5.1, 10, P);
  s.addText("Attachment-trapping is common across both topics, 76 to 85% of genuine district mentions either way. That reinforces Task 17's original point on its own terms: reading attachments, not refining alias matching, is where a future recall improvement would have to come from, regardless of which crisis type a report concerns.",
    { x: M + 0.24, y: 5.4, w: SW - 2 * M - 0.48, h: 0.75, margin: 0, fontFace: "Calibri", fontSize: 10.7, color: INK, lineSpacing: 13.8 });
}

// =========================================================
// 8. BOTTOM LINE
// =========================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, { x: -1.6, y: 3.4, w: 5.6, h: 5.6, fill: { color: P }, transparency: 84 });
  s.addText("BOTTOM LINE", { x: M, y: 1.2, w: 8, h: 0.34, margin: 0, fontFace: "Calibri", fontSize: 13, bold: true, color: SAGE, charSpacing: 3 });
  s.addText("The core finding survives,\nwith an honest caveat attached", { x: M, y: 1.65, w: 10.6, h: 1.5, margin: 0, fontFace: "Cambria", fontSize: 30, bold: true, color: W, lineSpacing: 36 });

  const boxes = [
    ["Check 1", "The conflict-versus-reporting association is substantially, perhaps mostly, a between-district effect: chronically visible districts, not necessarily a live reaction to a district's own worse months. Not a refutation of Tasks 13-15, but a real limit on how strongly the result can be interpreted causally.", P],
    ["Check 2", "That caveat is not a geoparser artefact: conflict and climate/food reports lose geographic detail to attachments at statistically indistinguishable rates, so this specific alternative explanation is not what is driving the asymmetry.", SAGE],
  ];
  let y = 3.3;
  boxes.forEach(([t, d, col]) => {
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: SW - 2 * M, h: 1.35, rectRadius: 0.06, fill: { color: DARK2 } });
    s.addText(t.toUpperCase(), { x: M + 0.3, y: y + 0.14, w: 2.2, h: 0.28, margin: 0, fontFace: "Calibri", fontSize: 11, bold: true, color: col, charSpacing: 1.2 });
    s.addText(d, { x: M + 0.3, y: y + 0.42, w: SW - 2 * M - 0.6, h: 0.88, margin: 0, fontFace: "Calibri", fontSize: 10.8, color: SAND, lineSpacing: 13.8 });
    y += 1.5;
  });

  s.addText("Recommended framing for the dissertation: the district-level, cross-sectional association between conflict and reporting attention is robust and well documented; the within-district, month-to-month reactive story is the part that now needs qualifying.",
    { x: M, y: y + 0.15, w: SW - 2 * M, h: 0.45, margin: 0, fontFace: "Calibri", fontSize: 10.5, italic: true, color: MUTED, lineSpacing: 13 });
}

pres.writeFile({ fileName: OUT }).then(f => console.log("WROTE", f));
