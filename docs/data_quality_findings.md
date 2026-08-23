# Data quality findings

A running log of measurement problems found in the integrated panel, with the evidence
for each. Started 2026-08-21 while preparing the geoparser validation.

This is raw material for two deliverables the supervisor asked for: the source-level
table (collection process, coverage, what a zero means, measurement biases) and the
final geoparser validation write-up.

**Nothing here has been fixed yet, and that is deliberate.** The validation sample in
`data/geoparser_validation/` was drawn against the geoparser exactly as it stands, and
that same version built the committed panel. Changing the method now would invalidate
the sample and the answer key. Fixes come after the manual labelling is scored, and
should be reported as a before/after comparison.

Status key: **confirmed** = verified against the data in this repo · **open** = needs
the manual validation to quantify.

---

## A. ReliefWeb geoparsing

### A1. The matcher has no word boundaries · confirmed

`build_name_pattern` joins district names into a regex alternation and matches with
`re.findall(pattern, text, flags=re.IGNORECASE)`. There is no `\b` on either side, so a
district name matches when it appears *inside* a longer word.

| District | Reports crediting it | Spurious | Cause |
|---|---|---|---|
| Marka | 25 | 48% | matches inside "re**marka**ble" |
| Eyl | 20 | 45% | matches inside "Bander**beyl**a" |

Some embedded matches are harmless because they hit a longer form of the same place
(`Buurhakab` inside `Buurhakaba`, `Wanla Weyn` inside `Wanla Weyne`, `Afgoye` inside
`Afgoyee`). Only the two above credit the wrong district.

Fix: wrap the pattern as `\b(?:...)\b`. Re-check the benign cases afterwards, since word
boundaries will also stop `Buurhakab` matching `Buurhakaba` and those matches are
currently correct.

### A2. "Sheikh" is an alias, and it is mostly a person's name · confirmed

`Sheekh` carries the aliases `Sheik` and `Sheikh`. "Sheikh" is among the most common
honorifics and personal names in Somalia. Of the 47 reports crediting district Sheekh:

- **34 (72%)** use "Sheikh" only as part of a person's name
- **21** name President **Hassan Sheikh Mohamud**
- **0** refer to the place without also using it as a name

This explains an anomaly already recorded in the notebook, where Sheekh is listed among
the districts "seen far more than expected": *"Sheekh recorded no conflict events at all
in 2024 yet was mentioned in 11 of 12 months."* The district appears in 11 months
because the head of state is mentioned year-round, not because it received humanitarian
attention.

This is the single clearest example in the project of a geographic matcher silently
importing a personal name as a place, and it should be quoted in the write-up.

Fix: drop `Sheikh` and `Sheik` from the alias list, keeping only `Sheekh`. Word
boundaries alone do **not** fix this, since "Sheikh" is a standalone token.

### A3. Bander-Beyla is stored hyphenated and reports write it closed · confirmed

The alias list holds `Bander-Beyla`, `Bander Beila`, `Bender Bayla`, but not
`Banderbeyla`. Reports using the closed form are missed, and because of A1 the string
credits **Eyl** instead. This is very likely why `SO_BANDER_BEYLA` is recorded in
CLAUDE.md as the only district never mentioned by ReliefWeb all year: a single spelling
gap produces a false negative for one district and a false positive for another.

Fix: add `Banderbeyla` and `Bander Beyla` (unhyphenated) as aliases.

### A4. The alias list is English/Somali only, so non-English reports are under-matched · confirmed

| Language | Reports | Match rate |
|---|---|---|
| English | 1,294 | 46.4% |
| French | 29 | **27.6%** |
| all others | 13 | mixed, n too small |

The main driver is that **"Mogadiscio"**, the French name for Mogadishu, is not in the
alias list. It appears in 9 reports and the geoparser misses 4 of them completely. All
four are genuinely about the capital: the Secretary-General condemning an attack near
the airport, the Lido Beach attack, a Security Council decision on MANUSOM, and an AU
Peace and Security Council communiqué.

Scale is small (42 non-English reports, 3.1% of the corpus; 4 missed reports, 0.3%) and
concentrated on Banadir, already the best-covered district, so this almost certainly
changes no substantive finding. Its value is illustrative: the matcher inherits the
language assumptions of whoever wrote the alias list.

Fix: add `Mogadiscio`. A full multilingual alias layer is not warranted at this corpus
size and would count as scope creep.

### A5. The reference-bulletin filter is English-only · confirmed, latent

`BULLETIN_KEYWORDS` contains only `price bulletin`, `supply chain update`,
`markets update`, `market update`. Seven French **"Bulletin des Prix"** reports exist in
the corpus and none are caught by `is_bulletin`.

No damage today, because those reports match no district anyway (A4). It is a latent
precision hole: a French bulletin using a matchable spelling would pass straight
through the filter.

### A6. Region-level mentions are never counted · confirmed, by design

All 18 Admin1 region names were checked against every searchable district name and
alias. There are no exact collisions, so a report discussing "conditions across Gedo
region" credits no district at all.

This is correct behaviour for an Admin2 feature, but it is a real recall ceiling worth
stating: reporting written at regional level is invisible to the panel, and regional
framing is common in humanitarian writing.

### A7. Multi-district reports credit many districts at once · open

Spotted while testing the scorer, not yet quantified. Humanitarian bulletins, DTM
displacement reports and epidemiological bulletins each credit 12 to 19 districts in a
single report. These are the same "reference document" pattern the bulletin filter
targets, but their titles do not contain any of the four keywords.

The manual validation will quantify this directly, since it is the largest expected
source of false positives.

---

## B. The spatial framework itself

### B1. Mataban is a real district with no row in the panel · confirmed

Found by Samuel while checking the alias list. Mataban is a district of Hiiraan region
in Somali administrative practice, but:

- it is **not** in GADM 4.1's Admin2 layer, which gives Hiiraan only three units:
  Beled Weyn, Buulo Burdo, Jalalaqsi
- it is **not** an Admin2 unit in ACLED either, which uses the same three
- ACLED nonetheless records **4 events at a named location "Mataban"**, filed under
  admin2 = **Belet Weyne**
- ReliefWeb mentions it in **15 reports**

So a populated, conflict-affected, reported-on place is absorbed into a neighbouring
district and has no row of its own. This is a different and more serious class of
problem than the alias gaps above: no amount of alias work can fix it, because the
district does not exist in the framework.

This speaks directly to the main research question's wording about integrating sources
into "a common subnational framework". The choice of GADM as the spatial backbone
determines what can be observed at all, and places recognised administratively in
Somalia are silently folded into neighbours.

Not fixable without changing the boundary source, which the no-new-datasets rule
discourages. It belongs in the limitations as a documented structural gap.

### B2. Admin2 does not mean a consistent unit · confirmed

| | area km² |
|---|---|
| Banadir (smallest) | 211 |
| Marka (2nd smallest) | 932 |
| median district | 7,984 |
| Afmadow (largest) | 27,178 |

Banadir is 38× smaller than the median and 129× smaller than the largest. It is a city,
not a rural district: Somalia's capital is administratively divided into 17 districts,
which GADM's Admin2 layer collapses into a single unit. So the same nominal "Admin2
level" is a 211 km² city in one row and a 27,000 km² district in another.

Consequences already visible in the analysis: Banadir is mentioned in all 12 months,
causing the perfect separation that forced it out of the logistic regression; and all
reporting about anywhere in Mogadishu collapses onto one row.

This is the cleanest concrete example of the **granularity** dimension named in the
research question.

### B3. ACLED observes at a much finer grain than the panel keeps · confirmed

ACLED records **517 distinct named locations** across the 74 districts, with up to 46
inside a single district (Afgooye). All of that sub-district detail is discarded by the
Admin2 aggregation. Relevant to the "granularity" half of the RQ: the panel's grain is
a choice, and for conflict data it is a substantial downgrade from what the source
offers.

---

## C. Integration bugs

### C1. The ACLED name-fix list is incomplete, and events are being dropped · FIXED 2026-08-21

The panel build applies a 14-entry `acled_name_fixes` dictionary, then merges onto GADM
names. Two ACLED district names survive the fix list without matching any GADM name, so
their rows drop silently out of the merge:

| ACLED name | Should map to | Events lost | Fatalities lost |
|---|---|---|---|
| `Sablaale` | Sablale | 1 | **20** |
| `Laasqoray` | Badhan (GADM alias "Las Qoray") | 2 | 2 |

Verified downstream: `SO_SABLALE` and `SO_BADHAN` both show
`conflict_event_count = 0` for all twelve months of 2024.

Small in volume (3 events out of roughly 5,000) but two districts carry a **false zero**
for the whole year, and one of the lost events killed 20 people.

Note the irony: both names *are* correctly handled in the ReliefWeb alias map
(`Sablale: [Sablaale]`, `Badhan: [Las Qoray]`). The two name-reconciliation layers were
built separately and have drifted apart.

**Fixed.** Both entries were added to `acled_name_fixes` in the two notebook cells that
define it (the prototype cell and the full-year cell), and both now carry a guard that
fails loudly rather than dropping rows silently:

```python
unresolved = sorted(set(som["admin2"].dropna()) - set(dim_location["admin2"]))
assert not unresolved, f"ACLED districts with no GADM match: {unresolved}"
```

`fact_conflict_somalia.csv` and `vw_food_insecurity_panel.csv` were regenerated. The
change is exactly what was predicted and nothing else moved:

| | before | after |
|---|---|---|
| SO_SABLALE, events / fatalities 2024 | 0 / 0 | **1 / 20** |
| SO_BADHAN, events / fatalities 2024 | 0 / 0 | **2 / 2** |
| national events / fatalities | 3,444 / 5,610 | 3,447 / 5,632 |
| panel shape | 888 × 30 | 888 × 30 |

Cells differing across the whole panel: 2 in `conflict_event_count`, 2 in `fatalities`,
4 in `conflict_trend_log` (the lag carries each correction into the following month).

Downstream effect on the headline model is negligible, as expected from two rows:
conflict OR 2.006 → 2.012, market OR 3.201 → 3.206, pseudo R² 0.1837 → 0.1839,
in-sample AUC 0.7753 → 0.7757. No conclusion changes. Note the notebook's hardcoded
odds-ratio table still reads 3.20 for market, which rounds to 3.21 on the corrected
panel; refresh it when the notebook is next re-run.

### C2. A zero can mean at least four different things · confirmed, needs writing up

Directly serves the supervisor's request to document "what a zero means" per source.
Collected here as the concrete cases found so far:

| A zero in the panel can mean | Example |
|---|---|
| genuinely nothing happened | most district-months |
| the source cannot see here at all | market columns for the 39 districts with no monitored market |
| a name failed to match | `SO_SABLALE` conflict, C1 above |
| the place is not a row in the framework | Mataban, B1 above |
| the mention was in a language or spelling not covered | Banderbeyla, A3; Mogadiscio, A4 |

---

## Fix order, once validation is scored

1. ~~**C1 now**~~ — **done 2026-08-21**, see above.
2. **After scoring**: A1 word boundaries, A2 drop `Sheikh`, A3 add `Banderbeyla`,
   A4 add `Mogadiscio`, A5 add French bulletin keywords.
3. Rebuild `fact_reporting_somalia.csv` and the panel, then report coverage before and
   after so the effect of each fix is visible.
4. **Never fixable, document instead**: B1, B2, B3, A6.

---

## D. Raised during manual labelling (2026-08-21)

Points Samuel raised while working through the validation sample. Several are
findings in their own right rather than labelling questions.

### D1. ReliefWeb publishes in formats the geoparser structurally cannot read · confirmed

The geoparser reads `title + body` only. It does not read images.

| Format | Reports | Match rate | Median body | Empty body |
|---|---|---|---|---|
| News and Press Release | 307 | 72.6% | 3,992 | 0% |
| Situation Report | 350 | 57.4% | 1,603 | 1% |
| **Infographic** | **216** | **15.3%** | **0** | **56%** |
| **Map** | **110** | **21.8%** | **0** | **60%** |

Infographics and maps are **326 reports, 24% of the corpus**, matching at 17.5%
against 55.5% for text formats. 57% carry no body text at all: the content is in the
image. Of the image reports that do match, 42% match on the title alone.

Not fixable by alias or word-boundary work. Reading them needs OCR or a vision model,
which is out of scope. It is a clean case of the structural-availability versus
recorded-coverage distinction: a district covered mainly through infographics appears
unobserved in the panel while being well documented in reality.

**Report precision and recall separately for text formats and for the whole corpus.**
The method's real behaviour on text is very different from its behaviour overall.

### D2. Admin2 identity is contested, and the dataset inherits one authority's answer · confirmed

Samuel found districts described online as Somali districts that are absent from the
panel. What the repository itself shows:

| Source | Admin2 units |
|---|---|
| GADM 4.1 (the panel's backbone) | 74 |
| ACLED, units used in 2024 | 67 |
| WFP crosswalk (market districts) | 35 |

Confirmed real districts absent from GADM's Admin2 layer entirely: **Mataban**,
**Mahas / Maxaas**, **Mahaday**. All three are reported on, and ACLED records events at
them, filed under a neighbouring district.

**This belongs in the dissertation as a stated assumption**, roughly: *Admin2 is
defined here as GADM 4.1's ADM2 layer, 74 units. Other authorities divide Somalia
differently, so district identity is not agreed and any Admin2 dataset inherits its
geography from a choice its author has to declare.* Directly serves the "common
subnational framework" wording in the research question.

### D3. Two defensible definitions of "about a district", so measure both · decision

Labelling surfaced cases where a report carries real district-specific information with
no narrative: a flood-risk line for Bulo Burto, a vaccination rate for Balcad, a
deaths-by-district table. "Does it tell a story" is therefore the wrong test. The
working rule is **does the report assert something specific about this district**.

That still leaves routine tabulations ambiguous, so two definitions are carried:

- **A, attention**: the report says something happened or was done in the district.
  Routine tables and price bulletins excluded.
- **B, observation**: the report carries any district-specific information. Included.

Labelling is done under **B**, the inclusive definition, with the document type recorded
in the notes column. That makes A computable at scoring time by excluding those types,
so both can be reported without re-labelling. B is primary; A is the sensitivity check.

### D4. Periodic reporting does not obviously inflate coverage persistence · confirmed, weak test

Serial publications (weekly bulletins, monthly dashboards) appear regardless of
conditions, so they could inflate reporting counts independently of events. Tested with
a title-keyword proxy: 30% of the corpus looks periodic, but its match rate is 43.5%
against 47.4% for the rest, and the median district appears in 5 months either way.

Relevant to the momentum result: if serial publication drove coverage persistence, the
"reporting attention is self-perpetuating" reading would be an artefact of publication
schedules. This test says it is not, but the proxy is crude and a proper test using
source and series metadata would be better.

### D5. Further alias gaps found by hand · confirmed

Found while labelling, all absent from `FINAL_ALIAS_MAP`:

| Report spelling | District |
|---|---|
| Benadir | Banadir |
| Jariban | Jariiban |
| Merka | Marka |
| Qoriole | Qoryooley |
| Rabdhuree | Rab Dhuure |
| Beletweyn | Belet Weyne |
| Bandarbeyla | Bander-Beyla |
| Laasqoray | Badhan |
| Dollow | Doolow |
| Tijieglo | Tiyeeglow |

Manual labelling is finding alias gaps faster than the automated construction did,
which is itself worth stating: the three-stage alias expansion reached 65 of 74
districts but still misses spellings that appear in real reports.

### D6. Context extraction (NLP) as future work, not now · decision

Distinguishing "the report is about this district" from "the district is named" is a
context problem that a language model could plausibly solve. Deliberately not attempted
here, for three reasons: the contribution is documenting what the data can and cannot
see rather than building a better method; validating such an approach needs labelled
ground truth, which is exactly what this exercise is producing; and the sample is pinned
to the current method.

The right framing is that **the 150 labelled reports become a reusable benchmark**.
Reporting that simple string matching reaches a measured precision, and publishing the
evaluation set alongside it, hands the next researcher both the problem and the yardstick.

## E. Repeated-measures corrections (2026-08-22)

### E1. Pilot 1's full-year conflict result was a pseudo-replication artefact · FIXED 2026-08-22

Audited every bivariate significance test in the notebook's full-year section against
the "repeated district-months are not independent" rule (CLAUDE.md Key decisions).

`has_market_coverage` is fixed per district across all 12 months, so "Pilot 1" (does
market coverage track conflict) tested it against `conflict_event_count` and
`fatalities` on all 888 month-level rows, each district's market status counted 12
times over. Reported `conflict_event_count` as significant, p=0.0001.

Collapsed to one row per district (n=74, mean conflict per district) instead: p=0.188,
not significant. `fatalities` moves from p=0.114 to p=0.978, also not significant. The
naive month-level result was entirely an artefact of the repetition; at the correct
grain the full year agrees with the two-month prototype (Task 9), which also found no
relationship. Both readings are now in the notebook side by side, with the naive one
explicitly labelled as such, following the same before/after pattern used for the
logistic regression's in-sample vs out-of-sample framing.

Verified by extracting the relevant cells into a standalone notebook and re-executing
via `jupyter nbconvert --execute`; the printed output matches the numbers quoted in the
surrounding markdown exactly.

### E2. Month-level correlations involving time-varying features are mostly, not entirely, robust · confirmed

Pilot 2 (conflict vs reports, r=0.366, n=888) and the climate checks against reporting
coverage use variables that genuinely change month to month, so pooling all 888 rows is
a weaker violation than E1: it is not literal duplication, just non-independence within
a district's 12 months (a district's reporting attention in January is not unrelated to
its attention in February). Checked with a district-cluster bootstrap (3,000 resamples,
whole districts resampled with replacement, not individual district-months) rather than
a full district-level redo, since these correlations are the headline evidence for
Sub-Question 2 and a bootstrap keeps the full n while still respecting the clustering.

Results: conflict vs reports (r=0.367, cluster CI [0.213, 0.501]), rainfall vs reports
(r=0.090, CI [0.015, 0.167]) and VHI vs conflict (r=-0.133, CI [-0.255, -0.013]) all
survive, CIs nowhere near zero. **VHI vs reports does not**: pooled r=-0.113, but the
cluster-robust CI is [-0.237, 0.003], crossing zero (p~0.057). The pooled month-level
test called this "detectable" only by treating 888 non-independent rows as independent;
under clustering it is inconclusive. This does not overturn the substantive reading
that climate carries far less signal than conflict, since the effect was already
described as small, but the specific r=-0.11 figure should not be quoted as confirmed.

The two-month prototype cells (Task 9 era, cells testing `conflict_density`, area, and
similar) were left unchanged: CLAUDE.md and the notebook's own cell 27 already disclaim
them as illustrative-only, not part of current findings, so they carry no risk of being
mistakenly cited as evidence.

## F. Strengthening the conflict-vs-climate reporting result (2026-08-22)

### F1. The extreme-conflict group is dominated by a handful of chronically affected districts · confirmed

While adding robustness checks to the "extreme conflict vs extreme climate stress"
reporting-attention comparison (Next steps item 4), checked how many distinct districts
each group actually draws on, since the district-independence audit (section E) had
already shown this kind of test can be fooled by repetition.

The 68 district-months of extreme conflict come from only 18 distinct districts;
Baydhaba, Marka and Afgooye alone supply 11, 10 and 9 of them respectively. The 67
district-months of extreme climate stress are much more spread out, 41 distinct
districts. Re-run at the district level (one row per district, its own mean reports
across its extreme months), the result survives but weakens substantially: p=0.0067
versus the naive p=0.000064, and a district-cluster bootstrap of the original row-level
statistic gives a 95% CI of [0.57, 7.54] on the mean difference, excluding zero but far
wider than the naive test implied. The conclusion (conflict attracts more reporting
attention than climate stress, even at comparably extreme positions in each
distribution) survives; the apparent strength of the naive p-value does not, for the
same reason as the Pilot 1 finding in section E.

### F2. Reporting rises continuously with conflict intensity; the same is not true for climate stress · confirmed

Quintile-binned mean reports show a close to monotonic rise across conflict quintiles
(1.40 to 5.66 reports) and no comparable pattern across VHI quintiles (a somewhat
elevated 4.01 in the worst-stress quintile, then flat around 2.0-2.4 for the rest).
Some of that elevation in the worst-VHI quintile is plausibly conflict riding along with
it (VHI and conflict correlate weakly, r=-0.133), which is exactly why the threshold
test excludes district-months extreme on both axes at once.

### F3. Climate stress is not reported late, it is reported less throughout · confirmed

Tested whether the conflict/climate reporting gap narrows over the three months
following an extreme month, as it would if slow-onset stress simply attracted delayed
rather than absent attention. It does not: the gap stays at 3.9-4.5 reports at lags 1
and 2 (versus 3.98 at lag 0), and cumulative reporting over the following three months
keeps the same roughly 2.5x ratio (17.47 vs 6.82 reports, p=0.0001) as the same-month
comparison. Lag 2 and lag 3 have shrinking samples (the extreme climate-stress group
thins out towards year-end, since fewer full months remain to look forward from) and
should be read cautiously, but the pattern across lags 0-2 is consistent.

### F4. Food/nutrition-specific reporting shows the same bias, weaker · confirmed

Restricting to `food_nutrition_report_count`, unused in any analysis until now, the
conflict-favouring gap persists (3.21 vs 2.09 reports) but is weaker than the all-reports
version (p=0.016 vs p=0.0001). Food and nutrition reporting is somewhat less
conflict-biased than reporting overall, but still favours conflict over climate stress,
which is the more directly relevant reading for a food-insecurity dataset than the
all-reports figure used originally.

## G. Found while building the source-level table (2026-08-23)

### G1. `commodities_tracked_count` and the PEWI-based market features understate real price coverage · confirmed

Found while writing the source-level table (Next steps item 7), checking precisely what
"recorded coverage" means for market. `commodities_tracked_count`, `market_anomaly_mean`,
`market_anomaly_max` and `market_stress_count` are all built from the 4 `{c}_pewi_score`
columns (non-null count/mean/max/threshold). Three districts with real, complete price
data all year, `SO_RAB_DHUURE`, `SO_TALEEX`, `SO_XUDUN`, never once have a `_pewi_score`
for any commodity in any month: `wheatflour_price_usd` is populated in all 12 months for
each, but WFP itself never computed a Pewi value for these markets (0 of 48 basket rows
each have a non-null `Pewi` in the raw export, confirmed directly against the source
file, not just the panel). The likely explanation is that WFP's ALPS/Pewi calculation
needs enough historical price observations at that specific market to fit a seasonal
trend and residual standard deviation (see the PEWI definition above), and these three
markets may not have enough history yet, but the raw export gives no explicit reason
column to confirm that from the data alone.

The practical effect: every summary feature that reads through `commodities_tracked_count`
undercounts real market activity for these three districts, reading 0 across all 12
months when real prices exist. This changes the "recorded coverage" figure depending on
which definition is used: 43.1% of district-months (383/888) by the PEWI-based
definition already used throughout the notebook (Measuring source complementarity,
Sub-Question 3) versus **47.2%** (419/888) by a price-based definition
(`any of the four {c}_price_usd columns non-null`). At the district level the gap is
larger in relative terms: 32/74 districts ever show a tracked commodity by the PEWI
definition, versus **35/74**, exactly the structural availability figure, by the
price-based one. In other words: every district with a monitored market did in fact
report real prices at some point in the year; it is only the PEWI/anomaly layer that
misses three of them entirely.

**Not yet acted on.** The Sub-Question 3 source-complementarity numbers (Next steps item
5, done 2026-08-23) used the PEWI-based `market_observed` definition throughout, so they
are very slightly conservative about market's true reach: SO_RAB_DHUURE, SO_TALEEX and
SO_XUDUN might no longer count among the 41 districts reporting reaches that market
never touches, since they do have real price data even though they have no PEWI score.
Whether to revisit those numbers with a price-based definition, or leave them as
documented and flag this as a known refinement, is a decision for Samuel; not changed
here without asking.

### F5. "Conflict-heavy" is an ACLED label, not a description of what the reports are about · flagged, not yet integrated

Raised by Samuel after manually reading reports and noticing many are about health,
vegetation, pregnancy and other non-conflict topics, not conflict itself: is it still
fair to call a district "conflict-heavy" when the reports counted for it cover such a
mix of subjects?

Worth stating precisely, since the two things are easy to conflate. "Conflict-heavy"
(and `conflict_event_count`) comes entirely from ACLED, an independent incident-tracking
dataset; it has no dependency on ReliefWeb content at all. Separately,
`reports_mentioning_district_count` is topic-blind: it counts any report whose text
mentions the district by name, regardless of subject. So a district's report count is
never "reports about its conflict", it is "reports of any kind that happen to name it".

Checked whether this makes the F1-F4 conflict-vs-climate finding circular (conflict
happens -> conflict-topic reports get written -> those reports name conflict districts
-> of course conflict districts have higher counts). Pulled ReliefWeb's own theme tags
for reports naming the 18 extreme-conflict-only districts versus the 41
extreme-climate-only districts (from the F1 groups). The topic mix is close to
identical between the two groups (Protection and Human Rights 64.2% vs 74.0%, Health
60.8% vs 61.6%, WASH 57.7% vs 66.2%, Food and Nutrition 50.7% vs 60.0%, Agriculture
30.6% vs 36.6%), and the one genuinely conflict-specific tag, Peacekeeping, is rare in
both (5.9% vs 2.7%). This weighs against the circularity worry: conflict districts are
not simply accumulating conflict-topic reports, they are accumulating more reports
across the same broad mix of humanitarian topics as everywhere else, consistent with
conflict-affected areas carrying more general humanitarian operational presence rather
than just more conflict-specific coverage. Not yet written into the notebook or
CLAUDE.md; Samuel asked to come back to it later.
