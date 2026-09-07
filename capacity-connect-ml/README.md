# CAPACITY CONNECT ML Service

Private FastAPI microservice for explainable trainer competency scoring and trainer-subject assignment optimization.

## Role in CAPACITY CONNECT

The React frontend must **not** call this service directly.

The Node/Express backend remains the system of record and is responsible for:

- authentication and authorization
- loading real trainer/competency data from MongoDB
- mapping CAPACITY CONNECT domain data to this service's request contract
- calling the ML service with the internal API key
- validating the returned recommendation
- persisting accepted assignments/sessions through the existing backend rules

Recommended deployment on AWS EC2:

```text
Netlify React Frontend
        |
        | HTTPS + credentials
        v
Node/Express Backend :5000
        |
        | internal HTTP + X-ML-Service-Key
        v
FastAPI ML Service :8000 (private / localhost only)
```

MongoDB Atlas remains behind the Node backend. The ML service does not connect directly to MongoDB.

## API

### Health

`GET /health`

Returns:

```json
{"status":"healthy"}
```

### Optimize assignment

`POST /api/v1/optimize-assignment`

Header:

```text
X-ML-Service-Key: <same value as ML_SERVICE_API_KEY>
```

Request:

```json
{
  "trainers": [
    {
      "id": "trainer-id",
      "name": "Trainer A",
      "skills": ["Python", "Machine Learning"],
      "experience_years": 5,
      "certifications": 3,
      "performance_rating": 4.5,
      "available": true
    }
  ],
  "subjects": [
    {
      "id": "subject-id",
      "name": "Machine Learning",
      "required_skills": ["Python", "Machine Learning"]
    }
  ]
}
```

Response contains:

- `assignments`: recommended one-to-one trainer-subject pairs
- `unassigned_subjects`: subjects that could not be assigned
- `competency_score`: explainable 0-100 competency score
- `valid`: true only when every subject has an assignment
- `reason`: safe human-readable failure/partial-result reason
- summary counts

The optimizer assigns only **available** trainers. It uses one-to-one assignment for a single optimization batch; this service does not decide whether a trainer may teach multiple sessions over time.

## Environment

```env
ML_SERVICE_API_KEY=replace-with-a-long-random-secret
```

Do not commit real secrets.

## Local run

```bash
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# Linux/macOS
# source .venv/bin/activate

pip install -r requirements.txt
set ML_SERVICE_API_KEY=local-dev-secret
uvicorn app:app --host 127.0.0.1 --port 8000
```

## Tests

```bash
pytest -q
```

## Notes

This component is an explainable optimization engine based on weighted competency scoring plus `scipy.optimize.linear_sum_assignment`. It is not a trained predictive ML model.
