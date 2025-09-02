// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import heroImage from '../assets/hero.jpg'; // Ensure the image exists in src/assets

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalStock: 0, todaysSales: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:5000/user', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data)).catch(console.error);

    axios.get('http://localhost:5000/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="container mt-4">
      {/* Hero Section with overlay */}
      <div
        className="position-relative text-white text-center mb-5"
        style={{
          height: '300px',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <h1 className="fw-bold">Inventory Management System</h1>
        <p className="lead">Track your stock, record sales, and grow your business.</p>
      </div>

      {/* Greeting */}
      <h3 className="mb-4">Welcome back, {user?.username || 'User'}!</h3>

      {/* Quick Stats */}
      <Row className="mb-5">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Total Stock Items</Card.Title>
              <Card.Text className="fs-3 fw-bold">{stats.totalStock}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Today's Sales</Card.Title>
              <Card.Text className="fs-3 fw-bold">Ksh {stats.todaysSales.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
