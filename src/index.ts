import * as core from '@actions/core';
import { fail, getOptionalInput, getRequiredInput, maskSecret } from './lib/action-core';
import { setOutputs } from './lib/outputs';
import { appendJobSummary } from './lib/summary';
import { ConfigurationError } from './lib/errors';
import { normalizeApiBaseUrl, parseEnum } from './lib/validation';
import { postJsonWithRetries } from './lib/bridgedai-client';

export async function run(): Promise<void> {
  const tenant = getRequiredInput('tenant');
  const image = getRequiredInput('image');
  const digest = getRequiredInput('digest');
  const environment = getRequiredInput('environment');
  const service = getOptionalInput('service');
  const region = getOptionalInput('region');
  const cluster = getOptionalInput('cluster');
  const deploymentUrl = getOptionalInput('deployment-url');
  const policyResultId = getOptionalInput('policy-result-id');
  const mode = parseEnum('mode', getOptionalInput('mode') || 'production', ['production', 'mock'] as const);

  if (mode === 'mock') {
    core.info('MOCK MODE ENABLED');
    setOutputs({
      'deployment-id': 'mock-deployment-id',
      'trust-graph-url': 'https://mock.invalid/trust-graph',
    });
    await appendJobSummary('## BridgedAI deployment registration\n\n**MOCK MODE ENABLED**\n');
    return;
  }

  const apiUrl = normalizeApiBaseUrl(getRequiredInput('api-url'), 'api-url');
  const accessToken = getRequiredInput('access-token');
  maskSecret(accessToken);

  const url = `${apiUrl}/api/v1/deployments/register`;
  const res = await postJsonWithRetries<Record<string, unknown>>(
    url,
    {
      tenant,
      image,
      digest,
      environment,
      service,
      region,
      cluster,
      deploymentUrl,
      policyResultId,
    },
    { Authorization: `Bearer ${accessToken}` },
  );

  const deploymentId = String(res.deployment_id ?? res.deploymentId ?? res.id ?? '').trim();
  if (!deploymentId) {
    throw new ConfigurationError('BridgedAI response missing deployment id');
  }
  const trustGraphUrl = String(res.trust_graph_url ?? res.trustGraphUrl ?? '').trim();

  setOutputs({
    'deployment-id': deploymentId,
    'trust-graph-url': trustGraphUrl,
  });
  await appendJobSummary(`## BridgedAI deployment registration\n\n- **deployment**: \`${deploymentId}\`\n`);
}

if (process.env.VITEST !== 'true') {
  void run().catch((e) => {
    fail(e instanceof Error ? e : new Error(String(e)));
  });
}
