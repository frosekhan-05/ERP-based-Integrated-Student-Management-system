import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './TeacherManagement.css';

const emptyFormData = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    department: '',
    interestedCourse: ''
};

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(emptyFormData);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teachersData, coursesData] = await Promise.all([
                adminService.getAllTeachers(),
                adminService.getAllCourses()
            ]);
            setTeachers(teachersData || []);
            setCourses(coursesData || []);
        } catch (error) {
            toast.error('Failed to fetch teachers');
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

    const handleAddTeacher = () => {
        setModalType('add');
        setSelectedTeacher(null);
        setFormData({ ...emptyFormData });
        setShowModal(true);
    };

    const handleEditTeacher = (teacher) => {
        setModalType('edit');
        setSelectedTeacher(teacher);
        setFormData({
            username: teacher.username || '',
            password: '',
            email: teacher.email || '',
            firstName: teacher.firstName || '',
            lastName: teacher.lastName || '',
            department: teacher.department || '',
            interestedCourse: teacher.interestedCourse || ''
        });
        setShowModal(true);
    };

    const handleDeleteTeacher = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await adminService.deleteTeacher(id);
                toast.success('Teacher deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete teacher');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'add') {
                await adminService.createTeacher(formData);
                toast.success('Teacher added successfully');
            } else {
                await adminService.updateTeacher(selectedTeacher.id, formData);
                toast.success('Teacher updated successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(`Failed to ${modalType} teacher`);
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        [teacher.firstName, teacher.lastName, teacher.teacherId, teacher.username, teacher.email, teacher.department, teacher.interestedCourse]
            .filter(Boolean)
            .some(value => value.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="teacher-management">
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={4}>
                            <h4>Teacher Management</h4>
                        </Col>
                        <Col md={8} className="text-end">
                            <Button variant="primary" onClick={handleAddTeacher}>
                                <FaPlus /> Add New Teacher
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search teachers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Table responsive hover className="teacher-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Department</th>
                                <th>Interested Course</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeachers.map(teacher => (
                                <tr key={teacher.id}>
                                    <td><Badge bg="secondary">{teacher.teacherId || 'N/A'}</Badge></td>
                                    <td>{teacher.firstName} {teacher.lastName}</td>
                                    <td>{teacher.username}</td>
                                    <td>{teacher.department || 'N/A'}</td>
                                    <td>{teacher.interestedCourse || 'N/A'}</td>
                                    <td>{teacher.email}</td>
                                    <td>
                                        <Badge bg={teacher.active ? 'success' : 'secondary'}>
                                            {teacher.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEditTeacher(teacher)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteTeacher(teacher.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'add' ? 'Add New Teacher' : 'Edit Teacher'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <h6 className="section-title">Login Information</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Password {modalType === 'add' && <span className="text-danger">*</span>}
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={modalType === 'add'}
                                        placeholder={modalType === 'edit' ? 'Leave blank to keep current password' : ''}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="section-title mt-3">Personal Information</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <h6 className="section-title mt-3">Academic Information</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Department</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Computer Science"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Interested Course</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="interestedCourse"
                                        value={formData.interestedCourse}
                                        onChange={handleInputChange}
                                        list="teacher-course-options"
                                        placeholder="Type or select a course"
                                    />
                                    <datalist id="teacher-course-options">
                                        {courses.map(course => (
                                            <option key={course.id} value={course.courseName} />
                                        ))}
                                    </datalist>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {modalType === 'add' ? 'Add Teacher' : 'Update Teacher'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default TeacherManagement;
