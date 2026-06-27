from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from stats_engine import two_proportion_z_test, confidence_interval, cohens_h, sample_size_required

app = FastAPI(title="ExperimentIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # we'll restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ExperimentIQ backend is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


# Request body schema for the /analyze endpoint
class AnalyzeRequest(BaseModel):
    n_a: int
    c_a: int
    n_b: int
    c_b: int
    alpha: float = 0.05
    tails: int = 2
    mde: float = 0.02  # minimum detectable effect, as a decimal (0.02 = 2%)


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
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))