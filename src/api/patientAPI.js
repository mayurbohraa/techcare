const API_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';

/**
 * Fetches all patients from the Coalition API, then resolves Jessica Taylor
 * for the main panels. Returns both arrays so the sidebar can list everyone.
 */

export const fetchPatientData = async ({ signal } = {}) => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: 'Basic ' + btoa('coalition:skills-test'),
    },
    signal,
  });



  if (!response.ok) {
    throw new Error('API fetch failed');
  }

  const data = await response.json();
  const patient = data.find((p) => p.name === 'Jessica Taylor');

  if (!patient) {
    throw new Error('Jessica Taylor not found in API response');
  }

  return { patients: data, patient };
};
