import { normalizePatient, selectPatient } from '../utils/patients.js';

const API_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';

export function parsePatientData(data) {
  if (!Array.isArray(data))
    throw new Error('The patient service returned an invalid response.');
  const patients = data
    .filter((item) => item && typeof item.name === 'string' && item.name.trim())
    .map(normalizePatient);
  if (!patients.length)
    throw new Error('No patient records are available. Please try again.');
  return { patients, patient: selectPatient(patients) };
}

export async function fetchPatientData({ signal } = {}) {
  const env = import.meta.env ?? {};
  const username = env.VITE_COALITION_USER;
  const password = env.VITE_COALITION_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'Patient service credentials are missing. Configure the application and try again.',
    );
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  else signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 15_000);
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error(
        `Patient service is unavailable (${response.status}). Please try again.`,
      );
    return parsePatientData(await response.json());
  } catch (error) {
    if (signal?.aborted) throw error;
    if (controller.signal.aborted)
      throw new Error(
        'The patient service took too long to respond. Please try again.',
      );
    if (error instanceof TypeError)
      throw new Error(
        'Unable to connect to the patient service. Check your connection and try again.',
      );
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
