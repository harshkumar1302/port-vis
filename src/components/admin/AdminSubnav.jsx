const AdminSubnav = ({ views, active, onChange, countLabel }) => (
  <div className="admin-subnav">
    {views.map((v) => (
      <button
        key={v.id}
        type="button"
        onClick={() => onChange(v.id)}
        className={active === v.id ? 'is-active' : ''}
      >
        {v.label}
      </button>
    ))}
    {countLabel && <span className="admin-subnav-count">{countLabel}</span>}
  </div>
);

export default AdminSubnav;
