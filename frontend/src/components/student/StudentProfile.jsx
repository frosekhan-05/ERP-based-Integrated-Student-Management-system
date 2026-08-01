import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Badge } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBook, FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import { toast } from 'react-toastify';
import './StudentProfile.css';

const DEFAULT_COURSES = [
    { id: 'CSE', courseCode: 'CSE', courseName: 'Computer Science and Engineering' },
    { id: 'IT', courseCode: 'IT', courseName: 'Information Technology' },
    { id: 'AIML', courseCode: 'AIML', courseName: 'Artificial Intelligence and Machine Learning' },
    { id: 'AIDS', courseCode: 'AIDS', courseName: 'Artificial Intelligence and Data Science' },
    { id: 'ECE', courseCode: 'ECE', courseName: 'Electronics and Communication Engineering' },
    { id: 'EEE', courseCode: 'EEE', courseName: 'Electrical and Electronics Engineering' },
    { id: 'BIOTECH', courseCode: 'BIOTECH', courseName: 'Biotechnology' }
];

const normalizeCourseValue = (value) => (value || '').trim().toUpperCase();

const findDefaultCourse = (courseCode, courseName) => DEFAULT_COURSES.find((course) =>
    normalizeCourseValue(course.courseCode) === normalizeCourseValue(courseCode)
        || normalizeCourseValue(course.courseName) === normalizeCourseValue(courseName)
);

const buildCourseOptions = (availableCourses = []) => {
    const normalizedCourses = Array.isArray(availableCourses) ? availableCourses.filter(Boolean) : [];

    if (normalizedCourses.length === 0) {
        return DEFAULT_COURSES;
    }

    const matchedKeys = new Set();

    const preferredCourses = DEFAULT_COURSES.map((defaultCourse) => {
        const match = normalizedCourses.find((course) =>
            normalizeCourseValue(course.courseCode) === normalizeCourseValue(defaultCourse.courseCode)
                || normalizeCourseValue(course.courseName) === normalizeCourseValue(defaultCourse.courseName)
        );

        if (match) {
            matchedKeys.add(String(match.id ?? match.courseCode ?? match.courseName));
            return match;
        }

        return defaultCourse;
    });

    const extraCourses = normalizedCourses.filter((course) =>
        !matchedKeys.has(String(course.id ?? course.courseCode ?? course.courseName))
    );

    return [...preferredCourses, ...extraCourses];
};

const StudentProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editSection, setEditSection] = useState(null); // personal | academic | parent | null
    const [formData, setFormData] = useState({});
    const [courses, setCourses] = useState([]);
    const courseOptions = buildCourseOptions(courses);

    const normalizeProfile = (data = {}) => ({
        ...data,
        courseId: data.courseId ?? data.course?.id ?? findDefaultCourse(data.course?.courseCode, data.courseName ?? data.course?.courseName)?.id ?? '',
        courseName: data.courseName ?? data.course?.courseName ?? ''
    });

    const getSectionPayload = (section, data) => {
        if (section === 'personal') {
            return {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                dateOfBirth: data.dateOfBirth || '',
                gender: data.gender || '',
                bloodGroup: data.bloodGroup || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                pincode: data.pincode || ''
            };
        }

        if (section === 'academic') {
            const selectedCourse = courseOptions.find((course) => String(course.id) === String(data.courseId));
            const selectedValue = String(data.courseId || '').trim();
            const numericCourseId = /^\d+$/.test(selectedValue) ? selectedValue : '';

            return {
                courseId: numericCourseId,
                courseCode: selectedCourse?.courseCode || (numericCourseId ? '' : selectedValue),
                courseName: selectedCourse?.courseName || '',
                batch: data.batch || '',
                semester: data.semester || '',
                enrollmentDate: data.enrollmentDate || ''
            };
        }

        return {
            fatherName: data.fatherName || '',
            motherName: data.motherName || '',
            parentPhone: data.parentPhone || ''
        };
    };

    useEffect(() => {
        fetchProfile();
        fetchCourses();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = normalizeProfile(await studentService.getProfile());
            setProfile(data);
            setFormData(data);
        } catch (error) {
            toast.error('Failed to fetch profile');
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

    const handleStartEditing = (section) => {
        setFormData(profile || {});
        setEditSection(section);
    };

    const handleCancelEditing = () => {
        setFormData(profile || {});
        setEditSection(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = getSectionPayload(editSection, formData);
            const updatedProfile = normalizeProfile(await studentService.updateProfile(payload));
            setProfile(updatedProfile);
            setFormData(updatedProfile);
            setEditSection(null);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const fetchCourses = async () => {
        try {
            const data = await studentService.getCourses();
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            setCourses([]);
        }
    };

    const formatDate = (value) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="student-profile">
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={3} className="text-center">
                            <div className="profile-avatar-large">
                                {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                            </div>
                        </Col>
                        <Col md={9}>
                            <div className="profile-header">
                                <h2>{profile?.firstName} {profile?.lastName}</h2>
                                <p className="text-muted">
                                    <FaUserGraduate /> {profile?.studentId}
                                </p>
                                <Badge bg="success" className="status-badge">
                                    {profile?.active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5><FaUser /> Personal Information</h5>
                            {editSection !== 'academic' && (
                                <Button
                                    size="sm"
                                    variant={editSection === 'personal' ? 'secondary' : 'primary'}
                                    onClick={editSection === 'personal' ? handleCancelEditing : () => handleStartEditing('personal')}
                                >
                                    {editSection === 'personal' ? 'Cancel' : 'Edit'}
                                </Button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            {editSection === 'personal' ? (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control type="text" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control type="text" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} required />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone Number</Form.Label>
                                                <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Date of Birth</Form.Label>
                                                <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Gender</Form.Label>
                                                <Form.Select name="gender" value={formData.gender || ''} onChange={handleInputChange}>
                                                    <option value="">Select</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Blood Group</Form.Label>
                                                <Form.Control type="text" name="bloodGroup" value={formData.bloodGroup || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" name="address" value={formData.address || ''} onChange={handleInputChange} />
                                    </Form.Group>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control type="text" name="city" value={formData.city || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>State</Form.Label>
                                                <Form.Control type="text" name="state" value={formData.state || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Pincode</Form.Label>
                                                <Form.Control type="text" name="pincode" value={formData.pincode || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex gap-2">
                                        <Button variant="primary" type="submit">Save Personal Info</Button>
                                        <Button variant="secondary" type="button" onClick={handleCancelEditing}>Cancel</Button>
                                    </div>
                                </Form>
                            ) : (
                                <>
                                    <table className="profile-table">
                                        <tbody>
                                            <tr><th>Full Name:</th><td>{profile?.firstName} {profile?.lastName}</td></tr>
                                            <tr><th>Date of Birth:</th><td>{formatDate(profile?.dateOfBirth)}</td></tr>
                                            <tr><th>Gender:</th><td>{profile?.gender || 'N/A'}</td></tr>
                                            <tr><th>Blood Group:</th><td>{profile?.bloodGroup || 'N/A'}</td></tr>
                                            <tr><th>Email:</th><td><FaEnvelope /> {profile?.email}</td></tr>
                                            <tr><th>Phone:</th><td><FaPhone /> {profile?.phoneNumber || 'N/A'}</td></tr>
                                        </tbody>
                                    </table>
                                    <Card className="mt-3">
                                        <Card.Header>
                                            <h5><FaMapMarkerAlt /> Address</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <p>{profile?.address || 'N/A'}</p>
                                            <p>{profile?.city || 'N/A'}, {profile?.state || 'N/A'} - {profile?.pincode || 'N/A'}</p>
                                        </Card.Body>
                                    </Card>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5><FaBook /> Academic Information</h5>
                            {editSection !== 'personal' && (
                                <Button
                                    size="sm"
                                    variant={editSection === 'academic' ? 'secondary' : 'primary'}
                                    onClick={editSection === 'academic' ? handleCancelEditing : () => handleStartEditing('academic')}
                                >
                                    {editSection === 'academic' ? 'Cancel' : 'Edit'}
                                </Button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            {editSection === 'academic' ? (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Course</Form.Label>
                                                <Form.Select name="courseId" value={formData.courseId || ''} onChange={handleInputChange}>
                                                    <option value="">Select Course</option>
                                                    {courseOptions.map(course => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.courseName}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Batch</Form.Label>
                                                <Form.Control type="text" name="batch" value={formData.batch || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Current Semester</Form.Label>
                                                <Form.Control type="number" name="semester" value={formData.semester || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Enrollment Date</Form.Label>
                                                <Form.Control type="date" name="enrollmentDate" value={formData.enrollmentDate || ''} onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex gap-2">
                                        <Button variant="primary" type="submit">Save Academic Info</Button>
                                        <Button variant="secondary" type="button" onClick={handleCancelEditing}>Cancel</Button>
                                    </div>
                                </Form>
                            ) : (
                                <table className="profile-table">
                                    <tbody>
                                        <tr><th>Student ID:</th><td><Badge bg="primary">{profile?.studentId || 'N/A'}</Badge></td></tr>
                                        <tr><th>Course:</th><td>{profile?.courseName || 'N/A'}</td></tr>
                                        <tr><th>Batch:</th><td>{profile?.batch || 'N/A'}</td></tr>
                                        <tr><th>Current Semester:</th><td>{profile?.semester || 'N/A'}</td></tr>
                                        <tr><th>Enrollment Date:</th><td>{formatDate(profile?.enrollmentDate)}</td></tr>
                                    </tbody>
                                </table>
                            )}
                        </Card.Body>
                    </Card>

                    {user?.role !== 'TEACHER' && (
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5><FaUserGraduate /> Parent/Guardian Information</h5>
                                {editSection !== 'personal' && editSection !== 'academic' && (
                                    <Button
                                        size="sm"
                                        variant={editSection === 'parent' ? 'secondary' : 'primary'}
                                        onClick={editSection === 'parent' ? handleCancelEditing : () => handleStartEditing('parent')}
                                    >
                                        {editSection === 'parent' ? 'Cancel' : 'Edit'}
                                    </Button>
                                )}
                            </Card.Header>
                            <Card.Body>
                                {editSection === 'parent' ? (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Father's Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fatherName"
                                                value={formData.fatherName || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mother's Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="motherName"
                                                value={formData.motherName || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Parent Phone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="parentPhone"
                                                value={formData.parentPhone || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                        <div className="d-flex gap-2">
                                            <Button variant="primary" type="submit">Save Parent Info</Button>
                                            <Button variant="secondary" type="button" onClick={handleCancelEditing}>Cancel</Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <table className="profile-table">
                                        <tbody>
                                            <tr><th>Father's Name:</th><td>{profile?.fatherName || 'N/A'}</td></tr>
                                            <tr><th>Mother's Name:</th><td>{profile?.motherName || 'N/A'}</td></tr>
                                            <tr><th>Parent Phone:</th><td>{profile?.parentPhone || 'N/A'}</td></tr>
                                        </tbody>
                                    </table>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default StudentProfile;
