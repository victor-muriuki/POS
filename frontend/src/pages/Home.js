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
          navigate('/login', {
            state: { message: 'Session expired. Please log in again.' },
            replace: true,
          });
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
          height: '320px',
          backgroundColor: '#f4f6f9',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <h1 className="fw-bold display-5 text-primary mb-2">Inventory Management System</h1>
        <p className="lead fs-5 text-muted mb-0">Track your stock, record sales, and grow your business efficiently.</p>
      </div>

      <Container className="mt-5">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center my-5">
            <Spinner animation="border" role="status" aria-label="Loading data" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center shadow-sm">
            {error}
          </Alert>
        ) : (
          <>
            {/* Quick Stats */}
            <Row className="g-4 mb-5">
              <Col md={6}>
                <Card className="shadow-sm border-0 rounded-4 text-center h-100 bg-light">
                  <Card.Body>
                    <Card.Title className="text-muted mb-2">Total Stock Items</Card.Title>
                    <Card.Text className="fs-2 fw-bold text-primary">{stats.totalStock}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm border-0 rounded-4 text-center h-100 bg-light">
                  <Card.Body>
                    <Card.Title className="text-muted mb-2">Today's Sales</Card.Title>
                    <Card.Text className="fs-2 fw-bold text-success">
                      Ksh {stats.todaysSales.toFixed(2)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              {/* Common Buttons */}
              <StyledButton
                label="Inventory"
                variant="outline-primary"
                onClick={() => navigate('/inventory')}
              />
              <StyledButton
                label="Sell"
                variant="primary"
                onClick={() => navigate('/sell')}
              />
              <StyledButton
                label="Add Inventory"
                variant="success"
                onClick={() => navigate('/inventory-form')}
              />

              {/* Admin-only */}
              {isAdmin && (
                <>
                  <StyledButton
                    label="View Transactions"
                    variant="info"
                    onClick={() => navigate('/transactions')}
                  />
                  <StyledButton
                    label="Generate Quotation"
                    variant="warning"
                    onClick={() => navigate('/quotation')}
                  />
                </>
              )}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

/** Custom styled button for consistent design */
const StyledButton = ({ label, variant, onClick }) => (
  <Button
    variant={variant}
    size="lg"
    onClick={onClick}
    className="px-4 py-2 fw-semibold rounded-4 shadow-sm"
    style={{
      minWidth: '180px',
      transition: 'all 0.3s ease',
    }}
    onMouseEnter={(e) => (e.target.style.transform = 'translateY(-3px)')}
    onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
  >
    {label}
  </Button>
);

export default Home;
