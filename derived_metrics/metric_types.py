from __future__ import annotations

from dataclasses import dataclass
from typing import Any


DEFAULT_QLF_WEIGHTS = {
    "query_execution_cost": 0.5,
    "query_count": 0.5,
    "average_query_latency": 0.25,
    "io_operations": 0.25,
}

DEFAULT_NPF_WEIGHTS = {
    "rows_returned": 0.4,
    "query_frequency": 0.25,
    "result_size": 0.35,
}

DEFAULT_SPS_WEIGHTS = {
    "schema_size": 0.45,
    "storage_growth_rate": 0.35,
    "write_operations": 0.2,
}


@dataclass(frozen=True)
class DerivedMetricResult:
    predictive_data: list[dict[str, Any]]
    billing_data: list[dict[str, Any]]
