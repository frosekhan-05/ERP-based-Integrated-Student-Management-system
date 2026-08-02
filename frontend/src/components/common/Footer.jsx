import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <Container fluid="lg">
                <Row className="g-4 align-items-center">
                    <Col lg={5}>
                        <div className="footer-brand">
                            <span className="footer-mark">ERP</span>
                            <div>
                                <h4>ERP Student Management System</h4>
                                <p>Bright, organized workflows for modern schools and colleges.</p>
                            </div>
                        </div>
                    </Col>
                    
                    <Col lg={4}>
                        <div className="footer-tags">
                            <span className="footer-tag">Attendance</span>
                            <span className="footer-tag">Marks</span>
                            <span className="footer-tag">Fees</span>
                            <span className="footer-tag">Reports</span>
                        </div>
                        <p className="footer-meta">Version 1.0.0 · &copy; {currentYear} All rights reserved.</p>
                    </Col>
                    
                    <Col lg={3} className="text-lg-end">
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                            <a href="#" className="social-link" aria-label="GitHub">
                                <FaGithub />
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
