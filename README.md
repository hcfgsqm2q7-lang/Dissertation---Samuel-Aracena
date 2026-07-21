> **Important:** GitHub is **not** a cloud drive (like Google Drive or OneDrive). Do not dump unstructured files into the root directory.

### Required Directory Structure

Your repository **must** follow this layout:

```
.
├── code/              <-- Source scripts (.py, .R), notebooks (.ipynb), execution code
├── data/              <-- Project datasets
│   ├── raw/           <-- Read-only original datasets (never modify directly)
│   └── processed/     <-- Cleaned, transformed, or intermediate outputs
├── weekly-meetings/   <-- Meeting logs (.md) and weekly slide decks (.pdf)
├── docs/              <-- Final reports, manuscript drafts, and paper figures
├── .gitignore         <-- Ignores virtual envs, local config, large binaries
└── README.md          <-- Main project overview
```

### Core Workflow Rules

1. **Commit Regularly (Minimum Weekly):** Do not upload your work in a single bulk push at the end of the term. Push incremental commits whenever you write or modify code.
2. **Organise Meeting Materials:** Save your weekly notes as Markdown files (`YYYY_MM_DD_notes.md`) and place presentation slides (`.pdf` only, no `.pptx`) directly inside `weekly_meetings/`.
3. **Pull Updates Before You Work:** Always run `git pull` before starting a work session to ensure you have the latest updates, feedback, or template changes from the remote repository.
4. **Use Clear Commit Messages:** Write brief, descriptive commit messages explaining *what* changed (e.g., `feat: add preprocessing pipeline`, not `updates`).
