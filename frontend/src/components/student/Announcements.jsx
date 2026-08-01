import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { FaBullhorn, FaBell, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import studentService from '../../services/studentService';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { toast } from 'react-toastify';
import './Announcements.css';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const data = await studentService.getAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            toast.error('Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    };

    const getAudienceBadge = (audience) => {
        const badges = {
            'ALL': 'primary',
            'STUDENTS': 'success',
            'TEACHERS': 'info',
            'SPECIFIC': 'warning'
        };
        return `badge bg-${badges[audience] || 'primary'}`;
    };

    return (
        <motion.div 
            className="student-announcements"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <Header />
            <div className="d-flex">
                <Sidebar role="STUDENT" />
                <div className="main-content p-4 w-100">
                    <Card className="mb-4">
                        <Card.Body>
                            <h4><FaBullhorn /> Notice Board</h4>
                        </Card.Body>
                    </Card>

                    {loading ? (
                        <div className="text-center mt-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Row>
                            {announcements.map((announcement, index) => (
                                <Col md={6} key={index} className="mb-4">
                                    <Card className="h-100 shadow-sm">
                                        <Card.Header className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <FaBell className="text-primary me-2" />
                                                <strong>{announcement.title}</strong>
                                            </div>
                                            {/* Since the backend model doesn't have targetAudience yet, we'll just check if it exists or default to ALL */}
                                            <Badge className={getAudienceBadge(announcement.targetAudience || 'ALL')}>
                                                {announcement.targetAudience || 'ALL'}
                                            </Badge>
                                        </Card.Header>
                                        <Card.Body>
                                            <p>{announcement.message}</p>
                                            <div className="text-muted small mt-3">
                                                <FaCalendarAlt className="me-1" />
                                                {new Date(announcement.createdAt).toLocaleDateString()}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                            {announcements.length === 0 && (
                                <Col md={12}>
                                    <Card>
                                        <Card.Body className="text-center text-muted py-5">
                                            <FaBullhorn size={50} className="mb-3" />
                                            <h5>No announcements yet</h5>
                                            <p>Check back later for updates</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Announcements;
