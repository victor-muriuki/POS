import React, { useEffect, useState } from 'react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    let url = 'http://localhost:5000/transactions';
    if (filterDate) {
      url += `?date=${filterDate}`;  // Backend should handle this query param
    }
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
      })
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filterDate]);

  return (
    <div>
      <h2>Transactions</h2>
      <label>
        Filter by Date:{' '}
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
      </label>

      {loading && <p>Loading transactions...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && transactions.length === 0 && <p>No transactions found.</p>}

      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>
            Item: {tx.item_name || 'Unknown'} | Quantity Sold: {tx.quantity_sold} | Total Price: ${tx.total_price.toFixed(2)} | Date: {new Date(tx.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
