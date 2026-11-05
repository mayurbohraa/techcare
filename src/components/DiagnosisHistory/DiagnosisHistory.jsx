import BPChart from '../BPChart/BPChart';
import VitalCard from '../VitalCard/VitalCard';
import './DiagnosisHistory.css';
import IconLungs from '../../assets/respiratory rate.svg';
import IconThermometer from '../../assets/temperature.svg';
import IconHeartPulse from '../../assets/HeartBPM.svg';
import { recentHistory } from '../../utils/diagnosisHistory';

function chartLabel(entry) {
  return `${entry.month.slice(0, 3)}, ${entry.year}`;
}

function BpLevelText({ levels }) {
  if (!levels) {
    return <span className="dh-bp__level dh-bp__level--muted">—</span>;
  }
  const s = String(levels);
  if (s.includes('Higher')) {
    return (
      <span className="dh-bp__level">
        <span className="dh-bp__arrow dh-bp__arrow--high">▲</span>
        <span className="dh-bp__level-label">{s}</span>
      </span>
    );
  }
  if (s.includes('Lower')) {
    return (
      <span className="dh-bp__level">
        <span className="dh-bp__arrow dh-bp__arrow--low">▼</span>
        <span className="dh-bp__level-label">{s}</span>
      </span>
    );
  }
  return <span className="dh-bp__level dh-bp__level--normal">{s}</span>;
}

export default function DiagnosisHistory({ data }) {
  const chartRows = recentHistory(data);
  const labels = chartRows.map(chartLabel);
  const systolic = chartRows.map(
    (h) => h.blood_pressure?.systolic?.value ?? null,
  );
  const diastolic = chartRows.map(
    (h) => h.blood_pressure?.diastolic?.value ?? null,
  );

  const latest = chartRows.at(-1) || {};
  const sys = latest.blood_pressure?.systolic;
  const dia = latest.blood_pressure?.diastolic;
  const rr = latest.respiratory_rate;
  const temp = latest.temperature;
  const hr = latest.heart_rate;

  return (
    <section className="dh" aria-labelledby="history-title">
      <h2 id="history-title" className="dh-title card-title-24pt">
        Diagnosis History
      </h2>

      <div className="dh-bp-card">
        <div className="dh-bp-card__body">
          <div>
            <div className="dh-bp-card__head">
              <h3 className="dh-bp-card__title inner-card-title-18pt">
                Blood Pressure
              </h3>
              <span className="dh-bp-card__dropdown body-secondary-info-14pt">
                Latest 6 records
              </span>
            </div>
            <div className="dh-bp-card__chart">
              {chartRows.length ? (
                <BPChart
                  labels={labels}
                  systolic={systolic}
                  diastolic={diastolic}
                />
              ) : (
                <p className="empty-message">No diagnosis history available.</p>
              )}
            </div>
          </div>

          <div className="dh-bp-card__stats">
            <div className="dh-bp__stat">
              <div className="dh-bp__stat-head">
                <span className="dh-bp__dot dh-bp__dot--pink" />
                <span className="dh-bp__stat-label">Systolic</span>
              </div>
              <div className="dh-bp__value">{sys?.value ?? '—'}</div>
              <BpLevelText levels={sys?.levels} />
            </div>

            <div className="dh-bp__divider" />

            <div className="dh-bp__stat">
              <div className="dh-bp__stat-head">
                <span className="dh-bp__dot dh-bp__dot--purple" />
                <span className="dh-bp__stat-label">Diastolic</span>
              </div>
              <div className="dh-bp__value">{dia?.value ?? '—'}</div>
              <BpLevelText levels={dia?.levels} />
            </div>
          </div>
        </div>
      </div>

      <div className="dh-vitals">
        <VitalCard
          variant="resp"
          icon={<img src={IconLungs} alt="" />}
          label="Respiratory Rate"
          value={rr?.value != null ? `${rr.value} bpm` : '—'}
          status={rr?.levels ?? ''}
        />
        <VitalCard
          variant="temp"
          icon={<img src={IconThermometer} alt="" />}
          label="Temperature"
          value={temp?.value != null ? `${temp.value}°F` : '—'}
          status={temp?.levels ?? ''}
        />
        <VitalCard
          variant="heart"
          icon={<img src={IconHeartPulse} alt="" />}
          label="Heart Rate"
          value={hr?.value != null ? `${hr.value} bpm` : '—'}
          status={hr?.levels ?? ''}
        />
      </div>
    </section>
  );
}
