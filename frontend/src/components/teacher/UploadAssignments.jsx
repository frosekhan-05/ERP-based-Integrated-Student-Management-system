import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Table, Row, Col, Spinner, Badge, Modal } from 'react-bootstrap';
import { FaUpload, FaFilePdf, FaFileWord, FaFile, FaDownload, FaTrash, FaEdit } from 'react-icons/fa';
import teacherService from '../../services/teacherService';
import { toast } from 'react-toastify';
import './UploadAssignments.css';

const UploadAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [formData, setFormData] = useState({
        subjectId: '',
        title: '',
        description: '',
        dueDate: '',
        maxMarks: '',
        file: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignmentsData, subjectsData] = await Promise.all([
                teacherService.getAssignments(),
                teacherService.getSubjects()
            ]);
            setAssignments(assignmentsData);
            setSubjects(subjectsData);
        } catch (error) {
            toast.error('Failed to fetch data');
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

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    const handleAddAssignment = () => {
        setEditingAssignment(null);
        setFormData({
            subjectId: '',
            title: '',
            description: '',
            dueDate: '',
            maxMarks: '',
            file: null
        });
        setShowModal(true);
    };

    const handleEditAssignment = (assignment) => {
        setEditingAssignment(assignment);
        setFormData({
            subjectId: assignment.subjectId,
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate,
            maxMarks: assignment.maxMarks,
            file: null
        });
        setShowModal(true);
    };

    const handleDeleteAssignment = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await teacherService.deleteAssignment(id);
                toast.success('Assignment deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete assignment');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append('subjectId', formData.subjectId);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('dueDate', formData.dueDate);
        formDataToSend.append('maxMarks', formData.maxMarks);
        if (formData.file) {
            formDataToSend.append('file', formData.file);
        }

        try {
            if (editingAssignment) {
                await teacherService.updateAssignment(editingAssignment.id, formDataToSend);
                toast.success('Assignment updated successfully');
            } else {
                await teacherService.uploadAssignment(formDataToSend);
                toast.success('Assignment uploaded successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(`Failed to ${editingAssignment ? 'update' : 'upload'} assignment`);
        }
    };

    const getFileIcon = (fileName) => {
        const ext = fileName?.split('.').pop().toLowerCase();
        if (ext === 'pdf') return <FaFilePdf className="text-danger" />;
        if (ext === 'doc' || ext === 'docx') return <FaFileWord className="text-primary" />;
        return <FaFile className="text-secondary" />;
    };

    const getStatusBadge = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return <Badge bg="danger">Expired</Badge>;
        if (daysLeft <= 2) return <Badge bg="warning">Due Soon</Badge>;
        return <Badge bg="success">Active</Badge>;
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="upload-assignments">
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h4>Assignments</h4>
                        </Col>
                        <Col className="text-end">
                            <Button variant="primary" onClick={handleAddAssignment}>
                                <FaUpload /> Upload New Assignment
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                {assignments.map((assignment, index) => (
                    <Col md={6} key={index} className="mb-4">
                        <Card className="assignment-card">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                    {getFileIcon(assignment.fileName)}
                                    <strong className="ms-2">{assignment.title}</strong>
                                </div>
                                <div>
                                    {getStatusBadge(assignment.dueDate)}
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="text-primary ms-2"
                                        onClick={() => handleEditAssignment(assignment)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="text-danger"
                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <p className="assignment-description">{assignment.description}</p>
                                
                                <Row className="assignment-details">
                                    <Col md={6}>
                                        <small className="text-muted">Subject:</small>
                                        <p className="mb-2">{assignment.subjectName}</p>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">Due Date:</small>
                                        <p className="mb-2">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">Max Marks:</small>
                                        <p className="mb-2">{assignment.maxMarks}</p>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">Submissions:</small>
                                        <p className="mb-2">{assignment.submissions || 0} / {assignment.totalStudents || 0}</p>
                                    </Col>
                                </Row>

                                {assignment.fileUrl && (
                                    <div className="mt-3">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            href={assignment.fileUrl}
                                            target="_blank"
                                        >
                                            <FaDownload /> Download Assignment
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {assignments.length === 0 && (
                <Card>
                    <Card.Body className="text-center text-muted py-5">
                        <FaUpload size={50} className="mb-3" />
                        <h5>No assignments uploaded yet</h5>
                        <p>Click the button above to upload your first assignment</p>
                    </Card.Body>
                </Card>
            )}

            {/* Upload Assignment Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingAssignment ? 'Edit Assignment' : 'Upload New Assignment'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Select
                                name="subjectId"
                                value={formData.subjectId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.subjectName} - Semester {subject.semester}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Assignment Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Due Date</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Maximum Marks</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="maxMarks"
                                        value={formData.maxMarks}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Assignment File (PDF, DOC, DOCX)</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                required={!editingAssignment}
                            />
                            <Form.Text className="text-muted">
                                Max file size: 10MB
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingAssignment ? 'Update' : 'Upload'} Assignment
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default UploadAssignments;
