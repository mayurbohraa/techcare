import { useState } from 'react';
import { doctor } from '../../data/doctor';
import { summarizeDiagnoses } from '../../utils/patients';
import {
  appointments,
  messageThreads,
  transactions,
} from '../../data/workspaceData';
import './WorkspacePages.css';

const money = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    amount,
  );
const dateLabel = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

function PageHeading({ title, description }) {
  return (
    <header className="workspace-heading">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function Overview({ patients }) {
  const { conditions, statuses } = summarizeDiagnoses(patients);
  return (
    <section className="workspace-page">
      <PageHeading
        title="Overview"
        description="A summary of the available patient records."
      />
      <div className="summary-grid">
        <article className="summary-card">
          <p>Patients</p>
          <strong>{patients.length}</strong>
        </article>
        <article className="summary-card">
          <p>With diagnosis history</p>
          <strong>
            {
              patients.filter((patient) => patient.diagnosis_history.length)
                .length
            }
          </strong>
        </article>
        <article className="summary-card">
          <p>Lab result entries</p>
          <strong>
            {patients.reduce(
              (sum, patient) => sum + patient.lab_results.length,
              0,
            )}
          </strong>
        </article>
      </div>
      <div className="overview-insights">
        <section className="workspace-card">
          <h2>Conditions across records</h2>
          <p className="muted">
            Top conditions by number of patient records. Each patient is counted
            once per condition.
          </p>
          {conditions.length ? (
            <ul className="condition-list">
              {conditions.map(({ label, count }) => (
                <li key={label}>
                  <div>
                    <span>{label}</span>
                    <strong>
                      {count} of {patients.length}
                    </strong>
                  </div>
                  <div className="condition-bar" aria-hidden="true">
                    <span
                      style={{
                        width: `${(count / Math.max(patients.length, 1)) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No diagnoses available.</p>
          )}
        </section>
        <section className="workspace-card">
          <h2>Diagnostic statuses</h2>
          <p className="muted">
            The status of diagnostic entries across all available records.
          </p>
          {statuses.length ? (
            <ul className="diagnostic-statuses">
              {statuses.map(({ label, count }) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No diagnostic statuses available.</p>
          )}
        </section>
      </div>
    </section>
  );
}

function Schedule() {
  const [date, setDate] = useState(appointments[0].date);
  const visible = appointments.filter(
    (appointment) => !date || appointment.date === date,
  );
  return (
    <section className="workspace-page">
      <PageHeading
        title="Schedule"
        description="Appointments and upcoming visits."
      />
      <div className="workspace-card">
        <div className="page-filters">
          <label>
            Appointment date
            <select
              value={date}
              onChange={(event) => setDate(event.target.value)}
            >
              <option value="">All dates</option>
              {[...new Set(appointments.map((item) => item.date))].map(
                (day) => (
                  <option key={day} value={day}>
                    {dateLabel(day)}
                  </option>
                ),
              )}
            </select>
          </label>
          <button className="text-button" onClick={() => setDate('')}>
            Show all dates
          </button>
        </div>
        <div className="record-list">
          {visible.map((appointment) => (
            <article className="record-list__item" key={appointment.id}>
              <div className="record-item__heading">
                <strong>
                  {appointment.time} · {dateLabel(appointment.date)}
                </strong>
                <span className="status-pill">{appointment.status}</span>
              </div>
              <h2>{appointment.patient}</h2>
              <p>{appointment.type}</p>
              <details>
                <summary>View appointment</summary>
                <p>Reference: {appointment.id}</p>
                <p>Duration: {appointment.duration}</p>
                <p>Location: Tech.Care Medical Center.</p>
              </details>
            </article>
          ))}
          {!visible.length && (
            <p className="empty-message">No appointments for this date.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Messages({ activeThread, setActiveThread, replies, addReply }) {
  const [draft, setDraft] = useState('');
  const thread = messageThreads.find((item) => item.id === activeThread);
  return (
    <section className="workspace-page">
      <PageHeading
        title="Messages"
        description="Conversations with your clinic team."
      />
      <div className="messages-layout">
        <section
          className="workspace-card message-threads"
          aria-label="Conversations"
        >
          {messageThreads.map((item) => (
            <button
              key={item.id}
              className="thread-button"
              aria-pressed={item.id === activeThread}
              onClick={() => {
                setActiveThread(item.id);
                setDraft('');
              }}
            >
              <strong>{item.sender}</strong>
              <span>{item.subject}</span>
            </button>
          ))}
        </section>
        <section
          className="workspace-card conversation"
          aria-labelledby="conversation-title"
        >
          <h2 id="conversation-title">{thread.subject}</h2>
          <p className="muted">{thread.sender}</p>
          <div
            className="conversation-log"
            role="log"
            aria-label="Conversation"
            tabIndex={0}
          >
            <p className="message-bubble">{thread.text}</p>
            {(replies[activeThread] ?? []).map((text, index) => (
              <p key={index} className="message-bubble message-bubble--reply">
                <small>You</small>
                {text}
              </p>
            ))}
          </div>
          <form
            className="reply-form"
            onSubmit={(event) => {
              event.preventDefault();
              const text = draft.trim();
              if (text) {
                addReply(activeThread, text);
                setDraft('');
              }
            }}
          >
            <label htmlFor="message-reply">Reply</label>
            <textarea
              id="message-reply"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Write your reply…"
            />
            <button className="action-button" disabled={!draft.trim()}>
              Send reply
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}

function Transactions() {
  const [status, setStatus] = useState('All');
  const visible = transactions.filter(
    (transaction) => status === 'All' || transaction.status === status,
  );
  return (
    <section className="workspace-page">
      <PageHeading
        title="Transactions"
        description="Invoices and payment statuses."
      />
      <div className="workspace-card">
        <div className="page-filters">
          <label>
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </label>
          <p className="muted">
            {visible.length} transaction{visible.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="record-list">
          {visible.map((transaction) => (
            <article className="record-list__item" key={transaction.id}>
              <div className="record-item__heading">
                <strong>{transaction.id}</strong>
                <span className="status-pill" data-status={transaction.status}>
                  {transaction.status}
                </span>
              </div>
              <h2>{money(transaction.amount)}</h2>
              <p>
                {transaction.patient} · {dateLabel(transaction.date)}
              </p>
              <details>
                <summary>View invoice</summary>
                <p>{transaction.description}</p>
                <p>Amount: {money(transaction.amount)} USD</p>
                <p>Payment method: Card</p>
              </details>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorProfile({ onNavigate }) {
  const contact = [
    ['Clinic', doctor.clinic],
    ['Department', doctor.department],
    ['Email', doctor.email],
    ['Phone', doctor.phone],
    ['Location', doctor.location],
  ];
  const professional = [
    ['Specialty', doctor.specialty],
    ['Languages', doctor.languages],
    ['Consultation types', doctor.consultationTypes],
    ['Qualifications', doctor.qualifications],
    ['Registration', doctor.registration],
  ];
  return (
    <section className="workspace-page">
      <PageHeading
        title="Doctor profile"
        description="Contact details and professional information."
      />
      <article className="workspace-card doctor-profile">
        <img src={doctor.photo} alt="" width={112} height={112} />
        <div>
          <h2>{doctor.name}</h2>
          <p>{doctor.specialty}</p>
          <p className="muted">
            {doctor.clinic} · {doctor.location}
          </p>
          <button
            className="action-button"
            onClick={() => onNavigate('settings')}
          >
            Workspace settings
          </button>
        </div>
      </article>
      <div className="doctor-details-grid">
        <section className="workspace-card">
          <h2>Contact & clinic</h2>
          <dl className="settings-list">
            {contact.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="workspace-card">
          <h2>Professional information</h2>
          <dl className="settings-list">
            {professional.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <section className="workspace-card">
        <h2>Office hours</h2>
        <p>{doctor.officeHours}</p>
        <p className="muted">{doctor.consultationTypes}</p>
      </section>
    </section>
  );
}

function Settings({ onNavigate, onRefresh, refreshing }) {
  return (
    <section className="workspace-page">
      <PageHeading
        title="Settings"
        description="Basic settings and information for this workspace."
      />
      <section className="workspace-card">
        <h2>Display preferences</h2>
        <p className="muted">Current workspace preferences.</p>
        <dl className="settings-list">
          <div>
            <dt>Appearance</dt>
            <dd>Tech.Care light</dd>
          </div>
          <div>
            <dt>Language</dt>
            <dd>English</dd>
          </div>
          <div>
            <dt>Scrollbars</dt>
            <dd>Show while scrolling</dd>
          </div>
        </dl>
      </section>
      <section className="workspace-card">
        <h2>Patient records</h2>
        <dl className="settings-list">
          <div>
            <dt>Automatic refresh</dt>
            <dd>Every 60 seconds after the last request</dd>
          </div>
          <div>
            <dt>Record changes</dt>
            <dd>Viewing only</dd>
          </div>
        </dl>
        <button
          className="action-button"
          disabled={refreshing}
          onClick={onRefresh}
        >
          {refreshing ? 'Refreshing…' : 'Refresh patient records'}
        </button>
      </section>
      <section className="workspace-card">
        <h2>Profile</h2>
        <p>
          {doctor.name} · {doctor.specialty}
        </p>
        <button className="text-button" onClick={() => onNavigate('doctor')}>
          View doctor profile
        </button>
      </section>
    </section>
  );
}

export default function WorkspacePages({
  page,
  patients,
  onNavigate,
  onRefresh,
  refreshing,
}) {
  const [activeThread, setActiveThread] = useState(messageThreads[0].id);
  const [replies, setReplies] = useState({});
  if (page === 'overview') return <Overview patients={patients} />;
  if (page === 'schedule') return <Schedule />;
  if (page === 'messages')
    return (
      <Messages
        activeThread={activeThread}
        setActiveThread={setActiveThread}
        replies={replies}
        addReply={(id, text) =>
          setReplies((previous) => ({
            ...previous,
            [id]: [...(previous[id] ?? []), text],
          }))
        }
      />
    );
  if (page === 'transactions') return <Transactions />;
  if (page === 'doctor') return <DoctorProfile onNavigate={onNavigate} />;
  if (page === 'settings')
    return (
      <Settings
        onNavigate={onNavigate}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    );
  return null;
}
