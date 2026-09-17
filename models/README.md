# models/

This directory is intentionally empty of model artefacts.

The analysis uses statistical models (negative binomial regression, logistic
regression, district fixed effects) fitted in-process with `statsmodels` and
`scikit-learn`. They are estimated inside the notebook each time it runs and are
not serialised to disk, so there are no weights or pickled objects to store here.

Every model is defined and fitted in `src/Dissertation_master_file_integrated.ipynb`:

| Model | Where |
|---|---|
| Negative binomial, conflict vs vegetation stress | Section 11.2 |
| Same model, food and nutrition reports only | Section 11.3 |
| District fixed effects, plus BFGS and Poisson/PPML cross-checks | Section 13.1 |
| Logistic regression for reporting coverage, with grouped cross-validation | Section 10.4 |
| Full logistic diagnostics (Appendix D of the dissertation) | Section 10.5 |

Fitted results are reported in the notebook's saved outputs and in
`results/tables/`.
