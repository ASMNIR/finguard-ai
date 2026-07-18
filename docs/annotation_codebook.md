# Annotation Codebook (Design Document)

**Status: this codebook defines how a future human-annotation study would label narratives for comparison against the FinGuard-AI rules engine. It has not yet been used in a completed annotation study.**

## Purpose

Give independent human annotators a consistent, written definition for each typology category, so that inter-rater agreement and rules-engine comparison are meaningful.

## General instructions for annotators

- Read the full narrative before assigning a label.
- Assign exactly one **primary** typology. Assign a **secondary** typology only if the narrative clearly describes two distinct schemes or risk patterns, not merely two keywords.
- If the narrative does not contain enough information to confidently choose a category, assign **Insufficient evidence** rather than guessing.
- Do not infer facts not stated in the narrative (e.g., do not assume an amount, a channel, or an outcome that isn't mentioned).
- Flag (do not silently resolve) any internal contradiction in the narrative.

## Category definitions

1. **APP scam** -- the consumer or business describes personally authorizing/sending a payment because they were deceived about the purpose or recipient.
2. **Bank impersonation scam** -- someone claiming to represent a bank, its fraud department, or a "security team" instructs the consumer to move funds or share a code/credential.
3. **Invoice redirection or business email compromise** -- a business payment is redirected because of a compromised or spoofed email purporting to be from a vendor, supplier, executive, or closing agent.
4. **Marketplace scam** -- a transaction through an online marketplace/classified listing where goods are not delivered, payment is diverted off-platform, or the listing is fraudulent.
5. **Romance scam** -- an online relationship is used to solicit repeated payments, typically with escalating fabricated emergencies.
6. **Investment scam** -- a promoted investment or trading opportunity promises implausible returns and later demands additional payments (fees, taxes) before allowing withdrawal.
7. **AML or mule-account risk** -- the narrative describes receiving and forwarding funds on someone else's behalf, in exchange for a commission, or other pass-through account patterns. **Annotators must not label a narrative as describing confirmed criminal conduct** -- this category captures risk indicators only.
8. **Medical debt or credit stress** -- billing, collections, or credit-reporting disputes tied to medical costs.
9. **Mortgage or insurance stress** -- servicing errors, foreclosure risk, or insurance-claim/force-placed-insurance disputes.
10. **Financial reporting or disclosure-integrity concern** -- concerns about the accuracy or completeness of a company's financial disclosures.
11. **Other** -- describes a financial harm or complaint that does not fit any category above.
12. **Insufficient evidence** -- the narrative (or lack thereof) does not contain enough information to assign any of the above with reasonable confidence.

## Evidence-strength rating

Annotators additionally rate their own confidence in the assigned label on a 1-5 scale (1 = very low confidence / mostly guessing, 5 = very high confidence / narrative is unambiguous). This is recorded separately from the rules engine's evidence-strength indicator so the two can be compared.

## Conflict flag

Annotators mark a narrative as "internally conflicting" if it contains statements that appear to contradict each other (e.g., describing the payment as both authorized and unauthorized). This flag is compared against the rules engine's automated conflict-detection output.
