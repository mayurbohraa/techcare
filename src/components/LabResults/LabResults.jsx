import './LabResults.css';
import IconDownload from '../../assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg';

export default function LabResults({ results = [] }) {
  return (
    <section className="labs" aria-labelledby="labs-title">
      <h2 id="labs-title" className="labs__title card-title-24pt">
        Lab Results
      </h2>
      {!results.length && (
        <p className="empty-message">No lab results available.</p>
      )}
      <div
        className="labs__scroll"
        role="region"
        aria-label="Lab results"
        tabIndex={0}
      >
        <ul className="labs__list">
          {results.map((name, index) => (
            <li key={`${name}-${index}`} className="labs__item">
              <span className="labs__name">{name}</span>
              <button
                type="button"
                className="labs__dl"
                aria-label={`Download ${name}`}
              >
                <img src={IconDownload} alt="" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
