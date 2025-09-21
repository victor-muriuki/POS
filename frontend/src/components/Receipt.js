import React, { forwardRef } from "react";
import { Button } from "react-bootstrap";

const Receipt = forwardRef(({ shopName, shopAddress, receiptData, customerName, paymentMethod, onPrint }, ref) => {
  if (!receiptData || receiptData.length === 0) return null;

  const subtotal = receiptData.reduce((sum, r) => sum + r.total, 0);
  const tax = +(subtotal * 0.08).toFixed(2); // Example 8% tax
  const balance = subtotal + tax;
  const now = new Date();

  return (
    <div
      className="card shadow-sm p-3"
      ref={ref}
      style={{ width: "280px", fontFamily: "monospace", fontSize: "13px" }}
    >
      {/* Header */}
      <h5 className="text-center fw-bold mb-1">{shopName}</h5>
      <p className="text-center mb-2">{shopAddress}</p>

      {/* Date & Time */}
      <div className="d-flex justify-content-between">
        <span>{now.toLocaleDateString()}</span>
        <span>{now.toLocaleTimeString()}</span>
      </div>
      <hr />

      {/* Items */}
      <table className="w-100 mb-2">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>QTY</th>
            <th style={{ textAlign: "left" }}>DESC</th>
            <th style={{ textAlign: "right" }}>AMT</th>
          </tr>
        </thead>
        <tbody>
          {receiptData.map((r, i) => (
            <tr key={i}>
              <td>{r.quantity}</td>
              <td>{r.name}</td>
              <td style={{ textAlign: "right" }}>{r.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />

      {/* Totals */}
      <div className="d-flex justify-content-between">
        <span>SUBTOTAL</span>
        <span>{subtotal.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>TAX (8%)</span>
        <span>{tax.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between fw-bold">
        <span>TOTAL</span>
        <span>{balance.toFixed(2)}</span>
      </div>
      <hr />

      {/* Footer */}
      <p>Customer: {customerName || "N/A"}</p>
      <p>Payment: {paymentMethod}</p>
      <p className="text-center mt-3">Thank you for shopping!</p>

      {/* Print Button */}
      <div className="text-center mt-2 no-print">
        <Button variant="outline-secondary" size="sm" onClick={onPrint}>
          🖨️ Print Receipt
        </Button>
      </div>
    </div>
  );
});

export default Receipt;
