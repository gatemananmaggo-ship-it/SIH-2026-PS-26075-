import pytest

from schemas.request_models import Subject, Trainer
from services.competency import calculate_skill_match
from services.optimizer import optimize_assignment


def trainer(
    trainer_id="T1",
    name="Trainer 1",
    skills=None,
    experience_years=5,
    certifications=2,
    performance_rating=4,
    available=True,
):
    return Trainer(
        id=trainer_id,
        name=name,
        skills=skills or [],
        experience_years=experience_years,
        certifications=certifications,
        performance_rating=performance_rating,
        available=available,
    )


def subject(subject_id="S1", name="Subject 1", required_skills=None):
    return Subject(
        id=subject_id,
        name=name,
        required_skills=required_skills or [],
    )


def test_skill_match_is_case_and_whitespace_insensitive():
    assert calculate_skill_match([" Python ", "Machine Learning"], ["python"]) == 100.0


def test_empty_required_skills_are_full_skill_match():
    assert calculate_skill_match([], []) == 100.0


def test_unavailable_trainers_are_not_assigned():
    result = optimize_assignment(
        [trainer(available=False), trainer(trainer_id="T2", name="Trainer 2")],
        [subject()],
    )
    assert result["valid"] is True
    assert result["assignments"][0]["trainer_id"] == "T2"


def test_all_unavailable_returns_clear_failure():
    result = optimize_assignment(
        [trainer(available=False)],
        [subject()],
    )
    assert result["valid"] is False
    assert result["assignments"] == []
    assert result["unassigned_subjects"][0]["subject_id"] == "S1"


def test_excess_subjects_are_reported_as_unassigned():
    result = optimize_assignment(
        [trainer()],
        [subject("S1"), subject("S2")],
    )
    assert len(result["assignments"]) == 1
    assert len(result["unassigned_subjects"]) == 1
    assert result["valid"] is False


def test_duplicate_ids_are_rejected():
    with pytest.raises(ValueError):
        optimize_assignment(
            [trainer("T1"), trainer("T1", name="Duplicate")],
            [subject()],
        )
