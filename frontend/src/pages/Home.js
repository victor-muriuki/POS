// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Check token existence

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={10} lg={8}>
          {/* Hero Image */}
          <Image
            src="https://source.unsplash.com/featured/?inventory,warehouse"
            fluid
            rounded
            className="shadow mb-4"
            style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
            alt="Inventory Hero"
          />
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow p-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3 text-primary">
                {isLoggedIn
                  ? 'Welcome Back!'
                  : 'Welcome to the Inventory Management System'}
              </Card.Title>

              <Card.Text className="mb-4 text-muted">
                {isLoggedIn
                  ? 'Manage your inventory, track sales, and generate reports all in one place.'
                  : 'Please log in to access your inventory and sales tools.'}
              </Card.Text>

              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(isLoggedIn ? '/inventory' : '/login')}
              >
                {isLoggedIn ? '📦 Go to Inventory' : '🔐 Log In to Continue'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
