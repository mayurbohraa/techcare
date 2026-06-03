import './PatientProfile.css';

import IconCalendar from '../../assets/BirthIcon.svg'
import IconGender from '../../assets/FemaleIcon.svg'
import IconPhone  from '../../assets/PhoneIcon.svg'
import IconShield from '../../assets/InsuranceIcon.svg'



export default function PatientProfile({ patient }) {
  if (!patient) return null;

  return (
    <div className="pp-card">
      <img className="pp-card__photo" src={patient.profile_picture} alt="" width={120} height={120} />
      <h2 className="pp-card__name card-title-24pt">{patient.name}</h2>

      <ul className="pp-facts">
        <li className="pp-facts__row">
          <span className="pp-facts__icon">
            <img src={IconCalendar} alt="" srcset="" />
          </span>
          <div className="pp-facts__text">
            <span className="pp-facts__label">Date Of Birth</span>
            <span className="pp-facts__value">{patient.date_of_birth}</span>
          </div>
        </li>
        <li className="pp-facts__row">
          <span className="pp-facts__icon">
            <img src={IconGender} alt="" srcset="" />
          </span>
          <div className="pp-facts__text">
            <span className="pp-facts__label">Gender</span>
            <span className="pp-facts__value">{patient.gender}</span>
          </div>
        </li>
        <li className="pp-facts__row">
          <span className="pp-facts__icon">
            <img src={IconPhone} alt="" srcset="" />
          </span>
          <div className="pp-facts__text">
            <span className="pp-facts__label">Contact Info.</span>
            <span className="pp-facts__value">{patient.phone_number}</span>
          </div>
        </li>
        <li className="pp-facts__row">
          <span className="pp-facts__icon">
            <img src={IconPhone} alt="" srcset="" />
          </span>
          <div className="pp-facts__text">
            <span className="pp-facts__label">Emergency Contacts</span>
            <span className="pp-facts__value">{patient.emergency_contact}</span>
          </div>
        </li>
        <li className="pp-facts__row">
          <span className="pp-facts__icon">
            <img src={IconShield} alt="" srcset="" />
          </span>
          <div className="pp-facts__text">
            <span className="pp-facts__label">Insurance Provider</span>
            <span className="pp-facts__value">{patient.insurance_type}</span>
          </div>
        </li>
      </ul>

      <button type="button" className="pp-btn">
        Show All Information
      </button>
    </div>
  );
}
