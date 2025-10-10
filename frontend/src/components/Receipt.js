import React, { forwardRef } from "react";
import { Button } from "react-bootstrap";

const Receipt = forwardRef(
  ({ receiptData, customerName, paymentMethod, onPrint }, ref) => {
    if (!receiptData || receiptData.length === 0) return null;

    const subtotal = receiptData.reduce((sum, r) => sum + r.total, 0);
    // const tax = +(subtotal * 0.08).toFixed(2); // Commented out tax for now
    const total = subtotal; // No tax applied
    const now = new Date();

    // Format time without seconds
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
      <div
        ref={ref}
        style={{
          width: "260px",
          margin: "0 auto",
          padding: "10px",
          fontFamily: "Courier New, monospace",
          fontSize: "12px",
          backgroundColor: "#fff",
          color: "#000",
          border: "1px dashed #000",
        }}
      >
        {/* Header */}
        <div className="text-center mb-2">
          <h6 style={{ marginBottom: "2px", fontWeight: "bold", textTransform: "uppercase" }}>
            Purlow Agencies
          </h6>
          <p style={{ margin: "0", fontSize: "11px" }}>Embu, Kenya</p>
          <p style={{ margin: "0", fontSize: "11px" }}>Email: purlowagencies@gmail.com</p>
          <p style={{ margin: "2px 0", fontSize: "11px" }}>
            {now.toLocaleDateString()} | {timeString}
          </p>
        </div>

        <hr style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />

        {/* Items */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>QTY</th>
              <th style={{ textAlign: "left" }}>ITEM</th>
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

        <hr style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tax (8%)</span>
          <span>{tax.toFixed(2)}</span>
        </div> */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            borderTop: "1px dashed #000",
            paddingTop: "2px",
          }}
        >
          <span>Total</span>
          <span>{total.toFixed(2)}</span>
        </div>

        <hr style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />

        {/* Customer & Payment */}
        <p style={{ margin: "2px 0" }}>
          Customer: {customerName || "N/A"}
          <br />
          Payment: {paymentMethod || "N/A"}
        </p>

        <hr style={{ borderTop: "1px dashed #000", margin: "4px 0" }} />

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "4px" }}>
          <p style={{ margin: "2px 0", fontWeight: "bold" }}>Thank you for your business!</p>
          <p style={{ margin: "2px 0", fontSize: "11px" }}>
            Goods once sold are not returnable.
          </p>
        </div>

        {/* Print Button (hidden on print) */}
        <div className="text-center no-print mt-2">
          <Button
            variant="dark"
            size="sm"
            onClick={onPrint}
            style={{ borderRadius: "20px" }}
          >
            🖨️ Print Receipt
          </Button>
        </div>
      </div>
    );
  }
);

export default Receipt;
