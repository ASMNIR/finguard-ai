"""Editable, plain-language dispute-letter template generation.

Templates are informational only. They do not cite laws or regulations and
do not state legal conclusions. Every template is built only from sanitized
facts supplied by the caller (case reference, typology, amount, channel,
dates) -- never from raw, unredacted narrative text.
"""

from __future__ import annotations

from datetime import date
from typing import Any

TEMPLATE_TITLES: dict[str, str] = {
    "initial_dispute": "Initial Dispute Letter",
    "fraud_escalation": "Fraud Escalation Request",
    "reimbursement_review": "Reimbursement Review Request",
    "appeal_reconsideration": "Appeal or Reconsideration Request",
    "written_decision_request": "Request for Written Decision",
    "investigation_documents_request": "Request for Investigation Documents",
    "evidence_submission_cover": "Evidence-Submission Cover Letter",
    "follow_up_no_response": "Follow-Up After No Response",
    "agency_complaint_summary": "Complaint Summary for an Official Agency",
}

_DISCLAIMER_LINE = (
    "This letter was prepared with the assistance of FinGuard-AI, a research "
    "prototype that provides informational, non-legal drafting support. It "
    "does not constitute legal advice and does not assert a legal conclusion."
)


def _facts_block(structured: dict[str, Any], typology: str, sanitized_narrative: str) -> str:
    amount = structured.get("amount_lost") or 0
    channel = str(structured.get("payment_channel", "unknown")).replace("_", " ")
    incident_date = structured.get("incident_date") or "an unspecified date"
    lines = [
        f"- Reported category (informational, not a determination): {typology}",
        f"- Approximate amount involved: ${float(amount):,.2f}" if amount else "- Approximate amount involved: not provided",
        f"- Payment channel: {channel}",
        f"- Reported incident date: {incident_date}",
    ]
    if sanitized_narrative:
        lines.append(f"- Consumer's summary of events: {sanitized_narrative}")
    return "\n".join(lines)


def generate_letter(
    template_id: str,
    case_reference: str,
    structured: dict[str, Any],
    sanitized_narrative: str,
    typology: str,
) -> dict[str, str]:
    if template_id not in TEMPLATE_TITLES:
        raise ValueError(f"Unknown letter template_id: {template_id}")

    title = TEMPLATE_TITLES[template_id]
    today = date.today().isoformat()
    facts = _facts_block(structured, typology, sanitized_narrative)
    subject = f"{title} - Case Reference {case_reference}"

    bodies = {
        "initial_dispute": f"""Date: {today}
Re: {subject}

To Whom It May Concern,

I am writing to formally dispute a transaction described below. I ask that this matter be reviewed and that I receive written confirmation of receipt of this dispute.

Case facts:
{facts}

I ask that you:
1. Open a case file and provide a case or reference number.
2. Confirm receipt of this dispute in writing.
3. Advise me of any additional information needed to complete your review.

I can be reached through the contact details on file with your institution.

Sincerely,
A Consumer (case reference {case_reference})

---
{_DISCLAIMER_LINE}
""",
        "fraud_escalation": f"""Date: {today}
Re: {subject}

To Whom It May Concern,

I am requesting escalation of the matter described below to your fraud or security team for review.

Case facts:
{facts}

I ask that you:
1. Escalate this case for fraud review.
2. Advise whether a freeze, recall, or stop-payment action is available.
3. Provide a case or reference number and expected timeline.

Sincerely,
A Consumer (case reference {case_reference})

---
{_DISCLAIMER_LINE}
""",
        "reimbursement_review": f"""Date: {today}
Re: {subject}

To Whom It May Concern,

I am requesting a review of my eligibility for reimbursement in connection with the case described below.

Case facts:
{facts}

I ask that you:
1. Review this case for reimbursement consideration under your institution's applicable policies.
2. Advise me of the criteria used in this review.
3. Provide a written decision once the review is complete.

Sincerely,
A Consumer (case reference {case_reference})

---
{_DISCLAIMER_LINE}
""",
        "appeal_reconsideration": f"""Date: {today}
Re: {subject}

To Whom It May Concern,

I am requesting reconsideration of the prior decision on the case described below. I believe the matter warrants a further look.

Case facts:
{facts}

I ask that you:
1. Reconsider the prior decision.
2. Identify any additional evidence that would support this reconsideration.
3. Provide the outcome of this appeal in writing.

Sincerely,
A Consumer (case reference {case_reference})

---
{_DISCLAIMER_LINE}
""",
        "written_decision_request": f"""Date: {today}
Re: {subject}

To Whom It May Concern,

I am requesting a written explanation of the decision reached on the case described below.

Case facts:
{facts}

I ask that you:
1. Provide the basis for the decision in writing.
2. Identify the information considered in reaching the decision.
3. Advise of any process available to seek further review.

Sincerely,
A Consumer (case reference {case_reference})

---
{_DISCLAIMER_LINE}
""",
        "investigation_documents_request": f"""Date: {today}
Re: {subject}

To Whom It May Concern,

I am requesting copies of the documents and records relied upon in the investigation of the case described below, to the extent your institution is able to provide them.

Case facts:
{facts}

I ask that you:
1. Provide the documents or a summary of findings relied upon.
2. Identify any additional records I may need to request.
3. Confirm the timeframe in which these records can be provided.

Sincerely,
A Consumer (case reference {case_reference})

---
{_DISCLAIMER_LINE}
""",
        "evidence_submission_cover": f"""Date: {today}
Re: {subject}

To Whom It May Concern,

Please find enclosed additional evidence supporting the case described below.

Case facts:
{facts}

Enclosed evidence (see attachments): transaction confirmations, communications, and other supporting records as applicable.

I ask that you:
1. Confirm receipt of this evidence.
2. Add it to the case file referenced above.
3. Advise if further information is needed.

Sincerely,
A Consumer (case reference {case_reference})

---
{_DISCLAIMER_LINE}
""",
        "follow_up_no_response": f"""Date: {today}
Re: {subject}

To Whom It May Concern,

I am following up on the case described below, for which I have not yet received a response.

Case facts:
{facts}

I ask that you:
1. Provide a status update on this case.
2. Confirm the expected timeline for resolution.
3. Advise of any escalation path available if a response is further delayed.

Sincerely,
A Consumer (case reference {case_reference})

---
{_DISCLAIMER_LINE}
""",
        "agency_complaint_summary": f"""Date: {today}
Re: Complaint Summary - Case Reference {case_reference}

Summary of complaint for submission to an official reporting agency (for example, ReportFraud.ftc.gov, IdentityTheft.gov, the CFPB complaint portal, or the FBI Internet Crime Complaint Center).

Case facts:
{facts}

Note: FinGuard-AI does not submit this complaint on your behalf. Please copy the relevant details into the official agency's own reporting form.

---
{_DISCLAIMER_LINE}
""",
    }

    return {"template_id": template_id, "subject": subject, "body": bodies[template_id]}
