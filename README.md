# BridgedAI Register Deployment (`bridgedai-devsecops/register-deployment-action`)

## What this action does

Registers a deployment in BridgedAI (`POST /api/v1/deployments/register`) in production, or simulates success in `mode: mock`.

## Why BridgedAI exists

Production deployments should be recorded for drift detection, audits, and incident response.

## Quick start

See `examples/basic.yml`.

## Enterprise setup

Pass stable service identifiers (`service`, `environment`, `region`, `cluster`) for clean trust graph edges.

## Inputs / outputs

See `action.yml`.

## Support

Use your BridgedAI support channel.

