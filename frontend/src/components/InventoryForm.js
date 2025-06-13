import React, { useState, useEffect } from 'react';

const InventoryForm = ({ existingItem, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    buying_price: '',
    selling_price: '',
    supplier: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingItem) {
      setFormData({
        name: existingItem.name || '',
        quantity: existingItem.quantity || '',
        buying_price: existingItem.buying_price || '',
        selling_price: existingItem.selling_price || '',
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

    if (!formData.name || !formData.quantity || !formData.buying_price || !formData.selling_price) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      buying_price: Number(formData.buying_price),
      selling_price: Number(formData.selling_price),
    };

    setLoading(true);

    try {
      const method = existingItem ? 'PUT' : 'POST';
      const url = existingItem ? `/items/${existingItem.id}` : '/items';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
        return;
      }

      alert(`Item ${existingItem ? 'updated' : 'added'} successfully!`);
      if (onSuccess) onSuccess();

      if (!existingItem) {
        setFormData({
          name: '',
          quantity: '',
          buying_price: '',
          selling_price: '',
          supplier: ''
        });
      }

    } catch (error) {
      setLoading(false);
      alert('Network error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">{existingItem ? 'Update Item' : 'Add New Item'}</h3>

      <div className="mb-3">
        <label className="form-label" htmlFor="name">Name*</label>
        <input
          id="name"
          className="form-control"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="quantity">Quantity*</label>
        <input
          id="quantity"
          className="form-control"
          name="quantity"
          type="number"
          min="0"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="buying_price">Buying Price*</label>
        <input
          id="buying_price"
          className="form-control"
          name="buying_price"
          type="number"
          min="0"
          step="0.01"
          value={formData.buying_price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="selling_price">Selling Price*</label>
        <input
          id="selling_price"
          className="form-control"
          name="selling_price"
          type="number"
          min="0"
          step="0.01"
          value={formData.selling_price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="supplier">Supplier</label>
        <input
          id="supplier"
          className="form-control"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? 'Saving...' : existingItem ? 'Update Item' : 'Add Item'}
      </button>
    </form>
  );
};

export default InventoryForm;
