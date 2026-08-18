import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, patsy, geopandas as gpd
import statsmodels.formula.api as smf
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold
from sklearn.metrics import roc_auc_score

REPO = "/home/user/Dissertation---Samuel-Aracena"
p = pd.read_csv(f"{REPO}/data/processed/vw_food_insecurity_panel.csv", dtype={"time_id": str})
p["mentioned"] = (p.reports_mentioning_district_count > 0).astype(int)
p["log_conflict"] = np.log1p(p.conflict_event_count)
p["market"] = p.has_market_coverage.astype(int)
p = p.sort_values(["location_id", "time_id"]).reset_index(drop=True)

# ---------- candidate 1: momentum. was the district covered last month? ----------
p["prev_mentioned"] = p.groupby("location_id")["mentioned"].shift(1)

# ---------- candidate 2: severity distinct from frequency ----------
p["log_fatalities"] = np.log1p(p.fatalities)

# ---------- candidate 3: spatial spread of conflict inside the district ----------
# ACLED carries coordinates, so count distinct event locations, not just events.
acled = pd.read_csv(f"{REPO}/data/raw/ACLED_Somalia_full_2024.csv")
fixes = {"Adan Yabaal":"Aadan","Baardheere":"Baar-Dheere","Buur Hakaba":"Buur Xakaba","Caluula":"Calawla",
         "Ceel Afweyn":"Ceel-Afwein","Dhuusamarreeb":"Dhuusamareeb","Galdogob":"Goldogob","Garbahaarey":"Garbahaaray",
         "Gebiley":"Gabiley","Kurtunwaarey":"Kuntuwaaray","Lughaye":"Lughaya","Owdweyne":"Oodweyne",
         "Tayeeglow":"Tiyeeglow","Waajid":"Wajid"}
som = acled[acled.country == "Somalia"].copy()
som["admin2"] = som.admin2.replace(fixes)
som["time_id"] = pd.to_datetime(som.event_date).dt.strftime("%Y%m")
spread = (som.groupby(["admin2","time_id"])
            .agg(n_locations=("location","nunique"), n_event_types=("event_type","nunique"))
            .reset_index())
p = p.merge(spread, on=["admin2","time_id"], how="left")
p[["n_locations","n_event_types"]] = p[["n_locations","n_event_types"]].fillna(0)

# ---------- candidate 4: spillover. were neighbouring districts covered this month? ----------
gdf = gpd.read_file(f"{REPO}/data/raw/gadm41_SOM.gpkg", layer="ADM_ADM_2")
dim = pd.read_csv(f"{REPO}/data/processed/dim_location_somalia_full74.csv")
gdf = gdf.merge(dim[["location_id","gadm_gid_2"]], left_on="GID_2", right_on="gadm_gid_2")[["location_id","geometry"]]
touch = gpd.sjoin(gdf, gdf, predicate="touches", how="inner")[["location_id_left","location_id_right"]]
nbrs = touch.groupby("location_id_left")["location_id_right"].apply(list).to_dict()
print(f"Adjacency built: {len(nbrs)} districts have neighbours, "
      f"median {int(np.median([len(v) for v in nbrs.values()]))} each")

cov = p.set_index(["location_id","time_id"])["mentioned"].to_dict()
def nbr_rate(row):
    ns = nbrs.get(row.location_id, [])
    vals = [cov.get((n, row.time_id)) for n in ns]
    vals = [v for v in vals if v is not None]
    return np.mean(vals) if vals else np.nan
p["nbr_coverage"] = p.apply(nbr_rate, axis=1)

# ---------- candidate 5: is the district its region's administrative seat? ----------
p["is_capital_like"] = (p.admin2.str.lower().str[:4] == p.admin1.str.lower().str[:4]).astype(int)

m = p[p.admin1 != "Banaadir"].dropna(subset=["prev_mentioned","nbr_coverage"]).copy()
print(f"Rows usable after lag: {len(m)}\n")

BASE = "mentioned ~ log_conflict + market + C(time_id)"

def cv(formula, label):
    y, X = patsy.dmatrices(formula, data=m, return_type="dataframe"); y = np.asarray(y).ravel()
    s = []
    for tr, te in GroupKFold(n_splits=5).split(X, y, groups=m.location_id.values):
        clf = LogisticRegression(max_iter=5000).fit(X.iloc[tr], y[tr])
        s.append(roc_auc_score(y[te], clf.predict_proba(X.iloc[te])[:,1]))
    print(f"  {label:52s} AUC {np.mean(s):.3f}")
    return np.mean(s)

print("=== Does each candidate add anything beyond conflict + market + month? ===")
b = cv(BASE, "baseline: conflict + market + month")
for extra, label in [
    ("prev_mentioned", "+ covered last month (momentum)"),
    ("log_fatalities", "+ fatalities (severity, not just frequency)"),
    ("n_locations", "+ number of distinct conflict locations"),
    ("n_event_types", "+ variety of conflict event types"),
    ("nbr_coverage", "+ whether neighbouring districts were covered"),
    ("is_capital_like", "+ district is its region's seat"),
]:
    cv(f"{BASE} + {extra}", label)

cv(BASE + " + prev_mentioned + nbr_coverage", "+ momentum AND neighbours together")

print("\n=== Effect sizes for the two most promising ===")
f = smf.logit(BASE + " + prev_mentioned + nbr_coverage", data=m).fit(disp=False, maxiter=200,
        cov_type="cluster", cov_kwds={"groups": m.location_id})
for v in ["log_conflict","market","prev_mentioned","nbr_coverage"]:
    lo, hi = np.exp(f.conf_int().loc[v])
    print(f"  {v:18s} OR {np.exp(f.params[v]):6.3f}  [{lo:.3f}, {hi:.3f}]  p={f.pvalues[v]:.4f}")
