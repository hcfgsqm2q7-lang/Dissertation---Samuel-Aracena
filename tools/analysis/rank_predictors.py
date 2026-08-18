import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd, geopandas as gpd
import statsmodels.formula.api as smf

REPO = "/home/user/Dissertation---Samuel-Aracena"
p = pd.read_csv(f"{REPO}/data/processed/vw_food_insecurity_panel.csv", dtype={"time_id": str})
p["mentioned"] = (p.reports_mentioning_district_count > 0).astype(int)
p["log_conflict"] = np.log1p(p.conflict_event_count)
p["market"] = p.has_market_coverage.astype(int)
p = p.sort_values(["location_id", "time_id"]).reset_index(drop=True)
p["prev_mentioned"] = p.groupby("location_id")["mentioned"].shift(1)

gdf = gpd.read_file(f"{REPO}/data/raw/gadm41_SOM.gpkg", layer="ADM_ADM_2")
dim = pd.read_csv(f"{REPO}/data/processed/dim_location_somalia_full74.csv")
gdf = gdf.merge(dim[["location_id","gadm_gid_2"]], left_on="GID_2", right_on="gadm_gid_2")[["location_id","geometry"]]
touch = gpd.sjoin(gdf, gdf, predicate="touches", how="inner")[["location_id_left","location_id_right"]]
nbrs = touch.groupby("location_id_left")["location_id_right"].apply(list).to_dict()
cov = p.set_index(["location_id","time_id"])["mentioned"].to_dict()
def nbr_rate(row):
    ns = nbrs.get(row.location_id, [])
    vals = [cov.get((n, row.time_id)) for n in ns]
    vals = [v for v in vals if v is not None]
    return np.mean(vals) if vals else np.nan
p["nbr_coverage"] = p.apply(nbr_rate, axis=1)

m = p[p.admin1 != "Banaadir"].dropna(subset=["prev_mentioned","nbr_coverage"]).copy()

FORMULA = ("mentioned ~ log_conflict + market + rainfall_mean_mm "
           "+ vegetation_health_index_mean + prev_mentioned + nbr_coverage "
           "+ C(admin1) + C(time_id)")
f = smf.logit(FORMULA, data=m).fit(disp=False, maxiter=200, cov_type="cluster",
                                    cov_kwds={"groups": m.location_id})

rows = []
for v, label in [
    ("log_conflict", "Conflict events (logged)"),
    ("market", "Has market price data"),
    ("rainfall_mean_mm", "Mean rainfall (mm)"),
    ("vegetation_health_index_mean", "Vegetation health index"),
    ("prev_mentioned", "Covered last month (momentum)"),
    ("nbr_coverage", "Neighbouring districts covered"),
]:
    orr = np.exp(f.params[v])
    lo, hi = np.exp(f.conf_int().loc[v])
    rows.append((label, orr, lo, hi, f.pvalues[v]))

rows.sort(key=lambda r: -abs(np.log(r[1])))
print(f"{'predictor':34s} {'OR':>7s} {'95% CI':>18s} {'p-value':>9s}")
for label, orr, lo, hi, pv in rows:
    print(f"{label:34s} {orr:7.3f} [{lo:6.3f}, {hi:6.3f}] {pv:9.4f}")

print(f"\nPseudo R2: {f.prsquared:.3f}  n={len(m)}")
