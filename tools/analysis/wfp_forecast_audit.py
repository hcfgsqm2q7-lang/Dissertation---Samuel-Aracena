"""
WFP observed-versus-forecast audit for Somalia 2024, the four basket commodities
(wheat flour, rice, sugar, oil) used in fact_market_somalia / vw_food_insecurity_panel.

Requested by supervisor feedback on 2026-08-21 and again on 2026-08-27: a month-by-month
table distinguishing observed ("Aggregated" in WFP's own Data Type field), forecast
(model-generated), and missing (no record at all) price cells, before trusting any
full-year market analysis.

Universe: the 35 districts WFP monitors at all for these commodities x 4 commodities
x 12 months of 2024 = 1,680 possible district-commodity-month cells. The other 39
districts have no WFP market whatsoever and are a separate, already-documented gap
(has_market_coverage), not part of this audit.
"""
import pandas as pd

WFP_FILE = "data/raw/Prices-Export-Mon Aug 10 2026 19_27_50 GMT+0100 (British Summer Time).csv"
COMMODITY_SHORT = {
    "Wheat flour (imported)": "wheatflour",
    "Rice (imported)": "rice",
    "Sugar (white)": "sugar",
    "Oil (vegetable, imported)": "oil",
}
TIME_IDS = [f"2024{m:02d}" for m in range(1, 13)]
MONTH_NAMES = pd.date_range("2024-01-01", periods=12, freq="MS").strftime("%B")

df = pd.read_csv(WFP_FILE)
df["Price Date"] = pd.to_datetime(df["Price Date"], format="%d/%m/%Y")

som = df[(df["Country"] == "Somalia") & (df["Commodity"].isin(COMMODITY_SHORT))].copy()
som["time_id"] = som["Price Date"].dt.strftime("%Y%m")
som = som[som["time_id"].isin(TIME_IDS)]

# The 35 districts WFP monitors for these 4 commodities at all, at any point in 2024.
market_districts = sorted(som["Admin 2"].unique())
assert len(market_districts) == 35

# Full grid of every possible (district, commodity, month) cell in that market universe.
grid = pd.MultiIndex.from_product(
    [market_districts, COMMODITY_SHORT.keys(), TIME_IDS],
    names=["Admin 2", "Commodity", "time_id"],
).to_frame(index=False)

status = som[["Admin 2", "Commodity", "time_id", "Data Type"]].drop_duplicates(
    subset=["Admin 2", "Commodity", "time_id"], keep="first"
)
# A handful of cells have both an Aggregated and a Forecast row for the same
# district-commodity-month; Aggregated always wins if present.
has_agg = som[som["Data Type"] == "Aggregated"][["Admin 2", "Commodity", "time_id"]].drop_duplicates()
has_agg["status"] = "Observed"
has_fc = som[som["Data Type"] == "Forecast"][["Admin 2", "Commodity", "time_id"]].drop_duplicates()
has_fc["status"] = "Forecast"

merged = grid.merge(has_agg, on=["Admin 2", "Commodity", "time_id"], how="left")
merged = merged.merge(has_fc, on=["Admin 2", "Commodity", "time_id"], how="left", suffixes=("", "_fc"))
merged["status"] = merged["status"].fillna(merged["status_fc"])
merged["status"] = merged["status"].fillna("Missing")
merged = merged.drop(columns=["status_fc"])

n_cells = len(merged)
print(f"Universe: {len(market_districts)} market districts x 4 commodities x 12 months = {n_cells} cells")
print()

overall = merged["status"].value_counts()
print("=== Overall, whole year ===")
for s in ["Observed", "Forecast", "Missing"]:
    n = overall.get(s, 0)
    print(f"{s:10s} {n:5d}  ({n/n_cells*100:.1f}%)")

print()
print("=== Month-by-month table ===")
monthly = merged.groupby("time_id")["status"].value_counts().unstack(fill_value=0)
for s in ["Observed", "Forecast", "Missing"]:
    if s not in monthly.columns:
        monthly[s] = 0
monthly = monthly[["Observed", "Forecast", "Missing"]]
monthly["total"] = monthly.sum(axis=1)
monthly.index = MONTH_NAMES
print(monthly.to_string())

monthly_pct = monthly[["Observed", "Forecast", "Missing"]].div(monthly["total"], axis=0) * 100
print()
print("=== Month-by-month, % ===")
print(monthly_pct.round(1).to_string())

monthly.to_csv("data/processed/wfp_observed_forecast_audit.csv")
print("\nSaved: data/processed/wfp_observed_forecast_audit.csv")

# Which specific cells are Forecast, i.e. would have been silently dropped/hidden as
# "missing" by the pipeline's Data Type == "Aggregated" filter, rather than surfaced
print()
print("=== Where does Forecast status occur? ===")
fc_only = merged[merged["status"] == "Forecast"]
print(f"Forecast cells: {len(fc_only)}")
if len(fc_only):
    print(fc_only.groupby("time_id").size())
    print(fc_only["Admin 2"].value_counts())
