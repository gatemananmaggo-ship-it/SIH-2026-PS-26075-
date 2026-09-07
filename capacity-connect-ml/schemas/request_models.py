from typing import List, Optional
from pydantic import BaseModel, Field


class TrainerInput(BaseModel):
    id: str
    name: str
    skills: List[str] = []
    experience_years: float = Field(0.0, ge=0)
    certifications: int = Field(0, ge=0)
    performance_rating: float = Field(0.0, ge=0.0, le=5.0)
    available: bool = True


class SubjectInput(BaseModel):
    subject_id: str
    subject_name: str
    required_skills: List[str] = []
    minimum_experience: float = Field(0.0, ge=0)
    priority: int = Field(1, ge=1, le=5)


class AssignmentResult(BaseModel):
    subject_id: str
    subject_name: str
    assigned_trainer_id: str
    assigned_trainer_name: str
    competency_score: float = Field(..., ge=0.0, le=100.0)
    justification: str


class UnassignedSubject(BaseModel):
    subject_id: str
    subject_name: str
    reason: str


class OptimizationRequest(BaseModel):
    trainers: List[TrainerInput]
    subjects: List[SubjectInput]


class OptimizationResponse(BaseModel):
    valid: bool
    assignments: List[AssignmentResult]
    unassigned_subjects: List[UnassignedSubject]
    summary: Optional[str] = None
