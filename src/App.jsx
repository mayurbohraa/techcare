import { useEffect, useRef, useState } from 'react';
import { fetchPatientData } from './api/patientAPI';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import DiagnosisHistory from './components/DiagnosisHistory/DiagnosisHistory';
import DiagnosticList from './components/DiagnosticList/DiagnosticList';
import PatientProfile from './components/PatientsProfile/PatientProfile';
import LabResults from './components/LabResults/LabResults';
import TechCareLogo from './assets/techcare-logo.png';
import useScrollVisibility from './hooks/useScrollVisibility';
import { selectPatient } from './utils/patients';
import WorkspacePages from './components/WorkspacePages/WorkspacePages';
import './App.css';

export default function App() {
  useScrollVisibility();
  const [patients, setPatients] = useState([]);
  const [selectedName, setSelectedName] = useState('Jessica Taylor');
  const [page, setPage] = useState('patients');
  const contentRef = useRef(null);
  const patient = selectPatient(patients, selectedName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [patientsOpen, setPatientsOpen] = useState(false);
  const patientsDialog = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1101px)');
    const closeOnDesktop = () => {
      if (desktop.matches) patientsDialog.current?.close();
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, left: 0 });
    contentRef.current?.focus({ preventScroll: true });
  }, [page, patient?.name]);

  function navigate(target) {
    setPage(target);
    patientsDialog.current?.close();
  }

  function choosePatient(name) {
    setSelectedName(name);
    navigate('patients');
  }

  function openPatients() {
    patientsDialog.current?.showModal();
    setPatientsOpen(true);
  }

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    let timer;
    async function load() {
      try {
        const result = await fetchPatientData({ signal: controller.signal });
        if (!mounted) return;
        setPatients(result.patients);
        setError(null);
      } catch (error) {
        if (mounted && !controller.signal.aborted)
          setError(error.message || 'Unable to load patient data.');
      } finally {
        if (mounted) {
          setLoading(false);
          // Schedule after completion so slow requests never overlap.
          timer = window.setTimeout(load, 60_000);
        }
      }
    }
    load();
    return () => {
      mounted = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [attempt]);

  function retry() {
    setLoading(true);
    setError(null);
    setAttempt((value) => value + 1);
  }

  if (!patient) {
    return (
      <main className="app app--state">
        <img className="preloader__logo" src={TechCareLogo} alt="Tech.Care" />
        <h1 className="sr-only">Tech.Care patient dashboard</h1>
        <p
          className={`state-message${error ? ' state-message--error' : ''}`}
          role={error ? 'alert' : 'status'}
        >
          {loading ? 'Loading patient records…' : error}
        </p>
        {!loading && (
          <button className="action-button" onClick={retry}>
            Try again
          </button>
        )}
      </main>
    );
  }
  return (
    <div className="app">
      <a className="skip-link" href="#page-content">
        Skip to main content
      </a>
      <Navbar page={page} onNavigate={navigate} />
      {error && (
        <div className="refresh-notice" role="status">
          <span>{error} Previously loaded records are still displayed.</span>
          <button className="action-button" onClick={retry}>
            Retry
          </button>
        </div>
      )}
      {loading && <p role="status">Refreshing patient data…</p>}
      <div className="mobile-toolbar">
        <button
          className="patients-toggle"
          onClick={openPatients}
          aria-haspopup="dialog"
          aria-expanded={patientsOpen}
          aria-controls="patients-drawer"
        >
          <span className="hamburger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Patients
        </button>
        <span className="mobile-toolbar__patient">{patient.name}</span>
      </div>
      <div className="main-layout">
        <div className="desktop-patients">
          <Sidebar
            patients={patients}
            selectedName={patient.name}
            onSelect={choosePatient}
            idPrefix="desktop"
          />
        </div>
        <main
          ref={contentRef}
          id="page-content"
          className={`dashboard-content${page === 'patients' ? '' : ' dashboard-content--page'}`}
          aria-label="Workspace content"
          tabIndex={-1}
        >
          {page === 'patients' && (
            <>
              <section aria-label="Selected patient record">
                <div className="patient-heading">
                  <p>Patient record</p>
                  <h1 className="card-title-24pt">{patient.name}</h1>
                </div>
                <p className="sr-only" role="status">
                  Viewing {patient.name}'s record
                </p>
                <DiagnosisHistory data={patient.diagnosis_history} />
                <DiagnosticList list={patient.diagnostic_list} />
              </section>
              <aside aria-label="Patient profile and lab results">
                <PatientProfile patient={patient} />
                <LabResults results={patient.lab_results} />
              </aside>
            </>
          )}
          <WorkspacePages
            page={page}
            patients={patients}
            onNavigate={navigate}
            onRefresh={retry}
            refreshing={loading}
          />
        </main>
      </div>
      <dialog
        ref={patientsDialog}
        id="patients-drawer"
        className="patients-drawer"
        aria-labelledby="drawer-patients-title"
        onClose={() => setPatientsOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          ) {
            event.currentTarget.close();
          }
        }}
      >
        <Sidebar
          patients={patients}
          selectedName={patient.name}
          onSelect={choosePatient}
          idPrefix="drawer"
          onClose={() => patientsDialog.current?.close()}
        />
      </dialog>
    </div>
  );
}
