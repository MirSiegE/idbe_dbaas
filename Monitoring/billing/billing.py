from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Iterable

from Monitoring.billing.config import BASE_PLATFORM_FEE, BILLING_RATE_VALUES, PLATFORM_SERVICE_FEE_VALUES

from .billing_types import BillingRateCard, BillingResult, PlatformServiceFeeConfig


BILLING_RATES = BillingRateCard(**BILLING_RATE_VALUES)

PLATFORM_SERVICE_FEES = PlatformServiceFeeConfig(**PLATFORM_SERVICE_FEE_VALUES)


def parse_timestamp(value: str) -> datetime:
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"

    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    return parsed.astimezone(timezone.utc)


def period_start(value: str, period: str) -> str:
    timestamp = parse_timestamp(value)

    if period == "daily":
        return timestamp.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()

    if period == "monthly":
        return timestamp.replace(
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        ).isoformat()

    raise ValueError(f"Unsupported billing aggregation period: {period}")


def group_records(
    records: Iterable[dict[str, Any]],
    key_fields: tuple[str, ...],
) -> dict[tuple[Any, ...], list[dict[str, Any]]]:
    grouped: dict[tuple[Any, ...], list[dict[str, Any]]] = {}
    for record in records:
        key = tuple(record[field] for field in key_fields)
        grouped.setdefault(key, []).append(record)
    return grouped


def calculate_platform_service_cost(service_fees: PlatformServiceFeeConfig) -> float:
    return (
        service_fees.ml_service_cost
        + service_fees.monitoring_service_cost
        + service_fees.analytics_processing_cost
    )


def calculate_tenant_bill(
    billing_usage_record: dict[str, Any],
    rates: BillingRateCard = BILLING_RATES,
    service_fees: PlatformServiceFeeConfig = PLATFORM_SERVICE_FEES,
    base_platform_fee: float = BASE_PLATFORM_FEE,
) -> dict[str, Any]:
    covered_hours = billing_usage_record.get("covered_seconds", 3600) / 3600

    tenant_cpu_usage = (
        billing_usage_record["tenant_cpu_usage_percent_avg"] * covered_hours
    )
    tenant_ram_usage = (
        billing_usage_record["tenant_ram_usage_percent_avg"] * covered_hours
    )
    tenant_io_usage = billing_usage_record["tenant_io_throughput_avg"] * covered_hours
    tenant_bandwidth_usage = billing_usage_record["tenant_bandwidth_mb_total"]
    tenant_storage_usage = billing_usage_record["tenant_storage_gb_hours"]

    compute_cost = (
        rates.cpu_rate_per_percent_hour * tenant_cpu_usage
        + rates.ram_rate_per_percent_hour * tenant_ram_usage
        + rates.io_rate_per_throughput_hour * tenant_io_usage
    )
    network_cost = rates.bandwidth_rate_per_mb * tenant_bandwidth_usage
    storage_cost = rates.storage_rate_per_gb_hour * tenant_storage_usage
    platform_service_cost = calculate_platform_service_cost(service_fees)

    total_tenant_bill = (
        compute_cost
        + network_cost
        + storage_cost
        + platform_service_cost
        + base_platform_fee
    )

    return {
        **billing_usage_record,
        "covered_hours": covered_hours,
        "tenant_cpu_usage_percent_hours": tenant_cpu_usage,
        "tenant_ram_usage_percent_hours": tenant_ram_usage,
        "tenant_io_throughput_hours": tenant_io_usage,
        "tenant_bandwidth_usage_mb": tenant_bandwidth_usage,
        "tenant_storage_usage_gb_hours": tenant_storage_usage,
        "compute_cost": compute_cost,
        "network_cost": network_cost,
        "storage_cost": storage_cost,
        "platform_service_cost": platform_service_cost,
        "base_platform_fee": base_platform_fee,
        "total_tenant_bill": total_tenant_bill,
    }


def calculate_billing_records(
    billing_data: list[dict[str, Any]],
    rates: BillingRateCard = BILLING_RATES,
    service_fees: PlatformServiceFeeConfig = PLATFORM_SERVICE_FEES,
    base_platform_fee: float = BASE_PLATFORM_FEE,
) -> list[dict[str, Any]]:
    return [
        calculate_tenant_bill(
            billing_usage_record=record,
            rates=rates,
            service_fees=service_fees,
            base_platform_fee=base_platform_fee,
        )
        for record in billing_data
    ]


def aggregate_bills_by_period(
    hourly_bills: list[dict[str, Any]],
    period: str,
) -> list[dict[str, Any]]:
    enriched_bills: list[dict[str, Any]] = []
    for bill in hourly_bills:
        enriched = bill.copy()
        enriched["period_start"] = period_start(
            enriched["billing_window_start"],
            period,
        )
        enriched_bills.append(enriched)

    grouped = group_records(
        enriched_bills,
        ("cluster_id", "tenant_id", "schema_name", "period_start"),
    )
    aggregated_bills: list[dict[str, Any]] = []

    for (cluster_id, tenant_id, schema_name, billing_period_start), group in grouped.items():
        aggregated_bills.append(
            {
                "billing_period_start": billing_period_start,
                "billing_period": period,
                "cluster_id": cluster_id,
                "tenant_id": tenant_id,
                "schema_name": schema_name,
                "hourly_record_count": len(group),
                "covered_seconds": sum(record["covered_seconds"] for record in group),
                "tenant_cpu_usage_percent_hours": sum(
                    record["tenant_cpu_usage_percent_hours"] for record in group
                ),
                "tenant_ram_usage_percent_hours": sum(
                    record["tenant_ram_usage_percent_hours"] for record in group
                ),
                "tenant_io_throughput_hours": sum(
                    record["tenant_io_throughput_hours"] for record in group
                ),
                "tenant_bandwidth_usage_mb": sum(
                    record["tenant_bandwidth_usage_mb"] for record in group
                ),
                "tenant_storage_usage_gb_hours": sum(
                    record["tenant_storage_usage_gb_hours"] for record in group
                ),
                "compute_cost": sum(record["compute_cost"] for record in group),
                "network_cost": sum(record["network_cost"] for record in group),
                "storage_cost": sum(record["storage_cost"] for record in group),
                "platform_service_cost": sum(
                    record["platform_service_cost"] for record in group
                ),
                "base_platform_fee": sum(record["base_platform_fee"] for record in group),
                "total_tenant_bill": sum(record["total_tenant_bill"] for record in group),
            }
        )

    return sorted(
        aggregated_bills,
        key=lambda record: (
            record["billing_period_start"],
            record["cluster_id"],
            record["tenant_id"],
            record["schema_name"],
        ),
    )


def build_billing_result(
    billing_data: list[dict[str, Any]],
    rates: BillingRateCard = BILLING_RATES,
    service_fees: PlatformServiceFeeConfig = PLATFORM_SERVICE_FEES,
    base_platform_fee: float = BASE_PLATFORM_FEE,
) -> BillingResult:
    hourly_bills = calculate_billing_records(
        billing_data=billing_data,
        rates=rates,
        service_fees=service_fees,
        base_platform_fee=base_platform_fee,
    )

    return BillingResult(
        hourly_bills=hourly_bills,
        daily_bills=aggregate_bills_by_period(hourly_bills, "daily"),
        monthly_bills=aggregate_bills_by_period(hourly_bills, "monthly"),
    )
