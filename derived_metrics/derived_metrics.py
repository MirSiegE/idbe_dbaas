from __future__ import annotations

from typing import Any

from .formulae import (
    add_cluster_pressure_totals,
    add_normalized_storage_growth_rate,
    add_pressure_scores,
    add_resource_attribution,
    add_storage_growth_rate,
    add_tenant_resource_shares,
    group_records,
    weighted_average,
)
from .metric_types import DerivedMetricResult, NPF_WEIGHTS, QLF_WEIGHTS, SPS_WEIGHTS


def build_predictive_data(
    normalized_records: list[dict[str, Any]],
    qlf_weights: dict[str, float] | None = None,
    npf_weights: dict[str, float] | None = None,
    sps_weights: dict[str, float] | None = None,
) -> list[dict[str, Any]]:
    with_growth_rate = add_storage_growth_rate(normalized_records)
    with_normalized_growth_rate = add_normalized_storage_growth_rate(with_growth_rate)
    with_scores = add_pressure_scores(
        with_normalized_growth_rate,
        qlf_weights=qlf_weights,
        npf_weights=npf_weights,
        sps_weights=sps_weights,
    )
    with_totals = add_cluster_pressure_totals(with_scores)
    with_shares = add_tenant_resource_shares(with_totals)
    predictive_data = add_resource_attribution(with_shares)

    return sorted(
        predictive_data,
        key=lambda record: (
            record["window_start"],
            record["cluster_id"],
            record["tenant_id"],
            record["schema_name"],
        ),
    )


def build_billing_data(predictive_data: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped = group_records(
        predictive_data,
        ("cluster_id", "tenant_id", "schema_name", "hour_start"),
    )
    billing_data: list[dict[str, Any]] = []

    for (cluster_id, tenant_id, schema_name, billing_window_start), group in grouped.items():
        total_window_seconds = sum(record.get("window_seconds", 60) for record in group)
        billable_hours = total_window_seconds / 3600
        tenant_storage_used_gb_avg = weighted_average(
            group,
            "tenant_storage_used_gb",
            "window_seconds",
        )

        billing_data.append(
            {
                "billing_window_start": billing_window_start,
                "billing_window_seconds": 3600,
                "covered_seconds": total_window_seconds,
                "cluster_id": cluster_id,
                "tenant_id": tenant_id,
                "schema_name": schema_name,
                "sample_count": len(group),
                "qlf_total": sum(record["qlf"] for record in group),
                "npf_total": sum(record["npf"] for record in group),
                "sps_total": sum(record["sps"] for record in group),
                "tenant_compute_share_avg": weighted_average(
                    group,
                    "tenant_compute_share",
                    "window_seconds",
                ),
                "tenant_network_share_avg": weighted_average(
                    group,
                    "tenant_network_share",
                    "window_seconds",
                ),
                "tenant_storage_share_avg": weighted_average(
                    group,
                    "tenant_storage_share",
                    "window_seconds",
                ),
                "tenant_cpu_usage_percent_avg": weighted_average(
                    group,
                    "tenant_cpu_usage_percent",
                    "window_seconds",
                ),
                "tenant_ram_usage_percent_avg": weighted_average(
                    group,
                    "tenant_ram_usage_percent",
                    "window_seconds",
                ),
                "tenant_io_throughput_avg": weighted_average(
                    group,
                    "tenant_io_throughput",
                    "window_seconds",
                ),
                "tenant_bandwidth_mb_total": sum(
                    record["tenant_bandwidth_mb"] for record in group
                ),
                "tenant_storage_used_gb_avg": tenant_storage_used_gb_avg,
                "tenant_storage_gb_hours": tenant_storage_used_gb_avg * billable_hours,
            }
        )

    return sorted(
        billing_data,
        key=lambda record: (
            record["billing_window_start"],
            record["cluster_id"],
            record["tenant_id"],
            record["schema_name"],
        ),
    )


def build_derived_metrics(
    normalized_records: list[dict[str, Any]],
    qlf_weights: dict[str, float] | None = None,
    npf_weights: dict[str, float] | None = None,
    sps_weights: dict[str, float] | None = None,
) -> DerivedMetricResult:
    predictive_data = build_predictive_data(
        normalized_records,
        qlf_weights=qlf_weights,
        npf_weights=npf_weights,
        sps_weights=sps_weights,
    )
    billing_data = build_billing_data(predictive_data)

    return DerivedMetricResult(
        predictive_data=predictive_data,
        billing_data=billing_data,
    )
