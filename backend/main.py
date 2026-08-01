from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from stats_engine import two_proportion_z_test, confidence_interval, cohens_h, sample_size_required
from database import init_db, save_experiment, get_all_experiments, delete_experiment

app = FastAPI(title="ExperimentIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the database (creates the table if it doesn't exist yet)
init_db()


@app.get("/")
def root():
    return {"status": "ExperimentIQ backend is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


class AnalyzeRequest(BaseModel):
    n_a: int
    c_a: int
    n_b: int
    c_b: int
    alpha: float = 0.05
    tails: int = 2
    mde: float = 0.02


@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    try:
        z_result = two_proportion_z_test(data.n_a, data.c_a, data.n_b, data.c_b, data.tails)
        ci_result = confidence_interval(data.n_a, data.c_a, data.n_b, data.c_b, confidence=1 - data.alpha if (1 - data.alpha) in [0.90, 0.95, 0.99] else 0.95)
        h = cohens_h(z_result["rate_a"], z_result["rate_b"])

        uplift = (z_result["rate_b"] - z_result["rate_a"]) / z_result["rate_a"] if z_result["rate_a"] > 0 else 0

        statistically_significant = z_result["p_value"] < data.alpha
        practically_significant = abs(uplift) >= data.mde

        if statistically_significant and practically_significant and z_result["rate_b"] > z_result["rate_a"]:
            verdict = "Ship B"
        elif statistically_significant and practically_significant and z_result["rate_b"] < z_result["rate_a"]:
            verdict = "Don't ship B"
        elif statistically_significant and not practically_significant:
            verdict = "Effect too small"
        elif not statistically_significant and practically_significant:
            verdict = "Collect more data"
        else:
            verdict = "No signal"

        return {
            "rate_a": z_result["rate_a"],
            "rate_b": z_result["rate_b"],
            "uplift": uplift,
            "p_value": z_result["p_value"],
            "z_score": z_result["z_score"],
            "confidence_interval": ci_result,
            "effect_size_cohens_h": h,
            "statistically_significant": statistically_significant,
            "practically_significant": practically_significant,
            "verdict": verdict,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


class SampleSizeRequest(BaseModel):
    baseline_rate: float
    mde: float
    alpha: float = 0.05
    power: float = 0.8


@app.post("/sample-size")
def sample_size(data: SampleSizeRequest):
    try:
        n = sample_size_required(data.baseline_rate, data.mde, data.alpha, data.power)
        return {"required_sample_size_per_group": n}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------- Experiment tracker endpoints ----------

class SaveExperimentRequest(BaseModel):
    name: str
    n_a: int
    c_a: int
    n_b: int
    c_b: int
    alpha: float
    tails: int
    mde: float
    rate_a: float
    rate_b: float
    uplift: float
    p_value: float
    verdict: str


@app.post("/experiment")
def create_experiment(data: SaveExperimentRequest):
    try:
        experiment_id = save_experiment(data.dict())
        return {"id": experiment_id, "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/experiments")
def list_experiments():
    try:
        experiments = get_all_experiments()
        return {"experiments": experiments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/experiment/{experiment_id}")
def remove_experiment(experiment_id: int):
    deleted = delete_experiment(experiment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return {"status": "deleted", "id": experiment_id}