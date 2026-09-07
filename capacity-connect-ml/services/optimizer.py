from typing import Any, Dict, List

import numpy as np
from scipy.optimize import linear_sum_assignment

from schemas.request_models import Subject, Trainer
from services.competency import calculate_competency

UNAVAILABLE_COST = 1_000_000.0


def build_competency_matrix(
    trainers: List[Trainer],
    subjects: List[Subject],
) -> np.ndarray:
    matrix = [
        [calculate_competency(trainer, subject) for subject in subjects]
        for trainer in trainers
    ]
    return np.array(matrix, dtype=float)


def optimize_assignment(
    trainers: List[Trainer],
    subjects: List[Subject],
) -> Dict[str, Any]:
    if not trainers:
        raise ValueError("At least one trainer is required.")
    if not subjects:
        raise ValueError("At least one subject is required.")

    trainer_ids = [trainer.id for trainer in trainers]
    subject_ids = [subject.id for subject in subjects]
    if len(trainer_ids) != len(set(trainer_ids)):
        raise ValueError("Trainer IDs must be unique.")
    if len(subject_ids) != len(set(subject_ids)):
        raise ValueError("Subject IDs must be unique.")

    available_trainers = [trainer for trainer in trainers if trainer.available]
    unavailable_trainers = [trainer for trainer in trainers if not trainer.available]

    if not available_trainers:
        return {
            "assignments": [],
            "unassigned_subjects": [
                {"subject_id": subject.id, "subject_name": subject.name}
                for subject in subjects
            ],
            "minimum_total_cost": None,
            "total_competency": 0.0,
            "valid": False,
            "reason": "No available trainers are eligible for assignment.",
            "num_trainers": len(trainers),
            "num_available_trainers": 0,
            "num_subjects": len(subjects),
        }

    competency_matrix = build_competency_matrix(available_trainers, subjects)
    max_score = float(np.max(competency_matrix)) if competency_matrix.size else 0.0
    cost_matrix = max_score - competency_matrix

    row_ind, col_ind = linear_sum_assignment(cost_matrix)

    assignments: List[Dict[str, Any]] = []
    assigned_subject_indices = set()
    total_cost = 0.0
    total_competency = 0.0

    for trainer_index, subject_index in zip(row_ind, col_ind):
        trainer = available_trainers[trainer_index]
        subject = subjects[subject_index]
        competency_score = float(competency_matrix[trainer_index, subject_index])
        assignment_cost = float(cost_matrix[trainer_index, subject_index])

        assigned_subject_indices.add(int(subject_index))
        total_cost += assignment_cost
        total_competency += competency_score

        assignments.append(
            {
                "trainer_id": trainer.id,
                "trainer_name": trainer.name,
                "subject_id": subject.id,
                "subject_name": subject.name,
                "competency_score": round(competency_score, 2),
                "assignment_cost": round(assignment_cost, 2),
                "available": True,
            }
        )

    unassigned_subjects = [
        {"subject_id": subject.id, "subject_name": subject.name}
        for index, subject in enumerate(subjects)
        if index not in assigned_subject_indices
    ]

    return {
        "assignments": assignments,
        "unassigned_subjects": unassigned_subjects,
        "minimum_total_cost": round(total_cost, 2),
        "total_competency": round(total_competency, 2),
        "valid": len(unassigned_subjects) == 0,
        "reason": (
            None
            if not unassigned_subjects
            else "One or more subjects could not be assigned because there are not enough available trainers."
        ),
        "num_trainers": len(trainers),
        "num_available_trainers": len(available_trainers),
        "num_unavailable_trainers": len(unavailable_trainers),
        "num_subjects": len(subjects),
    }
