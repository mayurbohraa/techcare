import BPChart from "../BPChart/BPChart";
import VitalCard from "../VitalCard/VitalCard";
import "./DiagnosisHistory.css";
import IconLungs from "../../assets/respiratory rate.svg";
import IconThermometer from "../../assets/temperature.svg";
import IconHeartPulse from "../../assets/HeartBPM.svg";
import IconExpand from '../../assets/expand_more_FILL0_wght300_GRAD0_opsz24.svg'

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthIndex(m) {
  const i = MONTHS.indexOf(m);
  return i === -1 ? 0 : i;
}

function compareChrono(a, b) {
  if (a.year !== b.year) return a.year - b.year;
  return monthIndex(a.month) - monthIndex(b.month);
}

function chartLabel(entry) {
  const short = entry.month.slice(0, 3);
  return `${short}, ${entry.year}`;
}

function getLastSixForChart(history) {
  if (!history || !history.length) return [];
  const lastSix = history.slice(0, 6);
  return [...lastSix].sort(compareChrono);
}

function BpLevelText({ levels }) {
  if (!levels) {
    return <span className="dh-bp__level dh-bp__level--muted">—</span>;
  }
  const s = String(levels);
  if (s.includes("Higher")) {
    return (
      <span className="dh-bp__level">
        <span className="dh-bp__arrow dh-bp__arrow--high">▲</span>
        <span className="dh-bp__level-label">{s}</span>
      </span>
    );
  }
  if (s.includes("Lower")) {
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
  const history = data || [];
  const chartRows = getLastSixForChart(history);
  const labels = chartRows.map(chartLabel);
  const systolic = chartRows.map(
    (h) => h.blood_pressure?.systolic?.value ?? null,
  );
  const diastolic = chartRows.map(
    (h) => h.blood_pressure?.diastolic?.value ?? null,
  );

  const latest = history[0] || {};
  const sys = latest.blood_pressure?.systolic;
  const dia = latest.blood_pressure?.diastolic;
  const rr = latest.respiratory_rate;
  const temp = latest.temperature;
  const hr = latest.heart_rate;

  return (
    <div className="dh">

      <h2 className="dh-title card-title-24pt">Diagnosis History</h2>
      
      <div className="dh-bp-card">

        <div className="dh-bp-card__body">

          <div>
            <div className="dh-bp-card__head">
            <h3 className="dh-bp-card__title inner-card-title-18pt">
              Blood Pressure
            </h3>
            <span className="dh-bp-card__dropdown body-secondary-info-14pt">
              <span>Last 6 months </span>              
              <img src={IconExpand} alt="" srcset="" />
            </span>
          </div>

          <div className="dh-bp-card__chart">
            <BPChart
              labels={labels}
              systolic={systolic}
              diastolic={diastolic}
            />
            </div>
          </div>
          

          <div className="dh-bp-card__stats">

            <div className="dh-bp__stat">
              <div className="dh-bp__stat-head">
                <span className="dh-bp__dot dh-bp__dot--pink" />
                <span className="dh-bp__stat-label">Systolic</span>
              </div>
              <div className="dh-bp__value">{sys?.value ?? "—"}</div>
              <BpLevelText levels={sys?.levels} />
            </div>

            <div className="dh-bp__divider" />

            <div className="dh-bp__stat">
              <div className="dh-bp__stat-head">
                <span className="dh-bp__dot dh-bp__dot--purple" />
                <span className="dh-bp__stat-label">Diastolic</span>
              </div>
              <div className="dh-bp__value">{dia?.value ?? "—"}</div>
              <BpLevelText levels={dia?.levels} />
            </div>

          </div>
        </div>
      </div>


      <div className="dh-vitals">
        <VitalCard
          variant="resp"
          icon={<img src={IconLungs} alt="" srcset="" />}
          label="Respiratory Rate"
          value={rr?.value != null ? `${rr.value} bpm` : "—"}
          status={rr?.levels ?? ""}
        />
        <VitalCard
          variant="temp"
          icon={<img src={IconThermometer} alt="" srcset="" />}
          label="Temperature"
          value={temp?.value != null ? `${temp.value}°F` : "—"}
          status={temp?.levels ?? ""}
        />
        <VitalCard
          variant="heart"
          icon={<img src={IconHeartPulse} alt="" srcset="" />}
          label="Heart Rate"
          value={hr?.value != null ? `${hr.value} bpm` : "—"}
          status={hr?.levels ?? ""}
        />
      </div>
    </div>
  );
}
