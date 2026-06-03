import "./Navbar.css";
import TechCareLogo from "../../assets/techcare-logo.png";
import DoctorAvatar from "../../assets/senior-woman-doctor-and-portrait-smile-for-health-2023-11-27-05-18-16-utc.png";
import IconOverview from "../../assets/home_FILL0_wght300_GRAD0_opsz24.svg";
import IconPatients from "../../assets/group_FILL0_wght300_GRAD0_opsz24.svg";
import IconSchedule from "../../assets/calendar_today_FILL0_wght300_GRAD0_opsz24.svg";
import IconMessage from "../../assets/chat_bubble_FILL0_wght300_GRAD0_opsz24.svg";
import IconTransactions from "../../assets/credit_card_FILL0_wght300_GRAD0_opsz24.svg";
import IconGear from "../../assets/settings_FILL0_wght300_GRAD0_opsz24.svg";
import IconDotsVertical from "../../assets/more_vert_FILL0_wght300_GRAD0_opsz24.svg";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <img className="navbar__logo-img" src={TechCareLogo} alt="Tech.Care" />
      </div>

      <nav className="navbar__nav" aria-label="Primary">
        <span className="navbar__link">
          <img
            className=""
            src={IconOverview}
            alt="IconOverview"
            width="18"
            height="18"
          />
          Overview
        </span>
        <span className="navbar__link navbar__link--active">
          <img
            className=""
            src={IconPatients}
            alt="IconPatients"
            width="18"
            height="18"
          />
          Patients
        </span>
        <span className="navbar__link">
          <img
            className=""
            src={IconSchedule}
            alt="IconSchedule"
            width="18"
            height="18"
          />
          Schedule
        </span>
        <span className="navbar__link">
          <img
            className=""
            src={IconMessage}
            alt="IconMessage"
            width="18"
            height="18"
          />
          Message
        </span>
        <span className="navbar__link">
          <img
            className=""
            src={IconTransactions}
            alt="IconTransactions"
            width="18"
            height="18"
          />
          Transactions
        </span>
      </nav>

      <div className="navbar__user">
        <img
          className="navbar__avatar"
          src={DoctorAvatar}
          alt=""
          width={40}
          height={40}
        />
        <div className="navbar__user-text">
          <span className="navbar__user-name body-emphasized-14pt">
            Dr. Jose Simmons
          </span>
          <span className="navbar__user-title">General Practitioner</span>
        </div>
        <span className="navbar__icon-btn" aria-hidden>
          <img
            className=""
            src={IconGear}
            alt="IconGear"
            width="18"
            height="18"
          />
        </span>
        <span className="navbar__icon-btn" aria-hidden>
          <img
            className=""
            src={IconDotsVertical}
            alt="IconDotsVertical"
            width="18"
            height="18"
          />
        </span>
      </div>
    </header>
  );
}
