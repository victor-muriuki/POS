import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';

const Home = () => {
  const [user, setUser] = useState({ username: '', role: '' });
  const [stats, setStats] = useState({ totalStock: 0, todaysSales: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch logged-in user info
    axios
      .get('http://localhost:5000/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(console.error);

    // Fetch quick stats from backend
    axios
      .get('http://localhost:5000/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

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
        {/* Personalized Greeting with role */}
        <h3 className="mb-4">
          Welcome back, {user.username || 'User'}{user.role ? ` (${user.role})` : ''}!
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
          <Button variant="primary" size="lg" onClick={() => navigate('/sell')}>
            Sell Item
          </Button>
          {/* <Button variant="success" size="lg" onClick={() => navigate('/inventory-form')}>
            Add Inventory
          </Button> */}
          <Button variant="secondary" size="lg" onClick={() => navigate('/transactions')}>
            View Transactions
          </Button>
          {/* <Button variant="warning" size="lg" onClick={() => navigate('/quotation')}>
            Generate Quotation
          </Button> */}
        </div>
      </Container>
    </div>
  );
};

export default Home;
