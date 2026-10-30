import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const PROJECT_REF = 'mvvmmewieigfslvqroia';

// Standalone functions are embedded unchanged in n8n Code nodes and tested here.
export function recoveryDecision(project, expectedRef) {
  if ((project.ref || project.id) !== expectedRef) throw new Error('Unexpected Supabase project.');
  const status = project.status;
  if (status === 'INACTIVE') return { projectRef: expectedRef, status, action: 'restore' };
  if (status === 'ACTIVE_HEALTHY') return { projectRef: expectedRef, status, action: 'probe' };
  if (['COMING_UP', 'RESTORING', 'RESTARTING', 'UPGRADING', 'RESIZING', 'PAUSING', 'GOING_DOWN'].includes(status)) {
    return { projectRef: expectedRef, status, action: 'wait' };
  }
  throw new Error(`Supabase requires attention: ${String(status)}`);
}

export function validateCatalog(response) {
  if (response.statusCode !== 200 || !Array.isArray(response.body)
      || response.body.some(row => !row || typeof row.id !== 'string')) {
    throw new Error('The public product catalog did not return a valid database response.');
  }
  return { outcome: 'healthy', checkedAt: new Date().toISOString() };
}

export function createRecoveryWorkflow({ managementCredentialId = 'CONFIGURE_MANAGEMENT_CREDENTIAL', catalogCredentialId = 'CONFIGURE_CATALOG_CREDENTIAL', minutes = 15 } = {}) {
  const managementAuth = { httpHeaderAuth: { id: managementCredentialId, name: 'VICLU Supabase Management' } };
  const catalogAuth = { httpHeaderAuth: { id: catalogCredentialId, name: 'VICLU Supabase Public Catalog' } };
  const projectUrl = `https://api.supabase.com/v1/projects/${PROJECT_REF}`;
  const http = (name, url, position, credentials, extra = {}) => ({
    id: name, name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position,
    parameters: { url, authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth', options: { timeout: 15000 }, ...extra },
    credentials,
  });
  const code = (name, jsCode, position) => ({ id: name, name, type: 'n8n-nodes-base.code', typeVersion: 2, position, parameters: { jsCode } });
  const condition = (name, expected, position) => ({
    id: name, name, type: 'n8n-nodes-base.if', typeVersion: 2.2, position,
    parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 }, conditions: [{ id: name, leftValue: '={{ $json.action }}', rightValue: expected, operator: { type: 'string', operation: 'equals' } }], combinator: 'and' }, options: {} },
  });
  const getStatus = http('Estado Supabase', projectUrl, [240, 0], managementAuth);
  Object.assign(getStatus, { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000 });
  const probe = http('Consultar Catalogo', `https://${PROJECT_REF}.supabase.co/rest/v1/products?select=id&limit=1`, [1200, 0], catalogAuth);
  probe.parameters.options.response = { response: { fullResponse: true, responseFormat: 'json' } };
  Object.assign(probe, { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000 });
  const edge = node => ({ node, type: 'main', index: 0 });
  return {
    name: 'VICLU - Supabase: actividad y recuperacion automatica',
    nodes: [
      { id: 'Cada 15 minutos', name: 'Cada 15 minutos', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0], parameters: { rule: { interval: [{ field: 'minutes', minutesInterval: minutes }] } } },
      getStatus,
      code('Decidir Recuperacion', `const decide = ${recoveryDecision.toString()};\nreturn [{ json: decide($json, '${PROJECT_REF}') }];`, [480, 0]),
      condition('Esta Pausado', 'restore', [720, 0]),
      http('Reactivar Proyecto', `${projectUrl}/restore`, [960, -240], managementAuth, { method: 'POST' }),
      code('Reactivacion Solicitada', "return [{ json: { outcome: 'restore_requested', checkedAt: new Date().toISOString(), note: 'La siguiente comprobacion verificara la disponibilidad.' } }];", [1200, -240]),
      condition('Esta Disponible', 'probe', [960, 120]),
      probe,
      code('Verificar Catalogo', `const validate = ${validateCatalog.toString()};\nreturn [{ json: validate($json) }];`, [1440, 0]),
      code('Esperar Transicion', "return [{ json: { outcome: 'waiting', status: $json.status, checkedAt: new Date().toISOString() } }];", [1200, 240]),
    ],
    connections: {
      'Cada 15 minutos': { main: [[edge('Estado Supabase')]] },
      'Estado Supabase': { main: [[edge('Decidir Recuperacion')]] },
      'Decidir Recuperacion': { main: [[edge('Esta Pausado')]] },
      'Esta Pausado': { main: [[edge('Reactivar Proyecto')], [edge('Esta Disponible')]] },
      'Reactivar Proyecto': { main: [[edge('Reactivacion Solicitada')]] },
      'Esta Disponible': { main: [[edge('Consultar Catalogo')], [edge('Esperar Transicion')]] },
      'Consultar Catalogo': { main: [[edge('Verificar Catalogo')]] },
    },
    settings: { executionOrder: 'v1', executionTimeout: 180, timezone: 'America/Bogota', saveDataErrorExecution: 'all', saveDataSuccessExecution: 'none' },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await writeFile(new URL('./supabase-recovery.n8n.json', import.meta.url), `${JSON.stringify(createRecoveryWorkflow(), null, 2)}\n`);
  console.log('Generated ops/supabase-recovery.n8n.json (credential references only).');
}
