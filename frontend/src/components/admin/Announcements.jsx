import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Badge, Modal } from 'react-bootstrap';
import { FaBullhorn, FaBell, FaCalendarAlt, FaUser, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import './Announcements.css';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        targetAudience: 'ALL',
        courseId: '',
        semester: '',
        expiryDate: ''
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const data = await adminService.getAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            toast.error('Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddAnnouncement = () => {
        setEditingAnnouncement(null);
        setFormData({
            title: '',
            content: '',
            targetAudience: 'ALL',
            courseId: '',
            semester: '',
            expiryDate: ''
        });
        setShowModal(true);
    };

    const handleEditAnnouncement = (announcement) => {
        setEditingAnnouncement(announcement);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            targetAudience: announcement.targetAudience,
            courseId: announcement.courseId || '',
            semester: announcement.semester || '',
            expiryDate: announcement.expiryDate
        });
        setShowModal(true);
    };

    const handleDeleteAnnouncement = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await adminService.deleteAnnouncement(id);
                toast.success('Announcement deleted successfully');
                fetchAnnouncements();
            } catch (error) {
                toast.error('Failed to delete announcement');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAnnouncement) {
                await adminService.updateAnnouncement(editingAnnouncement.id, formData);
                toast.success('Announcement updated successfully');
            } else {
                await adminService.postAnnouncement(formData);
                toast.success('Announcement posted successfully');
            }
            setShowModal(false);
            fetchAnnouncements();
        } catch (error) {
            toast.error(`Failed to ${editingAnnouncement ? 'update' : 'post'} announcement`);
        }
    };

    const getAudienceBadge = (audience) => {
        const badges = {
            'ALL': 'primary',
            'STUDENTS': 'success',
            'TEACHERS': 'info',
            'SPECIFIC': 'warning'
        };
        return `badge bg-${badges[audience]}`;
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <motion.div 
            className="admin-announcements"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <Header />
            <div className="d-flex">
                <Sidebar role="ADMIN" />
                <div className="main-content p-4 w-100">
                    <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h4><FaBullhorn /> Announcements</h4>
                        </Col>
                        {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                            <Col className="text-end">
                                <Button variant="primary" onClick={handleAddAnnouncement}>
                                    <FaPlus /> New Announcement
                                </Button>
                            </Col>
                        )}
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                {announcements.map((announcement, index) => (
                    <Col md={6} key={index} className="mb-4">
                        <Card className="announcement-card">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                    <FaBell className="text-primary me-2" />
                                    <strong>{announcement.title}</strong>
                                </div>
                                <div>
                                    <Badge className={getAudienceBadge(announcement.targetAudience)}>
                                        {announcement.targetAudience}
                                    </Badge>
                                    {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                                        <>
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                className="text-primary ms-2"
                                                onClick={() => handleEditAnnouncement(announcement)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                className="text-danger"
                                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <p className="announcement-content">{announcement.content}</p>
                                
                                {(announcement.courseName || announcement.semester) && (
                                    <div className="target-info mb-2">
                                        <small className="text-muted">
                                            Target: {announcement.courseName} 
                                            {announcement.semester && ` - Semester ${announcement.semester}`}
                                        </small>
                                    </div>
                                )}
                                
                                <div className="announcement-meta">
                                    <small className="text-muted">
                                        <FaUser /> Posted by: {announcement.postedBy}
                                    </small>
                                    <small className="text-muted ms-3">
                                        <FaCalendarAlt /> {new Date(announcement.postedDate).toLocaleDateString()}
                                    </small>
                                    {announcement.expiryDate && (
                                        <small className="text-muted ms-3">
                                            Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                                        </small>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {announcements.length === 0 && (
                <Card>
                    <Card.Body className="text-center text-muted py-5">
                        <FaBullhorn size={50} className="mb-3" />
                        <h5>No announcements yet</h5>
                        <p>Check back later for updates</p>
                    </Card.Body>
                </Card>
            )}

            {/* Add/Edit Announcement Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Target Audience</Form.Label>
                                    <Form.Select
                                        name="targetAudience"
                                        value={formData.targetAudience}
                                        onChange={handleInputChange}
                                    >
                                        <option value="ALL">Everyone</option>
                                        <option value="STUDENTS">Students Only</option>
                                        <option value="TEACHERS">Teachers Only</option>
                                        <option value="SPECIFIC">Specific Course/Semester</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {formData.targetAudience === 'SPECIFIC' && (
                                <>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Course</Form.Label>
                                            <Form.Select
                                                name="courseId"
                                                value={formData.courseId}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Course</option>
                                                <option value="1">Computer Science</option>
                                                <option value="2">Engineering</option>
                                                <option value="3">Business</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Semester</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="semester"
                                                value={formData.semester}
                                                onChange={handleInputChange}
                                                placeholder="Semester"
                                            />
                                        </Form.Group>
                                    </Col>
                                </>
                            )}
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Expiry Date (Optional)</Form.Label>
                            <Form.Control
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingAnnouncement ? 'Update' : 'Post'} Announcement
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
                </div>
            </div>
        </motion.div>
    );
};

export default Announcements;
