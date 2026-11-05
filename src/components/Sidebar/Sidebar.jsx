import { useEffect, useRef, useState } from 'react';
import './Sidebar.css';
import IconEllipsis from '../../assets/more_vert_FILL0_wght300_GRAD0_opsz24.svg';

export default function Sidebar({
  patients,
  selectedName,
  onSelect,
  idPrefix = 'patients',
  onClose,
}) {
  const [query, setQuery] = useState('');
  const [actionsFor, setActionsFor] = useState(null);
  const [menuAbove, setMenuAbove] = useState(false);
  const actionsRef = useRef(null);
  const triggerRef = useRef(null);
  const matches = patients.filter((patient) =>
    patient.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (actionsFor === null) return;
    function dismiss(event) {
      if (event.type === 'keydown') {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopPropagation();
        setActionsFor(null);
        triggerRef.current?.focus();
      } else if (!actionsRef.current?.contains(event.target)) {
        setActionsFor(null);
      }
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismiss);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', dismiss);
    };
  }, [actionsFor]);

  return (
    <aside className="sidebar" aria-labelledby={`${idPrefix}-patients-title`}>
      <div className="sidebar__header">
        <h2
          id={`${idPrefix}-patients-title`}
          className="sidebar__title card-title-24pt"
        >
          Patients
        </h2>
        {onClose && (
          <button
            className="menu-close"
            onClick={onClose}
            aria-label="Close patient directory"
          >
            ×
          </button>
        )}
      </div>
      <label className="sidebar__search-field">
        <span className="sr-only">Search patients</span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActionsFor(null);
          }}
          placeholder="Search patients…"
        />
      </label>
      <p className="supporting-note sidebar__note">
        {matches.length} patient{matches.length === 1 ? '' : 's'}
      </p>
      <div
        className="sidebar__list"
        tabIndex={0}
        role="region"
        aria-label="Patient directory"
      >
        {!matches.length && (
          <p className="empty-message sidebar__note">No matching patients.</p>
        )}
        {matches.map((patient, index) => {
          const active = patient.name === selectedName;
          const actionsOpen = actionsFor === patient.name;
          return (
            <div
              key={patient.name}
              className={`sidebar__row${active ? ' sidebar__row--active' : ''}`}
            >
              <button
                className="sidebar__select"
                onClick={() => {
                  setActionsFor(null);
                  onSelect(patient.name);
                }}
                aria-current={active ? 'true' : undefined}
                aria-label={`View ${patient.name}`}
              >
                {patient.profile_picture ? (
                  <img
                    className="sidebar__avatar"
                    src={patient.profile_picture}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span
                    className="sidebar__avatar sidebar__avatar--placeholder"
                    aria-hidden="true"
                  >
                    {patient.name[0]}
                  </span>
                )}
                <span className="sidebar__info">
                  <span className="sidebar__name body-emphasized-14pt">
                    {patient.name}
                  </span>
                  <span className="sidebar__meta">
                    {[patient.gender, patient.age]
                      .filter((value) => value != null && value !== '')
                      .join(', ')}
                  </span>
                </span>
              </button>
              <div
                className="patient-actions"
                ref={actionsOpen ? actionsRef : undefined}
              >
                <button
                  className="sidebar__more"
                  aria-label={`Actions for ${patient.name}`}
                  aria-expanded={actionsOpen}
                  aria-controls={`${idPrefix}-actions-${index}`}
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    const row = event.currentTarget.getBoundingClientRect();
                    const list = event.currentTarget
                      .closest('.sidebar__list')
                      .getBoundingClientRect();
                    setMenuAbove(
                      list.bottom - row.bottom < 240 &&
                        row.top - list.top > list.bottom - row.bottom,
                    );
                    setActionsFor(actionsOpen ? null : patient.name);
                  }}
                >
                  <img src={IconEllipsis} alt="" width={20} height={20} />
                </button>
                {actionsOpen && (
                  <div
                    id={`${idPrefix}-actions-${index}`}
                    className={`patient-actions__menu${menuAbove ? ' patient-actions__menu--above' : ''}`}
                    role="group"
                    aria-label={`Actions for ${patient.name}`}
                  >
                    <p>Patient actions</p>
                    <button type="button">Edit patient</button>
                    <button type="button">Send message</button>
                    <button type="button">Archive record</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
