import numpy as np, pandas as pd, patsy, warnings
import statsmodels.formula.api as smf
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold
from sklearn.metrics import (roc_auc_score, confusion_matrix, accuracy_score,
                             precision_score, recall_score, f1_score, brier_score_loss)
warnings.filterwarnings("ignore")

REPO = "/home/user/Dissertation---Samuel-Aracena"
p = pd.read_csv(f"{REPO}/data/processed/vw_food_insecurity_panel.csv", dtype={"time_id": str})
p["mentioned"] = (p.reports_mentioning_district_count > 0).astype(int)
p["log_conflict"] = np.log1p(p.conflict_event_count)
p["market"] = p.has_market_coverage.astype(int)
m = p[p.admin1 != "Banaadir"].copy()

FULL = ("mentioned ~ log_conflict + market + rainfall_mean_mm "
        "+ vegetation_health_index_mean + C(admin1) + C(time_id)")
PARS = "mentioned ~ log_conflict + market + C(time_id)"

def block(name, formula):
    fit = smf.logit(formula, data=m).fit(disp=False, maxiter=200)
    pr = fit.predict(m); yh = (pr > .5).astype(int); y = m.mentioned.values
    tn, fp, fn, tp = confusion_matrix(y, yh).ravel()

    # out-of-sample, whole districts held out
    yy, X = patsy.dmatrices(formula, data=m, return_type="dataframe"); yy = np.asarray(yy).ravel()
    oof = np.zeros(len(m))
    aucs = []
    for tr, te in GroupKFold(n_splits=5).split(X, yy, groups=m.location_id.values):
        clf = LogisticRegression(max_iter=5000).fit(X.iloc[tr], yy[tr])
        pp = clf.predict_proba(X.iloc[te])[:, 1]
        oof[te] = pp
        aucs.append(roc_auc_score(yy[te], pp))
    oyh = (oof > .5).astype(int)
    otn, ofp, ofn, otp = confusion_matrix(y, oyh).ravel()

    print(f"\n{'='*74}\n{name}\n{'='*74}")
    print(f"  {'':26s} {'in-sample':>12s} {'out-of-sample':>14s}")
    print(f"  {'AUC':26s} {roc_auc_score(y,pr):12.3f} {np.mean(aucs):14.3f}")
    print(f"  {'Accuracy':26s} {accuracy_score(y,yh):12.3f} {accuracy_score(y,oyh):14.3f}")
    print(f"  {'Precision (of predicted yes)':26s} {precision_score(y,yh):12.3f} {precision_score(y,oyh):14.3f}")
    print(f"  {'Recall / sensitivity':26s} {recall_score(y,yh):12.3f} {recall_score(y,oyh):14.3f}")
    print(f"  {'Specificity':26s} {tn/(tn+fp):12.3f} {otn/(otn+ofp):14.3f}")
    print(f"  {'F1':26s} {f1_score(y,yh):12.3f} {f1_score(y,oyh):14.3f}")
    print(f"  {'Brier score (lower=better)':26s} {brier_score_loss(y,pr):12.3f} {brier_score_loss(y,oof):14.3f}")
    print(f"  {'McFadden pseudo R2':26s} {fit.prsquared:12.3f} {'':>14s}")
    print(f"\n  Confusion matrix (out-of-sample), rows = truth")
    print(f"                    predicted no   predicted yes")
    print(f"    actually no  {otn:12d} {ofp:15d}")
    print(f"    actually yes {ofn:12d} {otp:15d}")
    print(f"  per-fold AUC: {', '.join(f'{a:.3f}' for a in aucs)}")
    return np.mean(aucs)

base = m.mentioned.mean()
print(f"Baselines: always-guess-'mentioned' accuracy = {max(base,1-base):.3f};  random AUC = 0.500")
print(f"Outcome rate: {base:.3f} ({m.mentioned.sum()} of {len(m)})")

block("FULL MODEL  (conflict + market + climate + region + month)", FULL)
block("PARSIMONIOUS MODEL  (conflict + market + month)", PARS)
