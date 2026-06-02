#!/bin/bash
set -e

REGISTRY="crpi-01p9dri69xu13hgk.cn-guangzhou.personal.cr.aliyuncs.com"
NAMESPACE="yuchenai"
REPO="yuchenaitech"
TAG="${1:-latest}"

FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${REPO}:${TAG}"

echo "==> Building Docker image..."
docker build -t yuchenai:local .

echo "==> Tagging as ${FULL_IMAGE}..."
docker tag yuchenai:local "${FULL_IMAGE}"

echo "==> Pushing ${FULL_IMAGE}..."
docker push "${FULL_IMAGE}"

echo "==> Done: ${FULL_IMAGE}"
