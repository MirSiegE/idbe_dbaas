# IntelliDB DBaaS Control Plane

This project is the new managed database platform layer around the existing IntelliDB Enterprise product.

It is not a rewrite of the IntelliDB dashboard. The control plane owns onboarding, tenant provisioning, resource state, telemetry rollups, billing estimates, and the new DBaaS GUI. It integrates with the existing IntelliDB backend through stable bridge APIs.

## Architecture

```text
New DBaaS GUI
      |
      v
Control-Plane Backend
  |        |         |
  |        |         +--> Database / metadata layer
  |        +------------> Cloud orchestration layer
  +---------------------> Telemetry / billing layer
      |
      v
IntelliDB Bridge API
/api/v1/bridge/*
      |
      v
Existing IntelliDB product
