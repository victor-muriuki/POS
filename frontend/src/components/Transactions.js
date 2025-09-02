import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Badge,
  Button,
} from 'react-bootstrap';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 3;

  useEffect(() => {
    let url = 'http://localhost:5000/transactions';
    if (filterDate) url += `?date=${filterDate}`;
    setLoading(true);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
      })
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filterDate]);

  const totalPages = Math.ceil(transactions.length / groupsPerPage);
  const currentGroups = useMemo(() => {
    const start = (currentPage - 1) * groupsPerPage;
    return transactions.slice(start, start + groupsPerPage);
  }, [transactions, currentPage]);

  const flattenedTransactions = useMemo(() => {
    return transactions.flatMap(group =>
      group.transactions.map(tx => ({
        ...tx,
        date: group.date,
        transaction_id: group.transaction_id,
        payment_method: group.payment_method,
        customer_name: group.customer_name
      }))
    );
  }, [transactions]);

  const getPaymentBadgeVariant = (method) => {
    if (!method) return 'secondary';
    switch (method.toLowerCase()) {
      case 'cash': return 'success';
      case 'mpesa': return 'primary';
      case 'credit': return 'warning';
      default: return 'secondary';
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transactions Report', 14, 15);
    let startY = 20;

    transactions.forEach(group => {
      doc.setFontSize(11);
      doc.text(`Transaction ID: ${group.transaction_id}`, 14, startY);
      doc.text(`Date: ${new Date(group.date).toLocaleString()}`, 14, startY + 5);

      // Payment method badge with color
      let badgeColor;
      switch ((group.payment_method || '').toLowerCase()) {
        case 'cash': badgeColor = [0, 128, 0]; break;       // green
        case 'mpesa': badgeColor = [0, 123, 255]; break;    // blue
        case 'credit': badgeColor = [255, 193, 7]; break;   // yellow
        default: badgeColor = [108, 117, 125];              // gray
      }

      doc.setFillColor(...badgeColor);
      doc.rect(14, startY + 10, 40, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(group.payment_method || 'N/A', 16, startY + 14);
      doc.setTextColor(0, 0, 0);

      startY += 20;

      autoTable(doc, {
        startY,
        head: [['Item Name', 'Qty Sold', 'Total (KES)']],
        body: group.transactions.map(tx => [
          tx.item_name,
          tx.quantity_sold,
          tx.total_price.toFixed(2)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [100, 149, 237] },
        margin: { left: 14, right: 14 },
      });

      const groupTotal = group.transactions.reduce((sum, tx) => sum + tx.total_price, 0);
      doc.text(`Total Amount: Ksh ${groupTotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 8);

      startY = doc.lastAutoTable.finalY + 15;
    });

    doc.save('transactions.pdf');
  };

  const csvHeaders = [
    { label: 'Transaction ID', key: 'transaction_id' },
    { label: 'Item Name', key: 'item_name' },
    { label: 'Quantity Sold', key: 'quantity_sold' },
    { label: 'Total Price', key: 'total_price' },
    { label: 'Date', key: 'date' },
    { label: 'Payment Method', key: 'payment_method' },
    { label: 'Customer Name', key: 'customer_name' },
  ];

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Transactions</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Label>Filter by Date</Form.Label>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={8} className="d-flex align-items-end gap-2">
          <Button variant="danger" onClick={exportPDF}>
            <FaFilePdf className="me-1" /> Export PDF
          </Button>
          <CSVLink
            headers={csvHeaders}
            data={flattenedTransactions}
            filename="transactions.csv"
            className="btn btn-success"
          >
            <FaFileCsv className="me-1" /> Export CSV
          </CSVLink>
        </Col>
      </Row>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p>Loading transactions...</p>
        </div>
      )}

      {error && <Alert variant="danger">Error: {error}</Alert>}

      {!loading && transactions.length === 0 && (
        <Alert variant="info">No transactions found.</Alert>
      )}

      {currentGroups.map(group => {
        const groupTotal = group.transactions.reduce((sum, tx) => sum + tx.total_price, 0);
        return (
          <Card key={group.transaction_id} className="mb-4 shadow-sm">
            <Card.Header>
              <strong>Transaction ID:</strong> {group.transaction_id}{' '}
              <span className="text-muted float-end">{new Date(group.date).toLocaleString()}</span>
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Payment Method:</strong>{' '}
                <Badge bg={getPaymentBadgeVariant(group.payment_method)}>
                  {group.payment_method || 'N/A'}
                </Badge>
              </p>
              {group.transactions.map(tx => (
                <Row key={tx.id} className="mb-2">
                  <Col xs={6}>{tx.item_name}</Col>
                  <Col xs={2}>
                    <Badge bg="secondary">{tx.quantity_sold}</Badge>
                  </Col>
                  <Col xs={4}>
                    <Badge bg="success">Ksh {tx.total_price.toFixed(2)}</Badge>
                  </Col>
                </Row>
              ))}
              <hr />
              <Row className="mt-2">
                <Col xs={6}><strong>Total Amount:</strong></Col>
                <Col xs={6}>
                  <Badge bg="warning" className="text-dark">Ksh {groupTotal.toFixed(2)}</Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      })}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
    </Container>
  );
}
