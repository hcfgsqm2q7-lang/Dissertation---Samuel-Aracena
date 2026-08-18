# Project context

MSc dissertation by Samuel Aracena on **humanitarian observability**: how unevenly
different humanitarian data sources observe different places and crisis types, and
what that unevenness means for food-insecurity analysis.

The dataset is the method, not the contribution. A dashboard is an optional output,
not the point.

## Research question

**Main RQ.** How unevenly do humanitarian data sources observe different places and
crisis mechanisms, and what are the consequences for food-insecurity analysis?

Use this wording exactly. It was drifted once to "monitoring humanitarian conditions
more broadly" and corrected back.

| Sub-question | Status |
|---|---|
| 1. Where are the gaps, and are they systematic? | **Answered.** Logistic regression is in the notebook. See the ranked-predictors findings below; one extension (momentum/neighbour effects) is analysed but not yet written up, see Next steps. |
| 2. Does observability differ by crisis type? | **Answered.** See the severity-matched comparison. |
| 3. Does poor observability mean being wrong, not just incomplete? | **Not started.** Blocked on two things, see below. |

Sub-question 3 is the priority. It is the only route to the "consequences" half of the
main question, and that half is currently unanswered.

## Where things are

```
src/Dissertation_master_file.ipynb   the notebook, 102 cells, the whole analysis
data/raw/                            all source data, committed (~47MB)
  CHIRPS/2024/                       12 monthly rainfall rasters, cropped to Somalia
  VHI/2024/                          52 weekly vegetation rasters, cropped
  ACLED_Somalia_full_2024.csv        conflict events
  reliefweb_horn_of_africa_2024.csv  full-year reports
  reliefweb_somalia_jan_feb_2024.csv prototype subset (still used by Task 7)
  Prices-Export-...csv               WFP prices
  gadm41_SOM.gpkg                    district boundaries
  somalia_admin2_crosswalk.csv       WFP to GADM name mapping
data/processed/                      8 generated tables, committed (includes
                                      district_observability_gaps.csv, the model's
                                      over/under-predicted districts)
tools/analysis/                      standalone modelling scripts, see Next steps item 0
weekly_meetings/                     feedback notes and slide decks
```

The rasters were cropped to Somalia's extent plus a 0.25 degree buffer, taking roughly
2.4GB down to about 13MB. Nothing is lost: the pipeline only computes zonal statistics
over the 74 districts. Verified before committing, the January rainfall value for
SO_AADAN matched the prototype's known output exactly.

## Environment constraints, learned the hard way

**Blocked by the network proxy** (all return 403): `star.nesdis.noaa.gov`,
`data.chc.ucsb.edu`, `api.reliefweb.int`, `api.ipcinfo.org`, `ipcinfo.org`,
`fsnau.org`, `centre.humdata.org`, `unocha.org`, `drive.google.com`, `docs.google.com`.

**Reachable**: `www.googleapis.com`, PyPI, npm, GitHub.

That last point matters. The Google Drive MCP connector caps downloads at 10MB per
file, which blocks every raster. The workaround that worked was a short-lived OAuth
token from Google's OAuth Playground with the `drive.readonly` scope, then pulling
files directly from `https://www.googleapis.com/drive/v3/files/{id}?alt=media`. Any
future bulk pull from Drive should use that route, not the connector.

**LibreOffice cannot render anything in this sandbox**, including plain text files. So
`.pptx` files cannot be converted to PDF or images for visual inspection. Slide decks
were checked with a geometry script instead (overflow, overlap, margins). Always ask
the user to skim decks in PowerPoint before sending.

**Packages needing install** (not preinstalled): `pandas numpy geopandas pyproj rasterio
rasterstats fiona scipy beautifulsoup4 nbclient nbformat ipykernel python-pptx`.

## Key decisions already made, do not relitigate

- **24 features**, unchanged between the 148-row prototype and the 888-row full year.
- **`conflict_density` was tested and dropped.** It correlated with plain event count
  at r=0.96, tracked district area more than anything humanitarian, and predicted
  fatalities worse than the raw count.
- **Percentage-change trends were replaced by log differences**, not kept alongside.
  Percentage change is undefined when the previous month is zero.
- **All four commodities kept.** Sugar is nearly uncorrelated with the others and would
  be lost in an aggregate.
- **ReliefWeb alias list covers 65 of 74 districts.** Built from the ACLED crosswalk,
  GADM's `VARNAME_2` field, and manual research. Manual validation found roughly 43%
  precision on matched reports.

## Current findings

- Panel is 888 rows (74 districts × 12 months of 2024) × 30 columns.
- Coverage by source: conflict and climate 100%, market 47%, reporting 68% at the
  prototype stage rising to 99% of districts across the full year.
- `SO_BANDER_BEYLA` is the only district never mentioned by ReliefWeb all year, and it
  has no market either.
- Reporting coverage swings between 34 and 54 districts by month. Market coverage is
  flat at 34 to 35. Different kinds of gap.
- Predictors of reporting coverage: conflict activity r=0.49, market status r=0.43,
  district area r=0.06 (nothing), distance to capital r=-0.11 (nothing).
- **Severity-matched crisis comparison**: district-months in the worst decile for
  conflict received a mean 6.65 reports against 2.67 for the worst decile of vegetation
  stress (p=0.000064). 88.2% versus 65.7% received any report at all. Groups were
  balanced at 68 and 67 with the overlap excluded.
- **Logistic regression (in the notebook)**: predicts whether a district was mentioned
  that month from conflict, market status, rainfall, vegetation, region and month.
  Banaadir excluded (mentioned 12/12 months, causes perfect separation; included
  separately with an L2-penalised fit as a robustness check). Out-of-sample AUC
  (5-fold, holding out whole districts) 0.715, versus 0.640 with region dummies
  removed the naive way, so region genuinely helps generalisation once done properly.
  Full in-sample/out-of-sample metrics table (accuracy, precision, recall, specificity
  0.51 OOS, F1, Brier score, confusion matrix) is in `tools/analysis/model_metrics.py`,
  not yet in the notebook, see Next steps.
- **Ranked predictors, all in one model, cluster-robust SEs by district** (conflict,
  market, rainfall, vegetation, momentum, neighbour coverage, region and month
  together, n=803): covered last month OR 4.63 (p<0.0001, by far the strongest),
  neighbouring districts covered this month OR 2.72 (p=0.054, borderline once
  everything else is controlled for), has market data OR 2.42 (p=0.003), conflict
  events (logged) OR 1.71 (p=0.0001), rainfall and vegetation both OR ≈ 1.00, not
  significant. **Headline: momentum beats both crisis-severity variables.** Where a
  district already stood in the reporting ecosystem last month predicts this month's
  coverage better than conflict or climate stress do, and climate stress has
  essentially zero independent predictive power once conflict, market and reporting
  history are known. Written into the notebook inside the "Logistic regression: are the
  reporting gaps systematic?" section (the model, its extension with momentum and
  neighbour coverage, and the confusion matrices are now one cohesive section, replacing
  the earlier separate model and extension write-ups).
  Caveat worth keeping in the write-up: momentum could mean attention is
  self-perpetuating, or it could be proxying an unmeasured persistent factor like NGO
  presence, we cannot distinguish the two with data currently in hand.
- **Momentum/neighbour extension, out-of-sample validated**: adding momentum and
  neighbour coverage to the conflict + market + month baseline raises out-of-sample AUC
  from 0.715 to 0.795 (momentum alone gets to 0.786). Full in/out-of-sample metrics and
  the out-of-sample confusion matrix for this extended model are in the notebook: AUC
  0.795, accuracy 0.748, precision 0.775, recall 0.823, specificity 0.635, F1 0.798,
  Brier 0.177, confusion matrix TN 202 / FP 116 / FN 86 / TP 399 (n=803).
- Ruled out as predictors, tested and found not to add anything beyond the model
  above: fatalities vs. plain conflict event count, spatial spread of conflict events
  within a district, variety of conflict event types, whether the district is its
  region's administrative seat.
- Cannot test without external data (biggest acknowledged gaps): NGO/humanitarian
  operational presence, population, road access, territorial control.

## Next steps

Ready means data is in hand. Blocked means an external download is needed.

**Sub-question 3, the priority**
1. Define this dataset's own derived assessment. **Ready, scheduled for next week.**
   Nothing currently exists on our side to compare against IPC. The harmonised
   market-anomaly features were built as its ingredients.
2. Obtain the IPC export for Somalia 2024. **Blocked**, needs a manual download.
   Then two problems: IPC publishes 2 to 3 times a year not monthly, and may use
   different area names, meaning a fourth round of name-matching.
3. Fallback if IPC fails: test whether the four sources agree with each other. Ready.

**Sub-question 2 refinements, all ready**
4. Repeat the severity comparison using food and nutrition reports only. The columns
   exist and have never been used.
5. Test whether slow-onset stress is reported late rather than never. Only a one-month
   lag has been tested, and only for conflict.
6. Test whether attention scales smoothly with severity rather than only at the extreme.

**Sub-question 1**
7. ~~Build a logistic regression predicting whether a district was mentioned that
   month~~. **Done**, including the momentum/neighbour extension, see Current findings
   and the notebook's "Logistic regression: are the reporting gaps systematic?" section.
8. Measure how much each additional source contributes to coverage.

**Strengthening, ready**
9. Rank districts by apparent severity, then re-rank accounting for observability.
   `district_observability_gaps.csv` (which districts the model over/under-predicts
   for) is already generated in `data/processed/`.
10. Confirm results survive the 43% geoparsing precision.
11. Produce observability maps. The boundary geometry has only been used for areas
    and centroids so far.

## Known issues

- **Cell ordering.** An early data-quality cell reads tables generated later in the
  notebook. Predates the migration. Committing the generated tables hides the symptom
  on a fresh clone but does not fix it. Worth moving that cell after the pipeline
  section.
- **Derived tables can drift.** `data/processed/` is committed. Regenerate it whenever
  the pipeline changes.

## Writing conventions for the notebook

These were requested explicitly and applied throughout. Keep them.

- No dashes as sentence punctuation. Use colons, semicolons, commas or parentheses.
  Hyphenated compounds and numeric ranges are fine.
- No references to supervisor feedback. Write "following previous observations".
- Plan sections in first person plural or impersonal, never second person.
- Simple wording, professional register. Explain statistical methods in plain terms.

## Git

Work happens on `claude/dissertation-colab-migration-7icrup`. Pull request #1 is open
against `main`: https://github.com/hcfgsqm2q7-lang/Dissertation---Samuel-Aracena/pull/1

A stop hook checks for uncommitted files, so commit and push before ending a session.

## Slide decks

`tools/slides/` holds the generator scripts. They use `pptxgenjs` (run
`npm install pptxgenjs` first, it is not preinstalled) and share one palette and set
of helper functions, so a new deck can reuse them.

- `build_week_deck.js` produced the 13-slide Week of August 10 deck.
- `build_next_steps.js` produced the 5-slide next-steps section.
- `qa_geometry.py deck.pptx` checks for text overflow, overlapping boxes and margin
  violations. This exists because LibreOffice cannot render in this sandbox, so the
  usual visual check is unavailable. It caught several real defects.

Both decks are in `weekly_meetings/`. The README asks for PDF, which has to be
exported from PowerPoint since conversion is not possible here.
