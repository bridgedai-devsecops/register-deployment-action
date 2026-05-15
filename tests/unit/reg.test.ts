import { describe, expect, it, vi } from 'vitest';
import * as core from '@actions/core';
import { run } from '../../src/index';

describe('register-deployment-action', () => {
  it('mock mode', async () => {
    vi.spyOn(core, 'setOutput').mockImplementation(() => {});
    vi.spyOn(core, 'info').mockImplementation(() => {});
    vi.spyOn(core, 'getInput').mockImplementation((name: string) => {
      const m: Record<string, string> = {
        tenant: 't',
        image: 'img',
        digest: 'sha256:' + 'd'.repeat(64),
        environment: 'prod',
        service: '',
        region: '',
        cluster: '',
        'deployment-url': '',
        'policy-result-id': '',
        mode: 'mock',
      };
      return m[name] ?? '';
    });
    await expect(run()).resolves.toBeUndefined();
  });
});
