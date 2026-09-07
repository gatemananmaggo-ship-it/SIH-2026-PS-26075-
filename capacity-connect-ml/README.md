# Capacity Connect ML Service

Internal FastAPI trainer-assignment optimizer for the CAPACITY CONNECT platform.

## ⚠️ Important

This service is **private** — it must NEVER be exposed to the public internet directly.
It runs locally on port `8000` and is proxied exclusively through the Express backend.

---

## Setup

```bash
cd capacity-connect-ml
cp .env.example .env           # Fill in ML_SERVICE_KEY
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

## Run (development)

```bash
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

## Run (production)

```bash
uvicorn app:app --host 127.0.0.1 --port 8000 --workers 2
```

## Run tests

```bash
pytest tests/ -v
```

## API

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/health` | None |
| POST | `/api/v1/optimize-assignment` | `X-ML-Service-Key` header |

### Request body (`POST /api/v1/optimize-assignment`)

```json
{
  "trainers": [
    {
      "id": "string",
      "name": "string",
      "skills": ["python", "ml"],
      "experience_years": 5,
      "certifications": 2,
      "performance_rating": 4.2,
      "available": true
    }
  ],
  "subjects": [
    {
      "subject_id": "string",
      "subject_name": "string",
      "required_skills": ["python"],
      "minimum_experience": 2,
      "priority": 3
    }
  ]
}
```
