import './DiagnosticList.css';

export default function DiagnosticList({ list }) {
  const rows = list || [];

  return (
    <div className="diag">
      <h3 className="diag__title card-title-24pt">Diagnostic List</h3>
      <div className="diag__table-wrap">
        <table className="diag__table">
          <thead className="diag__thead">
            <tr>
              <th>Problem/Diagnosis</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
        </table>
        <div className="diag__table-scroll" role="region" aria-label="Diagnostic list">
          <table className="diag__table diag__table--body" aria-hidden>
            <tbody className="diag__tbody">
              {rows.map((row) => (
                <tr key={row.name + row.status}>
                  <td className="diag__cell-name">{row.name}</td>
                  <td className="diag__cell-desc">{row.description}</td>
                  <td className="diag__cell-status">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
