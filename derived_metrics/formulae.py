from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Iterable

from .metric_types import NPF_WEIGHTS, QLF_WEIGHTS, SPS_WEIGHTS


def parse_timestamp(value: str) -> datetime:
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"

    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    return parsed.astimezone(timezone.utc)


def hour_start(value: str) -> str:
    timestamp = parse_timestamp(value)
    return timestamp.replace(minute=0, second=0, microsecond=0).isoformat()


def safe_divide(numerator: float, denominator: float) -> float:
    if denominator == 0:
        return 0.0
    return numerator / denominator


def min_max_scale(value: float, minimum: float, maximum: float) -> float:
    if maximum == minimum:
        return 0.0
    return (value - minimum) / (maximum - minimum)


def group_records(
    records: Iterable[dict[str, Any]],
    key_fields: tuple[str, ...],
) -> dict[tuple[Any, ...], list[dict[str, Any]]]:
    grouped: dict[tuple[Any, ...], list[dict[str, Any]]] = {}
    for record in records:
        key = tuple(record[field] for field in key_fields)
        grouped.setdefault(key, []).append(record)
    return grouped


def add_storage_growth_rate(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped = group_records(records, ("cluster_id", "tenant_id", "schema_name"))
    enriched_records: list[dict[str, Any]] = []

    for group in grouped.values():
        previous_record: dict[str, Any] | None = None
        ordered_group = sorted(group, key=lambda record: record["window_start"])

        for record in ordered_group:
            enriched = record.copy()
            window_seconds = float(enriched.get("window_seconds", 60))

            if previous_record is None:
                storage_growth_gb = enriched.get("storage_growth_mb", 0.0) / 1024
                interval_hours = window_seconds / 3600
            else:
                current_timestamp = parse_timestamp(enriched["window_start"])
                previous_timestamp = parse_timestamp(previous_record["window_start"])
                interval_seconds = max(
                    (current_timestamp - previous_timestamp).total_seconds(),
                    window_seconds,
                )
                interval_hours = interval_seconds / 3600
                storage_growth_gb = (
                    enriched["schema_size_gb"] - previous_record["schema_size_gb"]
                )

            enriched["storage_growth_rate_gb_per_hour"] = safe_divide(
                storage_growth_gb,
                interval_hours,
            )
            previous_record = enriched
            enriched_records.append(enriched)

    return sorted(
        enriched_records,
        key=lambda record: (
            record["window_start"],
            record["cluster_id"],
            record["tenant_id"],
            record["schema_name"],
        ),
    )


def add_normalized_storage_growth_rate(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped = group_records(records, ("cluster_id", "window_start"))
    normalized_records: list[dict[str, Any]] = []

    for group in grouped.values():
        values = [record["storage_growth_rate_gb_per_hour"] for record in group]
        minimum = min(values)
        maximum = max(values)

        for record in group:
            normalized = record.copy()
            normalized["normalized_storage_growth_rate_gb_per_hour"] = min_max_scale(
                record["storage_growth_rate_gb_per_hour"],
                minimum,
                maximum,
            )
            normalized_records.append(normalized)

    return sorted(
        normalized_records,
        key=lambda record: (
            record["window_start"],
            record["cluster_id"],
            record["tenant_id"],
            record["schema_name"],
        ),
    )


def calculate_qlf(record: dict[str, Any], weights: dict[str, float]) -> float:
    query_pressure = record.get("normalized_query_execution_cost")
    query_weight = weights["query_execution_cost"]

    if query_pressure is None:
        query_pressure = record["normalized_query_count"]
        query_weight = weights["query_count"]

    return (
        query_weight * query_pressure
        + weights["average_query_latency"]
        * record["normalized_average_query_latency_seconds"]
        + weights["io_operations"] * record["normalized_io_operations"]
    )


def calculate_npf(record: dict[str, Any], weights: dict[str, float]) -> float:
    return (
        weights["rows_returned"] * record["normalized_rows_returned"]
        + weights["query_frequency"] * record["normalized_query_frequency"]
        + weights["result_size"] * record["normalized_result_size_mb"]
    )


def calculate_sps(record: dict[str, Any], weights: dict[str, float]) -> float:
    return (
        weights["schema_size"] * record["normalized_schema_size_gb"]
        + weights["storage_growth_rate"]
        * record["normalized_storage_growth_rate_gb_per_hour"]
        + weights["write_operations"] * record["normalized_write_operations"]
    )


def add_pressure_scores(
    records: list[dict[str, Any]],
    qlf_weights: dict[str, float] | None = None,
    npf_weights: dict[str, float] | None = None,
    sps_weights: dict[str, float] | None = None,
) -> list[dict[str, Any]]:
    qlf_weights = qlf_weights or QLF_WEIGHTS
    npf_weights = npf_weights or NPF_WEIGHTS
    sps_weights = sps_weights or SPS_WEIGHTS

    scored_records: list[dict[str, Any]] = []
    for record in records:
        scored = record.copy()
        scored["qlf"] = calculate_qlf(scored, qlf_weights)
        scored["npf"] = calculate_npf(scored, npf_weights)
        scored["sps"] = calculate_sps(scored, sps_weights)
        scored_records.append(scored)

    return scored_records


def add_cluster_pressure_totals(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped = group_records(records, ("cluster_id", "window_start"))
    enriched_records: list[dict[str, Any]] = []

    for group in grouped.values():
        total_qlf = sum(record["qlf"] for record in group)
        total_npf = sum(record["npf"] for record in group)
        total_sps = sum(record["sps"] for record in group)

        for record in group:
            enriched = record.copy()
            enriched["total_cluster_qlf"] = total_qlf
            enriched["total_cluster_npf"] = total_npf
            enriched["total_cluster_sps"] = total_sps
            enriched_records.append(enriched)

    return enriched_records


def add_tenant_resource_shares(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    shared_records: list[dict[str, Any]] = []

    for record in records:
        shared = record.copy()
        shared["tenant_compute_share"] = safe_divide(
            shared["qlf"],
            shared["total_cluster_qlf"],
        )
        shared["tenant_network_share"] = safe_divide(
            shared["npf"],
            shared["total_cluster_npf"],
        )
        shared["tenant_storage_share"] = safe_divide(
            shared["sps"],
            shared["total_cluster_sps"],
        )
        shared_records.append(shared)

    return shared_records


def add_resource_attribution(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    attributed_records: list[dict[str, Any]] = []

    for record in records:
        attributed = record.copy()
        attributed["hour_start"] = hour_start(attributed["window_start"])
        attributed["tenant_cpu_usage_percent"] = (
            attributed["cluster_cpu_usage_percent"]
            * attributed["tenant_compute_share"]
        )
        attributed["tenant_ram_usage_percent"] = (
            attributed["cluster_ram_usage_percent"]
            * attributed["tenant_compute_share"]
        )
        attributed["tenant_io_throughput"] = (
            attributed["cluster_io_throughput"]
            * attributed["tenant_compute_share"]
        )
        attributed["tenant_bandwidth_mb"] = (
            attributed["cluster_bandwidth_mb"]
            * attributed["tenant_network_share"]
        )
        attributed["tenant_storage_used_gb"] = (
            attributed["cluster_storage_used_gb"]
            * attributed["tenant_storage_share"]
        )
        attributed_records.append(attributed)

    return attributed_records


def weighted_average(
    records: list[dict[str, Any]],
    value_field: str,
    weight_field: str,
) -> float:
    total_weight = sum(record.get(weight_field, 0.0) for record in records)
    if total_weight == 0:
        return sum(record[value_field] for record in records) / len(records)

    return (
        sum(record[value_field] * record.get(weight_field, 0.0) for record in records)
        / total_weight
    )
