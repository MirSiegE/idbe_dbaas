from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Iterable


IDENTITY_FIELDS = {
    "cluster_id": str,
    "tenant_id": str,
    "schema_name": str,
}

TIMESTAMP_FIELDS = {
    "timestamp": str,
}

SCHEMA_TELEMETRY_FIELDS = {
    "query_count": (int, float),
    "average_query_latency_ms": (int, float),
    "io_operations": (int, float),
    "rows_returned": (int, float),
    "query_frequency": (int, float),
    "result_size_bytes": (int, float),
    "schema_size_bytes": (int, float),
    "storage_growth_bytes": (int, float),
    "write_operations": (int, float),
}

CLUSTER_TELEMETRY_FIELDS = {
    "cluster_cpu_usage_percent": (int, float),
    "cluster_ram_usage_percent": (int, float),
    "cluster_storage_used_bytes": (int, float),
    "cluster_bandwidth_bytes": (int, float),
    "cluster_io_throughput": (int, float),
}

NUMERIC_FIELDS = tuple(SCHEMA_TELEMETRY_FIELDS) + tuple(CLUSTER_TELEMETRY_FIELDS)

REQUIRED_FIELDS = {
    **IDENTITY_FIELDS,
    **TIMESTAMP_FIELDS,
    **SCHEMA_TELEMETRY_FIELDS,
    **CLUSTER_TELEMETRY_FIELDS,
}

REQUIRED_NON_NUMERIC_FIELDS = {
    **IDENTITY_FIELDS,
    **TIMESTAMP_FIELDS,
}

PERCENT_FIELDS = {
    "cluster_cpu_usage_percent",
    "cluster_ram_usage_percent",
}

BYTE_FIELDS = {
    "result_size_bytes",
    "schema_size_bytes",
    "storage_growth_bytes",
    "cluster_storage_used_bytes",
    "cluster_bandwidth_bytes",
}

STANDARDIZED_BYTE_FIELDS = {
    "result_size_bytes": "result_size_mb",
    "schema_size_bytes": "schema_size_gb",
    "storage_growth_bytes": "storage_growth_mb",
    "cluster_storage_used_bytes": "cluster_storage_used_gb",
    "cluster_bandwidth_bytes": "cluster_bandwidth_mb",
}

NORMALIZED_FIELDS = (
    "query_count",
    "average_query_latency_seconds",
    "io_operations",
    "rows_returned",
    "query_frequency",
    "result_size_mb",
    "schema_size_gb",
    "storage_growth_mb",
    "write_operations",
    "cluster_cpu_usage_percent",
    "cluster_ram_usage_percent",
    "cluster_storage_used_gb",
    "cluster_bandwidth_mb",
    "cluster_io_throughput",
)

SUM_AGGREGATION_FIELDS = {
    "query_count",
    "io_operations",
    "rows_returned",
    "result_size_mb",
    "storage_growth_mb",
    "write_operations",
    "cluster_bandwidth_mb",
}

MEAN_AGGREGATION_FIELDS = {
    "query_frequency",
    "cluster_cpu_usage_percent",
    "cluster_ram_usage_percent",
    "cluster_io_throughput",
}

LATEST_AGGREGATION_FIELDS = {
    "schema_size_gb",
    "cluster_storage_used_gb",
}

WEIGHTED_AVERAGE_AGGREGATION_FIELDS = {
    "average_query_latency_seconds": "query_count",
}


@dataclass(frozen=True)
class ValidationResult:
    valid_records: list[dict[str, Any]]
    invalid_records: list[dict[str, Any]]


def parse_timestamp(value: str) -> datetime:
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"

    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    return parsed.astimezone(timezone.utc)


def align_timestamp_to_window(timestamp: datetime, window_seconds: int = 60) -> datetime:
    epoch_seconds = int(timestamp.timestamp())
    aligned_seconds = epoch_seconds - (epoch_seconds % window_seconds)
    return datetime.fromtimestamp(aligned_seconds, tz=timezone.utc)


def validate_telemetry_record(
    record: dict[str, Any],
    allow_missing_numeric: bool = True,
) -> list[str]:
    errors: list[str] = []

    for field, expected_type in REQUIRED_NON_NUMERIC_FIELDS.items():
        if field not in record:
            errors.append(f"Missing required field: {field}")
            continue

        value = record[field]
        if value is None:
            errors.append(f"Null value is not allowed for required field: {field}")
            continue

        if not isinstance(value, expected_type):
            errors.append(
                f"Invalid type for {field}: expected {expected_type}, got {type(value).__name__}"
            )
            continue

        if not value.strip():
            errors.append(f"{field} cannot be empty")

    for field, expected_type in {**SCHEMA_TELEMETRY_FIELDS, **CLUSTER_TELEMETRY_FIELDS}.items():
        if field not in record:
            if allow_missing_numeric:
                continue
            errors.append(f"Missing required numeric field: {field}")
            continue

        value = record[field]
        if value is None:
            if allow_missing_numeric:
                continue
            errors.append(f"Null value is not allowed for numeric field: {field}")
            continue

        if not isinstance(value, expected_type):
            errors.append(
                f"Invalid type for {field}: expected {expected_type}, got {type(value).__name__}"
            )
            continue

        if value < 0:
            errors.append(f"{field} cannot be negative")

    if "timestamp" in record and record.get("timestamp") is not None:
        try:
            parse_timestamp(record["timestamp"])
        except ValueError:
            errors.append("timestamp must be a valid ISO-8601 datetime")

    for field in PERCENT_FIELDS:
        value = record.get(field)
        if isinstance(value, (int, float)) and value > 100:
            errors.append(f"{field} cannot be greater than 100")

    return errors


def validate_telemetry_batch(
    records: Iterable[dict[str, Any]],
    allow_missing_numeric: bool = True,
) -> ValidationResult:
    valid_records: list[dict[str, Any]] = []
    invalid_records: list[dict[str, Any]] = []

    for index, record in enumerate(records):
        errors = validate_telemetry_record(
            record,
            allow_missing_numeric=allow_missing_numeric,
        )
        if errors:
            invalid_records.append(
                {
                    "index": index,
                    "record": record,
                    "errors": errors,
                }
            )
        else:
            valid_records.append(record.copy())

    return ValidationResult(valid_records=valid_records, invalid_records=invalid_records)


def filter_fresh_records(
    records: Iterable[dict[str, Any]],
    current_time: datetime | None = None,
    max_staleness_seconds: int = 300,
    future_tolerance_seconds: int = 30,
) -> ValidationResult:
    current_time = current_time or datetime.now(timezone.utc)
    if current_time.tzinfo is None:
        current_time = current_time.replace(tzinfo=timezone.utc)
    current_time = current_time.astimezone(timezone.utc)

    valid_records: list[dict[str, Any]] = []
    invalid_records: list[dict[str, Any]] = []

    for index, record in enumerate(records):
        timestamp = parse_timestamp(record["timestamp"])
        age_seconds = (current_time - timestamp).total_seconds()

        if age_seconds > max_staleness_seconds:
            invalid_records.append(
                {
                    "index": index,
                    "record": record,
                    "errors": [
                        f"Stale telemetry: age {age_seconds:.0f}s exceeds "
                        f"{max_staleness_seconds}s"
                    ],
                }
            )
            continue

        if age_seconds < -future_tolerance_seconds:
            invalid_records.append(
                {
                    "index": index,
                    "record": record,
                    "errors": [
                        f"Future telemetry: timestamp is {-age_seconds:.0f}s ahead of "
                        f"allowed {future_tolerance_seconds}s"
                    ],
                }
            )
            continue

        valid_records.append(record.copy())

    return ValidationResult(valid_records=valid_records, invalid_records=invalid_records)


def fill_missing_metric_values(
    records: list[dict[str, Any]],
    defaults: dict[str, float] | None = None,
) -> list[dict[str, Any]]:
    defaults = defaults or {}
    filled_records: list[dict[str, Any]] = []
    previous_values: dict[tuple[str, str, str], dict[str, float]] = {}

    for record in sorted(records, key=lambda item: item["timestamp"]):
        cleaned = record.copy()
        key = (cleaned["cluster_id"], cleaned["tenant_id"], cleaned["schema_name"])
        previous = previous_values.get(key, {})

        for field in NUMERIC_FIELDS:
            if field not in cleaned or cleaned.get(field) is None:
                cleaned[field] = previous.get(field, defaults.get(field, 0.0))

        previous_values[key] = {
            field: cleaned[field]
            for field in NUMERIC_FIELDS
            if isinstance(cleaned.get(field), (int, float))
        }
        filled_records.append(cleaned)

    return filled_records


def remove_duplicate_events(records: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[tuple[str, str, str, str]] = set()
    unique_records: list[dict[str, Any]] = []

    for record in records:
        event_key = (
            record["timestamp"],
            record["cluster_id"],
            record["tenant_id"],
            record["schema_name"],
        )

        if event_key in seen:
            continue

        seen.add(event_key)
        unique_records.append(record)

    return unique_records


def standardize_units(record: dict[str, Any]) -> dict[str, Any]:
    standardized = record.copy()
    standardized["average_query_latency_seconds"] = (
        standardized.pop("average_query_latency_ms") / 1000
    )

    for source_field, target_field in STANDARDIZED_BYTE_FIELDS.items():
        value = standardized.pop(source_field)
        if target_field.endswith("_gb"):
            standardized[target_field] = value / (1024**3)
        else:
            standardized[target_field] = value / (1024**2)

    return standardized


def prepare_telemetry_record(
    record: dict[str, Any],
    window_seconds: int = 60,
) -> dict[str, Any]:
    prepared = standardize_units(record)
    timestamp = parse_timestamp(prepared["timestamp"])
    aligned_timestamp = align_timestamp_to_window(timestamp, window_seconds)

    prepared["timestamp"] = timestamp.isoformat()
    prepared["window_start"] = aligned_timestamp.isoformat()
    prepared["window_seconds"] = window_seconds

    return prepared


def sum_field(records: list[dict[str, Any]], field: str) -> float:
    return float(sum(record[field] for record in records))


def mean_field(records: list[dict[str, Any]], field: str) -> float:
    return float(sum(record[field] for record in records) / len(records))


def latest_field(records: list[dict[str, Any]], field: str) -> float:
    latest_record = max(records, key=lambda record: record["timestamp"])
    return float(latest_record[field])


def weighted_average_field(
    records: list[dict[str, Any]],
    field: str,
    weight_field: str,
) -> float:
    total_weight = sum(record[weight_field] for record in records)
    if total_weight == 0:
        return mean_field(records, field)

    return float(
        sum(record[field] * record[weight_field] for record in records) / total_weight
    )


def aggregate_metric_field(records: list[dict[str, Any]], field: str) -> float:
    if field in SUM_AGGREGATION_FIELDS:
        return sum_field(records, field)

    if field in MEAN_AGGREGATION_FIELDS:
        return mean_field(records, field)

    if field in LATEST_AGGREGATION_FIELDS:
        return latest_field(records, field)

    if field in WEIGHTED_AVERAGE_AGGREGATION_FIELDS:
        return weighted_average_field(
            records,
            field,
            WEIGHTED_AVERAGE_AGGREGATION_FIELDS[field],
        )

    raise ValueError(f"No aggregation rule configured for field: {field}")


def aggregate_records(records: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str, str, str], list[dict[str, Any]]] = {}

    for record in records:
        key = (
            record["window_start"],
            record["cluster_id"],
            record["tenant_id"],
            record["schema_name"],
        )
        grouped.setdefault(key, []).append(record)

    aggregated_records: list[dict[str, Any]] = []
    for (window_start, cluster_id, tenant_id, schema_name), group in grouped.items():
        aggregated: dict[str, Any] = {
            "window_start": window_start,
            "cluster_id": cluster_id,
            "tenant_id": tenant_id,
            "schema_name": schema_name,
            "sample_count": len(group),
            "window_seconds": group[0].get("window_seconds", 60),
        }

        for field in NORMALIZED_FIELDS:
            aggregated[field] = aggregate_metric_field(group, field)

        aggregated_records.append(aggregated)

    return sorted(
        aggregated_records,
        key=lambda item: (
            item["window_start"],
            item["cluster_id"],
            item["tenant_id"],
            item["schema_name"],
        ),
    )


def add_moving_average_features(
    records: list[dict[str, Any]],
    fields: tuple[str, ...] = NORMALIZED_FIELDS,
    window_size: int = 3,
) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str, str], list[dict[str, Any]]] = {}

    for record in records:
        key = (record["cluster_id"], record["tenant_id"], record["schema_name"])
        grouped.setdefault(key, []).append(record)

    enhanced_records: list[dict[str, Any]] = []
    for group in grouped.values():
        ordered_group = sorted(group, key=lambda item: item["window_start"])

        for index, record in enumerate(ordered_group):
            enhanced = record.copy()
            start_index = max(0, index - window_size + 1)
            window = ordered_group[start_index : index + 1]

            for field in fields:
                enhanced[f"{field}_ma{window_size}"] = (
                    sum(item[field] for item in window) / len(window)
                )

            enhanced_records.append(enhanced)

    return sorted(
        enhanced_records,
        key=lambda item: (
            item["window_start"],
            item["cluster_id"],
            item["tenant_id"],
            item["schema_name"],
        ),
    )


def add_growth_rate_features(
    records: list[dict[str, Any]],
    fields: tuple[str, ...] = ("schema_size_gb", "query_count", "write_operations"),
) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str, str], list[dict[str, Any]]] = {}

    for record in records:
        key = (record["cluster_id"], record["tenant_id"], record["schema_name"])
        grouped.setdefault(key, []).append(record)

    enhanced_records: list[dict[str, Any]] = []
    for group in grouped.values():
        previous: dict[str, Any] | None = None
        for record in sorted(group, key=lambda item: item["window_start"]):
            enhanced = record.copy()

            for field in fields:
                previous_value = previous[field] if previous else None
                current_value = enhanced[field]
                if previous_value in (None, 0):
                    enhanced[f"{field}_growth_rate"] = 0.0
                else:
                    enhanced[f"{field}_growth_rate"] = (
                        current_value - previous_value
                    ) / previous_value

            previous = enhanced
            enhanced_records.append(enhanced)

    return sorted(
        enhanced_records,
        key=lambda item: (
            item["window_start"],
            item["cluster_id"],
            item["tenant_id"],
            item["schema_name"],
        ),
    )


def detect_outliers(record: dict[str, Any]) -> list[str]:
    outliers: list[str] = []

    if record["cluster_cpu_usage_percent"] > 100:
        outliers.append("cluster_cpu_usage_percent is above 100")

    if record["cluster_ram_usage_percent"] > 100:
        outliers.append("cluster_ram_usage_percent is above 100")

    if record["average_query_latency_seconds"] > 60:
        outliers.append("average_query_latency_seconds is unusually high")

    return outliers


def min_max_normalize(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not records:
        return []

    ranges: dict[str, tuple[float, float]] = {}
    for field in NORMALIZED_FIELDS:
        values = [record[field] for record in records]
        ranges[field] = (min(values), max(values))

    normalized_records: list[dict[str, Any]] = []
    for record in records:
        normalized = record.copy()

        for field, (minimum, maximum) in ranges.items():
            target_field = f"normalized_{field}"
            if maximum == minimum:
                normalized[target_field] = 0.0
            else:
                normalized[target_field] = (record[field] - minimum) / (maximum - minimum)

        normalized_records.append(normalized)

    return normalized_records


def normalize_by_cluster_window(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str], list[dict[str, Any]]] = {}

    for record in records:
        key = (record["cluster_id"], record["window_start"])
        grouped.setdefault(key, []).append(record)

    normalized_records: list[dict[str, Any]] = []
    for group in grouped.values():
        normalized_records.extend(min_max_normalize(group))

    return sorted(
        normalized_records,
        key=lambda item: (
            item["window_start"],
            item["cluster_id"],
            item["tenant_id"],
            item["schema_name"],
        ),
    )


def process_telemetry(
    raw_records: list[dict[str, Any]],
    window_seconds: int = 60,
    smoothing_window_size: int = 3,
    current_time: datetime | None = None,
    max_staleness_seconds: int = 300,
    future_tolerance_seconds: int = 30,
    missing_value_defaults: dict[str, float] | None = None,
) -> dict[str, Any]:
    initial_validation = validate_telemetry_batch(
        raw_records,
        allow_missing_numeric=True,
    )
    freshness_validation = filter_fresh_records(
        initial_validation.valid_records,
        current_time=current_time,
        max_staleness_seconds=max_staleness_seconds,
        future_tolerance_seconds=future_tolerance_seconds,
    )
    deduplicated = remove_duplicate_events(freshness_validation.valid_records)
    recovered = fill_missing_metric_values(
        deduplicated,
        defaults=missing_value_defaults,
    )
    strict_validation = validate_telemetry_batch(
        recovered,
        allow_missing_numeric=False,
    )
    prepared = [
        prepare_telemetry_record(record, window_seconds=window_seconds)
        for record in strict_validation.valid_records
    ]
    aggregated = aggregate_records(prepared)
    smoothed = add_moving_average_features(
        aggregated,
        window_size=smoothing_window_size,
    )
    with_growth_rates = add_growth_rate_features(smoothed)
    normalized = normalize_by_cluster_window(with_growth_rates)

    outlier_records = [
        {
            "cluster_id": record["cluster_id"],
            "tenant_id": record["tenant_id"],
            "schema_name": record["schema_name"],
            "window_start": record["window_start"],
            "outliers": detect_outliers(record),
        }
        for record in normalized
        if detect_outliers(record)
    ]

    return {
        "records": normalized,
        "invalid_records": (
            initial_validation.invalid_records
            + freshness_validation.invalid_records
            + strict_validation.invalid_records
        ),
        "outlier_records": outlier_records,
    }


if __name__ == "__main__":
    sample_records = [
        {
            "timestamp": "2026-05-26T05:30:05Z",
            "cluster_id": "cluster_1",
            "tenant_id": "tenant_a",
            "schema_name": "tenant_a_schema",
            "query_count": 1200,
            "average_query_latency_ms": 45,
            "io_operations": 800,
            "rows_returned": 50000,
            "query_frequency": 300,
            "result_size_bytes": 120 * 1024 * 1024,
            "schema_size_bytes": 2 * 1024 * 1024 * 1024,
            "storage_growth_bytes": 180 * 1024 * 1024,
            "write_operations": 450,
            "cluster_cpu_usage_percent": 68,
            "cluster_ram_usage_percent": 72,
            "cluster_storage_used_bytes": 900 * 1024 * 1024 * 1024,
            "cluster_bandwidth_bytes": 15000 * 1024 * 1024,
            "cluster_io_throughput": 32000,
        },
        {
            "timestamp": "2026-05-26T05:30:35Z",
            "cluster_id": "cluster_1",
            "tenant_id": "tenant_a",
            "schema_name": "tenant_a_schema",
            "query_count": 600,
            "average_query_latency_ms": 75,
            "io_operations": 400,
            "rows_returned": 25000,
            "query_frequency": None,
            "result_size_bytes": 70 * 1024 * 1024,
            "schema_size_bytes": 3 * 1024 * 1024 * 1024,
            "storage_growth_bytes": 80 * 1024 * 1024,
            "write_operations": 250,
            "cluster_cpu_usage_percent": 70,
            "cluster_ram_usage_percent": 75,
            "cluster_storage_used_bytes": 905 * 1024 * 1024 * 1024,
            "cluster_bandwidth_bytes": 6000 * 1024 * 1024,
            "cluster_io_throughput": 34000,
        },
        {
            "timestamp": "2026-05-26T05:30:17Z",
            "cluster_id": "cluster_1",
            "tenant_id": "tenant_b",
            "schema_name": "tenant_b_schema",
            "query_count": 900,
            "average_query_latency_ms": 80,
            "io_operations": 650,
            "rows_returned": 36000,
            "query_frequency": 220,
            "result_size_bytes": 85 * 1024 * 1024,
            "schema_size_bytes": 5 * 1024 * 1024 * 1024,
            "storage_growth_bytes": 90 * 1024 * 1024,
            "write_operations": 300,
            "cluster_cpu_usage_percent": 68,
            "cluster_ram_usage_percent": 72,
            "cluster_storage_used_bytes": 900 * 1024 * 1024 * 1024,
            "cluster_bandwidth_bytes": 15000 * 1024 * 1024,
            "cluster_io_throughput": 32000,
        },
    ]

    result = process_telemetry(
        sample_records,
        current_time=parse_timestamp("2026-05-26T05:31:00Z"),
    )
    print(result["records"])
