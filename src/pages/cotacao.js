import React, { useState } from 'react';

export default function Cotacao() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);

  // Função para formatar as datas no padrão YYYYMMDD para a API
  const formatDate = (date) => {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError('Por favor, informe as duas datas.');
      return;
    }

    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);

    if (startFormatted > endFormatted) {
      setError('A data inicial deve ser menor ou igual à data final.');
      return;
    }

    setError('');
    setLoading(true);
    setData([]);

    try {
      const url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${startFormatted}&end_date=${endFormatted}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Erro ao buscar os dados da cotação.');
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message || 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'Arial, sans-serif', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Buscar Cotação USD/BRL</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Data Início:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ marginLeft: '0.5rem', padding: '0.3rem' }}
          />
        </label>
        <label>
          Data Fim:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{ marginLeft: '0.5rem', padding: '0.3rem' }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: '0.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          Buscar
        </button>
      </form>

      {loading && <p>Carregando dados...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && data.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0070f3', color: 'white' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Data</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Valor Compra</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Valor Venda</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Máxima</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Mínima</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const date = new Date(parseInt(item.timestamp) * 1000);
              const formattedDate = date.toLocaleDateString();

              return (
                <tr key={item.timestamp} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>{formattedDate}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>R$ {parseFloat(item.bid).toFixed(4)}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>R$ {parseFloat(item.ask).toFixed(4)}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>R$ {parseFloat(item.high).toFixed(4)}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>R$ {parseFloat(item.low).toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {!loading && !error && data.length === 0 && <p>Não há dados para exibir.</p>}
    </div>
  );
}

