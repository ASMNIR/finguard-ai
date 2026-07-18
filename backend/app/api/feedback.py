from __future__ import annotations

from fastapi import APIRouter

from ..schemas import FeedbackRequest

router = APIRouter(tags=["feedback"])


@router.post("/feedback")
def submit_feedback(payload: FeedbackRequest) -> dict[str, str]:
    # Research-prototype behavior: feedback is accepted and acknowledged but is
    # not persisted or used for training in this deployment. A production
    # feature would require explicit consent and a documented retention
    # policy before any storage occurs. See docs/privacy.md.
    return {"status": "received", "message": "Thank you. Feedback is not stored in this research prototype."}
