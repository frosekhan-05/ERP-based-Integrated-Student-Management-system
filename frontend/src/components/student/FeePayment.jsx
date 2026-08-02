import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Row, Col, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaMoneyBillWave, FaCreditCard, FaQrcode, FaHistory } from 'react-icons/fa';
import studentService from '../../services/studentService';
import { toast } from 'react-toastify';
import './FeePayment.css';

const FeePayment = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [processing, setProcessing] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        fetchFees();
        fetchPaymentHistory();
    }, []);

    const fetchFees = async () => {
        try {
            const data = await studentService.getFees();
            setFees(data);
        } catch (error) {
            toast.error('Failed to fetch fee details');
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentHistory = async () => {
        try {
            const data = await studentService.getPaymentHistory();
            setPaymentHistory(data);
        } catch (error) {
            console.error('Failed to fetch payment history');
        }
    };

    const handlePayNow = (fee) => {
        setSelectedFee(fee);
        setShowPaymentModal(true);
    };

    const processPayment = async () => {
        setProcessing(true);
        try {
            await studentService.payFees({
                feeId: selectedFee.id,
                amount: selectedFee.dueAmount,
                paymentMethod: paymentMethod
            });
            toast.success('Payment successful!');
            setShowPaymentModal(false);
            fetchFees();
            fetchPaymentHistory();
        } catch (error) {
            toast.error('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'PAID': 'success',
            'PARTIAL': 'warning',
            'PENDING': 'danger',
            'OVERDUE': 'dark'
        };
        return `badge bg-${badges[status] || 'secondary'}`;
    };

    const totalDue = fees.reduce((sum, fee) => sum + (fee.dueAmount || 0), 0);
    const totalPaid = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
    const totalFees = fees.reduce((sum, fee) => sum + (fee.totalAmount || 0), 0);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="fee-payment">
            <Card className="mb-4">
                <Card.Body>
                    <h4>Fee Payment</h4>
                </Card.Body>
            </Card>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="fee-summary-card total">
                        <Card.Body>
                            <h6>Total Fees</h6>
                            <h3>₹{totalFees.toLocaleString()}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="fee-summary-card paid">
                        <Card.Body>
                            <h6>Paid Amount</h6>
                            <h3>₹{totalPaid.toLocaleString()}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="fee-summary-card due">
                        <Card.Body>
                            <h6>Due Amount</h6>
                            <h3>₹{totalDue.toLocaleString()}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">Fee Structure</h5>
                </Card.Header>
                <Card.Body>
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>Fee Type</th>
                                <th>Description</th>
                                <th>Total Amount</th>
                                <th>Paid Amount</th>
                                <th>Due Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.map((fee, index) => (
                                <tr key={index}>
                                    <td>{fee.feeType}</td>
                                    <td>{fee.description}</td>
                                    <td>₹{fee.totalAmount?.toLocaleString()}</td>
                                    <td>₹{fee.paidAmount?.toLocaleString()}</td>
                                    <td className={fee.dueAmount > 0 ? 'text-danger fw-bold' : ''}>
                                        ₹{fee.dueAmount?.toLocaleString()}
                                    </td>
                                    <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={getStatusBadge(fee.status)}>
                                            {fee.status}
                                        </span>
                                    </td>
                                    <td>
                                        {fee.dueAmount > 0 && (
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={() => handlePayNow(fee)}
                                            >
                                                <FaMoneyBillWave /> Pay Now
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>
                    <h5 className="mb-0"><FaHistory /> Payment History</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>Fee Type</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((payment, index) => (
                                <tr key={index}>
                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                    <td>{payment.transactionId}</td>
                                    <td>{payment.feeType}</td>
                                    <td>₹{payment.amount?.toLocaleString()}</td>
                                    <td>{payment.method}</td>
                                    <td>
                                        <span className="badge bg-success">Success</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Make Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFee && (
                        <>
                            <Alert variant="info">
                                <strong>Amount to Pay:</strong> ₹{selectedFee.dueAmount?.toLocaleString()}
                            </Alert>

                            <Form.Group className="mb-3">
                                <Form.Label>Select Payment Method</Form.Label>
                                <div className="payment-methods">
                                    <Form.Check
                                        type="radio"
                                        label={
                                            <div className="payment-method">
                                                <FaCreditCard /> Credit/Debit Card
                                            </div>
                                        }
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label={
                                            <div className="payment-method">
                                                <FaMoneyBillWave /> Net Banking
                                            </div>
                                        }
                                        name="paymentMethod"
                                        value="netbanking"
                                        checked={paymentMethod === 'netbanking'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label={
                                            <div className="payment-method">
                                                <FaQrcode /> UPI
                                            </div>
                                        }
                                        name="paymentMethod"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                </div>
                            </Form.Group>

                            {paymentMethod === 'card' && (
                                <div className="card-details">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Card Number</Form.Label>
                                        <Form.Control type="text" placeholder="1234 5678 9012 3456" />
                                    </Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Expiry Date</Form.Label>
                                                <Form.Control type="text" placeholder="MM/YY" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>CVV</Form.Label>
                                                <Form.Control type="password" placeholder="123" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            {paymentMethod === 'upi' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>UPI ID</Form.Label>
                                    <Form.Control type="text" placeholder="example@okhdfcbank" />
                                </Form.Group>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={processPayment}
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <Spinner size="sm" /> Processing...
                            </>
                        ) : (
                            'Pay Now'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FeePayment;
