"""The final ReliefWeb geoparsing method, as a single importable definition.

This is the method described in the notebook's Task 7 write-up: dateline stripping,
reference-bulletin exclusion, and the merged alias dictionary built from the WFP
crosswalk, the ACLED crosswalk, GADM's VARNAME_2 field and manual research.

It is factored out here so that the validation in this directory measures exactly the
method the pipeline uses, and so the alias decisions live in one reproducible file
rather than being duplicated across notebook cells.

Keep this in sync with the notebook. If the alias map or the filters change, the
validation has to be re-run.
"""

import re

import pandas as pd

# ---------------------------------------------------------------------------
# Final merged alias dictionary. Covers 65 of 74 districts.
#
# Sources, in the order they were applied:
#   1. the WFP <-> GADM crosswalk already built for market data
#   2. the ACLED crosswalk (14 GADM-vs-common spelling differences)
#   3. GADM's own VARNAME_2 field, previously unused
#   4. manual research on the 9 districts still without an alias, which found real
#      variants for 2 (Afmadow, Hobyo) and confirmed a single spelling for the other 7
#
# Self-referential entries (a district listed as its own alias, a quirk in GADM's
# data) were removed in a final cleanup pass.
# ---------------------------------------------------------------------------
FINAL_ALIAS_MAP = {
    "Aadan": ["Adan Yabaal", "Adan Yabal", "Aden Yabal"],
    "Afgooye": ["Afgoi", "Afgoye"],
    "Afmadow": ["Af-madow", "Afamadow", "Afmaadu", "Afmadoow", "Afmadou", "Afmadu"],
    "Baar-Dheere": ["Baardheere", "Bardera", "Bardhere"],
    "Badhaadhe": ["Badhadhe"], "Badhan": ["Las Qoray"], "Balcad": ["Balad", "Ballcad"],
    "Banadir": ["Mogadishu"], "Bander-Beyla": ["Bander Beila", "Bender Bayla"],
    "Baraawe": ["Braawe"], "Baydhaba": ["Baidoa"],
    "Belet Weyne": ["Beledweyne", "Beletweyne"],
    "Belet Xaawo": ["Beledhawa", "Belet Hawa", "Belethawa", "Beletxawa", "Bula-hawa"],
    "Borama": ["Boramo"], "Bossaso": ["Bosaso"], "Bu'aale": ["Buale"],
    "Bulo Burto": ["Bula-Brif", "Bulo-Burte", "Buuloburd"], "Burco": ["Burao"],
    "Buuhoodle": ["Buhodle", "Buuhodle"],
    "Buur Xakaba": ["Bur Hacaba", "Burhakaba", "Buur Hakaba", "Buurhakab"],
    "Cabudwaaq": ["Abudwak", "Abudwaq"], "Cadaado": ["Adado"],
    "Cadale": ["Adale", "Caadale"], "Calawla": ["Alula", "Caluula"],
    "Caynabo": ["Ainabo", "Aynabo", "Caynaba"], "Ceel Barde": ["El Barde"],
    "Ceel Buur": ["Ceelbur", "El Bur"], "Ceel Dheer": ["Ceeldeer", "El Dere"],
    "Ceel Waaq": ["Ceelwaaq", "El Wak", "El Waq"],
    "Ceel-Afwein": ["Ceel Afwayn", "Ceel Afweyn", "Ceelafyeyn", "El Afwe"],
    "Ceerigaabo": ["Ceerigabo", "Erigabo", "Erigavo"],
    "Dhuusamareeb": ["Dhusa-Mareb", "Dhuusamarreeb"], "Diinsoor": ["Dinsor"],
    "Gaalkacyo": ["Galcaio", "Galkacyo", "Galkayo"], "Gabiley": ["Gebiley"],
    "Garbahaaray": ["Garbahaarey", "Garbahaarreey", "Garbaharey"],
    "Garoowe": ["Garowe"], "Goldogob": ["Galdogob"], "Hargeysa": ["Hargeisa"],
    "Hobyo": ["Obbia"], "Iskushuban": ["Iskhushuban"], "Jamaame": ["Jamame"],
    "Jariiban": ["Jarban", "Jeriban"], "Kismaayo": ["Kismayo"],
    "Kuntuwaaray": ["Kurtun Warrey", "Kurtunwaarey"],
    "Laas Caanood": ["Laascaanood", "Las Anod", "Lasanod"], "Lughaya": ["Lughaye"],
    "Luuq": ["Lugh"], "Marka": ["Mark Afgooye"],
    "Oodweyne": ["Odweine", "Odwenyen", "Oodwayne", "Owdweyne"],
    "Qandala": ["Kandala"], "Qansax Dheere": ["Qansadhere"], "Qardho": ["Gardo"],
    "Qoryooley": ["Qoryoley", "Qoryoyley"], "Saakow": ["Sakow"], "Sablale": ["Sablaale"],
    "Sheekh": ["Sheik", "Sheikh"], "Taleex": ["Taleh", "Telex"],
    "Tiyeeglow": ["Tayeeglow", "Tiyeglow"], "Wajid": ["Waajid"],
    "Wanla Weyn": ["Wanlaweyne", "Wanle Weyne"],
    "Xarardheere": ["Haradhere", "Harardheere"], "Xudun": ["Hudun"], "Xudur": ["Hudur"],
    "Zeylac": ["Saylac"],
}

# A leading dateline such as "Mogadishu - The United Nations..." names a place that the
# report is filed from, not necessarily one it is about. Stripped before matching.
DATELINE_RE = re.compile(r"^\*{0,2}[A-Z][a-zA-Z]+\*{0,2}\s*[-–—]\s*")

# Reference bulletins list many districts as price-comparison points rather than
# because anything happened there. Excluded by title, since a district-count threshold
# could not separate them (the Livestock Price Bulletin names 4 districts, exactly as
# many as a genuine UNHCR operational update).
BULLETIN_KEYWORDS = ["price bulletin", "supply chain update", "markets update", "market update"]


def strip_dateline(body):
    return DATELINE_RE.sub("", str(body), count=1)


def is_bulletin(title):
    return any(k in str(title).lower() for k in BULLETIN_KEYWORDS)


def build_name_pattern(dim_location):
    """Regex alternation over every district name and documented alias."""
    all_names = []
    for _, loc in dim_location.iterrows():
        all_names.extend([loc["admin2"]] + FINAL_ALIAS_MAP.get(loc["admin2"], []))
    return "|".join(re.escape(n) for n in all_names)


def name_to_location_id(dim_location):
    """Lowercased district name or alias -> location_id."""
    lookup = {}
    for _, loc in dim_location.iterrows():
        for name in [loc["admin2"]] + FINAL_ALIAS_MAP.get(loc["admin2"], []):
            lookup[name.lower()] = loc["location_id"]
    return lookup


def get_matches(row, pattern):
    """Raw surface forms matched in a report, after the precision filters."""
    if is_bulletin(row["title"]):
        return []
    text = str(row["title"]) + " " + strip_dateline(row["body"])
    return re.findall(pattern, text, flags=re.IGNORECASE)


def geoparse(reports, dim_location):
    """Add `matches`, `matched_location_ids` and `is_matched` to a reports frame."""
    pattern = build_name_pattern(dim_location)
    lookup = name_to_location_id(dim_location)

    out = reports.copy()
    out["matches"] = out.apply(lambda r: get_matches(r, pattern), axis=1)
    out["matched_location_ids"] = out["matches"].apply(
        lambda ms: sorted({lookup[m.lower()] for m in ms if m.lower() in lookup})
    )
    out["is_matched"] = out["matched_location_ids"].apply(len) > 0
    return out


def load_somalia_reports(repo="."):
    """The full-year Somalia ReliefWeb corpus, as the pipeline reads it."""
    rw = pd.read_csv(f"{repo}/data/raw/reliefweb_horn_of_africa_2024.csv")
    return rw[rw["primary_country"] == "Somalia"].copy()
