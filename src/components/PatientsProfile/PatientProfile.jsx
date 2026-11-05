import './PatientProfile.css';
import IconCalendar from '../../assets/BirthIcon.svg';
import IconFemale from '../../assets/FemaleIcon.svg';
import IconMale from '../../assets/MaleIcon.svg';
import IconPhone from '../../assets/PhoneIcon.svg';
import IconShield from '../../assets/InsuranceIcon.svg';

export default function PatientProfile({ patient }) {
  if (!patient) return null;
  const facts = [
    {
      label: 'Date of birth',
      value: patient.date_of_birth,
      icon: IconCalendar,
    },
    { label: 'Age', value: patient.age, icon: IconCalendar },
    {
      label: 'Gender',
      value: patient.gender,
      icon: patient.gender === 'Male' ? IconMale : IconFemale,
    },
    { label: 'Contact info', value: patient.phone_number, icon: IconPhone },
    {
      label: 'Emergency contact',
      value: patient.emergency_contact,
      icon: IconPhone,
    },
    {
      label: 'Insurance provider',
      value: patient.insurance_type,
      icon: IconShield,
    },
  ].filter(({ value }) => value != null && value !== '');

  return (
    <section className="pp-card" aria-labelledby="patient-profile-name">
      {patient.profile_picture ? (
        <img
          className="pp-card__photo"
          src={patient.profile_picture}
          alt=""
          width={140}
          height={140}
        />
      ) : (
        <div className="pp-card__photo pp-card__placeholder" aria-hidden="true">
          {patient.name[0]}
        </div>
      )}
      <h2 id="patient-profile-name" className="pp-card__name card-title-24pt">
        {patient.name}
      </h2>
      <ul className="pp-facts">
        {facts.map(({ label, value, icon }) => (
          <li key={label} className="pp-facts__row">
            <span className="pp-facts__icon">
              <img src={icon} alt="" />
            </span>
            <div className="pp-facts__text">
              <span className="pp-facts__label">{label}</span>
              <span className="pp-facts__value">{value}</span>
            </div>
          </li>
        ))}
      </ul>
      {!facts.length && (
        <p className="empty-message">
          No additional profile details available.
        </p>
      )}
    </section>
  );
}
