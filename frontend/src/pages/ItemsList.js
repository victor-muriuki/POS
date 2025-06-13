import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ItemCard from '../components/ItemCard';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await api.get('/items');
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
      {error && <p>{error}</p>}
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
