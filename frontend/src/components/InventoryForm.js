import React, { useState, useEffect } from 'react';

const InventoryForm = ({ existingItem, onSuccess }) => {
  // If existingItem passed, we’re editing, else adding new
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    buying_price: '',
    selling_price: '',
    supplier: ''
  });

  useEffect(() => {
    if (existingItem) {
      setFormData({
        name: existingItem.name,
        quantity: existingItem.quantity,
        buying_price: existingItem.buying_price,
        selling_price: existingItem.selling_price,
        supplier: existingItem.supplier || ''
      });
    }
  }, [existingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs if you want (optional)
    if (!formData.name || !formData.quantity || !formData.buying_price || !formData.selling_price) {
      alert('Please fill in all required fields.');
      return;
    }

    // Prepare payload
    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      buying_price: Number(formData.buying_price),
      selling_price: Number(formData.selling_price),
    };

    try {
      const method = existingItem ? 'PUT' : 'POST';
      const url = existingItem ? `/items/${existingItem.id}` : '/items';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
        return;
      }

      alert(`Item ${existingItem ? 'updated' : 'added'} successfully!`);
      if (onSuccess) onSuccess();
      if (!existingItem) {
        // Reset form after adding new item
        setFormData({
          name: '',
          quantity: '',
          buying_price: '',
          selling_price: '',
          supplier: ''
        });
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h3>{existingItem ? 'Update Item' : 'Add New Item'}</h3>

      <label>
        Name*:
        <input name="name" value={formData.name} onChange={handleChange} required />
      </label>

      <label>
        Quantity*:
        <input
          name="quantity"
          type="number"
          min="0"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Buying Price*:
        <input
          name="buying_price"
          type="number"
          min="0"
          step="0.01"
          value={formData.buying_price}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Selling Price*:
        <input
          name="selling_price"
          type="number"
          min="0"
          step="0.01"
          value={formData.selling_price}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Supplier:
        <input name="supplier" value={formData.supplier} onChange={handleChange} />
      </label>

      <button type="submit">{existingItem ? 'Update' : 'Add'} Item</button>
    </form>
  );
};

export default InventoryForm;
