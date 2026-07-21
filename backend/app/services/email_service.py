"""Outbound email for the contact form, via the Resend API.

Deliberately fails soft: if RESEND_API_KEY or CONTACT_EMAIL is not configured,
or the request errors, the caller falls back to its existing acknowledged-but-
not-delivered response rather than raising to the user.
"""

from __future__ import annotations

import httpx

from ..config import get_settings

RESEND_API_URL = "https://api.resend.com/emails"


def send_contact_email(*, inquiry_type: str, name: str, email: str | None, organization: str, message: str) -> bool:
    settings = get_settings()
    if not settings.RESEND_API_KEY or not settings.CONTACT_EMAIL:
        return False

    lines = [
        f"Inquiry type: {inquiry_type or 'general'}",
        f"Name: {name or '(not provided)'}",
        f"Email: {email or '(not provided)'}",
        f"Organization: {organization or '(not provided)'}",
        "",
        "Message:",
        message,
    ]
    html = "<br>".join(line.replace("&", "&amp;").replace("<", "&lt;").replace("\n", "<br>") for line in lines)

    payload: dict[str, object] = {
        "from": "FinGuard-AI Contact Form <onboarding@resend.dev>",
        "to": [settings.CONTACT_EMAIL],
        "subject": f"FinGuard-AI contact form: {inquiry_type or 'general'}",
        "html": html,
    }
    if email:
        payload["reply_to"] = email

    try:
        response = httpx.post(
            RESEND_API_URL,
            headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
            json=payload,
            timeout=10.0,
        )
        return response.status_code < 300
    except httpx.HTTPError:
        return False
