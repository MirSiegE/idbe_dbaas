from __future__ import annotations


# Formula weights for derived tenant pressure scores.
QLF_WEIGHTS = {
    "query_execution_cost": 0.5,
    "query_count": 0.5,
    "average_query_latency": 0.25,
    "io_operations": 0.25,
}

NPF_WEIGHTS = {
    "rows_returned": 0.4,
    "query_frequency": 0.25,
    "result_size": 0.35,
}

SPS_WEIGHTS = {
    "schema_size": 0.45,
    "storage_growth_rate": 0.35,
    "write_operations": 0.2,
}


# Billing rate card values.
CPU_RATE_PER_PERCENT_HOUR = 0.01
RAM_RATE_PER_PERCENT_HOUR = 0.008
IO_RATE_PER_THROUGHPUT_HOUR = 0.0001
BANDWIDTH_RATE_PER_MB = 0.00002
STORAGE_RATE_PER_GB_HOUR = 0.001

BILLING_RATE_VALUES = {
    "cpu_rate_per_percent_hour": CPU_RATE_PER_PERCENT_HOUR,
    "ram_rate_per_percent_hour": RAM_RATE_PER_PERCENT_HOUR,
    "io_rate_per_throughput_hour": IO_RATE_PER_THROUGHPUT_HOUR,
    "bandwidth_rate_per_mb": BANDWIDTH_RATE_PER_MB,
    "storage_rate_per_gb_hour": STORAGE_RATE_PER_GB_HOUR,
}


# Platform service cost components:
# Platform_Service_Cost = ML + Monitoring + Analytics.
ML_SERVICE_COST = 0.0
MONITORING_SERVICE_COST = 0.25
ANALYTICS_PROCESSING_COST = 0.10

PLATFORM_SERVICE_FEE_VALUES = {
    "ml_service_cost": ML_SERVICE_COST,
    "monitoring_service_cost": MONITORING_SERVICE_COST,
    "analytics_processing_cost": ANALYTICS_PROCESSING_COST,
}


# Fixed subscription charge, independent of resource usage and service costs.
FIXED_SUBSCRIPTION_COST = 1.0
BASE_PLATFORM_FEE = FIXED_SUBSCRIPTION_COST
