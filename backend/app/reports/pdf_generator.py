"""Server-generated PDF case report.

Built with reportlab (pure Python, no headless-browser dependency). Contains
only sanitized facts -- the caller is responsible for passing the
already-redacted narrative and structured intake, never raw input.
"""

from __future__ import annotations

import io
from typing import Any

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

_NAVY = colors.HexColor("#0B263D")
_TEAL = colors.HexColor("#087F8C")
_SLATE = colors.HexColor("#5E697D")


def _styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    styles = {
        "title": ParagraphStyle("FGTitle", parent=base["Title"], textColor=_NAVY, fontSize=20, spaceAfter=4),
        "subtitle": ParagraphStyle("FGSubtitle", parent=base["Normal"], textColor=_TEAL, fontSize=11, spaceAfter=14),
        "h2": ParagraphStyle("FGH2", parent=base["Heading2"], textColor=_NAVY, fontSize=13, spaceBefore=14, spaceAfter=6),
        "body": ParagraphStyle("FGBody", parent=base["Normal"], fontSize=9.5, leading=13.5),
        "caption": ParagraphStyle("FGCaption", parent=base["Normal"], fontSize=8, textColor=_SLATE, leading=11),
    }
    return styles


def build_case_report_pdf(analysis: dict[str, Any], author_attribution: dict[str, str]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=LETTER,
        topMargin=0.6 * inch,
        bottomMargin=0.6 * inch,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        title="FinGuard-AI Case Report",
    )
    styles = _styles()
    story: list[Any] = []

    story.append(Paragraph("FinGuard-AI", styles["title"]))
    story.append(Paragraph("Research Prototype Case Report - Informational Only", styles["subtitle"]))
    story.append(HRFlowable(width="100%", color=_TEAL, thickness=1))
    story.append(Spacer(1, 8))

    meta_rows = [
        ["Case reference", analysis["case_reference"]],
        ["Analysis timestamp (UTC)", analysis["analysis_timestamp"]],
        ["Rules-engine version", analysis["rules_engine_version"]],
    ]
    meta_table = Table(meta_rows, colWidths=[180, 320])
    meta_table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("TEXTCOLOR", (0, 0), (0, -1), _SLATE),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    story.append(meta_table)
    story.append(Spacer(1, 10))

    story.append(
        Paragraph(
            "Research Prototype: FinGuard-AI provides informational, explainable risk indicators and "
            "consumer-assistance guidance. It is not a bank, law firm, government agency, emergency "
            "service, fraud adjudication system, or automated eligibility determination. It does not "
            "confirm that fraud occurred, determine legal rights, or guarantee reimbursement or recovery.",
            styles["caption"],
        )
    )

    story.append(Paragraph("Sanitized Case Summary", styles["h2"]))
    story.append(Paragraph(analysis.get("sanitized_narrative") or "No narrative provided.", styles["body"]))

    story.append(Paragraph("Typology Assessment", styles["h2"]))
    typology_rows = [
        ["Primary typology", analysis["primary_typology"]],
        ["Secondary typology", analysis.get("secondary_typology") or "Not applicable"],
        ["Evidence strength (0-100, not a probability)", str(analysis["evidence_strength"])],
        ["Insufficient evidence flagged", "Yes" if analysis["insufficient_evidence"] else "No"],
    ]
    t = Table(typology_rows, colWidths=[260, 240])
    t.setStyle(TableStyle([("FONTSIZE", (0, 0), (-1, -1), 9.5), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    story.append(t)

    story.append(Paragraph("Risk Scores (0-100)", styles["h2"]))
    score_rows = [["Dimension", "Score", "Band"]]
    for label, key in [
        ("Fraud Risk", "fraud_risk"),
        ("Consumer Harm", "consumer_harm"),
        ("Dispute Friction", "dispute_friction"),
        ("Recovery Urgency", "recovery_urgency"),
    ]:
        score_rows.append([label, str(analysis[key]["score"]), analysis[key]["band"]])
    score_table = Table(score_rows, colWidths=[220, 100, 180])
    score_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), _NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#DCE3EA")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(score_table)

    story.append(Paragraph("Matched Indicators", styles["h2"]))
    if analysis["matched_indicators"]:
        rows = [["Rule ID", "Indicator", "Weight"]]
        for m in analysis["matched_indicators"]:
            rows.append([m["rule_id"], m["indicator"], str(m["weight"])])
        mt = Table(rows, colWidths=[90, 320, 90])
        mt.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), _TEAL),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#DCE3EA")),
                ]
            )
        )
        story.append(mt)
    else:
        story.append(Paragraph("No category-specific phrase matched.", styles["body"]))

    if analysis.get("missing_information"):
        story.append(Paragraph("Missing Information", styles["h2"]))
        for item in analysis["missing_information"]:
            story.append(Paragraph(f"- {item}", styles["body"]))

    story.append(Paragraph("Recommended Action Plan", styles["h2"]))
    section_titles = {
        "act_now": "Act Now",
        "secure_accounts": "Secure Accounts",
        "preserve_evidence": "Preserve Evidence",
        "contact_institution": "Contact the Institution",
        "follow_up": "Follow-Up",
    }
    for key, title in section_titles.items():
        story.append(Paragraph(f"<b>{title}</b>", styles["body"]))
        for item in analysis.get("action_plan", {}).get(key, []):
            story.append(Paragraph(f"- {item}", styles["body"]))
        story.append(Spacer(1, 4))

    story.append(Paragraph("Limitations", styles["h2"]))
    story.append(
        Paragraph(
            "This report reflects a heuristic, rules-based analysis of the information provided. It "
            "has not been validated against representative institutional or public complaint data, does "
            "not verify facts, and does not replace review by the relevant financial institution, "
            "attorney, law-enforcement agency, or regulator.",
            styles["body"],
        )
    )

    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", color=_SLATE, thickness=0.5))
    attribution = author_attribution.get("author_name", "")
    footer_text = "FinGuard-AI Research Prototype"
    if attribution:
        footer_text += f" - Designed and developed by {attribution}"
    story.append(Paragraph(footer_text, styles["caption"]))

    doc.build(story)
    return buffer.getvalue()
