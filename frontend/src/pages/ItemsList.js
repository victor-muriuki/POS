import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ItemCard from '../components/ItemCard';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please log in to view items.');
      return;
    }

    async function fetchItems() {
      try {
        const res = await api.get('/items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(res.data);
      } catch (err) {
        setError('Failed to load items');
      }
    }

    fetchItems();
  }, []);

  return (
    <div className="container">
      <h2>Inventory Items</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="row">
        {items.map(item => (
          <div key={item.id} className="col-md-4">
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemsList;
