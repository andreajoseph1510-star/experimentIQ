from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ExperimentIQ API")

# CORS setup — allows your React frontend to call this backend
# We'll update the origins list later when we deploy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # temporary — we'll restrict this before final deployment
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