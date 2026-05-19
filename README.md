# BridgedAI Register Deployment (`bridgedai-devsecops/register-deployment-action`)

## What this action does

In production, calls **`GET /v1/actions/capabilities`** on **`https://api.bridgedai.io`** (default) to check whether deployment registration is supported. This action does **not** invent private registration routes; when the backend publishes a public registration endpoint, this action will be updated to call it. Use `mode: mock` for demos.

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

