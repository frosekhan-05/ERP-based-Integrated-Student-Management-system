import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap';
import { FaCheck, FaTimes, FaClock, FaSave, FaCalendarAlt } from 'react-icons/fa';
import teacherService from '../../services/teacherService';
import { toast } from 'react-toastify';
import './MarkAttendance.css';

const MarkAttendance = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [existingAttendance, setExistingAttendance] = useState(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject && selectedDate) {
            fetchStudents();
            checkExistingAttendance();
        }
    }, [selectedSubject, selectedDate]);

    const fetchSubjects = async () => {
        try {
            const data = await teacherService.getSubjects();
            setSubjects(data);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await teacherService.getStudentsBySubject(selectedSubject);
            setStudents(data);
            
            // Initialize attendance object
            const initialAttendance = {};
            data.forEach(student => {
                initialAttendance[student.id] = 'PRESENT';
            });
            setAttendance(initialAttendance);
        } catch (error) {
            toast.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const checkExistingAttendance = async () => {
        try {
            const data = await teacherService.getAttendanceByDate(selectedSubject, selectedDate);
            if (data && data.length > 0) {
                setExistingAttendance(data);
                // Pre-fill existing attendance
                const existing = {};
                data.forEach(record => {
                    existing[record.studentId] = record.status;
                });
                setAttendance(existing);
            } else {
                setExistingAttendance(null);
            }
        } catch (error) {
            console.error('Error checking existing attendance:', error);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const markAll = (status) => {
        const newAttendance = {};
        students.forEach(student => {
            newAttendance[student.id] = status;
        });
        setAttendance(newAttendance);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedSubject || !selectedDate) {
            toast.error('Please select subject and date');
            return;
        }

        setSaving(true);
        try {
            const attendanceData = students.map(student => ({
                studentId: student.id,
                subjectId: selectedSubject,
                date: selectedDate,
                status: attendance[student.id] || 'ABSENT'
            }));

            await teacherService.markBulkAttendance(attendanceData);
            toast.success(existingAttendance ? 'Attendance updated successfully' : 'Attendance marked successfully');
            checkExistingAttendance();
        } catch (error) {
            toast.error('Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const getStatusCount = (status) => {
        return Object.values(attendance).filter(s => s === status).length;
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="mark-attendance">
            <Card className="mb-4">
                <Card.Body>
                    <h4>Mark Attendance</h4>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Select Subject</Form.Label>
                                <Form.Select 
                                    value={selectedSubject} 
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    required
                                >
                                    <option value="">Choose Subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.subjectName} - Semester {subject.semester}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Select Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>&nbsp;</Form.Label>
                                <div>
                                    <Button variant="success" size="sm" className="me-2" onClick={() => markAll('PRESENT')}>
                                        <FaCheck /> Mark All Present
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => markAll('ABSENT')}>
                                        <FaTimes /> Mark All Absent
                                    </Button>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {selectedSubject && selectedDate && (
                <>
                    <Card className="mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <div className="attendance-summary present">
                                        <h6>Present</h6>
                                        <h3>{getStatusCount('PRESENT')}</h3>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="attendance-summary absent">
                                        <h6>Absent</h6>
                                        <h3>{getStatusCount('ABSENT')}</h3>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="attendance-summary late">
                                        <h6>Late</h6>
                                        <h3>{getStatusCount('LATE')}</h3>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="attendance-summary total">
                                        <h6>Total</h6>
                                        <h3>{students.length}</h3>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {existingAttendance && (
                        <Alert variant="info" className="mb-4">
                            <FaCalendarAlt /> Attendance already marked for this date. You can update it below.
                        </Alert>
                    )}

                    <Card>
                        <Card.Body>
                            <form onSubmit={handleSubmit}>
                                <Table responsive striped hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Student ID</th>
                                            <th>Name</th>
                                            <th>Roll No</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={student.id}>
                                                <td>{index + 1}</td>
                                                <td>{student.studentId}</td>
                                                <td>{student.firstName} {student.lastName}</td>
                                                <td>{student.rollNo || '-'}</td>
                                                <td>
                                                    <div className="attendance-actions">
                                                        <Button
                                                            variant={attendance[student.id] === 'PRESENT' ? 'success' : 'outline-success'}
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleAttendanceChange(student.id, 'PRESENT')}
                                                        >
                                                            <FaCheck /> Present
                                                        </Button>
                                                        <Button
                                                            variant={attendance[student.id] === 'ABSENT' ? 'danger' : 'outline-danger'}
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleAttendanceChange(student.id, 'ABSENT')}
                                                        >
                                                            <FaTimes /> Absent
                                                        </Button>
                                                        <Button
                                                            variant={attendance[student.id] === 'LATE' ? 'warning' : 'outline-warning'}
                                                            size="sm"
                                                            onClick={() => handleAttendanceChange(student.id, 'LATE')}
                                                        >
                                                            <FaClock /> Late
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                <div className="text-end mt-3">
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        size="lg"
                                        disabled={saving || students.length === 0}
                                    >
                                        {saving ? (
                                            <>
                                                <Spinner size="sm" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave /> {existingAttendance ? 'Update Attendance' : 'Save Attendance'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </>
            )}
        </div>
    );
};

export default MarkAttendance;
