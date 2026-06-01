from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from config import NPF_WEIGHTS, QLF_WEIGHTS, SPS_WEIGHTS


@dataclass(frozen=True)
class DerivedMetricResult:
    predictive_data: list[dict[str, Any]]
    billing_data: list[dict[str, Any]]
