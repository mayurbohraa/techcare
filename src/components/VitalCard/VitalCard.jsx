import './VitalCard.css';

export default function VitalCard({ variant, icon, label, value, status }) {
  return (
    <div className={'vital-card vital-card--' + variant}>
      <div className="vital-card__icon" aria-hidden>
        {icon}
      </div>
      <div className="vital-card__body">
        <div className="vital-card__label">{label}</div>
        <div className="vital-card__value">{value}</div>
        <div className="vital-card__status">{status}</div>
      </div>
    </div>
  );
}
