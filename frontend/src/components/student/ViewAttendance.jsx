import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Form, Spinner, ProgressBar, Badge } from 'react-bootstrap';
import { FaCalendarCheck, FaCalendarTimes, FaClock } from 'react-icons/fa';
import studentService from '../../services/studentService';
import { toast } from 'react-toastify';
import './ViewAttendance.css';

const ViewAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedSubject, setSelectedSubject] = useState('all');

    useEffect(() => {
        fetchAttendance();
        fetchSubjects();
    }, []);

    const fetchAttendance = async () => {
        try {
            const data = await studentService.getAttendance();
            setAttendance(data);
        } catch (error) {
            toast.error('Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const data = await studentService.getSubjects();
            setSubjects(data);
        } catch (error) {
            console.error('Failed to fetch subjects');
        }
    };

    const filteredAttendance = attendance.filter(record => {
        const recordDate = new Date(record.date);
        const matchesMonth = recordDate.getMonth() + 1 === parseInt(selectedMonth);
        const matchesYear = recordDate.getFullYear() === parseInt(selectedYear);
        const matchesSubject = selectedSubject === 'all' || record.subjectId === parseInt(selectedSubject);
        return matchesMonth && matchesYear && matchesSubject;
    });

    const calculateStats = () => {
        const total = filteredAttendance.length;
        const present = filteredAttendance.filter(a => a.status === 'PRESENT').length;
        const absent = filteredAttendance.filter(a => a.status === 'ABSENT').length;
        const late = filteredAttendance.filter(a => a.status === 'LATE').length;
        const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;

        return { total, present, absent, late, percentage };
    };

    const getStatusBadge = (status) => {
        const badges = {
            'PRESENT': 'success',
            'ABSENT': 'danger',
            'LATE': 'warning',
            'HOLIDAY': 'info'
        };
        return `badge bg-${badges[status]}`;
    };

    const stats = calculateStats();

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="view-attendance">
            <Card className="mb-4">
                <Card.Body>
                    <h4>Attendance Report</h4>
                </Card.Body>
            </Card>

            <Row className="mb-4">
                <Col md={3}>
                    <Card className="stats-card present">
                        <Card.Body>
                            <h6>Present</h6>
                            <h3>{stats.present}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stats-card absent">
                        <Card.Body>
                            <h6>Absent</h6>
                            <h3>{stats.absent}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stats-card late">
                        <Card.Body>
                            <h6>Late</h6>
                            <h3>{stats.late}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="stats-card percentage">
                        <Card.Body>
                            <h6>Attendance %</h6>
                            <h3>{stats.percentage}%</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Month</Form.Label>
                                <Form.Select 
                                    value={selectedMonth} 
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                                        <option key={month} value={month}>
                                            {new Date(2000, month-1, 1).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Year</Form.Label>
                                <Form.Select 
                                    value={selectedYear} 
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {[2023, 2024, 2025].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Subject</Form.Label>
                                <Form.Select 
                                    value={selectedSubject} 
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                >
                                    <option value="all">All Subjects</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.subjectName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <div className="attendance-summary mb-4">
                        <h5>Attendance Overview</h5>
                        <ProgressBar 
                            now={stats.percentage} 
                            label={`${stats.percentage}%`}
                            variant={stats.percentage >= 75 ? 'success' : 'warning'}
                            className="mb-3"
                        />
                        <p>Total Classes: {stats.total}</p>
                    </div>

                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.map((record, index) => (
                                <tr key={index}>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td>{record.subjectName}</td>
                                    <td>{record.teacherName}</td>
                                    <td>
                                        <span className={getStatusBadge(record.status)}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td>{record.markedAt}</td>
                                    <td>{record.remarks || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {filteredAttendance.length === 0 && (
                        <div className="text-center text-muted py-4">
                            No attendance records found for the selected period.
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ViewAttendance;
