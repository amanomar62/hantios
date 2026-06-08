import React from 'react';

const DataTable = ({ columns, data }) => {
  return (
    <div className="card table-container" style={{ padding: '0', overflow: 'hidden' }}>
      <table className="table">
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-hover)' }}>
            {columns.map((col, i) => (
              <th key={i}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                <span className="text-muted">No data available</span>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
