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
| 1. Where are the gaps, and are they systematic? | Substantially covered. Multivariate model still to build. |
| 2. Does observability differ by crisis type? | **Answered.** See the severity-matched comparison. |
| 3. Does poor observability mean being wrong, not just incomplete? | **Not started.** Blocked on two things, see below. |

Sub-question 3 is the priority. It is the only route to the "consequences" half of the
main question, and that half is currently unanswered.

## Where things are

```
src/Dissertation_master_file.ipynb   the notebook, 95 cells, the whole analysis
data/raw/                            all source data, committed (~47MB)
  CHIRPS/2024/                       12 monthly rainfall rasters, cropped to Somalia
  VHI/2024/                          52 weekly vegetation rasters, cropped
  ACLED_Somalia_full_2024.csv        conflict events
  reliefweb_horn_of_africa_2024.csv  full-year reports
  reliefweb_somalia_jan_feb_2024.csv prototype subset (still used by Task 7)
  Prices-Export-...csv               WFP prices
  gadm41_SOM.gpkg                    district boundaries
  somalia_admin2_crosswalk.csv       WFP to GADM name mapping
data/processed/                      7 generated tables, committed
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

**Sub-question 1, ready**
7. Build a logistic regression predicting whether a district was mentioned that month,
   from conflict, market status, region and climate, with month as a control. Report
   which factors matter independently and which districts the model gets wrong.
8. Measure how much each additional source contributes to coverage.

**Strengthening, ready**
9. Rank districts by apparent severity, then re-rank accounting for observability.
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
