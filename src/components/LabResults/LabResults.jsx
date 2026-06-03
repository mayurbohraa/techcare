import './LabResults.css';
import IconDownload from '../../assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg'


export default function LabResults({ results }) {
  const items = results || [];

  return (
    <div className="labs">
      <h3 className="labs__title card-title-24pt">Lab Results</h3>
      <div className="labs__scroll" role="region" aria-label="Lab results">
        <ul className="labs__list">
          {items.map((name) => (
            <li key={name} className="labs__item">
              <span className="labs__name">{name}</span>
              <button type="button" className="labs__dl" aria-label={`Download ${name}`}>
                <img src={IconDownload} alt="" srcset="" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
