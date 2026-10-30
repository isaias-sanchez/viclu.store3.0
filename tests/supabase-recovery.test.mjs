import { describe, expect, it } from 'vitest';
import { createRecoveryWorkflow, recoveryDecision, validateCatalog, PROJECT_REF } from '../ops/supabase-recovery.mjs';

describe('Supabase recovery guard', () => {
  it('requests a restore only for the intended paused project', () => {
    expect(recoveryDecision({ ref: PROJECT_REF, status: 'INACTIVE' }, PROJECT_REF).action).toBe('restore');
    expect(() => recoveryDecision({ ref: 'another-project', status: 'INACTIVE' }, PROJECT_REF)).toThrow('Unexpected');
  });
  it('probes a healthy project without restarting it', () => {
    expect(recoveryDecision({ id: PROJECT_REF, status: 'ACTIVE_HEALTHY' }, PROJECT_REF).action).toBe('probe');
  });
  it.each(['RESTORING', 'COMING_UP', 'RESTARTING', 'UPGRADING', 'RESIZING', 'PAUSING', 'GOING_DOWN'])('does not restart a project in %s', status => {
    expect(recoveryDecision({ ref: PROJECT_REF, status }, PROJECT_REF).action).toBe('wait');
  });
  it.each(['ACTIVE_UNHEALTHY', 'UNKNOWN', 'RESTORE_FAILED', 'INIT_FAILED', 'REMOVED', undefined])('fails visibly on %s', status => {
    expect(() => recoveryDecision({ ref: PROJECT_REF, status }, PROJECT_REF)).toThrow('requires attention');
  });
  it('checks actual catalog responses, including a legitimately empty table', () => {
    expect(validateCatalog({ statusCode: 200, body: [{ id: 'real-product' }] }).outcome).toBe('healthy');
    expect(validateCatalog({ statusCode: 200, body: [] }).outcome).toBe('healthy');
    for (const response of [{ statusCode: 503, body: [] }, { statusCode: 200, body: '<html>' }, { statusCode: 200, body: [{}] }]) {
      expect(() => validateCatalog(response)).toThrow('valid database response');
    }
  });
  it('embeds tested decisions and protects the restore branch in the deployed graph', () => {
    const workflow = createRecoveryWorkflow();
    const plan = workflow.nodes.find(n => n.name === 'Decidir Recuperacion');
    const execute = new Function('$json', plan.parameters.jsCode);
    expect(execute({ ref: PROJECT_REF, status: 'INACTIVE' })[0].json.action).toBe('restore');
    expect(execute({ ref: PROJECT_REF, status: 'RESTORING' })[0].json.action).toBe('wait');
    expect(workflow.connections['Esta Pausado'].main[0][0].node).toBe('Reactivar Proyecto');
    expect(workflow.connections['Esta Pausado'].main[1][0].node).toBe('Esta Disponible');
    const restore = workflow.nodes.find(n => n.name === 'Reactivar Proyecto');
    expect(restore.parameters.method).toBe('POST');
    expect(restore.retryOnFail).toBeUndefined();
    expect(workflow.connections['Reactivar Proyecto'].main[0][0].node).toBe('Reactivacion Solicitada');
    expect(JSON.stringify(workflow)).not.toContain('sbp_');
    expect(workflow.nodes.every(n => !n.onError)).toBe(true);
  });
});
