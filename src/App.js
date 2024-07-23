import React, { useState } from 'react';
import Typing from './Components/Typing';

const SQLQueryGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-and-execute-sql`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      setResults(data.results);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results || results.length === 0) return null;

    if (typeof results[0] === 'object') {
      const keys = Object.keys(results[0]);
      return (
        <div style={{ overflowX: 'auto', marginTop: '20px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {keys.map((key) => (
                  <th key={key} style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  {keys.map((key) => (
                    <td key={key} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <pre style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>{JSON.stringify(results, null, 2)}</pre>;
  };

  return (
    <>
    <Typing />
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', backgroundColor: '#3b82f6', color: '#ffffff' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>SQL Query Generator</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your question here"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '10px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Generating...' : 'Generate and Execute SQL'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '16px', borderRadius: '4px', marginTop: '20px' }}>
          <p style={{ fontWeight: 'bold' }}>Error</p>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: '#10b981', color: '#ffffff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Results</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {renderResults()}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SQLQueryGenerator;