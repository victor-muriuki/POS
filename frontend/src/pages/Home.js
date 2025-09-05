import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import heroImage from '../assets/hero.jpg';

const Home = () => {
  const [user, setUser] = useState({ username: '', role: '' });
  const [stats, setStats] = useState({ totalStock: 0, todaysSales: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const username = localStorage.getItem('username') || '';
    const role = localStorage.getItem('role') || 'user';
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setUser({ username, role });

    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('role');
          navigate('/login', { state: { message: 'Session expired. Please log in again.' }, replace: true });
        } else {
          setError('Failed to load data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const isAdmin = user.role === 'admin';

  return (
    <div>
      {/* Hero Section */}
      <div
        className="position-relative text-dark text-center"
        style={{
          width: '100%',
          height: '300px',
          backgroundColor: '#f8f9fa',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <h1 className="fw-bold display-4">Inventory Management System</h1>
        <p className="lead fs-4">Track your stock, record sales, and grow your business.</p>
      </div>

      <Container className="mt-4">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center my-5">
            <Spinner animation="border" role="status" aria-label="Loading data" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            {/* Quick Stats */}
            <Row className="g-4 mb-4">
              <Col md={6}>
                <Card className="shadow-sm border-0 h-100 text-center">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <Card.Title className="text-muted">Total Stock Items</Card.Title>
                    <Card.Text className="fs-2 fw-bold">{stats.totalStock}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm border-0 h-100 text-center">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <Card.Title className="text-muted">Today's Sales</Card.Title>
                    <Card.Text className="fs-2 fw-bold">Ksh {stats.todaysSales.toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              <Button variant="primary" size="lg" onClick={() => navigate('/sell')}>
                Sell Item
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/transactions')}>
                View Transactions
              </Button>

              {/* Admin-only actions */}
              {isAdmin && (
                <>
                  <Button variant="success" size="lg" onClick={() => navigate('/inventory-form')}>
                    Add Inventory
                  </Button>
                  <Button variant="warning" size="lg" onClick={() => navigate('/quotation')}>
                    Generate Quotation
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Home;
