"""FinGuard-AI deterministic, rules-first risk engine.

This package contains the entire explainable analysis pipeline. No step in this
package depends on a generative or opaque machine-learning model. Every output
can be reconstructed from the rule tables in ``rules.py`` and the deterministic
functions in ``classifier.py``, ``scoring.py``, and ``recommendations.py``.
"""

from .versioning import RULES_ENGINE_VERSION

__all__ = ["RULES_ENGINE_VERSION"]
