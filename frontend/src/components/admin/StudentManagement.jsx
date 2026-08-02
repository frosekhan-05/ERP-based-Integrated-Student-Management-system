import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './StudentManagement.css';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        courseId: '',
        batch: '',
        semester: '',
        enrollmentDate: '',
        fatherName: '',
        motherName: '',
        parentPhone: ''
    });

    const normalizeStudent = (student) => ({
        ...student,
        courseId: student.courseId ?? student.course?.id ?? '',
        courseName: student.courseName ?? student.course?.courseName ?? 'N/A'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsData, coursesData] = await Promise.all([
                adminService.getAllStudents(),
                adminService.getAllCourses()
            ]);
            setStudents(studentsData.map(normalizeStudent));
            setCourses(coursesData);
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

    const handleAddStudent = () => {
        setModalType('add');
        setFormData({
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: '',
            gender: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            courseId: '',
            batch: '',
            semester: '',
            enrollmentDate: '',
            fatherName: '',
            motherName: '',
            parentPhone: ''
        });
        setShowModal(true);
    };

    const handleEditStudent = (student) => {
        setModalType('edit');
        setSelectedStudent(student);
        setFormData({
            username: student.username,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            phoneNumber: student.phoneNumber,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            address: student.address,
            city: student.city,
            state: student.state,
            pincode: student.pincode,
            courseId: student.courseId,
            batch: student.batch,
            semester: student.semester,
            enrollmentDate: student.enrollmentDate,
            fatherName: student.fatherName,
            motherName: student.motherName,
            parentPhone: student.parentPhone
        });
        setShowModal(true);
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await adminService.deleteStudent(id);
                toast.success('Student deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete student');
            }
        }
    };

    const handleViewStudent = (student) => {
        // Implement view details modal or navigate to student details page
        setSelectedStudent(student);
        // Show view modal
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'add') {
                await adminService.createStudent(formData);
                toast.success('Student added successfully');
            } else {
                await adminService.updateStudent(selectedStudent.id, formData);
                toast.success('Student updated successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(`Failed to ${modalType} student`);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCourse = !filterCourse || student.courseId === parseInt(filterCourse);
        const matchesSemester = !filterSemester || student.semester === parseInt(filterSemester);
        
        return matchesSearch && matchesCourse && matchesSemester;
    });

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="student-management">
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={4}>
                            <h4>Student Management</h4>
                        </Col>
                        <Col md={8} className="text-end">
                            <Button variant="primary" onClick={handleAddStudent}>
                                <FaPlus /> Add New Student
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <Form.Select 
                                value={filterCourse} 
                                onChange={(e) => setFilterCourse(e.target.value)}
                            >
                                <option value="">All Courses</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.courseName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Select 
                                value={filterSemester} 
                                onChange={(e) => setFilterSemester(e.target.value)}
                            >
                                <option value="">All Semesters</option>
                                {[1,2,3,4,5,6,7,8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button variant="info" className="w-100" onClick={() => {
                                setSearchTerm('');
                                setFilterCourse('');
                                setFilterSemester('');
                            }}>
                                Clear Filters
                            </Button>
                        </Col>
                    </Row>

                    <Table responsive hover className="student-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Course</th>
                                <th>Semester</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td><Badge bg="secondary">{student.studentId}</Badge></td>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>{student.courseName}</td>
                                    <td>Sem {student.semester}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phoneNumber}</td>
                                    <td>
                                        <Badge bg={student.active ? 'success' : 'danger'}>
                                            {student.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="info" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleViewStudent(student)}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleEditStudent(student)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleDeleteStudent(student.id)}
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

            {/* Add/Edit Student Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'add' ? 'Add New Student' : 'Edit Student'}
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
                            {modalType === 'add' && (
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}
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

                        <Row>
                            <Col md={6}>
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
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Enrollment Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="enrollmentDate"
                                        value={formData.enrollmentDate}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pincode</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="section-title mt-3">Academic Information</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course</Form.Label>
                                    <Form.Select
                                        name="courseId"
                                        value={formData.courseId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.courseName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Batch</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="batch"
                                        value={formData.batch}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Semester</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="section-title mt-3">Parent/Guardian Information</h6>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Father's Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fatherName"
                                        value={formData.fatherName}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mother's Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="motherName"
                                        value={formData.motherName}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Parent Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="parentPhone"
                                        value={formData.parentPhone}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {modalType === 'add' ? 'Add Student' : 'Update Student'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default StudentManagement;
