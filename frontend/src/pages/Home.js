import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';

const Home = () => {
  const [user, setUser] = useState({ username: '', role: '' });
  const [stats, setStats] = useState({ totalStock: 0, todaysSales: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Fetch logged-in user info
        const userRes = await axios.get('http://localhost:5000/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // Fetch quick stats
        const statsRes = await axios.get('http://localhost:5000/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login', { state: { message: 'Session expired. Please log in again.' }, replace: true });
        } else {
          setError('Failed to load data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      {/* Hero Section */}
      <div
        className="position-relative text-white text-center"
        style={{
          width: '100%',
          height: '300px',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${heroImage})`,
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
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <>
            {/* Personalized Greeting with role */}
            <h3 className="mb-4">
              Welcome back, {user.username || 'Guest'}{user.role ? ` (${user.role})` : ''}!
            </h3>

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
              <Button
                variant="primary"
                size="lg"
                aria-label="Sell item"
                onClick={() => navigate('/sell')}
              >
                Sell Item
              </Button>

              <Button
                variant="secondary"
                size="lg"
                aria-label="View transactions"
                onClick={() => navigate('/transactions')}
              >
                View Transactions
              </Button>

              {/* Role-based actions */}
              {user.role === 'admin' && (
                <>
                  <Button
                    variant="success"
                    size="lg"
                    aria-label="Add inventory"
                    onClick={() => navigate('/inventory-form')}
                  >
                    Add Inventory
                  </Button>
                  <Button
                    variant="warning"
                    size="lg"
                    aria-label="Generate quotation"
                    onClick={() => navigate('/quotation')}
                  >
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
