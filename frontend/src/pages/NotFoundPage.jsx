import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <Header />
            
            <Container className="text-center py-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <FaExclamationTriangle className="not-found-icon" />
                        <h1 className="display-1">404</h1>
                        <h2 className="mb-4">Page Not Found</h2>
                        <p className="text-muted mb-4">
                            The page you are looking for might have been removed, 
                            had its name changed, or is temporarily unavailable.
                        </p>
                        <Button as={Link} to="/" variant="primary" size="lg">
                            <FaHome /> Go to Homepage
                        </Button>
                    </Col>
                </Row>
            </Container>
            
            <Footer />
        </div>
    );
};

export default NotFoundPage;