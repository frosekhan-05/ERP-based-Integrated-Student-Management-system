import React, { useState, useEffect } from 'react';
import { 
    Table, Button, Modal, Form, Card, Row, Col, Spinner, 
    Badge, InputGroup, Alert
} from 'react-bootstrap';
import { 
    FaEdit, FaTrash, FaPlus, FaSearch, FaBook, 
    FaChalkboardTeacher, FaFilter, FaDownload
} from 'react-icons/fa';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './SubjectManagement.css';

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterTeacher, setFilterTeacher] = useState('');
    
    const [formData, setFormData] = useState({
        subjectName: '',
        subjectCode: '',
        courseId: '',
        semester: '',
        credits: '',
        teacherId: '',
        description: '',
        syllabus: '',
        totalClasses: '',
        practicalHours: '',
        theoryHours: '',
        isElective: false,
        prerequisite: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [subjectsData, coursesData, teachersData] = await Promise.all([
                adminService.getAllSubjects(),
                adminService.getAllCourses(),
                adminService.getAllTeachers()
            ]);
            setSubjects(subjectsData);
            setCourses(coursesData);
            setTeachers(teachersData);
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.subjectName.trim()) {
            errors.subjectName = 'Subject name is required';
        }
        if (!formData.subjectCode.trim()) {
            errors.subjectCode = 'Subject code is required';
        }
        if (!formData.courseId) {
            errors.courseId = 'Please select a course';
        }
        if (!formData.semester) {
            errors.semester = 'Semester is required';
        } else if (formData.semester < 1 || formData.semester > 8) {
            errors.semester = 'Semester must be between 1 and 8';
        }
        if (!formData.credits) {
            errors.credits = 'Credits are required';
        } else if (formData.credits < 1 || formData.credits > 10) {
            errors.credits = 'Credits must be between 1 and 10';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddSubject = () => {
        setModalType('add');
        setFormData({
            subjectName: '',
            subjectCode: '',
            courseId: '',
            semester: '',
            credits: '',
            teacherId: '',
            description: '',
            syllabus: '',
            totalClasses: '',
            practicalHours: '',
            theoryHours: '',
            isElective: false,
            prerequisite: ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEditSubject = (subject) => {
        setModalType('edit');
        setSelectedSubject(subject);
        setFormData({
            subjectName: subject.subjectName || '',
            subjectCode: subject.subjectCode || '',
            courseId: subject.courseId || '',
            semester: subject.semester || '',
            credits: subject.credits || '',
            teacherId: subject.teacherId || '',
            description: subject.description || '',
            syllabus: subject.syllabus || '',
            totalClasses: subject.totalClasses || '',
            practicalHours: subject.practicalHours || '',
            theoryHours: subject.theoryHours || '',
            isElective: subject.isElective || false,
            prerequisite: subject.prerequisite || ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteSubject = async (id) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await adminService.deleteSubject(id);
                toast.success('Subject deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete subject');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            if (modalType === 'add') {
                await adminService.createSubject(formData);
                toast.success('Subject added successfully');
            } else {
                await adminService.updateSubject(selectedSubject.id, formData);
                toast.success('Subject updated successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(`Failed to ${modalType} subject`);
            console.error('Error saving subject:', error);
        }
    };

    const filteredSubjects = subjects.filter(subject => {
        const matchesSearch = 
            subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCourse = !filterCourse || subject.courseId === parseInt(filterCourse);
        const matchesSemester = !filterSemester || subject.semester === parseInt(filterSemester);
        const matchesTeacher = !filterTeacher || subject.teacherId === parseInt(filterTeacher);
        
        return matchesSearch && matchesCourse && matchesSemester && matchesTeacher;
    });

    const getUniqueSemesters = () => {
        const semesters = subjects.map(s => s.semester).filter(Boolean);
        return [...new Set(semesters)].sort((a, b) => a - b);
    };

    const exportToCSV = () => {
        const headers = ['Subject Code', 'Subject Name', 'Course', 'Semester', 'Credits', 'Teacher', 'Type'];
        const csvData = filteredSubjects.map(s => [
            s.subjectCode,
            s.subjectName,
            courses.find(c => c.id === s.courseId)?.courseName || 'N/A',
            s.semester,
            s.credits,
            teachers.find(t => t.id === s.teacherId)?.firstName + ' ' + 
                teachers.find(t => t.id === s.teacherId)?.lastName || 'Not Assigned',
            s.isElective ? 'Elective' : 'Core'
        ]);
        
        const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'subjects_list.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading subjects...</p>
            </div>
        );
    }

    return (
        <div className="subject-management">
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={4}>
                            <h4><FaBook className="me-2" /> Subject Management</h4>
                            <p className="text-muted mb-0">Total Subjects: {subjects.length}</p>
                        </Col>
                        <Col md={8} className="text-end">
                            <Button 
                                variant="success" 
                                className="me-2"
                                onClick={exportToCSV}
                                disabled={filteredSubjects.length === 0}
                            >
                                <FaDownload /> Export
                            </Button>
                            <Button variant="primary" onClick={handleAddSubject}>
                                <FaPlus /> Add New Subject
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search subjects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={2}>
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
                        <Col md={2}>
                            <Form.Select 
                                value={filterSemester} 
                                onChange={(e) => setFilterSemester(e.target.value)}
                            >
                                <option value="">All Semesters</option>
                                {getUniqueSemesters().map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Select 
                                value={filterTeacher} 
                                onChange={(e) => setFilterTeacher(e.target.value)}
                            >
                                <option value="">All Teachers</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.firstName} {teacher.lastName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button 
                                variant="info" 
                                className="w-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterCourse('');
                                    setFilterSemester('');
                                    setFilterTeacher('');
                                }}
                            >
                                <FaFilter /> Clear
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Table responsive striped hover className="subject-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Subject Name</th>
                                <th>Course</th>
                                <th>Semester</th>
                                <th>Credits</th>
                                <th>Teacher</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubjects.map(subject => {
                                const teacher = teachers.find(t => t.id === subject.teacherId);
                                const course = courses.find(c => c.id === subject.courseId);
                                
                                return (
                                    <tr key={subject.id}>
                                        <td>
                                            <Badge bg="info">{subject.subjectCode}</Badge>
                                        </td>
                                        <td>
                                            <strong>{subject.subjectName}</strong>
                                            <br />
                                            <small className="text-muted">{subject.description?.substring(0, 30)}...</small>
                                        </td>
                                        <td>{course?.courseName || 'N/A'}</td>
                                        <td>Sem {subject.semester}</td>
                                        <td>
                                            <Badge bg="secondary">{subject.credits}</Badge>
                                        </td>
                                        <td>
                                            {teacher ? (
                                                <>
                                                    <FaChalkboardTeacher className="me-1" />
                                                    {teacher.firstName} {teacher.lastName}
                                                </>
                                            ) : (
                                                <span className="text-muted">Not Assigned</span>
                                            )}
                                        </td>
                                        <td>
                                            {subject.isElective ? (
                                                <Badge bg="warning">Elective</Badge>
                                            ) : (
                                                <Badge bg="primary">Core</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <Badge bg="success">Active</Badge>
                                        </td>
                                        <td>
                                            <Button 
                                                variant="info" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => handleEditSubject(subject)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                size="sm"
                                                onClick={() => handleDeleteSubject(subject.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                    {filteredSubjects.length === 0 && (
                        <div className="text-center text-muted py-4">
                            <FaBook size={40} className="mb-3" />
                            <h5>No subjects found</h5>
                            <p>Try adjusting your search filters or add a new subject</p>
                        </div>
                    )}

                    <div className="mt-3">
                        <small className="text-muted">
                            Showing {filteredSubjects.length} of {subjects.length} subjects
                        </small>
                    </div>
                </Card.Body>
            </Card>

            {/* Add/Edit Subject Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'add' ? 'Add New Subject' : 'Edit Subject'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Subject Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subjectName"
                                        value={formData.subjectName}
                                        onChange={handleInputChange}
                                        isInvalid={!!formErrors.subjectName}
                                        placeholder="e.g., Data Structures"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.subjectName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Subject Code <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subjectCode"
                                        value={formData.subjectCode}
                                        onChange={handleInputChange}
                                        isInvalid={!!formErrors.subjectCode}
                                        placeholder="e.g., CS301"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.subjectCode}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Course <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="courseId"
                                        value={formData.courseId}
                                        onChange={handleInputChange}
                                        isInvalid={!!formErrors.courseId}
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.courseName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.courseId}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Semester <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        isInvalid={!!formErrors.semester}
                                        min="1"
                                        max="8"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.semester}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Credits <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="credits"
                                        value={formData.credits}
                                        onChange={handleInputChange}
                                        isInvalid={!!formErrors.credits}
                                        min="1"
                                        max="10"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.credits}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Theory Hours/Week</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="theoryHours"
                                        value={formData.theoryHours}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="10"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Practical Hours/Week</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="practicalHours"
                                        value={formData.practicalHours}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="10"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Total Classes</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="totalClasses"
                                        value={formData.totalClasses}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Assign Teacher</Form.Label>
                                    <Form.Select
                                        name="teacherId"
                                        value={formData.teacherId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Teacher (Optional)</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.firstName} {teacher.lastName} - {teacher.specialization}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>&nbsp;</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        label="Is Elective Subject"
                                        name="isElective"
                                        checked={formData.isElective}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Brief description of the subject"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Syllabus</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="syllabus"
                                value={formData.syllabus}
                                onChange={handleInputChange}
                                placeholder="Detailed syllabus (can include topics, books, etc.)"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Prerequisites</Form.Label>
                            <Form.Control
                                type="text"
                                name="prerequisite"
                                value={formData.prerequisite}
                                onChange={handleInputChange}
                                placeholder="e.g., CS201 - Data Structures"
                            />
                        </Form.Group>

                        {modalType === 'edit' && (
                            <Alert variant="info">
                                <small>
                                    <strong>Subject ID:</strong> {selectedSubject?.id} | 
                                    <strong> Created:</strong> {new Date(selectedSubject?.createdAt).toLocaleDateString()}
                                </small>
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {modalType === 'add' ? 'Add Subject' : 'Update Subject'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Quick Stats */}
            <Row className="mt-4">
                <Col md={3}>
                    <Card className="stats-card">
                        <Card.Body>
                            <h6>Total Subjects</h6>
                            <h3>{subjects.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stats-card">
                        <Card.Body>
                            <h6>Core Subjects</h6>
                            <h3>{subjects.filter(s => !s.isElective).length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stats-card">
                        <Card.Body>
                            <h6>Elective Subjects</h6>
                            <h3>{subjects.filter(s => s.isElective).length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stats-card">
                        <Card.Body>
                            <h6>Subjects with Teachers</h6>
                            <h3>{subjects.filter(s => s.teacherId).length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Subject Distribution by Semester */}
            <Card className="mt-4">
                <Card.Header>
                    <h5 className="mb-0">Subject Distribution by Semester</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {[1,2,3,4,5,6,7,8].map(semester => {
                            const semSubjects = subjects.filter(s => s.semester === semester);
                            return (
                                <Col md={3} key={semester} className="mb-3">
                                    <div className="semester-card">
                                        <h6>Semester {semester}</h6>
                                        <p className="mb-0">
                                            <strong>{semSubjects.length}</strong> Subjects
                                        </p>
                                        <small className="text-muted">
                                            Core: {semSubjects.filter(s => !s.isElective).length} | 
                                            Elective: {semSubjects.filter(s => s.isElective).length}
                                        </small>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default SubjectManagement;
