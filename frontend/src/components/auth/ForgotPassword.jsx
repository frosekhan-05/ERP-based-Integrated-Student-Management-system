import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await authService.forgotPassword(email);
            setSent(true);
            toast.success('Password reset link sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <Card className="forgot-password-card">
                <Card.Body>
                    <div className="text-center mb-4">
                        <h3>Forgot Password?</h3>
                        <p className="text-muted">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {sent ? (
                        <Alert variant="success">
                            <Alert.Heading>Email Sent!</Alert.Heading>
                            <p>
                                We've sent a password reset link to <strong>{email}</strong>. 
                                Please check your inbox and follow the instructions.
                            </p>
                            <hr />
                            <div className="text-center">
                                <Link to="/login" className="btn btn-primary">
                                    Back to Login
                                </Link>
                            </div>
                        </Alert>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaEnvelope />
                                    </span>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-100 mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" /> Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>

                            <div className="text-center">
                                <Link to="/login" className="text-decoration-none">
                                    <FaArrowLeft /> Back to Login
                                </Link>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ForgotPassword;
