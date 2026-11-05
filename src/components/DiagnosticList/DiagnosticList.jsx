import './DiagnosticList.css';

export default function DiagnosticList({ list = [] }) {
  return (
    <section className="diag" aria-labelledby="diagnostic-title">
      <h2 id="diagnostic-title" className="diag__title card-title-24pt">
        Diagnostic List
      </h2>
      {list.length ? (
        <div
          className="diag__table-scroll"
          role="region"
          aria-label="Diagnostic list"
          tabIndex={0}
        >
          <table className="diag__table">
            <thead className="diag__thead">
              <tr>
                <th scope="col">Problem/Diagnosis</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row, index) => (
                <tr key={`${row.name}-${index}`}>
                  <td className="diag__cell-name">{row.name}</td>
                  <td className="diag__cell-desc">{row.description}</td>
                  <td className="diag__cell-status">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-message">No diagnoses available.</p>
      )}
    </section>
  );
}
