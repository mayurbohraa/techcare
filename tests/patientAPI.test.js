import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

let server;
let fetchPatientData;
before(async () => {
  server = await createServer({
    configFile: false,
    plugins: [react()],
    envFile: false,
    server: { middlewareMode: true, watch: null },
    appType: 'custom',
  });
  Object.assign(server.config.env, {
    VITE_COALITION_USER: 'test-user',
    VITE_COALITION_PASSWORD: 'test-password',
  });
  ({ fetchPatientData } = await server.ssrLoadModule('/src/api/patientAPI.js'));
});
after(async () => {
  await server?.close();
});

test('sends configured assessment credentials and returns the target record', async (context) => {
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(
      url,
      'https://fedskillstest.coalitiontechnologies.workers.dev',
    );
    assert.equal(
      options.headers.Authorization,
      `Basic ${btoa('test-user:test-password')}`,
    );
    return new Response(
      JSON.stringify([
        {
          name: 'Jessica Taylor',
          diagnosis_history: [],
          diagnostic_list: [],
          lab_results: [],
        },
      ]),
    );
  });
  const result = await fetchPatientData();
  assert.equal(result.patient.name, 'Jessica Taylor');
});
test('reports HTTP service failures', async (context) => {
  context.mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, { status: 503 }),
  );
  await assert.rejects(fetchPatientData(), /503/);
});
test('reports network failures with actionable feedback', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => {
    throw new TypeError('Failed to fetch');
  });
  await assert.rejects(fetchPatientData(), /Check your connection/);
});
test('propagates caller cancellation', async (context) => {
  context.mock.method(globalThis, 'fetch', async (url, { signal }) => {
    signal.throwIfAborted();
  });
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchPatientData({ signal: controller.signal }), {
    name: 'AbortError',
  });
});
test('times out stalled requests with retry feedback', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  context.mock.method(
    globalThis,
    'fetch',
    (url, { signal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener(
          'abort',
          () => reject(new DOMException('Aborted', 'AbortError')),
          { once: true },
        );
      }),
  );
  const pending = fetchPatientData();
  const rejection = assert.rejects(pending, /took too long/);
  context.mock.timers.tick(15_000);
  await rejection;
});

test('diagnostic rows remain exposed with associated column headers', async () => {
  const { default: DiagnosticList } = await server.ssrLoadModule(
    '/src/components/DiagnosticList/DiagnosticList.jsx',
  );
  const html = renderToStaticMarkup(
    createElement(DiagnosticList, {
      list: [
        {
          name: 'Sample diagnosis',
          description: 'Sample description',
          status: 'Under observation',
        },
      ],
    }),
  );
  assert.match(html, /Sample diagnosis/);
  assert.match(html, /<th scope="col">Problem\/Diagnosis<\/th>/);
  assert.doesNotMatch(html, /aria-hidden/);
  assert.equal((html.match(/<table/g) ?? []).length, 1);
});
test('an empty diagnosis collection provides feedback instead of an empty table', async () => {
  const { default: DiagnosticList } = await server.ssrLoadModule(
    '/src/components/DiagnosticList/DiagnosticList.jsx',
  );
  const html = renderToStaticMarkup(
    createElement(DiagnosticList, { list: [] }),
  );
  assert.match(html, /No diagnoses available/);
  assert.doesNotMatch(html, /<table/);
});

test('patient profiles show available details and omit absent fields', async () => {
  const { default: PatientProfile } = await server.ssrLoadModule(
    '/src/components/PatientsProfile/PatientProfile.jsx',
  );
  const html = renderToStaticMarkup(
    createElement(PatientProfile, {
      patient: { name: 'Other patient', age: 45, gender: 'Male' },
    }),
  );
  assert.match(html, /Other patient/);
  assert.match(html, /45/);
  assert.doesNotMatch(html, /Contact info|Insurance provider|undefined/);
});
test('workspace pages display clean labels and an expanded doctor profile', async () => {
  const { default: WorkspacePages } = await server.ssrLoadModule(
    '/src/components/WorkspacePages/WorkspacePages.jsx',
  );
  for (const page of [
    'overview',
    'schedule',
    'messages',
    'transactions',
    'doctor',
    'settings',
  ]) {
    const html = renderToStaticMarkup(
      createElement(WorkspacePages, {
        page,
        patients: [],
        onNavigate() {},
        onSelect() {},
        onRefresh() {},
      }),
    );
    assert.doesNotMatch(html, /\b(demo|sample|preview)\b/i);
    if (page === 'doctor') {
      assert.match(html, /Office hours/);
      assert.match(html, /Contact &amp; clinic/);
      assert.match(html, /Professional information/);
    }
  }
});
