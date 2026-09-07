from typing import List
from schemas.request_models import (
    TrainerInput,
    SubjectInput,
    AssignmentResult,
    UnassignedSubject,
    OptimizationResponse,
)


def _skill_overlap_score(trainer_skills: List[str], required_skills: List[str]) -> float:
    """Returns fraction of required skills the trainer covers (0.0 – 1.0)."""
    if not required_skills:
        return 1.0
    trainer_set = {s.lower() for s in trainer_skills}
    required_set = {s.lower() for s in required_skills}
    overlap = trainer_set & required_set
    return len(overlap) / len(required_set)


def _competency_score(trainer: TrainerInput, subject: SubjectInput) -> float:
    """
    Weighted composite score (0 – 100):
      - Skill overlap:         40 %
      - Experience:            25 %  (capped at 20 years → 100 %)
      - Performance rating:    25 %  (out of 5.0)
      - Certifications bonus:  10 %  (capped at 5 certs → 100 %)
    """
    skill_score = _skill_overlap_score(trainer.skills, subject.required_skills) * 40.0
    exp_score = min(trainer.experience_years / 20.0, 1.0) * 25.0
    perf_score = (trainer.performance_rating / 5.0) * 25.0
    cert_score = min(trainer.certifications / 5.0, 1.0) * 10.0
    return round(skill_score + exp_score + perf_score + cert_score, 2)


def optimize_assignments(
    trainers: List[TrainerInput],
    subjects: List[SubjectInput],
) -> OptimizationResponse:
    """
    Greedy trainer-assignment optimizer.
    Subjects are sorted by priority (desc) then processed one-by-one.
    Each available trainer that meets minimum_experience is scored;
    the highest-scoring trainer is assigned and removed from the pool.
    """
    available_trainers = [t for t in trainers if t.available]
    assigned_trainer_ids = set()
    assignments: List[AssignmentResult] = []
    unassigned: List[UnassignedSubject] = []

    # Sort subjects: higher priority first
    sorted_subjects = sorted(subjects, key=lambda s: s.priority, reverse=True)

    for subject in sorted_subjects:
        candidates = [
            t for t in available_trainers
            if t.id not in assigned_trainer_ids
            and t.experience_years >= subject.minimum_experience
        ]

        if not candidates:
            unassigned.append(
                UnassignedSubject(
                    subject_id=subject.subject_id,
                    subject_name=subject.subject_name,
                    reason=(
                        "No available trainer meets the minimum experience requirement"
                        if any(
                            t.id not in assigned_trainer_ids
                            and t.experience_years < subject.minimum_experience
                            for t in available_trainers
                        )
                        else "No available trainers remaining"
                    ),
                )
            )
            continue

        # Score all candidates
        scored = [
            (t, _competency_score(t, subject)) for t in candidates
        ]
        scored.sort(key=lambda x: x[1], reverse=True)
        best_trainer, best_score = scored[0]

        assigned_trainer_ids.add(best_trainer.id)
        skill_overlap = _skill_overlap_score(best_trainer.skills, subject.required_skills)

        justification = (
            f"Assigned {best_trainer.name} with competency score {best_score}/100. "
            f"Skill coverage: {round(skill_overlap * 100)}%, "
            f"Experience: {best_trainer.experience_years} yrs, "
            f"Performance rating: {best_trainer.performance_rating}/5.0, "
            f"Certifications: {best_trainer.certifications}."
        )

        assignments.append(
            AssignmentResult(
                subject_id=subject.subject_id,
                subject_name=subject.subject_name,
                assigned_trainer_id=best_trainer.id,
                assigned_trainer_name=best_trainer.name,
                competency_score=best_score,
                justification=justification,
            )
        )

    valid = len(unassigned) == 0
    summary = (
        f"{len(assignments)} subject(s) assigned, {len(unassigned)} unassigned."
    )

    return OptimizationResponse(
        valid=valid,
        assignments=assignments,
        unassigned_subjects=unassigned,
        summary=summary,
    )
