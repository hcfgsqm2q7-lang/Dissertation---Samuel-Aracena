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
