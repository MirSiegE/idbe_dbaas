#!/bin/bash

# This script deploys the IntelliDB PostgreSQL infrastructure to Kubernetes
# Run this from the intellidb-cloud/ folder: ./scripts/deploy.sh

echo "========================================"
echo " IntelliDB Infrastructure Deploy"
echo "========================================"

# Step 1: Create the namespace first
# Everything else lives inside this namespace, so it must exist first
echo ""
echo "Step 1: Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Step 2: Create secrets (passwords)
# StatefulSet will reference these, so they must exist before StatefulSet
echo ""
echo "Step 2: Creating secrets..."
kubectl apply -f k8s/secrets.yaml

# Step 3: Create configmap (non-sensitive config)
# Same reason — StatefulSet references this
echo ""
echo "Step 3: Creating configmap..."
kubectl apply -f k8s/configmap.yaml

# Step 4: Create services
# Headless service MUST exist before StatefulSet
# StatefulSet reads the serviceName field immediately on creation
echo ""
echo "Step 4: Creating services..."
kubectl apply -f k8s/services.yaml

# Step 5: Create the StatefulSet
# This actually starts the PostgreSQL pods
echo ""
echo "Step 5: Creating PostgreSQL StatefulSet..."
kubectl apply -f k8s/statefulset.yaml

# Step 6: Wait for pods to be ready
# kubectl apply returns immediately — it just submits the request
# We wait here so the script only finishes when pods are actually running
echo ""
echo "Step 6: Waiting for pods to be ready (this takes ~60 seconds)..."
kubectl wait --for=condition=ready pod -l app=postgres -n intellidb --timeout=180s

# Step 7: Show final status
echo ""
echo "========================================"
echo " Deploy Complete — Current Status"
echo "========================================"

echo ""
echo "PODS (check NODE column — should be different nodes):"
kubectl get pods -n intellidb -o wide

echo ""
echo "STORAGE (check STATUS column — should say Bound):"
kubectl get pvc -n intellidb

echo ""
echo "SERVICES:"
kubectl get services -n intellidb