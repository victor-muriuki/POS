import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/api';
import { CSVLink } from 'react-csv';
import ReactPaginate from 'react-paginate';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const itemsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please log in to view items.');
      setLoading(false);
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
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  // Search filter
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // Sorting
  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? (sortConfig.key === 'supplier' ? a.supplier?.name : '');
        const bVal = b[sortConfig.key] ?? (sortConfig.key === 'supplier' ? b.supplier?.name : '');
        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  const pageCount = Math.ceil(sortedItems.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = sortedItems.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Inventory Items", 14, 15);
    const tableColumn = ["#", "Name", "Quantity", "Buying Price", "Selling Price", "Supplier"];
    const tableRows = sortedItems.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `KES ${item.buying_price.toFixed(2)}`,
      `KES ${item.selling_price.toFixed(2)}`,
      item.supplier?.name || "N/A"
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("inventory_items.pdf");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Inventory Items</h2>
        <div className="d-flex">
          <input
            type="text"
            placeholder="Search by name or supplier..."
            className="form-control me-2"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={exportToPDF} className="btn btn-danger">
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : sortedItems.length === 0 ? (
        <p>No items available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('quantity')} style={{ cursor: 'pointer' }}>
                  Quantity {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('buying_price')} style={{ cursor: 'pointer' }}>
                  Buying Price {sortConfig.key === 'buying_price' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('selling_price')} style={{ cursor: 'pointer' }}>
                  Selling Price {sortConfig.key === 'selling_price' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('supplier')} style={{ cursor: 'pointer' }}>
                  Supplier {sortConfig.key === 'supplier' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{offset + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>KES {item.buying_price.toFixed(2)}</td>
                  <td>KES {item.selling_price.toFixed(2)}</td>
                  <td>{item.supplier?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <ReactPaginate
            previousLabel={'← Previous'}
            nextLabel={'Next →'}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
          />
        </div>
      )}
    </div>
  );
}

export default ItemsList;
