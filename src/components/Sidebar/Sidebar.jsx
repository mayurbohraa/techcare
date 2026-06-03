import './Sidebar.css';
import IconSearch from '../../assets/search_FILL0_wght300_GRAD0_opsz24.svg'
import IconEllipsis from '../../assets/more_horiz_FILL0_wght300_GRAD0_opsz24.svg'


export default function Sidebar({ patients }) {
  return (
    <aside className="sidebar">

      <div className="sidebar__header">
        <h2 className="sidebar__title card-title-24pt">Patients</h2>
        <span className="sidebar__search" aria-hidden>
          <img className="" src={IconSearch} alt="IconSearch" width="20" height="20"/>
        </span>

      </div>

      <div className="sidebar__list">

        {patients.map((p, index) => {
          const active = p.name === 'Jessica Taylor';
          return (
            <div
              key={`${p.name}-${index}`}
              className={'sidebar__row' + (active ? ' sidebar__row--active' : '')}
            >
              <img
                className="sidebar__avatar"
                src={p.profile_picture}
                alt=""
                width={44}
                height={44}
              />
              <div className="sidebar__info">
                <div className="sidebar__name body-emphasized-14pt">{p.name}</div>
                <div className="sidebar__meta body-secondary-info-14pt">
                  {p.gender}, {p.age}
                </div>
              </div>
              <span className="sidebar__more" aria-hidden>
                 <img className="" src={IconEllipsis} alt="IconEllipsis" width="18" height="18"/>
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
