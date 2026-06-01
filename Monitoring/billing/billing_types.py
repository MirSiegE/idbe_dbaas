from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BillingRateCard:
    cpu_rate_per_percent_hour: float
    ram_rate_per_percent_hour: float
    io_rate_per_throughput_hour: float
    bandwidth_rate_per_mb: float
    storage_rate_per_gb_hour: float


@dataclass(frozen=True)
class PlatformServiceFeeConfig:
    ml_service_cost: float = 0.0
    monitoring_service_cost: float = 0.0
    analytics_processing_cost: float = 0.0


@dataclass(frozen=True)
class BillingResult:
    hourly_bills: list[dict]
    daily_bills: list[dict]
    monthly_bills: list[dict]
