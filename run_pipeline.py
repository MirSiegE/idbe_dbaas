from __future__ import annotations

from billing import build_billing_result
from derived_metrics import build_derived_metrics
from normalization import parse_timestamp, process_telemetry
from sample_data import (
    SAMPLE_BILLING_RATES,
    SAMPLE_CURRENT_TIME,
    SAMPLE_PLATFORM_FEES,
    SAMPLE_TELEMETRY_RECORDS,
)


def print_section(title: str) -> None:
    print(f"\n{title}")
    print("-" * len(title))


def main() -> None:
    normalized_result = process_telemetry(
        SAMPLE_TELEMETRY_RECORDS,
        current_time=parse_timestamp(SAMPLE_CURRENT_TIME),
    )
    derived_result = build_derived_metrics(normalized_result["records"])
    billing_result = build_billing_result(
        derived_result.billing_data,
        rates=SAMPLE_BILLING_RATES,
        fees=SAMPLE_PLATFORM_FEES,
    )

    print_section("Pipeline Summary")
    print(f"Normalized records: {len(normalized_result['records'])}")
    print(f"Invalid records: {len(normalized_result['invalid_records'])}")
    print(f"Outlier records: {len(normalized_result['outlier_records'])}")
    print(f"Predictive records: {len(derived_result.predictive_data)}")
    print(f"Hourly billing records: {len(billing_result.hourly_bills)}")
    print(f"Daily billing records: {len(billing_result.daily_bills)}")
    print(f"Monthly billing records: {len(billing_result.monthly_bills)}")

    print_section("Predictive Data")
    for record in derived_result.predictive_data:
        print(
            record["window_start"],
            record["tenant_id"],
            f"QLF={record['qlf']:.4f}",
            f"NPF={record['npf']:.4f}",
            f"SPS={record['sps']:.4f}",
            f"CPU share={record['tenant_compute_share']:.4f}",
            f"Network share={record['tenant_network_share']:.4f}",
            f"Storage share={record['tenant_storage_share']:.4f}",
        )

    print_section("Hourly Bills")
    for bill in billing_result.hourly_bills:
        print(
            bill["billing_window_start"],
            bill["tenant_id"],
            f"compute={bill['compute_cost']:.4f}",
            f"network={bill['network_cost']:.4f}",
            f"storage={bill['storage_cost']:.4f}",
            f"platform={bill['platform_service_cost']:.4f}",
            f"base={bill['base_platform_fee']:.4f}",
            f"total={bill['total_tenant_bill']:.4f}",
        )


if __name__ == "__main__":
    main()
