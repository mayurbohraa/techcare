import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePatientData } from '../src/api/patientAPI.js';
import { recentHistory } from '../src/utils/diagnosisHistory.js';
import { selectPatient, summarizeDiagnoses } from '../src/utils/patients.js';

const patient = () => ({
  name: 'Jessica Taylor',
  diagnosis_history: [],
  diagnostic_list: [],
  lab_results: [],
});

test('selects Jessica while retaining the patient directory', () => {
  const jessica = patient();
  const result = parsePatientData([{ name: 'Other patient' }, jessica]);
  assert.deepEqual(result.patient, jessica);
  assert.equal(result.patients.length, 2);
});
test('rejects non-array responses and empty patient directories', () => {
  for (const response of [null, {}, 'invalid', []]) {
    assert.throws(() => parsePatientData(response));
  }
});
test('rejects malformed collections before components render', () => {
  for (const key of ['diagnosis_history', 'diagnostic_list', 'lab_results']) {
    assert.throws(
      () => parsePatientData([{ ...patient(), [key]: 'invalid' }]),
      /incomplete/,
    );
  }
});
test('rejects malformed diagnostics and lab results', () => {
  assert.throws(
    () => parsePatientData([{ ...patient(), diagnostic_list: [null] }]),
    /invalid results/,
  );
  assert.throws(
    () => parsePatientData([{ ...patient(), lab_results: [{}] }]),
    /invalid results/,
  );
});
test('selects the newest six records from unordered history without mutation', () => {
  const history = [
    'January',
    'August',
    'March',
    'July',
    'February',
    'June',
    'April',
    'May',
  ].map((month) => ({ month, year: 2024 }));
  const original = structuredClone(history);
  assert.deepEqual(
    recentHistory(history).map((entry) => entry.month),
    ['March', 'April', 'May', 'June', 'July', 'August'],
  );
  assert.deepEqual(history, original);
});
test('orders across years and safely handles empty or invalid history', () => {
  assert.deepEqual(
    recentHistory([
      { month: 'January', year: 2025 },
      null,
      { month: 'Unknown', year: 2024 },
      { month: 'December', year: 2024 },
    ]).map((entry) => entry.year),
    [2024, 2025],
  );
  assert.deepEqual(recentHistory(undefined), []);
  assert.deepEqual(recentHistory([]), []);
});

test('supports other patients when Jessica is not in the response', () => {
  const result = parsePatientData([{ name: 'Other patient' }]);
  assert.equal(result.patient.name, 'Other patient');
  assert.deepEqual(result.patient.diagnosis_history, []);
  assert.deepEqual(result.patient.diagnostic_list, []);
  assert.deepEqual(result.patient.lab_results, []);
});
test('retains a selected patient when refreshed data arrives', () => {
  const first = parsePatientData([
    patient(),
    { name: 'Other patient', age: 20 },
  ]);
  const refreshed = parsePatientData([
    { ...patient(), age: 30 },
    { name: 'Other patient', age: 21 },
  ]);
  assert.equal(selectPatient(first.patients, 'Other patient').age, 20);
  assert.equal(selectPatient(refreshed.patients, 'Other patient').age, 21);
});
test('falls back safely when the selected patient is removed', () => {
  assert.equal(
    selectPatient([patient()], 'Removed patient').name,
    'Jessica Taylor',
  );
  assert.equal(
    selectPatient([{ name: 'Other patient' }], 'Removed patient').name,
    'Other patient',
  );
  assert.equal(selectPatient([], 'Removed patient'), null);
});

test('overview counts each patient once per condition and groups status casing', () => {
  const data = [
    {
      diagnostic_list: [
        { name: 'Asthma', status: 'Under observation' },
        { name: 'asthma', status: 'Cured' },
      ],
    },
    {
      diagnostic_list: [
        { name: 'ASTHMA', status: 'Under Observation' },
        { name: 'Allergies', status: 'Cured' },
      ],
    },
  ];
  const result = summarizeDiagnoses(data);
  assert.deepEqual(result.conditions, [
    { label: 'Asthma', count: 2 },
    { label: 'Allergies', count: 1 },
  ]);
  assert.deepEqual(result.statuses, [
    { label: 'Cured', count: 2 },
    { label: 'Under observation', count: 2 },
  ]);
  assert.deepEqual(summarizeDiagnoses([]), { conditions: [], statuses: [] });
});
