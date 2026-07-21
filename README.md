> **Important:** GitHub is **not** a cloud drive (like Google Drive or OneDrive). Do not dump unstructured files into the root directory.

### Required Directory Structure

Your repository **must** follow this layout:

```
.
├── src/                    <-- Source code (inputs/logic)
├── data/
│   ├── raw/                <-- Read-only original input data
│   └── processed/          <-- Cleansed, transformed data outputs
├── models/                 <-- Trained model weights & serialized objects (.pt, .pkl)
├── results/                <-- Primary scientific outputs
│   ├── figures/            <-- Plots, charts, visualizations (.png, .pdf)
│   ├── tables/             <-- Summary metrics, CSVs, LaTeX tables (.csv, .tex)
│   └── logs/               <-- Execution logs, TensorBoard runs
├── weekly_meetings/        <-- Meeting logs (.md) and weekly slide decks (.pdf)
│   ├── YYYY_MM_DD_log.md
│   ├── YYYY_MM_DD_slides.pdf
│   └── ...
├── docs/                   <-- Reports, papers, literature review, etc.
├── .gitignore
└── requirements.txt       (or environment.yml)
```

### Core Workflow Rules

1. **Commit Regularly (Minimum Weekly):** Do not upload your work in a single bulk push at the end of the term. Push incremental commits whenever you write or modify code.
2. **Organise Meeting Materials:** Save your weekly notes as Markdown files (`YYYY_MM_DD_notes.md`) and place presentation slides (`.pdf` only, no `.pptx`) directly inside `weekly_meetings/`.
3. **Pull Updates Before You Work:** Always run `git pull` before starting a work session to ensure you have the latest updates, feedback, or template changes from the remote repository.
4. **Use Clear Commit Messages:** Write brief, descriptive commit messages explaining *what* changed (e.g., `feat: add preprocessing pipeline`, not `updates`).


### Official GitHub Standard Guides

- **[GitHub Flow Guide](https://docs.github.com/en/get-started/using-github/github-flow):** GitHub's official, step-by-step workflow for branching, making commits, opening pull requests, and merging code. This is the industry-standard workflow they should follow for their assignments.
- **[GitHub Best Practices for Repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories):** The official guide covering repository structure, security, `.gitignore` usage, and branch protection.
- **[GitHub Community Code of Conduct](https://docs.github.com/en/site-policy/github-terms/github-community-code-of-conduct):** GitHub’s official expectations for respectful communication in issues, code reviews, and discussions.

