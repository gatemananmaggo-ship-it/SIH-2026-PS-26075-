import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from schemas.request_models import OptimizationRequest, OptimizationResponse
from services.optimizer import optimize_assignments

ML_SERVICE_KEY = os.getenv("ML_SERVICE_KEY", "change_me_in_production")

app = FastAPI(
    title="Capacity Connect ML Optimizer",
    description="Internal trainer-assignment optimization service for CAPACITY CONNECT admin.",
    version="1.0.0",
    docs_url=None,   # Disable Swagger UI in production
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # Express backend only
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


def verify_api_key(x_ml_service_key: str = Header(...)):
    if x_ml_service_key != ML_SERVICE_KEY:
        raise HTTPException(status_code=401, detail="Invalid ML service key")
    return x_ml_service_key


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "capacity-connect-ml"}


@app.post(
    "/api/v1/optimize-assignment",
    response_model=OptimizationResponse,
    dependencies=[Depends(verify_api_key)],
)
def optimize_assignment(payload: OptimizationRequest):
    if not payload.trainers:
        raise HTTPException(status_code=400, detail="trainers list must not be empty")
    if not payload.subjects:
        raise HTTPException(status_code=400, detail="subjects list must not be empty")

    result = optimize_assignments(payload.trainers, payload.subjects)
    return result
