import pytest
from services.optimizer import optimize_assignments, _competency_score, _skill_overlap_score
from schemas.request_models import TrainerInput, SubjectInput


# ── helpers ────────────────────────────────────────────────────────────────

def make_trainer(**kwargs):
    defaults = dict(
        id="t1", name="Trainer One",
        skills=["python", "ml"],
        experience_years=5.0,
        certifications=2,
        performance_rating=4.0,
        available=True,
    )
    defaults.update(kwargs)
    return TrainerInput(**defaults)


def make_subject(**kwargs):
    defaults = dict(
        subject_id="s1", subject_name="Machine Learning",
        required_skills=["python", "ml"],
        minimum_experience=2.0,
        priority=3,
    )
    defaults.update(kwargs)
    return SubjectInput(**defaults)


# ── unit tests ──────────────────────────────────────────────────────────────

class TestSkillOverlap:
    def test_full_overlap(self):
        assert _skill_overlap_score(["python", "ml"], ["python", "ml"]) == 1.0

    def test_partial_overlap(self):
        score = _skill_overlap_score(["python"], ["python", "ml"])
        assert score == 0.5

    def test_no_overlap(self):
        assert _skill_overlap_score(["java"], ["python", "ml"]) == 0.0

    def test_empty_required(self):
        assert _skill_overlap_score(["python"], []) == 1.0

    def test_case_insensitive(self):
        assert _skill_overlap_score(["Python", "ML"], ["python", "ml"]) == 1.0


class TestCompetencyScore:
    def test_score_range(self):
        t = make_trainer(skills=["python", "ml"], experience_years=10,
                         certifications=3, performance_rating=4.5)
        s = make_subject(required_skills=["python", "ml"], minimum_experience=2)
        score = _competency_score(t, s)
        assert 0.0 <= score <= 100.0

    def test_perfect_trainer(self):
        t = make_trainer(skills=["python", "ml"], experience_years=20,
                         certifications=5, performance_rating=5.0)
        s = make_subject(required_skills=["python", "ml"])
        assert _competency_score(t, s) == 100.0

    def test_zero_trainer(self):
        t = make_trainer(skills=[], experience_years=0,
                         certifications=0, performance_rating=0.0)
        s = make_subject(required_skills=["python"])
        assert _competency_score(t, s) == 0.0


class TestOptimizeAssignments:
    def test_single_assignment(self):
        trainers = [make_trainer()]
        subjects = [make_subject()]
        result = optimize_assignments(trainers, subjects)
        assert result.valid is True
        assert len(result.assignments) == 1
        assert len(result.unassigned_subjects) == 0
        assert result.assignments[0].subject_id == "s1"
        assert result.assignments[0].assigned_trainer_id == "t1"

    def test_unassigned_when_no_trainer(self):
        trainers = []
        subjects = [make_subject()]
        result = optimize_assignments(trainers, subjects)
        assert result.valid is False
        assert len(result.assignments) == 0
        assert len(result.unassigned_subjects) == 1

    def test_unavailable_trainer_excluded(self):
        trainers = [make_trainer(available=False)]
        subjects = [make_subject()]
        result = optimize_assignments(trainers, subjects)
        assert result.valid is False
        assert len(result.unassigned_subjects) == 1

    def test_minimum_experience_filter(self):
        trainers = [make_trainer(experience_years=1.0)]
        subjects = [make_subject(minimum_experience=5.0)]
        result = optimize_assignments(trainers, subjects)
        assert result.valid is False
        assert "experience" in result.unassigned_subjects[0].reason.lower()

    def test_priority_ordering(self):
        t1 = make_trainer(id="t1", name="T1", experience_years=10, performance_rating=4.5)
        t2 = make_trainer(id="t2", name="T2", experience_years=3, performance_rating=3.0)
        s_high = make_subject(subject_id="s_high", subject_name="High Priority", priority=5)
        s_low = make_subject(subject_id="s_low", subject_name="Low Priority", priority=1)
        result = optimize_assignments([t1, t2], [s_high, s_low])
        assert result.valid is True
        assert len(result.assignments) == 2
        # High priority subject should be assigned t1 (better trainer)
        high_assignment = next(a for a in result.assignments if a.subject_id == "s_high")
        assert high_assignment.assigned_trainer_id == "t1"

    def test_each_trainer_assigned_once(self):
        trainer = make_trainer()
        subjects = [
            make_subject(subject_id="s1", subject_name="Subject 1"),
            make_subject(subject_id="s2", subject_name="Subject 2"),
        ]
        result = optimize_assignments([trainer], subjects)
        assigned_ids = [a.assigned_trainer_id for a in result.assignments]
        assert len(assigned_ids) == len(set(assigned_ids))  # no duplicates
