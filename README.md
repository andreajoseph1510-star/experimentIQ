# ExperimentIQ

A full-stack A/B testing and causal inference framework for designing, running, and analyzing experiments with statistical rigor.

🔗 **Live demo:** [experiment-iq.vercel.app](https://experiment-iq.vercel.app)

---

## What it does

ExperimentIQ lets you make data-driven decisions about product changes by:

- **Analyzing A/B test results** — enter visitor and conversion counts for a control and treatment group, and get a full statistical breakdown: p-value, confidence intervals, effect size (Cohen's h), relative uplift, and a clear verdict (Ship B / Don't ship B / Collect more data / Effect too small)
- **Checking both statistical and practical significance** — a result can be statistically real but too small to matter. ExperimentIQ checks both, combining a configurable significance level (α) with a minimum detectable effect (MDE) threshold
- **Planning experiments before they run** — the sample size calculator tells you exactly how many visitors you need per group to reliably detect your target effect, given your baseline rate, MDE, significance level, and desired statistical power
- **Tracking experiment history** — save named experiments with their full results, browse past decisions, and delete old entries

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Backend | FastAPI (Python) |
| Database | SQLite |
| Stats engine | Custom Python (no stats packages) |
| Frontend hosting | Vercel |
| Backend hosting | Render |
| Version control | GitHub |

---

## Statistical methods

The stats engine is implemented from scratch using Python's `math` library — no scipy, statsmodels, or other statistics packages.

- **Two-proportion z-test** — tests whether the difference in conversion rates between two groups is statistically significant
- **P-value calculation** — uses a normal CDF approximation (Abramowitz & Stegun method)
- **95% Confidence interval** — for the absolute difference in conversion rates (B − A)
- **Cohen's h** — effect size measure for comparing two proportions
- **Sample size formula** — based on the standard power analysis formula using pooled proportions

---

## Running locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in the `frontend` folder
---

## Key design decisions

**Why a custom stats engine?** Using scipy would have been one import. Writing the math from scratch demonstrates understanding of the underlying statistics — what interviewers actually care about.

**Why SQLite?** This is a portfolio project, not a production system with thousands of concurrent users. SQLite is dependency-free, requires zero configuration, and is more than sufficient for this use case.

**Why FastAPI over Flask?** Automatic OpenAPI docs (`/docs`), Pydantic request validation, and async support out of the box — with no extra configuration.

---

Built by Andrea Maria Joseph (https://github.com/andreajoseph1510-star) 
