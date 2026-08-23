const pptxgen = require("pptxgenjs");

const P = "B85042", SAND = "E7E8D1", SAGE = "A7BEAE", INK = "2B2523", MUTED = "7A6E68", W = "FFFFFF";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Samuel Aracena";
pres.title = "Source-level table";

const SW = 13.3, SH = 7.5, M = 0.62;

function lightSlide() { const s = pres.addSlide(); s.background = { color: W }; return s; }
function header(s, title, sub) {
  s.addText(title, { x: M, y: 0.52, w: SW - 2 * M, h: 0.6, margin: 0,
    fontFace: "Cambria", fontSize: 29, bold: true, color: INK });
  if (sub) s.addText(sub, { x: M, y: 1.14, w: SW - 2 * M, h: 0.36, margin: 0,
    fontFace: "Calibri", fontSize: 13.5, color: MUTED, italic: true });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06,
    fill: { color: fill || "F7F5F1" },
    shadow: { type: "outer", angle: 90, blur: 6, offset: 0.03, color: "000000", opacity: 0.08 } });
}
function tag(s, text, x, y, col, w) {
  s.addText(text.toUpperCase(), { x, y, w: w || 2.6, h: 0.26, margin: 0,
    fontFace: "Calibri", fontSize: 9.5, bold: true, color: col, charSpacing: 1.2 });
}

// =========================================================
// Source-level table, condensed for a slide
// =========================================================
{
  const s = lightSlide();
  header(s, "How each source actually observes Somalia",
    "Condensed from the dissertation's source-level table; the full version with formulas and citations is in the notebook");

  const CW = 5.9, GAP = 0.26;
  const X1 = M, X2 = M + CW + GAP;
  const CH = 2.12, ROWGAP = 0.2;
  const Y1 = 1.62, Y2 = Y1 + CH + ROWGAP;
  const FOOTER_Y = Y2 + CH + 0.16, FOOTER_H = 0.66;

  const sources = [
    {
      x: X1, y: Y1, name: "Conflict (ACLED)", tagText: "100% recorded", tagCol: SAGE,
      bullets: [
        "Compiled mostly from Somali news outlets and local partners; a third of events cite no named source at all",
        "Sees what gets reported, not what happens: violence in remote, less-watched areas is structurally undercounted",
      ],
    },
    {
      x: X2, y: Y1, name: "Climate (rainfall + vegetation)", tagText: "100% recorded", tagCol: SAGE,
      bullets: [
        "Collected automatically by satellite, every district, every week, with no dependence on local reporting",
        "The most reliable of the four, but rainfall estimates are weaker where ground weather stations are sparse",
      ],
    },
    {
      x: X1, y: Y2, name: "Market (WFP prices)", tagText: "47% of districts", tagCol: P,
      bullets: [
        "WFP field staff visit monitored markets weekly to record prices, only where a monitored market exists",
        "Markets are chosen for being safe and accessible to reach, so the least secure districts are structurally missing",
      ],
    },
    {
      x: X2, y: Y2, name: "Reporting (ReliefWeb)", tagText: "99% of districts, 60% of months", tagCol: P,
      bullets: [
        "Humanitarian organisations publish reports whenever they choose to, with no fixed schedule or obligation",
        "Text-matching can miss names or unreadable formats, and reporting itself favours conflict over slow-building crises",
      ],
    },
  ];

  sources.forEach(src => {
    card(s, src.x, src.y, CW, CH);
    s.addText(src.name, { x: src.x + 0.26, y: src.y + 0.14, w: CW - 0.52, h: 0.3, margin: 0,
      fontFace: "Cambria", fontSize: 14.5, bold: true, color: INK });
    tag(s, src.tagText, src.x + 0.26, src.y + 0.46, src.tagCol, CW - 0.52);
    s.addText(
      src.bullets.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < src.bullets.length - 1, paraSpaceAfter: 6 } })),
      { x: src.x + 0.26, y: src.y + 0.76, w: CW - 0.52, h: CH - 0.9, margin: 0,
        fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13 }
    );
  });

  card(s, M, FOOTER_Y, SW - 2 * M, FOOTER_H, INK);
  s.addText("None of the four is a neutral, ground-truthed measure. Each one sees Somalia through the lens of who is watching, and why.",
    { x: M + 0.3, y: FOOTER_Y + 0.14, w: SW - 2 * M - 0.6, h: FOOTER_H - 0.28, margin: 0,
      fontFace: "Calibri", fontSize: 12.5, italic: true, color: SAND });

  s.addNotes("Condensed version of the notebook's source-level table (Next steps item 7). Full formulas, exact coverage figures, missingness definitions and citations are in the notebook section 'Source-level table: how each mechanism actually observes Somalia'.");
}

pres.writeFile({ fileName: "/tmp/claude-0/-home-user-Dissertation---Samuel-Aracena/f617b219-b21d-55dd-bcca-f625cfd1129d/scratchpad/2026_08_23_source_table_slide.pptx" })
  .then(f => console.log("WROTE", f));
