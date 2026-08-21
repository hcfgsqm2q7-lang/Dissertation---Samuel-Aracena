# Project context

MSc dissertation by Samuel Aracena on **humanitarian observability**: how unevenly
different humanitarian data sources observe different places and crisis types when
integrated into one subnational framework.

**This is a data/resource paper, not a prediction study.** The deliverable is the
integrated Admin2 × Month dataset plus a rigorous account of what each source can and
cannot see. The contribution is what we learn about humanitarian data collection
itself, so that future research can use the dataset knowing its limits. A dashboard is
an optional output, not the point.

Reframed on 2026-08-21 following supervisor feedback
(`weekly_meetings/2026_08_21_feedback.md`). The earlier framing built towards
predicting food insecurity and comparing against IPC; that is explicitly out of scope
now. See "Scope boundaries" below before proposing any modelling work.

## Research question

**Main RQ.** How do heterogeneous humanitarian data sources differ in their spatial and
temporal coverage, granularity, missingness and measurement reliability when integrated
into a common subnational framework?

Use this wording exactly. It is the supervisor's own phrasing. The previous version
("...and what are the consequences for food-insecurity analysis?") is superseded:
food insecurity stays as the application domain, not as the prediction target.

| Sub-question | Status |
|---|---|
| 1. Where are the data gaps? Which districts, periods and mechanisms are well or poorly observed? | **Substantially covered.** Coverage figures by source, district and month are in the notebook. |
| 2. Are these gaps systematic? Do they depend on how the data are collected (satellite, market survey, event monitoring, humanitarian reporting)? | **Substantially covered.** Logistic regression with district-clustered SEs is in the notebook; keep it descriptive, see Scope boundaries. |
| 3. What do we gain by combining sources? Which are complementary, which add little? | **Not started.** All data is in hand; see Next steps. |

Sub-question 3 is the priority and is fully unblocked.

## Scope boundaries, set by supervisor feedback

- **No prediction study.** No train/test splits, no out-of-sample AUC, no
  cross-validation, no evaluation-metric tables. Logistic regression is still wanted,
  but only as a descriptive tool answering "are the gaps systematic," reported as odds
  ratios with district-clustered standard errors.
- **IPC is optional and descriptive only.** At most, show whether poorly covered
  districts are also districts experiencing serious food insecurity. Never a
  prediction target, never a model comparison. The blocked IPC download is therefore
  no longer on the critical path.
- **No new datasets** unless genuinely required by the RQ above, and not until the
  outstanding analyses are complete.
- **Star schema is an implementation method, not the scientific contribution.** Do not
  frame it as a finding.
- **Repeated district-months are not independent observations.** See Key decisions.

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
tools/analysis/                      standalone modelling scripts. model_metrics.py and
                                      momentum_neighbour_extension.py are prediction-era
                                      and now out of scope, see Scope boundaries
tools/geoparser_validation/          sample builder and scorer for the final geoparser
                                      validation, see Next steps item 1
weekly_meetings/                     feedback notes and slide decks
  2026_08_21_feedback.md             the reframing feedback; read before planning work
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
  GADM's `VARNAME_2` field, and manual research. The 43% precision figure came from
  validating the *original* method; the improved method has not yet been validated, and
  doing so is Next steps item 1. Do not quote 43% as the final method's precision.
- **Repeated district-months are not independent.** Each district contributes 12 rows.
  Variables fixed at district level (`has_market_coverage` above all) must be analysed
  at district level, not treated as 888 independent observations. Monthly outcomes need
  district-clustered SEs or a district random effect. Any p-value that got smaller only
  because rows were repeated is not stronger evidence. Several existing bivariate
  results have this flaw and are flagged in Next steps item 3.
- **"Comparable severity" wording is banned.** Being in the worst decile of two
  different variables does not make the humanitarian impact equivalent. Use
  "relatively extreme conflict observations" versus "relatively extreme climate-stress
  observations". This was corrected explicitly and must not drift back.
- **The 1.0 market-stress threshold is unsupported** by WFP documentation. Either
  justify it with a sensitivity analysis or drop `market_stress_count`.

## Current findings

- Panel is 888 rows (74 districts × 12 months of 2024) × 30 columns.
- Coverage by source: conflict and climate 100%, market 47%, reporting 68% at the
  prototype stage rising to 99% of districts across the full year.
- `SO_BANDER_BEYLA` is the only district never mentioned by ReliefWeb all year, and it
  has no market either.
- Reporting coverage swings between 34 and 54 districts by month. Market coverage is
  flat at 34 to 35. Different kinds of gap.
- Correlates of reporting coverage: conflict activity r=0.49, market status r=0.43,
  district area r=0.06 (nothing), distance to capital r=-0.11 (nothing). **The market
  correlation is one of the district-independence casualties**, since market status
  barely varies within a district across the year; it needs redoing at district level.
- **WFP observed vs forecast, checked 2026-08-21**: the export carries a `Data Type`
  column ("Aggregated" = observed, "Forecast") and a `Forecast Methodology` column.
  Across the whole 69,162-row export, 63% is forecast. But the **Somalia 2024 slice
  actually used is 6,973 rows of which only 4 are forecasts** (2 in November, 2 in
  December, 0.3% of those months, 0.0% Jan-Oct). The forecast contamination lives in
  the other three countries (Ethiopia, Kenya, South Sudan) and other years. The earlier
  prototype-stage warning was correct about the export as a whole and does not bite on
  the slice in use. This still needs writing up properly as the audit table, see Next
  steps item 2, but the answer is reassuring rather than damaging.
- **Reporting attention by crisis type** (rewording pending, see Key decisions):
  district-months in the worst decile for conflict received a mean 6.65 reports against
  2.67 for the worst decile of vegetation stress (p=0.000064). 88.2% versus 65.7%
  received any report at all. Groups were 68 and 67 with the overlap excluded.
  **Two caveats before this can be quoted**: the "comparable severity" framing is
  banned, and the Mann-Whitney test treats district-months as independent when
  districts repeat across groups. Needs threshold robustness (5/10/20%) and a
  continuous version, see Next steps item 4.
- **Logistic regression, descriptive reading** (in the notebook, "Logistic regression:
  are the reporting gaps systematic?"). Odds ratios with district-clustered SEs, from
  conflict, market status, rainfall, vegetation, region and month. Banaadir excluded
  (mentioned 12/12 months, perfect separation; kept separately with an L2-penalised fit
  as a robustness check). Market OR 3.20 (p=0.002), conflict (logged) OR 2.01
  (p<0.0001), rainfall and vegetation both OR ≈ 1.00 and not significant. **Climate
  stress carries no independent signal once conflict and market status are known**;
  removing both climate measures changes the model negligibly (chi2 0.23, df 2, p=0.89).
  This is the part that survives the reframing and answers sub-question 2.
- **In the same six-predictor model, adding reporting history** (n=803, clustered SEs):
  covered last month OR 4.63 (p<0.0001), neighbouring districts covered OR 2.72
  (p=0.054, borderline), market OR 2.42 (p=0.003), conflict OR 1.71 (p=0.0001), climate
  both ≈ 1.00. Descriptively this says **reporting attention is self-perpetuating**:
  where a district stood in the reporting ecosystem last month is more strongly
  associated with this month's coverage than either crisis-severity variable.
  Caveat to keep: this could be genuine self-perpetuation, or momentum proxying an
  unmeasured persistent factor like NGO presence. We cannot distinguish the two.
  **Scope warning**: this finding is fine as a descriptive coefficient, but the
  out-of-sample AUC framing around it (0.715 → 0.795) is prediction and is now out of
  scope. Flag the momentum result to the supervisor before leaning on it.
- **Out of scope after the reframing, retained only for reference**: all out-of-sample
  AUC and cross-validation results, the confusion matrices, and
  `tools/analysis/model_metrics.py` / `momentum_neighbour_extension.py`. Also the
  earlier ruled-out predictor tests (fatalities vs. event count, spatial spread of
  conflict, event-type variety, administrative-seat status), which were run as
  predictive checks.
- Cannot test without external data (biggest acknowledged gaps): NGO/humanitarian
  operational presence, population, road access, territorial control. Per the
  no-new-datasets rule, these stay as acknowledged limitations rather than todos.

## Next steps

Straight from the supervisor's to-do list, in priority order. Everything here is
unblocked: all data is already in the repository.

1. **Validate the final geoparser on a fresh manual sample.** The long pole, because it
   needs Samuel's own eyes on 150 reports and cannot be automated. Harness is built in
   `tools/geoparser_validation/`: `build_sample.py` draws a stratified sample (75
   matched + 75 unmatched) from the Mar-Dec corpus, excluding the Jan-Feb prototype
   reports used while improving the system, and writes a blind labelling workbook plus
   a separate answer key. `score.py` computes precision, recall, F1 and pulls out false
   positive and false negative examples once labels come back. Labelling is blind by
   design: the geoparser's predictions are not in the workbook. Report against the
   **final** method, never the original.
2. **WFP observed-vs-forecast audit.** Month-by-month table of observed, forecast and
   missing record counts. Preliminary numbers are in Current findings and look
   favourable; this is a write-up task, not a discovery task. Never mix forecast and
   observed prices without marking them.
3. **Fix the repeated-district-months problem.** Audit every existing bivariate result.
   District-fixed variables (`has_market_coverage`) move to district-level analysis;
   monthly outcomes keep district-clustered SEs. The logistic regression already
   clusters, so it is largely compliant.
4. **Strengthen the conflict-vs-climate reporting result.** Reword away from
   "comparable severity". Re-run at 5%, 10% and 20% thresholds. Add a continuous
   version: does reporting rise with conflict intensity, and does it stay flat across
   climate stress? Also repeat using `food_nutrition_report_count` only, which has
   never been used, and test whether slow-onset stress is reported late rather than
   never.
5. **Measure source complementarity** (sub-question 3, the open one). For each
   district-month count how many of the four mechanisms are observed, then report the
   share with 1, 2, 3 and 4. Add each source's unique contribution: how many
   district-months gain an additional observed mechanism when that source is added.
6. **Finalise every feature definition and formula.** Exact formulas, especially the
   log-difference variables. Define PEWI and cite where its formula comes from (may
   need a WFP methodology note; their domains have been proxy-blocked before). Resolve
   the 1.0 market-stress threshold by sensitivity analysis or removal.
7. **Build the source-level table.** For each source: how the data are collected, where
   it can theoretically provide information, where values actually exist, what a zero
   means, what missing means, main measurement biases. The structural availability /
   recorded coverage / true observability distinction already in the notebook is the
   backbone; this turns it into the dissertation's key table.
8. **Optional and descriptive only: IPC.** At most, show whether poorly covered
   districts are also badly food-insecure. Not a priority, not a model.

**Also outstanding, from before the reframing**
9. Produce observability maps. The boundary geometry has only been used for areas and
   centroids so far.
10. Strip the prediction apparatus out of the notebook's logistic regression section
    (out-of-sample AUC, cross-validation, confusion matrices), keeping the odds-ratio
    tables and the descriptive reading. Not yet done.

## Known issues

- **Cell ordering.** An early data-quality cell reads tables generated later in the
  notebook. Predates the migration. Committing the generated tables hides the symptom
  on a fresh clone but does not fix it. Worth moving that cell after the pipeline
  section.
- **Derived tables can drift.** `data/processed/` is committed. Regenerate it whenever
  the pipeline changes.
- **The notebook still contains prediction-era material** that the reframing puts out
  of scope. See Next steps item 10.

## Writing conventions for the notebook

These were requested explicitly and applied throughout. Keep them.

- No dashes as sentence punctuation. Use colons, semicolons, commas or parentheses.
  Hyphenated compounds and numeric ranges are fine.
- No references to supervisor feedback. Write "following previous observations".
- Plan sections in first person plural or impersonal, never second person.
- Simple wording, professional register. Explain statistical methods in plain terms.

## Git

Work now happens on `claude/claude-md-visibility-iukck2`. Pull request #1 (from the
earlier `claude/dissertation-colab-migration-7icrup` branch) has been merged into
`main`.

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
