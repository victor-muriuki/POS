import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaPen, FaTrash, FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

const InventoryForm = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    buying_price: '',
    selling_price: '',
    supplier: ''
  });
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const backendUrl = 'http://localhost:5000'; // Flask backend URL

  const showToast = (message, isError = false) => {
    const toastFn = isError ? toast.error : toast.success;
    toastFn(message, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backendUrl}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      showToast('Error loading items: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        quantity: editingItem.quantity || '',
        buying_price: editingItem.buying_price || '',
        selling_price: editingItem.selling_price || '',
        supplier: editingItem.supplier?.name || ''
      });
    } else {
      setFormData({
        name: '',
        quantity: '',
        buying_price: '',
        selling_price: '',
        supplier: ''
      });
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filter + Sort combined
  const filteredItems = useMemo(() => {
    const result = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return result.sort((a, b) =>
      sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [items, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const validateForm = () => {
    if (Number(formData.selling_price) <= Number(formData.buying_price)) {
      showToast('Selling price must be greater than buying price', true);
      return false;
    }
    if (Number(formData.quantity) < 0) {
      showToast('Quantity cannot be negative', true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      buying_price: Number(formData.buying_price),
      selling_price: Number(formData.selling_price),
    };

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${backendUrl}/items/${editingItem.id}` : `${backendUrl}/items`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      showToast(`Item ${editingItem ? 'updated' : 'added'} successfully!`);
      setEditingItem(null);
      setFormData({
        name: '',
        quantity: '',
        buying_price: '',
        selling_price: '',
        supplier: ''
      });
      fetchItems();
      setShowModal(false);
    } catch (error) {
      showToast('Error: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/items/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }

      showToast('Item deleted successfully');
      fetchItems();
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      showToast('Error deleting item: ' + error.message, true);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4 border-0 rounded-4">
        <h2 className="text-center mb-4 text-primary fw-bold">📦 Inventory Management</h2>

        {/* Search + Sort + Add section */}
        <div className="row g-2 align-items-center mb-4">
          <div className="col-md-5">
            <div className="input-group shadow-sm rounded-3">
              <span className="input-group-text bg-light border-0"><FaSearch className="text-primary" /></span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Search by name or supplier..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-outline-primary w-100 rounded-3 shadow-sm"
              onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            >
              {sortOrder === 'asc' ? (
                <>
                  <FaSortAlphaDown className="me-2" /> Sort: A → Z
                </>
              ) : (
                <>
                  <FaSortAlphaUp className="me-2" /> Sort: Z → A
                </>
              )}
            </button>
          </div>

          <div className="col-md-4 text-end">
            <button className="btn btn-primary w-100 rounded-3 shadow-sm" onClick={handleAdd}>
              <FaPlusCircle className="me-2" /> Add Item
            </button>
          </div>
        </div>

        {/* Table & Pagination */}
        {loading && items.length === 0 ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="alert alert-info text-center rounded-3">
            {searchTerm ? 'No items match your search.' : 'No items in inventory.'}
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Buying Price</th>
                    <th>Selling Price</th>
                    <th>Supplier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.buying_price)}</td>
                      <td>{formatCurrency(item.selling_price)}</td>
                      <td>{item.supplier?.name || '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(item)}>
                          <FaPen className="me-1" /> Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                          <FaTrash className="me-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content rounded-4 border-0 shadow">
              <form onSubmit={handleSubmit}>
                <div className="modal-header bg-primary text-white rounded-top-4">
                  <h5 className="modal-title">{editingItem ? 'Update Item' : 'Add New Item'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} disabled={loading}></button>
                </div>
                <div className="modal-body">
                  {['name', 'quantity', 'buying_price', 'selling_price', 'supplier'].map(field => (
                    <div className="mb-3" key={field}>
                      <label className="form-label fw-semibold">
                        {field.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                      </label>
                      <input
                        className="form-control shadow-sm"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        type={field.includes('price') || field === 'quantity' ? 'number' : 'text'}
                        required={['name', 'quantity', 'buying_price', 'selling_price'].includes(field)}
                        min={field === 'quantity' || field.includes('price') ? '0' : undefined}
                        step={field.includes('price') ? '0.01' : undefined}
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary rounded-3" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {editingItem ? 'Updating...' : 'Adding...'}
                      </>
                    ) : editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  <button type="button" className="btn btn-secondary rounded-3" onClick={() => setShowModal(false)} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryForm;
