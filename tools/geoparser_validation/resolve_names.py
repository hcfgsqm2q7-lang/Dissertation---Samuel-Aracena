"""Resolve a hand-typed place name to one of the 74 canonical Admin2 districts.

Labelling is done while reading reports, so the natural thing is to type the name the
report uses ("Baidoa", "Mogadishu", "Beletweyn") rather than the panel's canonical name
("Baydhaba", "Banadir", "Belet Weyne"). Requiring the canonical spelling by hand would
be slow and error-prone, so this resolver does the translation instead.

Resolution order, most to least certain:

  1. canonical district name                        Baydhaba      -> Baydhaba
  2. documented alias from the geoparser            Baidoa        -> Baydhaba
  3. GADM's own NAME_2                              Mogadisho     -> Banadir
  4. a district of Mogadishu                        Kahda         -> Banadir
  5. a named place ACLED files under a district     Ceelasha Biyaha -> Afgooye

Anything left over is classified rather than silently dropped:

  REGION   an Admin1 region, not a district. A report written at regional level has no
           Admin2 to record, so these must not be mapped to a district.
  UNKNOWN  not recognised at all. Reported back for a human decision.

The distinction matters for scoring: a region name in the truth column is not a missed
district, it is a report the framework genuinely cannot place.
"""

import difflib
import re
import unicodedata

import pandas as pd

from geoparser import FINAL_ALIAS_MAP

# Near-miss spellings are matched by similarity as a last resort. The cutoff is high
# enough that only obvious variants pass, and every such match is reported so it can be
# checked by eye rather than trusted blindly. Each one is also an alias the geoparser is
# missing, so the list of fuzzy hits is a finding in its own right.
FUZZY_CUTOFF = 0.86

# Below the auto-accept bar but close enough to be worth a human glance.
SUGGEST_CUTOFF = 0.70

# Districts of Mogadishu. GADM collapses the whole city into the single Admin2 unit
# "Banadir", so every one of these resolves there. See docs/data_quality_findings.md B2.
MOGADISHU_DISTRICTS = [
    "abdiaziz", "boondheere", "bondhere", "daynile", "dayniile", "deynile", "dharkenley",
    "dharkenleey", "hamar jajab", "hamar weyne", "hawl wadaag", "heliwaa", "hodan",
    "howl wadag", "huriwaa", "kaxda", "kahda", "karan", "shangaani", "shibis", "waberi",
    "waaberi", "wadajir", "wardhiigleey", "yaaqshiid", "yaqshid",
]

# Alternative and older Admin1 region names that appear in reports but are not in GADM's
# 18. Listed so they are recognised as regions rather than reported as unknown.
EXTRA_REGION_NAMES = [
    "ayn", "gardafuu", "karkaar", "hiran", "hiiraan", "galgadud", "galgaduud",
    "middle shabelle", "middle shebelle", "lower shabelle", "lower shebelle",
    "middle juba", "lower juba", "banadir", "banaadir", "somaliland", "puntland",
    "jubaland", "hirshabelle", "south west state", "galmudug",
]


def _norm(s):
    """Lowercase, strip accents, drop parenthetical asides and punctuation."""
    s = str(s)
    s = re.sub(r"\([^)]*\)", " ", s)          # "Xudun (Sool)" -> "Xudun"
    s = re.sub(r"\[[^\]]*\]", " ", s)
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.replace("'", "").replace("’", "")
    s = re.sub(r"[^a-zA-Z0-9\s-]", " ", s)
    s = re.sub(r"[-\s]+", " ", s)
    return s.strip().lower()


class Resolver:
    def __init__(self, repo="."):
        dim = pd.read_csv(f"{repo}/data/processed/dim_location_somalia_full74.csv")
        self.dim = dim
        self.canonical = {r.admin2: r.location_id for r in dim.itertuples()}

        self.lookup = {}
        for r in dim.itertuples():
            self.lookup[_norm(r.admin2)] = r.admin2
            if pd.notna(r.admin2_gadm_name):
                self.lookup.setdefault(_norm(r.admin2_gadm_name), r.admin2)
        for canon, aliases in FINAL_ALIAS_MAP.items():
            for a in aliases:
                self.lookup.setdefault(_norm(a), canon)
        for d in MOGADISHU_DISTRICTS:
            self.lookup.setdefault(_norm(d), "Banadir")

        # Banadir region contains exactly one district, so the region name is an
        # unambiguous way of referring to it. Both spellings resolve to the district.
        self.lookup.setdefault(_norm("Banaadir"), "Banadir")

        self.regions = {_norm(x) for x in dim["admin1"].unique()}
        self.regions |= {_norm(x) for x in EXTRA_REGION_NAMES}
        # a name that is both a region and a district resolves as the district
        self.regions -= set(self.lookup)

        self.gazetteer = self._acled_gazetteer(repo)
        self._fuzzy_keys = list(self.lookup) + list(self.gazetteer)

    def _acled_gazetteer(self, repo):
        """ACLED's `location` column, mapped to the district ACLED files it under."""
        try:
            ac = pd.read_csv(f"{repo}/data/raw/ACLED_Somalia_full_2024.csv")
        except Exception:
            return {}
        som = ac[ac.country == "Somalia"].dropna(subset=["location", "admin2"]).copy()
        fixes = {
            "Adan Yabaal": "Aadan", "Baardheere": "Baar-Dheere", "Buur Hakaba": "Buur Xakaba",
            "Caluula": "Calawla", "Ceel Afweyn": "Ceel-Afwein", "Dhuusamarreeb": "Dhuusamareeb",
            "Galdogob": "Goldogob", "Garbahaarey": "Garbahaaray", "Gebiley": "Gabiley",
            "Kurtunwaarey": "Kuntuwaaray", "Lughaye": "Lughaya", "Owdweyne": "Oodweyne",
            "Tayeeglow": "Tiyeeglow", "Waajid": "Wajid", "Sablaale": "Sablale",
            "Laasqoray": "Badhan",
        }
        som["d"] = som.admin2.replace(fixes)
        som = som[som.d.isin(self.canonical)]
        counts = som.groupby("location")["d"].nunique()
        out = {}
        for loc in counts[counts == 1].index:
            key = _norm(loc)
            if key not in self.lookup:
                out[key] = som.loc[som.location == loc, "d"].iloc[0]
        return out

    def _direct(self, key):
        if key in self.lookup:
            return self.lookup[key]
        if key in self.gazetteer:
            return self.gazetteer[key]
        return None

    def resolve(self, raw):
        """-> (canonical district | None, status)  status in ok/fuzzy/region/unknown."""
        key = _norm(raw)
        if not key:
            return None, "empty"

        hit = self._direct(key)
        if hit:
            return hit, "ok"

        # "Bay (Baydhaba/Baidoa)" and similar: the bare name is a region but the
        # parenthetical names the district actually meant. Prefer the district.
        for inner in re.findall(r"\(([^)]*)\)", str(raw)):
            for piece in re.split(r"[/,]", inner):
                hit = self._direct(_norm(piece))
                if hit:
                    return hit, "ok"

        if key in self.regions:
            return None, "region"

        close = difflib.get_close_matches(key, self._fuzzy_keys, n=1, cutoff=FUZZY_CUTOFF)
        if close:
            return self._direct(close[0]), "fuzzy"

        # Weaker similarity is not accepted automatically, because these labels are the
        # ground truth the geoparser is measured against and a wrong auto-assignment
        # would corrupt it. Reported as a suggestion for a human to confirm instead.
        near = difflib.get_close_matches(key, self._fuzzy_keys, n=1, cutoff=SUGGEST_CUTOFF)
        if near:
            return self._direct(near[0]), "suggest"

        return None, "unknown"

    def parse_cell(self, cell):
        """Split a label cell and resolve every entry.

        Accepts semicolons, commas and newlines as separators, since all three turn up
        in hand-typed cells.
        """
        if cell is None or (isinstance(cell, float) and pd.isna(cell)):
            return set(), [], [], [], []
        text = str(cell).strip()
        if not text or _norm(text) == "none":
            return set(), [], [], [], []
        parts = [p for p in re.split(r"[;,\n]+", text) if p.strip()]
        ids, regions, unknown, fuzzy, suggest = set(), [], [], [], []
        for p in parts:
            name, status = self.resolve(p)
            if status == "ok":
                ids.add(self.canonical[name])
            elif status == "fuzzy":
                ids.add(self.canonical[name])
                fuzzy.append((p.strip(), name))
            elif status == "suggest":
                suggest.append((p.strip(), name))
            elif status == "region":
                regions.append(p.strip())
            elif status == "unknown":
                unknown.append(p.strip())
        return ids, regions, unknown, fuzzy, suggest
