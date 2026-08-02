import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './TimetableManagement.css';

const TimetableManagement = () => {
    const [timetable, setTimetable] = useState([]);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [formData, setFormData] = useState({
        subjectId: '',
        teacherId: '',
        day: '',
        startTime: '',
        endTime: '',
        roomNo: '',
        batch: '',
        semester: '',
        courseId: ''
    });

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchSubjectsByCourse();
        }
    }, [selectedCourse]);

    const fetchData = async () => {
        try {
            const [timetableData, coursesData, teachersData] = await Promise.all([
                adminService.getTimetable(),
                adminService.getAllCourses(),
                adminService.getAllTeachers()
            ]);
            setTimetable(timetableData);
            setCourses(coursesData);
            setTeachers(teachersData);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjectsByCourse = async () => {
        try {
            const subjectsData = await adminService.getSubjectsByCourse(selectedCourse);
            setSubjects(subjectsData);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'courseId') {
            setSelectedCourse(value);
        }
    };

    const handleAddEntry = () => {
        setModalType('add');
        setFormData({
            subjectId: '',
            teacherId: '',
            day: '',
            startTime: '',
            endTime: '',
            roomNo: '',
            batch: '',
            semester: '',
            courseId: ''
        });
        setShowModal(true);
    };

    const handleEditEntry = (entry) => {
        setModalType('edit');
        setSelectedEntry(entry);
        setFormData({
            subjectId: entry.subjectId,
            teacherId: entry.teacherId,
            day: entry.day,
            startTime: entry.startTime,
            endTime: entry.endTime,
            roomNo: entry.roomNo,
            batch: entry.batch,
            semester: entry.semester,
            courseId: entry.courseId
        });
        setSelectedCourse(entry.courseId);
        setShowModal(true);
    };

    const handleDeleteEntry = async (id) => {
        if (window.confirm('Are you sure you want to delete this timetable entry?')) {
            try {
                await adminService.deleteTimetableEntry(id);
                toast.success('Timetable entry deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete timetable entry');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'add') {
                await adminService.createTimetableEntry(formData);
                toast.success('Timetable entry added successfully');
            } else {
                await adminService.updateTimetableEntry(selectedEntry.id, formData);
                toast.success('Timetable entry updated successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(`Failed to ${modalType} timetable entry`);
        }
    };

    const renderTimetable = () => {
        const filteredTimetable = timetable.filter(entry => 
            (!selectedCourse || entry.courseId === parseInt(selectedCourse)) &&
            (!selectedSemester || entry.semester === parseInt(selectedSemester))
        );

        const timetableByDay = {};
        days.forEach(day => {
            timetableByDay[day] = filteredTimetable.filter(entry => entry.day === day);
        });

        return (
            <div className="timetable-grid">
                {days.map(day => (
                    <Card key={day} className="day-card">
                        <Card.Header className="day-header">
                            <h6>{day}</h6>
                        </Card.Header>
                        <Card.Body>
                            {timetableByDay[day].length > 0 ? (
                                timetableByDay[day].map(entry => (
                                    <div key={entry.id} className="timetable-entry">
                                        <div className="entry-time">
                                            {entry.startTime} - {entry.endTime}
                                        </div>
                                        <div className="entry-subject">{entry.subjectName}</div>
                                        <div className="entry-teacher">{entry.teacherName}</div>
                                        <div className="entry-room">Room: {entry.roomNo}</div>
                                        <div className="entry-actions">
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                onClick={() => handleEditEntry(entry)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                className="text-danger"
                                                onClick={() => handleDeleteEntry(entry.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-class">No classes</div>
                            )}
                        </Card.Body>
                    </Card>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="timetable-management">
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={4}>
                            <h4><FaCalendarAlt className="me-2" /> Timetable Management</h4>
                        </Col>
                        <Col md={8} className="text-end">
                            <Button variant="primary" onClick={handleAddEntry}>
                                <FaPlus /> Add Timetable Entry
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Filter by Course</Form.Label>
                                <Form.Select 
                                    value={selectedCourse} 
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="">All Courses</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.courseName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Filter by Semester</Form.Label>
                                <Form.Select 
                                    value={selectedSemester} 
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                >
                                    <option value="">All Semesters</option>
                                    {[1,2,3,4,5,6,7,8].map(sem => (
                                        <option key={sem} value={sem}>Semester {sem}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {renderTimetable()}

            {/* Add/Edit Timetable Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'add' ? 'Add Timetable Entry' : 'Edit Timetable Entry'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="courseId"
                                        value={formData.courseId}
                                        onChange={handleInputChange}
                                        required
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
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Semester <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="subjectId"
                                        value={formData.subjectId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.subjectName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teacher <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="teacherId"
                                        value={formData.teacherId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Teacher</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.firstName} {teacher.lastName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Day <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="day"
                                        value={formData.day}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Day</option>
                                        {days.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room No.</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="roomNo"
                                        value={formData.roomNo}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Batch</Form.Label>
                            <Form.Control
                                type="text"
                                name="batch"
                                value={formData.batch}
                                onChange={handleInputChange}
                                placeholder="e.g., 2024"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {modalType === 'add' ? 'Add Entry' : 'Update Entry'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default TimetableManagement;