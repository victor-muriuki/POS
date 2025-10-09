import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Toast,
  ToastContainer,
  Table,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import Receipt from "./Receipt"; // ✅ import the new receipt component

const SellForm = () => {
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState("");
  const [barcode, setBarcode] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");

  const receiptRef = useRef();

  useEffect(() => {
    axios
      .get("http://localhost:5000/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  const itemOptions = items.map((item) => ({
    value: item.id,
    label: `${item.name} (Stock: ${item.quantity})`,
    raw: item,
  }));

  const handleBarcodeChange = async (e) => {
    const code = e.target.value;
    setBarcode(code);

    if (code && code.length > 4) {
      try {
        const res = await axios.get(
          `http://localhost:5000/items/barcode/${code}`
        );
        const item = res.data;
        addItem(item);
        setMessage(`Selected: ${item.name}`);
      } catch {
        setMessage("Item not found for barcode");
      }
      setShowToast(true);
      setBarcode("");
    }
  };

  const addItem = (item) => {
    if (selectedItems.some((si) => si.item.id === item.id)) return;
    setSelectedItems((prev) => [...prev, { item, quantity: 1 }]);
  };

  const handleItemSelect = (option) => {
    setSelectedOption(option);
    if (option && option.raw) addItem(option.raw);
  };

  const handleQuantityChange = (itemId, qty) => {
    setSelectedItems((prev) =>
      prev.map((si) =>
        si.item.id === itemId
          ? { ...si, quantity: parseInt(qty) || 1 }
          : si
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((si) => si.item.id !== itemId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage("Please select at least one item.");
      setShowToast(true);
      return;
    }

    if (selectedItems.some((si) => si.quantity > si.item.quantity)) {
      setMessage("Quantity exceeds available stock.");
      setShowToast(true);
      return;
    }

    try {
      const transactionId = crypto.randomUUID();
      const itemsPayload = selectedItems.map((si) => ({
        item_id: si.item.id,
        quantity_sold: si.quantity,
      }));

      await axios.post("http://localhost:5000/transactions", {
        transaction_id: transactionId,
        payment_method: paymentMethod,
        customer_name: customerName,
        items: itemsPayload,
      });

      const now = new Date();
      const receipt = selectedItems.map((si) => ({
        name: si.item.name,
        quantity: si.quantity,
        price: si.item.selling_price,
        total: si.quantity * si.item.selling_price,
        time: now.toLocaleString(),
      }));

      setReceiptData(receipt);
      setShowReceipt(true);

      // Reset form
      setSelectedItems([]);
      setSelectedOption(null);
      setCustomerName("");
      setPaymentMethod("cash");

      setMessage("Sale completed successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred.");
    }
    setShowToast(true);
  };

  const handlePrint = () => {
  if (receiptRef.current) {
    const printContents = receiptRef.current.innerHTML;
    const printWindow = window.open("", "", "height=600,width=400");
    printWindow.document.write("<html><head><title>Receipt</title>");
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContents);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  }

  setTimeout(() => {
    setShowReceipt(false);
    setReceiptData([]);
  }, 1000);
};


  const grandTotal = selectedItems.reduce(
    (sum, si) => sum + si.quantity * si.item.selling_price,
    0
  );

  return (
  <div
    className="container my-5 p-4 rounded shadow-lg"
    style={{
      background: "#fdfdfd",
      borderRadius: "12px",
      border: "1px solid #eaeaea",
    }}
  >
    <h2
      className="text-center mb-4 fw-bold"
      style={{ color: "#2c3e50", letterSpacing: "0.5px" }}
    >
      💸 Sell Items
    </h2>

    <Row>
      {/* Left: Sell form */}
      <Col md={showReceipt ? 7 : 12}>
        <Card
          className="p-4 shadow-sm border-0"
          style={{
            borderRadius: "12px",
            background: "#ffffff",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-muted">
                Scan Barcode
              </Form.Label>
              <Form.Control
                type="text"
                value={barcode}
                onChange={handleBarcodeChange}
                placeholder="🔍 Scan barcode here..."
                autoFocus
                className="shadow-sm"
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-muted">
                Select Item (Manual)
              </Form.Label>
              <Select
                options={itemOptions}
                onChange={handleItemSelect}
                value={selectedOption}
                placeholder="Search and select item..."
                isClearable
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: "8px",
                    borderColor: "#ced4da",
                    boxShadow: "none",
                    minHeight: "42px",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: "8px",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? "#e6f7ff" : "#fff",
                    color: "#2c3e50",
                    cursor: "pointer",
                  }),
                }}
              />
            </Form.Group>

            {selectedItems.length > 0 && (
              <>
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="mt-3 align-middle shadow-sm"
                >
                  <thead style={{ background: "#4a90e2", color: "#fff" }}>
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
                    {selectedItems.map((si) => (
                      <tr key={si.item.id}>
                        <td>{si.item.name}</td>
                        <td>{si.item.quantity}</td>
                        <td>Ksh {si.item.selling_price}</td>
                        <td>
                          <Form.Control
                            type="number"
                            min="1"
                            max={si.item.quantity}
                            value={si.quantity}
                            onChange={(e) =>
                              handleQuantityChange(si.item.id, e.target.value)
                            }
                            style={{ width: "80px" }}
                          />
                        </td>
                        <td>
                          Ksh {(si.quantity * si.item.selling_price).toFixed(2)}
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(si.item.id)}
                            className="rounded-pill px-3"
                          >
                            ❌ Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <h5 className="text-end mt-3 mb-4">
                  Total:{" "}
                  <span
                    style={{
                      fontWeight: "700",
                      color: "#27ae60",
                      fontSize: "1.2rem",
                    }}
                  >
                    Ksh {grandTotal.toFixed(2)}
                  </span>
                </h5>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-muted">
                Customer Name
              </Form.Label>
              <Form.Control
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name..."
                className="shadow-sm"
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-muted">
                Payment Method
              </Form.Label>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="shadow-sm"
                style={{ borderRadius: "8px" }}
              >
                <option value="cash">💵 Cash</option>
                <option value="mpesa">📱 M-Pesa</option>
                <option value="credit">💳 Credit</option>
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              variant="success"
              disabled={selectedItems.length === 0}
              className="w-100 fw-bold shadow-sm py-2"
              style={{
                backgroundColor: "#27ae60",
                border: "none",
                borderRadius: "10px",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#219150")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#27ae60")}
            >
              ✅ Confirm Sale
            </Button>
          </Form>
        </Card>
      </Col>

      {/* Right: Receipt */}
      {showReceipt && receiptData.length > 0 && (
        <Col md={5} className="d-flex justify-content-center">
          <Receipt
            ref={receiptRef}
            shopName="📚 Purlow Bookshop"
            shopAddress="Nairobi, Kenya"
            receiptData={receiptData}
            customerName={customerName}
            paymentMethod={paymentMethod}
            onPrint={handlePrint}
          />
        </Col>
      )}
    </Row>

    {/* Toast */}
    <ToastContainer position="top-center" className="p-3">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          backgroundColor: "#4a90e2",
          color: "#fff",
          minWidth: "250px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Toast.Body className="fw-semibold text-center">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  </div>
);

};

export default SellForm;
