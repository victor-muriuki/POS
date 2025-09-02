import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Form, Toast, ToastContainer, Table } from 'react-bootstrap';
import Select from 'react-select';

const SellForm = () => {
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState('');
  const [barcode, setBarcode] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');

  const receiptRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  const itemOptions = items.map(item => ({
    value: item.id,
    label: `${item.name} (Stock: ${item.quantity})`,
    raw: item
  }));

  const handleBarcodeChange = async (e) => {
    const code = e.target.value;
    setBarcode(code);

    if (code && code.length > 4) {
      try {
        const res = await axios.get(`http://localhost:5000/items/barcode/${code}`);
        const item = res.data;
        addItem(item);
        setMessage(`Selected: ${item.name}`);
      } catch {
        setMessage('Item not found for barcode');
      }
      setShowToast(true);
      setBarcode('');
    }
  };

  const addItem = (item) => {
    if (selectedItems.some(si => si.item.id === item.id)) return;
    setSelectedItems(prev => [...prev, { item, quantity: 1 }]);
  };

  const handleItemSelect = (option) => {
    setSelectedOption(option);
    if (option && option.raw) addItem(option.raw);
  };

  const handleQuantityChange = (itemId, qty) => {
    setSelectedItems(prev =>
      prev.map(si => si.item.id === itemId ? { ...si, quantity: parseInt(qty) || 1 } : si)
    );
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(prev => prev.filter(si => si.item.id !== itemId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage('Please select at least one item.');
      setShowToast(true);
      return;
    }

    if (selectedItems.some(si => si.quantity > si.item.quantity)) {
      setMessage('Quantity exceeds available stock.');
      setShowToast(true);
      return;
    }

    try {
      const transactionId = crypto.randomUUID();
      const itemsPayload = selectedItems.map(si => ({
        item_id: si.item.id,
        quantity_sold: si.quantity
      }));

      await axios.post('http://localhost:5000/transactions', {
        transaction_id: transactionId,
        payment_method: paymentMethod,
        customer_name: customerName,
        items: itemsPayload
      });

      const now = new Date();
      const receipt = selectedItems.map(si => ({
        name: si.item.name,
        quantity: si.quantity,
        price: si.item.selling_price,
        total: si.quantity * si.item.selling_price,
        time: now.toLocaleString()
      }));

      setReceiptData(receipt);
      setShowReceipt(true);

      // Reset form
      setSelectedItems([]);
      setSelectedOption(null);
      setCustomerName('');
      setPaymentMethod('cash');

      setMessage('Sale completed successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
    }
    setShowToast(true);
  };

  const handlePrint = () => {
    if (receiptRef.current) window.print();
    setTimeout(() => {
      setShowReceipt(false);
      setReceiptData([]);
    }, 1000);
  };

  const grandTotal = selectedItems.reduce(
    (sum, si) => sum + si.quantity * si.item.selling_price, 0
  );

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Sell Items</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Scan Barcode</Form.Label>
          <Form.Control
            type="text"
            value={barcode}
            onChange={handleBarcodeChange}
            placeholder="Scan barcode here..."
            autoFocus
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Item (Manual)</Form.Label>
          <Select
            options={itemOptions}
            onChange={handleItemSelect}
            value={selectedOption}
            placeholder="Search and select item..."
            isClearable
            isSearchable
          />
        </Form.Group>

        {selectedItems.length > 0 && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Available</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map(si => (
                  <tr key={si.item.id}>
                    <td>{si.item.name}</td>
                    <td>{si.item.quantity}</td>
                    <td>{si.item.selling_price}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        max={si.item.quantity}
                        value={si.quantity}
                        onChange={e => handleQuantityChange(si.item.id, e.target.value)}
                      />
                    </td>
                    <td>{(si.quantity * si.item.selling_price).toFixed(2)}</td>
                    <td>
                      <Button variant="outline-danger" size="sm" onClick={() => handleRemoveItem(si.item.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5 className="text-end mb-3">
              Total: <strong>Ksh {grandTotal.toFixed(2)}</strong>
            </h5>
          </>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Enter customer name..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Payment Method</Form.Label>
          <Form.Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
            <option value="credit">Credit</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="success" disabled={selectedItems.length === 0} className="w-100">
          Confirm Sale
        </Button>
      </Form>

      <ToastContainer position="top-center" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="info">
          <Toast.Body className="text-white">{message}</Toast.Body>
        </Toast>
      </ToastContainer>

      {showReceipt && receiptData.length > 0 && (
        <div className="mt-5 d-flex justify-content-center">
          <div className="receipt-print card shadow-sm p-4 text-start" style={{ width: '58mm', fontFamily: 'monospace', fontSize: '12px' }} ref={receiptRef}>
            <h5 className="mb-3 text-center">🧾 Receipt</h5>
            {receiptData.map((r, i) => (
              <div key={i}>
                <p>{r.name} x{r.quantity} @ {r.price} = {r.total}</p>
              </div>
            ))}
            <hr />
            <p>Total: Ksh {receiptData.reduce((sum, r) => sum + r.total, 0).toFixed(2)}</p>
            <p>Customer: {customerName || "N/A"}</p>
            <p>Payment: {paymentMethod}</p>
            <p>Time: {receiptData[0]?.time}</p>
            <p className="text-center">Thank you!</p>
            <div className="text-center mt-3 no-print">
              <Button variant="outline-secondary" onClick={handlePrint}>🖨️ Print Receipt</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellForm;
