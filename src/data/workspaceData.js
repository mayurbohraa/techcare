// Local workspace fixtures; patient records are fetched separately from the API.
export const appointments = [
  {
    id: 'APT-01',
    date: '2026-11-05',
    time: '09:00',
    patient: 'Alex Morgan',
    type: 'Routine consultation',
    status: 'Completed',
    duration: '30 minutes',
  },
  {
    id: 'APT-02',
    date: '2026-11-05',
    time: '11:30',
    patient: 'Jordan Lee',
    type: 'Follow-up visit',
    status: 'Scheduled',
    duration: '20 minutes',
  },
  {
    id: 'APT-03',
    date: '2026-11-06',
    time: '10:00',
    patient: 'Sam Parker',
    type: 'Routine consultation',
    status: 'Scheduled',
    duration: '30 minutes',
  },
];
export const messageThreads = [
  {
    id: 'reception',
    sender: 'Reception',
    subject: 'Appointment coordination',
    text: 'Could you confirm the consultation schedule for this week?',
  },
  {
    id: 'care-team',
    sender: 'Care team',
    subject: 'Team updates',
    text: 'Please review the shared clinic schedule before the next shift.',
  },
];
export const transactions = [
  {
    id: 'INV-001',
    date: '2026-11-03',
    patient: 'Alex Morgan',
    description: 'Consultation',
    amount: 120,
    status: 'Paid',
  },
  {
    id: 'INV-002',
    date: '2026-11-04',
    patient: 'Jordan Lee',
    description: 'Follow-up consultation',
    amount: 80,
    status: 'Pending',
  },
  {
    id: 'INV-003',
    date: '2026-11-05',
    patient: 'Sam Parker',
    description: 'Consultation',
    amount: 120,
    status: 'Paid',
  },
];
