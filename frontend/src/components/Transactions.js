import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    let url = 'http://localhost:5000/transactions';
    if (filterDate) {
      url += `?date=${filterDate}`;
    }
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
      })
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filterDate]);

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Transactions</h2>

      <Form.Group className="mb-4">
        <Form.Label>Filter by Date</Form.Label>
        <Form.Control
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
      </Form.Group>

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

      <Row>
        {transactions.map(tx => (
          <Col key={tx.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{tx.item_name || 'Unknown Item'}</Card.Title>
                <Card.Text>
                  <strong>Quantity Sold:</strong> {tx.quantity_sold}<br />
                  <strong>Total Price:</strong> Ksh {tx.total_price.toFixed(2)}<br />
                  <strong>Date:</strong> {new Date(tx.date).toLocaleString()}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
