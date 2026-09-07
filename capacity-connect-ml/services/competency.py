from typing import List

from schemas.request_models import Subject, Trainer


def normalize_skill(skill: str) -> str:
    """Normalize skill text for case/whitespace-insensitive matching."""
    return " ".join(skill.strip().lower().split())


def calculate_skill_match(
    trainer_skills: List[str],
    required_skills: List[str],
) -> float:
    """Return skill match percentage in the range 0-100."""
    trainer_set = {
        normalize_skill(skill) for skill in trainer_skills if normalize_skill(skill)
    }
    required_set = {
        normalize_skill(skill) for skill in required_skills if normalize_skill(skill)
    }

    # No required skills means there is no skill-match penalty/reward.
    # Treat it as a full skill match so the score can be determined by the
    # remaining competency dimensions.
    if not required_set:
        return 100.0

    matched_skills = trainer_set.intersection(required_set)
    return (len(matched_skills) / len(required_set)) * 100


def calculate_experience_score(
    experience_years: float,
    maximum_years: float = 10.0,
) -> float:
    if maximum_years <= 0:
        return 0.0
    return min((experience_years / maximum_years) * 100, 100.0)


def calculate_certification_score(
    certifications: int,
    maximum_certifications: int = 5,
) -> float:
    if maximum_certifications <= 0:
        return 0.0
    return min((certifications / maximum_certifications) * 100, 100.0)


def calculate_rating_score(performance_rating: float) -> float:
    return (performance_rating / 5) * 100


def calculate_competency(trainer: Trainer, subject: Subject) -> float:
    """
    Explainable competency score.

    Weights:
    Skill Match    = 50%
    Experience     = 20%
    Certification  = 15%
    Performance    = 15%
    """
    skill_match = calculate_skill_match(trainer.skills, subject.required_skills)
    experience_score = calculate_experience_score(trainer.experience_years)
    certification_score = calculate_certification_score(trainer.certifications)
    rating_score = calculate_rating_score(trainer.performance_rating)

    final_score = (
        0.50 * skill_match
        + 0.20 * experience_score
        + 0.15 * certification_score
        + 0.15 * rating_score
    )

    return round(final_score, 2)
