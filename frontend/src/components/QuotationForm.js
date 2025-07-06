import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api/api';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

function QuotationForm() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [vatRate, setVatRate] = useState(0.16);
  const [discountRate, setDiscountRate] = useState(0.1);
  const [companyName, setCompanyName] = useState('Purlow Bookshop');
  const [customerName, setCustomerName] = useState('');
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        setItems(res.data);
      } catch (err) {
        toast.error('Failed to load items');
      }
    };
    fetchItems();
  }, []);

  const handleSelectItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id);
    if (!exists) {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === id ? { ...item, quantity: parseInt(quantity) || 0 } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`${companyName} - Quotation`, 14, 15);
    doc.text(`Customer: ${customerName || 'N/A'}`, 14, 22);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 29);

    const tableRows = selectedItems.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      `KES ${item.selling_price.toFixed(2)}`,
      `KES ${(item.selling_price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
  head: [['#', 'Item Name', 'Quantity', 'Unit Price', 'Total']],
  body: tableRows,
  startY: 35,
});

    const subtotal = selectedItems.reduce((sum, item) => sum + (item.quantity * item.selling_price), 0);
    const vat = subtotal * vatRate;
    const discount = subtotal * discountRate;
    const total = subtotal + vat - discount;

    let y = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: KES ${subtotal.toFixed(2)}`, 14, y);
    doc.text(`VAT (${(vatRate * 100).toFixed(0)}%): KES ${vat.toFixed(2)}`, 14, y + 6);
    doc.text(`Discount (${(discountRate * 100).toFixed(0)}%): -KES ${discount.toFixed(2)}`, 14, y + 12);
    doc.text(`Total: KES ${total.toFixed(2)}`, 14, y + 20);

    doc.save('quotation.pdf');
  };

  const sendEmail = async () => {
    if (!email) return toast.error('Please enter recipient email');

    try {
      const payload = {
        email,
        items: selectedItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          selling_price: item.selling_price
        }))
      };
      await api.post('/send-quotation', payload);
      toast.success('Quotation sent via email');
    } catch (err) {
      toast.error('Failed to send email');
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredItems.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + (item.quantity * item.selling_price), 0);
  const vat = subtotal * vatRate;
  const discount = subtotal * discountRate;
  const total = subtotal + vat - discount;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Generate Quotation</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Search Items</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search items by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">VAT Rate (%)</label>
          <input
            type="number"
            className="form-control"
            value={vatRate * 100}
            onChange={(e) => setVatRate(parseFloat(e.target.value) / 100)}
            min="0"
          />
        </div>
        <div className="col-md-3 mt-3">
          <label className="form-label">Discount Rate (%)</label>
          <input
            type="number"
            className="form-control"
            value={discountRate * 100}
            onChange={(e) => setDiscountRate(parseFloat(e.target.value) / 100)}
            min="0"
          />
        </div>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>KES {item.selling_price.toFixed(2)}</td>
              <td>{item.supplier?.name || 'N/A'}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleSelectItem(item)}
                  disabled={selectedItems.some(i => i.id === item.id)}
                >
                  {selectedItems.some(i => i.id === item.id) ? 'Selected' : 'Add'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pageCount > 1 && (
        <div className="d-flex justify-content-center my-3">
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

      <h4 className="mt-4">Selected Items</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                />
              </td>
              <td>KES {item.selling_price.toFixed(2)}</td>
              <td>KES {(item.selling_price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <h5>Subtotal: KES {subtotal.toFixed(2)}</h5>
        <h5>VAT ({(vatRate * 100).toFixed(0)}%): KES {vat.toFixed(2)}</h5>
        <h5>Discount ({(discountRate * 100).toFixed(0)}%): -KES {discount.toFixed(2)}</h5>
        <h4>Total: KES {total.toFixed(2)}</h4>
      </div>

      <div className="mb-3 mt-4">
        <label className="form-label">Send to Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient email"
        />
      </div>

      <div className="d-flex gap-3">
        <button className="btn btn-success" onClick={generatePDF}>Download PDF</button>
        <button className="btn btn-primary" onClick={sendEmail}>Send Email</button>
      </div>
    </div>
  );
}

export default QuotationForm;
