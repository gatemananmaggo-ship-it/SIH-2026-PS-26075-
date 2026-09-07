from typing import List

from pydantic import BaseModel, Field, field_validator


class Trainer(BaseModel):
    id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    skills: List[str] = Field(default_factory=list)
    experience_years: float = Field(default=0, ge=0)
    certifications: int = Field(default=0, ge=0)
    performance_rating: float = Field(default=0, ge=0, le=5)
    available: bool = True

    @field_validator("skills")
    @classmethod
    def clean_skills(cls, value: List[str]) -> List[str]:
        return [skill.strip() for skill in value if skill and skill.strip()]


class Subject(BaseModel):
    id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    required_skills: List[str] = Field(default_factory=list)

    @field_validator("required_skills")
    @classmethod
    def clean_required_skills(cls, value: List[str]) -> List[str]:
        return [skill.strip() for skill in value if skill and skill.strip()]


class AssignmentRequest(BaseModel):
    trainers: List[Trainer] = Field(min_length=1)
    subjects: List[Subject] = Field(min_length=1)

    @field_validator("trainers")
    @classmethod
    def unique_trainer_ids(cls, value: List[Trainer]) -> List[Trainer]:
        ids = [trainer.id for trainer in value]
        if len(ids) != len(set(ids)):
            raise ValueError("Trainer IDs must be unique.")
        return value

    @field_validator("subjects")
    @classmethod
    def unique_subject_ids(cls, value: List[Subject]) -> List[Subject]:
        ids = [subject.id for subject in value]
        if len(ids) != len(set(ids)):
            raise ValueError("Subject IDs must be unique.")
        return value
