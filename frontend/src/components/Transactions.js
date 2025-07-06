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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;

  useEffect(() => {
    let url = 'http://localhost:5000/transactions';
    if (filterDate) {
      url += `?date=${filterDate}`;
    }
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) =>
      tx.item_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const currentTransactions = useMemo(() => {
    const start = (currentPage - 1) * transactionsPerPage;
    return filteredTransactions.slice(start, start + transactionsPerPage);
  }, [filteredTransactions, currentPage]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transactions Report', 14, 15);
    autoTable(doc, {
      head: [['Item Name', 'Quantity Sold', 'Total Price (KES)', 'Date']],
      body: filteredTransactions.map((tx) => [
        tx.item_name,
        tx.quantity_sold,
        tx.total_price.toFixed(2),
        new Date(tx.date).toLocaleString(),
      ]),
      startY: 25,
    });
    doc.save('transactions.pdf');
  };

  const csvHeaders = [
    { label: 'Item Name', key: 'item_name' },
    { label: 'Quantity Sold', key: 'quantity_sold' },
    { label: 'Total Price', key: 'total_price' },
    { label: 'Date', key: 'date' },
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
        <Col md={4}>
          <Form.Label>Search by Item Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search item..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={4} className="d-flex align-items-end gap-2">
          <Button variant="danger" onClick={exportPDF}>
            <FaFilePdf className="me-1" /> Export PDF
          </Button>
          <CSVLink
            headers={csvHeaders}
            data={filteredTransactions}
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

      {!loading && filteredTransactions.length === 0 && (
        <Alert variant="info">No transactions found.</Alert>
      )}

      <Row>
        {currentTransactions.map((tx) => (
          <Col key={tx.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-primary">{tx.item_name || 'Unknown Item'}</Card.Title>
                <Card.Text>
                  <strong>Quantity Sold:</strong>{' '}
                  <Badge bg="secondary">{tx.quantity_sold}</Badge>
                  <br />
                  <strong>Total Price:</strong>{' '}
                  <Badge bg="success">Ksh {tx.total_price.toFixed(2)}</Badge>
                  <br />
                  <strong>Date:</strong> {new Date(tx.date).toLocaleString()}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
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
              <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
    </Container>
  );
}
