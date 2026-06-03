import { useEffect, useState } from 'react';
import { fetchPatientData } from './api/patientAPI';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import DiagnosisHistory from './components/DiagnosisHistory/DiagnosisHistory';
import DiagnosticList from './components/DiagnosticList/DiagnosticList';
import PatientProfile from './components/PatientsProfile/PatientProfile';
import LabResults from './components/LabResults/LabResults';
import './App.css';

function App() {

  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const load = async ({ isInitial } = { isInitial: false }) => {
      try {
        const { patients: list, patient: jessica } = await fetchPatientData({
          signal: controller.signal,
        });
        if (!mounted) return;
        setPatients(list);
        setPatient(jessica);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        if (e?.name === 'AbortError') return;
        if (isInitial) setError(e.message || 'Failed to load data');
      } finally {
        if (mounted && isInitial) setLoading(false);
      }
    };

    load({ isInitial: true });

    const interval = window.setInterval(() => {
      load({ isInitial: false });
    }, 60_000);

    return () => {
      mounted = false;
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

//loader

  if (loading) {
    return (
      <div className="app app--state">
        <p className="state-message">Loading patient data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app app--state">
        <p className="state-message state-message--error">{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      
      <Navbar />

      <div className="main-layout">
      
        <Sidebar patients={patients} />
      
        <main>
          <DiagnosisHistory data={patient.diagnosis_history} />
          <DiagnosticList list={patient.diagnostic_list} />
        </main>
      
        <aside>
          <PatientProfile patient={patient} />
          <LabResults results={patient.lab_results} />
        </aside>
      
      </div>
    </div>
  );
}

export default App;
