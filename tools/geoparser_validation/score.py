"""Score the labelled sample against the final geoparser.

Reports precision, recall and F1 at two levels:

  * **report x district pairs** (the headline). This is the level the pipeline feature
    actually works at, since `reports_mentioning_district_count` counts one report
    against one district. A report correctly identified as being about Beledweyne but
    wrongly also credited to Mogadishu is partly right, and only the pair level shows
    that.

  * **report level**. Did the geoparser correctly decide that a report is about at
    least one district at all? Coarser, but easier to state in prose.

A note on the weighting, because it is easy to get wrong. The sample is stratified by
whether the geoparser matched the report, with 75 drawn from each stratum out of very
different corpus totals. Precision is computed entirely within the matched stratum, so
the sampling weights cancel and a raw proportion is correct. Recall is not: its true
positives come from the matched stratum and its false negatives come from both, so the
two strata have to be reweighted to corpus proportions before they are combined. Doing
this naively inflates recall, because the matched stratum is over-represented.

Confidence intervals come from a stratified bootstrap, resampling within each stratum,
which handles the weighted ratio without needing a delta-method approximation.

Run:  python tools/geoparser_validation/score.py
"""

import os
import sys

import numpy as np
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import geoparser as gp  # noqa: E402
from resolve_names import Resolver  # noqa: E402

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
VAL_DIR = os.path.join(REPO, "data", "geoparser_validation")
WORKBOOK = os.path.join(VAL_DIR, "geoparser_labelling_workbook.xlsx")

N_BOOTSTRAP = 5000
SEED = 20260821


def load_labels():
    resolver = Resolver(REPO)

    labels = pd.read_excel(WORKBOOK, sheet_name="Labelling")
    labels = labels[labels["report_id"].astype(str) != "EXAMPLE"]

    labelled = labels[
        labels["districts_genuinely_about"].notna()
        | labels["no_admin2_identifiable"].notna()
    ].copy()

    key = pd.read_csv(f"{VAL_DIR}/answer_key.csv")
    manifest = pd.read_csv(f"{VAL_DIR}/sample_manifest.csv")

    merged = labelled.merge(key, on=["row_id", "report_id"], how="left", validate="1:1")

    unknown_all, region_only = [], []
    truth, passing = [], []
    for rec in merged.itertuples():
        t, reg_t, unk_t, _, sug_t = resolver.parse_cell(rec.districts_genuinely_about)
        p, _, unk_p, _, sug_p = resolver.parse_cell(rec.districts_mentioned_in_passing)
        truth.append(t)
        passing.append(p)
        unknown_all.extend([(rec.row_id, u) for u in unk_t + unk_p])
        unknown_all.extend([(rec.row_id, f"{a} (suggest {b}?)") for a, b in sug_t + sug_p])
        # A report written about a region has no Admin2 to record. That is a real
        # property of the report, not a labelling error, and must not be scored as a
        # district the geoparser missed.
        if reg_t and not t:
            region_only.append(rec.row_id)
    merged["truth_ids"] = truth
    merged["passing_ids"] = passing
    merged["pred_ids"] = merged["matched_location_ids"].apply(
        lambda v: set(str(v).split("|")) if isinstance(v, str) and v else set()
    )

    return merged, manifest, unknown_all, len(labels), region_only


def pair_counts(row):
    """(tp, fp, fn) for one report, at the report x district pair level."""
    tp = len(row["pred_ids"] & row["truth_ids"])
    fp = len(row["pred_ids"] - row["truth_ids"])
    fn = len(row["truth_ids"] - row["pred_ids"])
    return tp, fp, fn


def report_counts(row):
    """(tp, fp, fn, tn) for one report, at the report level."""
    predicted_any = len(row["pred_ids"]) > 0
    truly_any = len(row["truth_ids"]) > 0
    hit = len(row["pred_ids"] & row["truth_ids"]) > 0
    if predicted_any and truly_any:
        return (1, 0, 0, 0) if hit else (0, 1, 0, 0)
    if predicted_any and not truly_any:
        return (0, 1, 0, 0)
    if not predicted_any and truly_any:
        return (0, 0, 1, 0)
    return (0, 0, 0, 1)


def weighted_prf(df, weights, counter):
    """Precision, recall, F1 with stratum weights applied to the counts."""
    tp = fp = fn = 0.0
    for stratum, w in weights.items():
        sub = df[df["stratum"] == stratum]
        for _, row in sub.iterrows():
            c = counter(row)
            tp += c[0] * w
            fp += c[1] * w
            fn += c[2] * w
    precision = tp / (tp + fp) if (tp + fp) else float("nan")
    recall = tp / (tp + fn) if (tp + fn) else float("nan")
    f1 = (2 * precision * recall / (precision + recall)
          if precision and recall and not np.isnan(precision) and not np.isnan(recall)
          else float("nan"))
    return precision, recall, f1, tp, fp, fn


def bootstrap_ci(df, weights, counter, n=N_BOOTSTRAP):
    """Stratified bootstrap CIs for precision, recall and F1."""
    rng = np.random.default_rng(SEED)
    by_stratum = {s: df[df["stratum"] == s] for s in weights}
    out = []
    for _ in range(n):
        parts = [g.sample(len(g), replace=True, random_state=int(rng.integers(1 << 31)))
                 for g in by_stratum.values() if len(g)]
        if not parts:
            continue
        p, r, f, *_ = weighted_prf(pd.concat(parts), weights, counter)
        out.append((p, r, f))
    arr = np.array(out, dtype=float)
    return {
        name: (np.nanpercentile(arr[:, i], 2.5), np.nanpercentile(arr[:, i], 97.5))
        for i, name in enumerate(["precision", "recall", "f1"])
    }


def show(title, df, weights, counter):
    precision, recall, f1, tp, fp, fn = weighted_prf(df, weights, counter)
    ci = bootstrap_ci(df, weights, counter)
    print(f"\n{'=' * 72}\n{title}\n{'=' * 72}")
    print(f"  weighted counts   TP {tp:8.1f}   FP {fp:8.1f}   FN {fn:8.1f}")
    for name, val in [("Precision", precision), ("Recall", recall), ("F1", f1)]:
        lo, hi = ci[name.lower()]
        print(f"  {name:10s} {val:6.3f}   95% CI [{lo:.3f}, {hi:.3f}]")


def examples(df, dim_names, limit=6):
    print(f"\n{'=' * 72}\nFalse positives: districts credited that the report is not about\n{'=' * 72}")
    shown = 0
    for rec in df.itertuples():
        wrong = rec.pred_ids - rec.truth_ids
        if not wrong:
            continue
        in_passing = wrong & rec.passing_ids
        print(f"\n  row {rec.row_id}  {str(rec.title)[:78]}")
        print(f"    credited but not about : {', '.join(dim_names.get(w, w) for w in sorted(wrong))}")
        if in_passing:
            print(f"    ...of which in passing : {', '.join(dim_names.get(w, w) for w in sorted(in_passing))}")
        shown += 1
        if shown >= limit:
            break
    if not shown:
        print("  none in the labelled rows")

    print(f"\n{'=' * 72}\nFalse negatives: districts the report is about but the geoparser missed\n{'=' * 72}")
    shown = 0
    for rec in df.itertuples():
        missed = rec.truth_ids - rec.pred_ids
        if not missed:
            continue
        print(f"\n  row {rec.row_id}  [{rec.stratum}]  {str(rec.title)[:70]}")
        print(f"    missed : {', '.join(dim_names.get(m, m) for m in sorted(missed))}")
        shown += 1
        if shown >= limit:
            break
    if not shown:
        print("  none in the labelled rows")


def main():
    if not os.path.exists(WORKBOOK):
        raise SystemExit(f"No workbook at {WORKBOOK}. Run build_sample.py first.")

    df, manifest, unknown, total_rows, region_only = load_labels()
    dim = pd.read_csv(f"{REPO}/data/processed/dim_location_somalia_full74.csv")
    dim_names = {r.location_id: r.admin2 for r in dim.itertuples()}

    if df.empty:
        raise SystemExit(
            f"No labelled rows yet. Fill in the shaded columns of {WORKBOOK}\n"
            "(at minimum districts_genuinely_about or no_admin2_identifiable)."
        )

    weights = dict(zip(manifest["stratum"], manifest["weight"]))

    print(f"Labelled {len(df)} of {total_rows} sampled reports "
          f"({len(df) / total_rows * 100:.0f}% complete)")
    for s in weights:
        n = (df["stratum"] == s).sum()
        print(f"  {s:10s} {n:3d} labelled   (corpus weight {weights[s]:.2f})")

    if region_only:
        print(f"\nRows whose truth is a region, not a district (no Admin2 to find): {region_only}")

    if unknown:
        print("\n!! Unresolved names, these rows are being scored without them:")
        for row_id, name in unknown[:15]:
            print(f"   row {row_id}: '{name}'")
        print("   Fix the spelling against the 'District reference' sheet and re-run.")

    if len(df) < total_rows:
        print("\nNote: partial results. Confidence intervals will narrow as labelling completes.")

    show("Report x district pairs (headline)", df, weights, pair_counts)
    show("Report level (is it about any district at all)", df, weights, report_counts)
    examples(df, dim_names)

    print(f"\n{'=' * 72}")
    print("Precision is a within-stratum proportion, so it needs no weighting.")
    print("Recall combines both strata and is weighted to corpus proportions;")
    print("the unweighted figure would be optimistic.")


if __name__ == "__main__":
    main()
