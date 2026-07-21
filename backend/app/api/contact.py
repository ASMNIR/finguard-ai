from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from ..services.email_service import send_contact_email

router = APIRouter(tags=["contact"])


class ContactRequest(BaseModel):
    inquiry_type: str = Field(default="general", max_length=64)
    name: str = Field(default="", max_length=200)
    email: EmailStr | None = None
    organization: str = Field(default="", max_length=200)
    message: str = Field(default="", max_length=4000)
    # Honeypot field: real users never populate a hidden field. Basic,
    # dependency-free spam protection appropriate for a research prototype.
    website: str = Field(default="", max_length=200)


@router.post("/contact")
def submit_contact(payload: ContactRequest) -> dict[str, str]:
    if payload.website:
        raise HTTPException(status_code=400, detail="Submission rejected.")
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Please include a message.")

    delivered = send_contact_email(
        inquiry_type=payload.inquiry_type,
        name=payload.name,
        email=payload.email,
        organization=payload.organization,
        message=payload.message,
    )
    # Research-prototype behavior: forwarded by email, not persisted server-side. A
    # production deployment would require a documented retention policy and
    # consent notice before storing contact-form submissions.
    return {
        "status": "received",
        "message": (
            "Thank you for reaching out. Your message has been sent."
            if delivered
            else "Thank you for reaching out. This research prototype does not store contact-form submissions."
        ),
    }
