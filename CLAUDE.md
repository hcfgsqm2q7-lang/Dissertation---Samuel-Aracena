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
docs/data_quality_findings.md        running log of measurement problems found, with
                                      evidence. Read before touching the geoparser or
                                      the ACLED name-fix list
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

- **23 features** (24 through the full-year build, then `wash_report_count` was dropped
  2026-08-23: never used in any analysis, and the project's reframing as a general
  humanitarian-observability dataset rather than a food-insecurity-specific one made it
  out of scope. `food_nutrition_report_count` was kept, since food insecurity remains
  the project's application domain per the reframing note. See Current findings.
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
- **The 1.0 market-stress threshold is resolved, not unsupported.** It is exactly WFP's
  own Stress/Alert boundary on the Pewi (ALPS) score, confirmed directly from the `ALPS
  Phase` column in the raw export: Normal up to 0.25, Stress 0.25-1.0, Alert 1.0-2.0,
  Crisis above 2.0, identical for Somalia's basket commodities and the full export. No
  sensitivity analysis was needed and the feature was not dropped. What the name gets
  wrong: `market_stress_count` (Pewi > 1.0) actually counts Alert-or-worse, not WFP's
  own Stress phase. The column itself was not renamed, since it is already used
  throughout the notebook and the committed CSVs; the corrected reading is documented
  in the notebook instead. See Current findings and Next steps item 6.

## Current findings

- Panel is 888 rows (74 districts × 12 months of 2024) × 29 columns (30 minus
  `wash_report_count`, dropped 2026-08-23).
- Coverage by source: conflict and climate 100%, market 47%, reporting 68% at the
  prototype stage rising to 99% of districts across the full year.
- `SO_BANDER_BEYLA` is the only district never mentioned by ReliefWeb all year, and it
  has no market either.
- Reporting coverage swings between 34 and 54 districts by month. Market coverage is
  flat at 34 to 35. Different kinds of gap.
- Correlates of reporting coverage, already computed correctly at district level (n=74,
  one row per district, notebook cell "Candidate predictors of reporting coverage"):
  conflict activity r=0.49, market status r=0.43, district area r=0.06 (nothing). There
  is no "distance to capital" feature anywhere in the codebase; an earlier version of
  this note conflated that with a separate month-level figure (VHI vs reports, r=-0.11,
  see below). The market and conflict correlations above do NOT need redoing, since
  `prof` in that cell already aggregates the panel to one row per district before
  computing them.
- **WFP observed vs forecast, audited and written up 2026-08-21** (notebook, "WFP
  observed-vs-forecast audit, full year"). The export carries a `Data Type` column
  ("Aggregated" = observed, "Forecast") and a `Forecast Methodology` column. Across the
  whole 69,162-row export, 63% is forecast. But the **Somalia 2024 slice actually used
  is 6,973 rows of which only 4 are forecasts**, and those 4 are Sorghum (red and
  white) in Afmadow for November and December, a commodity the panel does not track.
  **The four basket commodities the panel actually keeps (wheat flour, rice, sugar,
  oil) have zero forecast rows in any month, all year.** Missingness is small and
  explained: January is missing 4 of 140 expected market x commodity series (2.9%),
  all four the same market (Bakaara) not yet reporting in the export's first month;
  every month from February on is 100% complete. The panel-building code already
  filters to `Data Type == "Aggregated"` before anything else happens, so this was
  always safe; the audit confirms it with numbers rather than fixing anything. The
  notebook also carries the full breakdown at the supervisor's literal spec (month,
  observed, forecast, missing) for **every** commodity WFP tracks, not just the
  basket, with the four basket commodities marked `*` for comparison. That fuller
  table surfaced one thing outside the basket, noted but not acted on since it does
  not touch the panel: Livestock (Goat) and Salt both show 0 observed / 35 missing
  in January (absent that whole month, not forecast), and Meat (Goat) does the same
  in May. Next steps item 2 is done.
- **Repeated-district-months audit, done 2026-08-22** (notebook, "Correcting Pilot 1 for
  repeated district-months" and "Are the month-level correlations above robust to
  repeated district-months?"). Every bivariate test in the full-year section was
  checked. One was a genuine violation and is now fixed in place: "Pilot 1"
  (`has_market_coverage` vs conflict/fatalities) tested a district-fixed variable on all
  888 month-level rows, reporting conflict_event_count as significant (p=0.0001). At
  the correct district level (n=74, one row per district) it is not significant
  (p=0.188); fatalities moves from p=0.114 to p=0.978. The naive figures are kept in the
  notebook alongside the correction, not deleted, so the artefact is visible. The
  remaining month-level correlations (Pilot 2's conflict-reports r=0.366, and the
  climate checks in "Candidate predictors of reporting coverage") use time-varying
  variables, not fixed ones, so pooling is a weaker violation; checked with a
  district-cluster bootstrap (resampling whole districts, not individual district-
  months) rather than a full redo. Conflict vs reports, rainfall vs reports and VHI vs
  conflict all survive clustering. **VHI vs reports does not**: its cluster-robust 95%
  CI crosses zero ([-0.237, 0.003], p~0.057), so the r=-0.11 figure should not be quoted
  as a confirmed effect, only as inconclusive. This does not change the substantive
  reading that climate carries far less signal than conflict. The two-month prototype
  cells (Task 9 era) were left alone: they are already disclaimed as illustrative-only
  and are not part of the current findings. Next steps item 3 is done.
- **Reporting attention by crisis type, strengthened and reworded 2026-08-22** (notebook,
  "Comparing Crisis Types: Relatively Extreme Conflict vs. Climate-Stress Observations").
  Both caveats flagged against this result are now resolved. Wording changed throughout
  to "relatively extreme conflict observations" vs "relatively extreme climate-stress
  observations", never "comparable severity". Five robustness checks were added:
  (1) the original 10%-threshold result (mean 6.65 reports for extreme conflict vs 2.67
  for extreme climate stress, p=0.000064, 88.2% vs 65.7% received any report) holds at
  5% and 20% thresholds too, all p<0.001; (2) a continuous, non-threshold version shows
  reporting rising close to monotonically with conflict intensity (1.40 to 5.66 reports
  across conflict quintiles) with no comparable rise across climate-stress quintiles;
  (3) restricted to `food_nutrition_report_count` only, the same direction holds but
  weaker (3.21 vs 2.09 reports, p=0.016); (4) the gap does not narrow over the three
  months following an extreme month (17.47 vs 6.82 cumulative reports, p=0.0001), so
  climate stress is not simply reported late; (5) **the repeated-district-months
  caveat**, since the extreme-conflict group draws heavily on a handful of chronically
  conflict-affected districts (18 distinct districts for 68 district-months, versus 41
  distinct districts for the climate group's 67), is now checked directly: at the
  district level (n=18 vs n=41) the result survives but weakens substantially, from
  p=0.000064 to p=0.0067, and a district-cluster bootstrap on the original statistic
  gives a 95% CI of [0.57, 7.54] on the mean difference, excluding zero but far wider
  than the naive test implied. The direction and significance hold; the effective
  sample size does not. The one caveat that remains, and cannot be resolved by any of
  these checks, is that "extreme" is defined relative to Somalia's own 2024
  distribution, not an external measure of human impact. Next steps item 4 is done.
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
- **Source complementarity, done 2026-08-23** (notebook, "Measuring source
  complementarity", answers Sub-Question 3, previously the one open sub-question).
  "Observed" uses the same recorded-coverage definition as the structural
  availability / recorded coverage / true observability section: conflict and climate
  are observed for all 888 district-months by construction (ACLED is zero-filled,
  satellite has no gaps), so they contribute no variation and every district-month sits
  at a floor of 2 of 4 mechanisms observed. The interesting variation is entirely in
  market and reporting: 31.0% of district-months reach only that floor of 2 (neither
  market nor reporting), 34.8% reach 3, 34.2% reach all 4. Market and reporting are
  genuinely complementary at the month level, not redundant: of the 383 district-months
  market covers, 79 (20.6%) are ones reporting missed that month; of the 534 reporting
  covers, 230 (43.1%) are ones market missed. At the district level the picture is
  different: every one of the 32 districts with a market is mentioned by ReliefWeb at
  least once during the year (market adds no new districts reporting doesn't already
  reach), while reporting alone reaches 41 districts market never touches at all.
  `SO_BANDER_BEYLA` remains the one district invisible to both, all year. Next steps
  item 5 is done.
- **Feature reference and PEWI definition, done 2026-08-23** (notebook, "Feature
  reference: exact formulas and definitions" and "Defining PEWI"). Every one of the 24
  features now has its exact formula documented in one place: conflict and fatalities
  are zero-filled ACLED counts, `conflict_trend_log` uses `log1p` because event counts
  can be 0, market `{c}_trend_log` uses plain `log` because prices cannot, VHI is a
  day-weighted average of the weekly rasters overlapping each calendar month, and
  `{c}_pewi_score` is not computed by this pipeline at all, it is WFP's own `Pewi`
  column taken directly from their export. PEWI stands for Price Early Warning
  Indicator, WFP's own name for the ALPS (Alert for Price Spikes) methodology
  (WFP/CERDI, *Technical Guidance Note: Calculation and Use of the ALPS Indicator*,
  April 2014): a price's deviation from its own seasonal trend, normalised by the
  historic standard deviation of the trend residuals. WFP's and ReliefWeb's domains
  are proxy-blocked in this environment, so the citation came from a web search rather
  than the PDF itself; the exact phase boundaries were confirmed independently and
  more reliably from the raw export's own `ALPS Phase` column (see Key decisions:
  Normal up to 0.25, Stress 0.25-1.0, Alert 1.0-2.0, Crisis above 2.0). This also
  resolved the market-stress-threshold question, see Key decisions. Next steps item 6
  is substantially done; the log-difference and PEWI parts are complete, no other
  formula was found to need resolving.
- **`wash_report_count` dropped, 2026-08-23**, at Samuel's request while reviewing the
  feature reference above: never used in any analysis, and out of scope for a project
  reframed around general humanitarian observability rather than food insecurity
  specifically. `food_nutrition_report_count` was kept (option 3 of three considered),
  since food insecurity remains the project's application domain. This also removes
  it from Robustness check 3's finding on the F4 conflict-vs-climate result: that
  finding used `food_nutrition_report_count`, not `wash_report_count`, so it is
  unaffected and still stands. Panel regenerated and verified: 888 rows, 29 columns
  (30 minus the dropped column), same 73/74 district coverage and missingness pattern
  as before.
- **Source-level table, done 2026-08-23** (notebook, "Source-level table: how each
  mechanism actually observes Somalia", Next steps item 7, the dissertation's key
  table). Corrects the two-month-prototype numbers still sitting in the earlier
  structural availability section (reporting's recorded coverage there still says
  50/74; the full year is 73/74). Collection-method claims are grounded directly in
  the raw data, not general knowledge: ACLED's Somalia 2024 events are 65.3%
  "Local partner" sourced per ACLED's own `source_scale` field (dominated by Somali
  outlets Calamada, Al Furqaan, Somali Memo, Caasimada) and 31.2% cite no named source
  at all; WFP prices are collected weekly by WFP's own VAM enumerators; ReliefWeb's
  2024 Somalia corpus is led by IOM, UNHCR, OCHA, FSNAU, FEWS NET, the Somali
  government, WHO and Radio Ergo, and 216 of 1,336 reports are Infographics and 110
  are Maps, formats the text-matching geoparser cannot read.
  **Surfaced a real, previously undocumented finding while building the market row**:
  `commodities_tracked_count` and the other PEWI-based market features understate
  recorded market coverage. Three districts (`SO_RAB_DHUURE`, `SO_TALEEX`,
  `SO_XUDUN`) have complete price data for all 4 basket commodities all year but WFP
  never computed a Pewi score for any of it, so these features read 0 across all 12
  months despite real prices existing. Price-based coverage is 47.2% of
  district-months (419/888, 35/74 districts, exactly the structural availability
  figure) versus 43.1% (383/888, 32/74 districts) by the PEWI-based definition used
  throughout Sub-Question 3. The Sub-Question 3 numbers (Next steps item 5) were not
  revised, since they used the PEWI-based definition consistently and are only
  slightly conservative about market's reach as a result; whether to redo them with a
  price-based definition is an open decision, see `docs/data_quality_findings.md` G1.

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
2. ~~**WFP observed-vs-forecast audit.**~~ **Done 2026-08-21.** Month-by-month table
   of observed, forecast and missing record counts is in the notebook, both for every
   WFP-tracked commodity and restricted to the panel's own basket. See Current
   findings for the numbers.
3. ~~**Fix the repeated-district-months problem.**~~ **Done 2026-08-22.** Audited every
   bivariate result in the full-year section. `has_market_coverage` (district-fixed) was
   the one real violation and is now corrected in the notebook, kept alongside the
   naive figure for transparency. Time-varying monthly correlations were checked with a
   district-cluster bootstrap instead of a full redo; all but one (VHI vs reports)
   survive. See Current findings for the numbers. The logistic regression already
   clustered, so it needed no change.
4. ~~**Strengthen the conflict-vs-climate reporting result.**~~ **Done 2026-08-22.**
   Reworded away from "comparable severity" throughout. Re-run at 5/10/20% thresholds,
   all significant. Added a continuous version (quintile bins), the
   `food_nutrition_report_count`-only version, a test for whether climate stress is
   reported late rather than never (it is not), and a district-cluster check of the
   test itself, which survives but at markedly weaker significance (p=0.0067, not
   p=0.000064) once repeated conflict-heavy districts stop being overcounted. See
   Current findings for the numbers.
5. ~~**Measure source complementarity**~~ (sub-question 3). **Done 2026-08-23.**
   Conflict and climate are observed for all 888 district-months by construction, so
   every district-month sits at a floor of 2 of 4; the real variation is entirely in
   market and reporting. They complement each other at the month level (each covers
   real district-months the other misses) but not at the district level (every
   market district is reached by reporting too; reporting alone reaches 41 districts
   market never touches). See Current findings for the numbers.
6. ~~**Finalise every feature definition and formula.**~~ **Done 2026-08-23.** Every
   feature's exact formula is documented in the notebook, including the log-difference
   variables. PEWI is defined and cited (WFP/CERDI's ALPS technical note, found via web
   search since WFP's own domains are proxy-blocked). The 1.0 market-stress threshold
   is resolved as a genuine WFP phase boundary, not dropped or sensitivity-tested. See
   Current findings for the numbers.
7. ~~**Build the source-level table.**~~ **Done 2026-08-23.** One table in the notebook
   ("Source-level table: how each mechanism actually observes Somalia") covering all
   four mechanisms: collection method, structural availability, recorded coverage,
   what a zero means, what missing means, plus a main-measurement-biases writeup per
   source. See Current findings for the numbers and Key decisions / findings doc for
   the market coverage-definition discovery this surfaced.
8. **Optional and descriptive only: IPC.** At most, show whether poorly covered
   districts are also badly food-insecure. Not a priority, not a model.

**Also outstanding, from before the reframing**
9. Produce observability maps. The boundary geometry has only been used for areas and
   centroids so far.
10. Strip the prediction apparatus out of the notebook's logistic regression section
    (out-of-sample AUC, cross-validation, confusion matrices), keeping the odds-ratio
    tables and the descriptive reading. Not yet done.

## Known issues

- **Measurement problems are logged in `docs/data_quality_findings.md`**, with evidence
  for each. Highlights: the geoparser matches without word boundaries; `Sheikh` is an
  alias for district Sheekh and is overwhelmingly a personal name (21 of its 47 reports
  name President Hassan Sheikh Mohamud, which explains the Sheekh outlier); Mataban is a
  real district absent from GADM entirely. **Do not fix the geoparser before the
  validation sample is scored**, since the sample and answer key are pinned to the
  current method.
- **The ACLED name-fix bug is fixed** (2026-08-21). `Sablaale` and `Laasqoray` were
  dropping out of the merge, leaving `SO_SABLALE` and `SO_BADHAN` on a false zero for
  all of 2024 and losing one event that killed 20 people. Both are now mapped, both
  ACLED cells carry an assertion that fails rather than dropping rows silently, and
  `fact_conflict_somalia.csv` and the panel were regenerated. Model results moved
  negligibly (conflict OR 2.006 → 2.012, market 3.201 → 3.206). The notebook's
  hardcoded odds-ratio table still says 3.20 for market and should read 3.21 after the
  next full re-run.
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
