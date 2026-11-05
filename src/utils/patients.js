export function selectPatient(patients, name) {
  return (
    patients.find((patient) => patient.name === name) ??
    patients.find((patient) => patient.name === 'Jessica Taylor') ??
    patients[0] ??
    null
  );
}

export function normalizePatient(patient) {
  const result = { ...patient };
  for (const key of [
    'gender',
    'age',
    'date_of_birth',
    'phone_number',
    'emergency_contact',
    'insurance_type',
    'profile_picture',
  ]) {
    const value = result[key];
    if (value != null && typeof value !== 'string' && typeof value !== 'number')
      result[key] = undefined;
  }
  for (const key of ['diagnosis_history', 'diagnostic_list', 'lab_results']) {
    if (patient[key] == null) result[key] = [];
    else if (!Array.isArray(patient[key]))
      throw new Error('The patient record is incomplete. Please try again.');
  }
  if (
    result.diagnostic_list.some(
      (row) =>
        !row ||
        ['name', 'description', 'status'].some(
          (key) => typeof row[key] !== 'string',
        ),
    ) ||
    result.lab_results.some((name) => typeof name !== 'string')
  ) {
    throw new Error(
      'The patient record contains invalid results. Please try again.',
    );
  }
  return result;
}

export function summarizeDiagnoses(patients) {
  const conditions = new Map();
  const statuses = new Map();
  for (const patient of patients) {
    const seen = new Set();
    for (const diagnosis of patient.diagnostic_list ?? []) {
      const name = diagnosis.name.trim();
      const conditionKey = name.toLowerCase();
      if (conditionKey && !seen.has(conditionKey)) {
        const item = conditions.get(conditionKey) ?? { label: name, count: 0 };
        item.count += 1;
        conditions.set(conditionKey, item);
        seen.add(conditionKey);
      }
      const status = diagnosis.status.trim();
      const statusKey = status.toLowerCase();
      if (statusKey) {
        const item = statuses.get(statusKey) ?? { label: status, count: 0 };
        item.count += 1;
        statuses.set(statusKey, item);
      }
    }
  }
  const byCount = (a, b) => b.count - a.count || a.label.localeCompare(b.label);
  return {
    conditions: [...conditions.values()].sort(byCount).slice(0, 5),
    statuses: [...statuses.values()].sort(byCount),
  };
}
