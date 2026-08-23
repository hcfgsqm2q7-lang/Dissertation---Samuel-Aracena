"""Draw the validation sample for the FINAL ReliefWeb geoparser, and write a blind
labelling workbook.

Design decisions, all of which need stating in the dissertation:

1. **Fresh reports only.** The 220 January-February reports are excluded, because they
   are the prototype subset that was read while building and improving the alias list
   and the precision filters. Validating on them would measure how well the method
   fits the cases used to design it. The eligible pool is therefore March-December.

2. **Stratified, not simple random.** Precision can only be measured on reports the
   geoparser matched, and recall needs reports it did not. A simple random sample of
   100 would spend most of its labelling effort on whichever stratum happens to be
   larger. So 50 are drawn from each stratum, and `score.py` reweights back to corpus
   proportions when combining them.

   (An earlier draft of this harness drew 75 per stratum, 150 total. That target was
   cut down once actual labelling speed made 150 impractical; 50 per stratum matches
   what was actually completed. The committed `sample_manifest.csv` and
   `answer_key.csv` reflect the 100 reports genuinely labelled, weighted by their real
   counts per stratum, 52 matched and 48 unmatched, not by 50/50 exactly, since
   stopping partway did not land on a perfectly even split.)

3. **Blind labelling.** The geoparser's predictions are NOT in the workbook, and the
   two strata are shuffled together so their order gives nothing away. Predictions go
   to a separate answer key that `score.py` joins on afterwards. Labelling while
   looking at the answer is not validation.

4. **Reports with no body text are kept.** About 16% of the corpus has an empty body
   and is matched on its title alone. Dropping them would make the result apply only
   to the body-bearing subset. They are flagged so they can be labelled from the URL.

Run:  python tools/geoparser_validation/build_sample.py
"""

import os
import sys

import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import geoparser as gp  # noqa: E402

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT_DIR = os.path.join(REPO, "data", "geoparser_validation")

SEED = 20260821
PER_STRATUM = 50
EXCLUDED_MONTHS = [1, 2]  # the prototype subset used while improving the method
BODY_EXCERPT_CHARS = 2000

HEADER_FILL = PatternFill("solid", fgColor="1E2761")
INPUT_FILL = PatternFill("solid", fgColor="FFF2CC")
EXAMPLE_FILL = PatternFill("solid", fgColor="E8E8E8")


def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    dim = pd.read_csv(f"{REPO}/data/processed/dim_location_somalia_full74.csv")
    reports = gp.load_somalia_reports(REPO)
    parsed = gp.geoparse(reports, dim)

    eligible = parsed[~parsed["month"].astype(int).isin(EXCLUDED_MONTHS)].copy()
    matched = eligible[eligible["is_matched"]]
    unmatched = eligible[~eligible["is_matched"]]

    print(f"Full Somalia corpus            : {len(parsed)}")
    print(f"Excluded (Jan-Feb prototype)   : {len(parsed) - len(eligible)}")
    print(f"Eligible pool (Mar-Dec)        : {len(eligible)}")
    print(f"  matched by final geoparser   : {len(matched)}")
    print(f"  not matched                  : {len(unmatched)}")

    if len(matched) < PER_STRATUM or len(unmatched) < PER_STRATUM:
        raise SystemExit("A stratum is smaller than the requested sample size.")

    s_matched = matched.sample(PER_STRATUM, random_state=SEED).assign(stratum="matched")
    s_unmatched = unmatched.sample(PER_STRATUM, random_state=SEED).assign(stratum="unmatched")

    # Shuffle the two strata together so the labeller cannot infer the prediction
    # from a report's position in the sheet.
    sample = (
        pd.concat([s_matched, s_unmatched])
        .sample(frac=1.0, random_state=SEED)
        .reset_index(drop=True)
    )
    sample.insert(0, "row_id", range(1, len(sample) + 1))

    _write_manifest(len(matched), len(unmatched), sample)
    _write_answer_key(sample)
    _write_workbook(sample, dim)

    print(f"\nSample drawn: {len(sample)} reports ({PER_STRATUM} per stratum), seed {SEED}")
    print(f"Wrote: {OUT_DIR}")


def _write_manifest(n_matched, n_unmatched, sample):
    """Stratum sizes and sampling fractions. score.py needs these to weight recall."""
    manifest = pd.DataFrame(
        [
            {
                "stratum": "matched",
                "corpus_size": n_matched,
                "sampled": PER_STRATUM,
                "weight": n_matched / PER_STRATUM,
            },
            {
                "stratum": "unmatched",
                "corpus_size": n_unmatched,
                "sampled": PER_STRATUM,
                "weight": n_unmatched / PER_STRATUM,
            },
        ]
    )
    manifest.to_csv(f"{OUT_DIR}/sample_manifest.csv", index=False)


def _write_answer_key(sample):
    """The geoparser's predictions, kept OUT of the labelling workbook on purpose."""
    key = sample[["row_id", "id", "stratum", "matched_location_ids", "matches"]].copy()
    key["matched_location_ids"] = key["matched_location_ids"].apply(lambda v: "|".join(v))
    key["matches"] = key["matches"].apply(lambda v: "|".join(sorted(set(v))))
    key = key.rename(columns={"id": "report_id", "matches": "matched_surface_forms"})
    key.to_csv(f"{OUT_DIR}/answer_key.csv", index=False)


def _write_workbook(sample, dim):
    wb = Workbook()

    _sheet_instructions(wb.active)
    _sheet_labelling(wb.create_sheet("Labelling"), sample)
    _sheet_districts(wb.create_sheet("District reference"), dim)

    wb.save(f"{OUT_DIR}/geoparser_labelling_workbook.xlsx")


def _sheet_instructions(ws):
    ws.title = "Instructions"
    lines = [
        ("ReliefWeb geoparser validation: labelling instructions", True, 14),
        ("", False, 11),
        ("What this is for", True, 12),
        ("Measuring how accurately the final geoparsing method attributes reports to", False, 11),
        ("districts. The method's predictions are deliberately not shown, so that the", False, 11),
        ("labels are formed independently. Precision, recall and F1 are computed", False, 11),
        ("afterwards by tools/geoparser_validation/score.py.", False, 11),
        ("", False, 11),
        ("What to fill in", True, 12),
        ("Only the four shaded columns on the 'Labelling' sheet:", False, 11),
        ("", False, 11),
        ("  districts_genuinely_about", True, 11),
        ("     Districts the report is actually reporting on: where the event happened,", False, 11),
        ("     where the response is taking place, where the people described are.", False, 11),
        ("     Separate several with a semicolon. Write NONE if there are none.", False, 11),
        ("", False, 11),
        ("  districts_mentioned_in_passing", True, 11),
        ("     Districts named but not the subject: comparison points in a price table,", False, 11),
        ("     a dateline, a list of offices, background context. Write NONE if none.", False, 11),
        ("", False, 11),
        ("  no_admin2_identifiable", True, 11),
        ("     Y if no district can be identified at all, for example a purely national", False, 11),
        ("     or organisational document. Otherwise N.", False, 11),
        ("", False, 11),
        ("  notes", True, 11),
        ("     Optional. Worth using for anything surprising, and for any district you", False, 11),
        ("     recognise that is spelled unusually, since those become alias candidates.", False, 11),
        ("", False, 11),
        ("Rules", True, 12),
        ("1. Use district names exactly as spelled on the 'District reference' sheet.", False, 11),
        ("2. Judge from the report itself, not from what the pipeline might have done.", False, 11),
        ("3. If body_available is N, open the url to read the report before labelling.", False, 11),
        ("4. If body_truncated is Y and the excerpt is ambiguous, open the url.", False, 11),
        ("5. A place below district level (a town, a camp) counts as its district.", False, 11),
        ("6. Row 2 is a filled-in EXAMPLE and is ignored by the scorer. Do not edit it.", False, 11),
        ("7. Partial progress is fine: the scorer skips rows left blank.", False, 11),
    ]
    for i, (text, bold, size) in enumerate(lines, start=1):
        c = ws.cell(row=i, column=1, value=text)
        c.font = Font(name="Arial", bold=bold, size=size)
    ws.column_dimensions["A"].width = 82


def _sheet_labelling(ws, sample):
    headers = [
        "row_id", "report_id", "date", "title", "url",
        "body_available", "body_truncated", "body_excerpt",
        "districts_genuinely_about", "districts_mentioned_in_passing",
        "no_admin2_identifiable", "notes",
    ]
    input_cols = set(range(9, 13))  # the four columns the labeller fills in

    for j, h in enumerate(headers, start=1):
        c = ws.cell(row=1, column=j, value=h)
        c.font = Font(name="Arial", bold=True, size=11, color="FFFFFF")
        c.fill = HEADER_FILL
        c.alignment = Alignment(vertical="center", wrap_text=True)

    example = [
        0, "EXAMPLE", "2024-05-14",
        "Flash floods displace families in Beledweyne and Jowhar",
        "https://reliefweb.int/node/0000000", "Y", "N",
        "Heavy rains caused the Shabelle river to burst its banks, displacing 12,000 "
        "people in Beledweyne. Response teams also reached affected families in Jowhar. "
        "Prices in Mogadishu markets were unaffected.",
        "Belet Weyne; Jowhar", "Banadir", "N",
        "Mogadishu appears only as a price comparison, so it is in-passing.",
    ]
    for j, v in enumerate(example, start=1):
        c = ws.cell(row=2, column=j, value=v)
        c.font = Font(name="Arial", size=10, italic=True)
        c.fill = EXAMPLE_FILL
        c.alignment = Alignment(vertical="top", wrap_text=True)

    for i, rec in enumerate(sample.itertuples(), start=3):
        body = "" if pd.isna(rec.body) else str(rec.body)
        excerpt = body[:BODY_EXCERPT_CHARS]
        values = [
            rec.row_id, rec.id, str(rec.date_original)[:10], str(rec.title), str(rec.url),
            "N" if not body.strip() else "Y",
            "Y" if len(body) > BODY_EXCERPT_CHARS else "N",
            excerpt, None, None, None, None,
        ]
        for j, v in enumerate(values, start=1):
            c = ws.cell(row=i, column=j, value=v)
            c.font = Font(name="Arial", size=10)
            c.alignment = Alignment(vertical="top", wrap_text=(j == 8))
            if j in input_cols:
                c.fill = INPUT_FILL

    widths = [7, 11, 11, 46, 34, 9, 9, 78, 26, 28, 12, 34]
    for j, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(j)].width = w
    ws.freeze_panes = "A2"
    ws.row_dimensions[1].height = 30


def _sheet_districts(ws, dim):
    for j, h in enumerate(["location_id", "district name (use this spelling)",
                           "region", "known aliases"], start=1):
        c = ws.cell(row=1, column=j, value=h)
        c.font = Font(name="Arial", bold=True, size=11, color="FFFFFF")
        c.fill = HEADER_FILL

    for i, loc in enumerate(dim.sort_values("admin2").itertuples(), start=2):
        aliases = ", ".join(gp.FINAL_ALIAS_MAP.get(loc.admin2, [])) or "(none documented)"
        for j, v in enumerate([loc.location_id, loc.admin2, loc.admin1, aliases], start=1):
            c = ws.cell(row=i, column=j, value=v)
            c.font = Font(name="Arial", size=10)

    for j, w in enumerate([22, 30, 22, 62], start=1):
        ws.column_dimensions[get_column_letter(j)].width = w
    ws.freeze_panes = "A2"


if __name__ == "__main__":
    build()
