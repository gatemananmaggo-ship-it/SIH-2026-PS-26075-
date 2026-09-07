import os
from typing import Optional

from fastapi import FastAPI, Header, HTTPException

from schemas.request_models import AssignmentRequest
from services.optimizer import optimize_assignment


app = FastAPI(
    title="Capacity Connect ML Service",
    description=(
        "Private competency-based trainer recommendation and "
        "trainer-subject assignment optimization service for CAPACITY CONNECT."
    ),
    version="1.1.0",
)


ML_SERVICE_API_KEY = os.getenv("ML_SERVICE_API_KEY", "").strip()


def _authorize(x_ml_service_key: Optional[str]) -> None:
    """Require the internal API key when configured/used in production."""
    if not ML_SERVICE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="ML service authentication is not configured.",
        )

    if x_ml_service_key != ML_SERVICE_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized ML service request.")


@app.get("/")
def root():
    return {
        "service": "Capacity Connect ML Service",
        "status": "running",
        "version": app.version,
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/v1/optimize-assignment")
def optimize(
    request: AssignmentRequest,
    x_ml_service_key: Optional[str] = Header(default=None, alias="X-ML-Service-Key"),
):
    _authorize(x_ml_service_key)

    try:
        return optimize_assignment(request.trainers, request.subjects)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception:
        # Do not leak internal exception details to callers.
        raise HTTPException(status_code=500, detail="Optimization failed.")


# Backward-compatible route for local/integration code that used the original path.
@app.post("/optimize-assignment", include_in_schema=False)
def optimize_legacy(
    request: AssignmentRequest,
    x_ml_service_key: Optional[str] = Header(default=None, alias="X-ML-Service-Key"),
):
    return optimize(request, x_ml_service_key)
