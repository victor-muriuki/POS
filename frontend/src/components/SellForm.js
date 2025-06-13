import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import Select from 'react-select';

const SellForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [barcode, setBarcode] = useState('');
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const receiptRef = useRef();

  // Fetch items from backend on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  // Prepare dropdown options
  const itemOptions = items.map(item => ({
    value: item.id,
    label: `${item.name} (Stock: ${item.quantity})`,
    raw: item
  }));

  // Barcode scan logic
  const handleBarcodeChange = async (e) => {
    const code = e.target.value;
    setBarcode(code);

    if (code && code.length > 4) {
      try {
        const res = await axios.get(`http://localhost:5000/items/barcode/${code}`);
        const item = res.data;
        setSelectedItem({
          value: item.id,
          label: `${item.name} (Stock: ${item.quantity})`,
          raw: item
        });
        setQuantity(1);
        setMessage(`Selected: ${item.name}`);
      } catch (err) {
        setMessage('Item not found for barcode');
        setSelectedItem(null);
      }
      setShowToast(true);
      setBarcode('');
    }
  };

  // Handle dropdown select
  const handleItemSelect = (option) => {
    setSelectedItem(option);
  };

  // Sale submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItem) {
      setMessage('Please select an item first.');
      setShowToast(true);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/transactions', {
        item_id: selectedItem.value,
        quantity_sold: parseInt(quantity)
      });

      setMessage(res.data.message || 'Sale successful!');

      // Prepare receipt data
      const now = new Date();
      const receipt = {
        name: selectedItem.raw.name,
        quantity,
        price: selectedItem.raw.selling_price,
        total: quantity * selectedItem.raw.selling_price,
        time: now.toLocaleString()
      };
      setReceiptData(receipt);
      setShowReceipt(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
    }

    setShowToast(true);
    setShow(false); // Close modal
    setBarcode('');
  };

  // Print receipt and reset
  const handlePrint = () => {
    if (receiptRef.current) {
      window.print();
    }
    setTimeout(() => {
      setShowReceipt(false);
      setReceiptData(null);
      setSelectedItem(null);
      setQuantity(1);
    }, 1000);
  };

  return (
    <div className="text-center mt-5">
      {/* Open Sell Modal */}
      <Button variant="primary" onClick={() => setShow(true)}>
        📦 Sell Item
      </Button>

      {/* Modal Form */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sell Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Barcode input */}
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

            {/* Manual item selection */}
            <Form.Group className="mb-3">
              <Form.Label>Select Item (Manual)</Form.Label>
              <Select
                options={itemOptions}
                onChange={handleItemSelect}
                value={selectedItem}
                placeholder="Search and select item..."
                isClearable
              />
            </Form.Group>

            {/* Quantity input */}
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
              />
              {selectedItem && (
                <Form.Text className="text-muted">
                  Available: {selectedItem.raw.quantity}
                </Form.Text>
              )}
            </Form.Group>

            {/* Confirm Sale Button */}
            <Button
              type="submit"
              variant="success"
              className="w-100"
              disabled={!selectedItem || selectedItem.raw.quantity === 0}
            >
              {selectedItem?.raw.quantity === 0 ? 'Out of Stock' : 'Confirm Sale'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toast Message */}
      <ToastContainer position="top-center" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="info"
        >
          <Toast.Body className="text-white">{message}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Receipt Modal Styled for Thermal Print */}
      {showReceipt && receiptData && (
        <div className="mt-5 d-flex justify-content-center">
          <div
            className="receipt-print card shadow-sm p-4 text-start"
            style={{ width: '58mm', fontFamily: 'monospace', fontSize: '12px' }}
            ref={receiptRef}
          >
            <h5 className="mb-3 text-center">🧾 Receipt</h5>
            <p>Item: {receiptData.name}</p>
            <p>Qty: {receiptData.quantity}</p>
            <p>Unit: Ksh {receiptData.price}</p>
            <p>Total: Ksh {receiptData.total}</p>
            <p>Time: {receiptData.time}</p>
            <hr />
            <p className="text-center">Thank you!</p>
            <div className="text-center mt-3 no-print">
              <Button variant="outline-secondary" onClick={handlePrint}>
                🖨️ Print Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellForm;
