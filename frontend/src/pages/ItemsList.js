import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { CSVLink } from 'react-csv';
import ReactPaginate from 'react-paginate';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function ItemsList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

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

  const pageCount = Math.ceil(items.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const csvHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Buying Price', key: 'buying_price' },
    { label: 'Selling Price', key: 'selling_price' },
    { label: 'Supplier', key: 'supplier.name' }
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Inventory Items", 14, 15);

    const tableColumn = ["#", "Name", "Quantity", "Buying Price", "Selling Price", "Supplier"];
    const tableRows = items.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `KES ${item.buying_price.toFixed(2)}`,
      `KES ${item.selling_price.toFixed(2)}`,
      item.supplier?.name || "N/A"
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("inventory_items.pdf");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Inventory Items</h2>
        <div>
          <CSVLink
            data={items.map(item => ({
              ...item,
              supplier: item.supplier?.name || 'N/A',
            }))}
            headers={csvHeaders}
            filename="inventory_export.csv"
            className="btn btn-success me-2"
          >
            Export CSV
          </CSVLink>
          <button onClick={exportToPDF} className="btn btn-danger">
            Export PDF
          </button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {items.length === 0 && !error ? (
        <p>No items available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Buying Price</th>
                <th>Selling Price</th>
                <th>Supplier</th>
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
        <div className="d-flex justify-content-center">
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
