import { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import TechCareLogo from '../../assets/techcare-logo.png';
import { doctor } from '../../data/doctor';
import IconOverview from '../../assets/home_FILL0_wght300_GRAD0_opsz24.svg';
import IconPatients from '../../assets/group_FILL0_wght300_GRAD0_opsz24.svg';
import IconSchedule from '../../assets/calendar_today_FILL0_wght300_GRAD0_opsz24.svg';
import IconMessage from '../../assets/chat_bubble_FILL0_wght300_GRAD0_opsz24.svg';
import IconTransactions from '../../assets/credit_card_FILL0_wght300_GRAD0_opsz24.svg';
import IconGear from '../../assets/settings_FILL0_wght300_GRAD0_opsz24.svg';

const sections = [
  { label: 'Overview', page: 'overview', icon: IconOverview },
  { label: 'Patients', page: 'patients', icon: IconPatients },
  { label: 'Schedule', page: 'schedule', icon: IconSchedule },
  { label: 'Message', page: 'messages', icon: IconMessage },
  { label: 'Transactions', page: 'transactions', icon: IconTransactions },
];

export default function Navbar({ page, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function dismiss(event) {
      if (event.type === 'keydown') {
        if (event.key !== 'Escape') return;
        setMenuOpen(false);
        toggleRef.current?.focus();
      } else if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    const desktop = window.matchMedia('(min-width: 1401px)');
    const resize = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismiss);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', dismiss);
      desktop.removeEventListener('change', resize);
    };
  }, [menuOpen]);

  return (
    <header className="navbar" ref={headerRef}>
      <div className="navbar__brand">
        <img className="navbar__logo-img" src={TechCareLogo} alt="Tech.Care" />
      </div>
      <button
        ref={toggleRef}
        type="button"
        className="navbar__menu-toggle"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="hamburger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <nav
        id="primary-navigation"
        className={`navbar__nav${menuOpen ? ' navbar__nav--open' : ''}`}
        aria-label="Primary"
      >
        {sections.map(({ label, icon, page: target }) => (
          <button
            key={target}
            type="button"
            className={`navbar__link${page === target ? ' navbar__link--active' : ''}`}
            aria-current={page === target ? 'page' : undefined}
            onClick={() => {
              onNavigate(target);
              setMenuOpen(false);
            }}
          >
            <img src={icon} alt="" width={18} height={18} />
            {label}
          </button>
        ))}
        <div className="navbar__mobile-user">
          <button
            className="navbar__link"
            onClick={() => {
              onNavigate('doctor');
              setMenuOpen(false);
            }}
          >
            Doctor profile
          </button>
          <button
            className="navbar__link"
            onClick={() => {
              onNavigate('settings');
              setMenuOpen(false);
            }}
          >
            Settings
          </button>
        </div>
      </nav>
      <div className="navbar__user">
        <button
          className="navbar__profile"
          onClick={() => {
            onNavigate('doctor');
            setMenuOpen(false);
          }}
          aria-label={`View profile for ${doctor.name}`}
          aria-current={page === 'doctor' ? 'page' : undefined}
        >
          <img
            className="navbar__avatar"
            src={doctor.photo}
            alt=""
            width={40}
            height={40}
          />
          <span className="navbar__user-text">
            <span className="navbar__user-name body-emphasized-14pt">
              {doctor.name}
            </span>
            <span className="navbar__user-title">{doctor.specialty}</span>
          </span>
        </button>
        <button
          className="navbar__icon-btn"
          onClick={() => {
            onNavigate('settings');
            setMenuOpen(false);
          }}
          aria-label="Open settings"
          aria-current={page === 'settings' ? 'page' : undefined}
        >
          <img src={IconGear} alt="" width={20} height={20} />
        </button>
      </div>
    </header>
  );
}
