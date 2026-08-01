import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Form, Spinner, Badge } from 'react-bootstrap';
import { FaClock, FaMapMarkerAlt, FaChalkboardTeacher } from 'react-icons/fa';
import studentService from '../../services/studentService';
import { toast } from 'react-toastify';
import './ViewTimetable.css';

const ViewTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('all');
    const [studentInfo, setStudentInfo] = useState(null);

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    useEffect(() => {
        fetchTimetable();
        fetchStudentInfo();
    }, []);

    const fetchTimetable = async () => {
        try {
            const data = await studentService.getTimetable();
            setTimetable(data);
        } catch (error) {
            toast.error('Failed to fetch timetable');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentInfo = async () => {
        try {
            const data = await studentService.getProfile();
            setStudentInfo(data);
        } catch (error) {
            console.error('Failed to fetch student info');
        }
    };

    const filteredTimetable = selectedDay === 'all' 
        ? timetable 
        : timetable.filter(entry => entry.day === selectedDay);

    const getTimetableForDay = (day) => {
        return filteredTimetable.filter(entry => entry.day === day);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="view-timetable">
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col>
                            <h4>Class Timetable</h4>
                            {studentInfo && (
                                <p className="text-muted mb-0">
                                    {studentInfo.courseName} - Semester {studentInfo.semester} ({studentInfo.batch})
                                </p>
                            )}
                        </Col>
                        <Col md={3}>
                            <Form.Select 
                                value={selectedDay} 
                                onChange={(e) => setSelectedDay(e.target.value)}
                            >
                                <option value="all">All Days</option>
                                {days.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <div className="timetable-grid">
                {selectedDay === 'all' ? (
                    days.map(day => (
                        <Card key={day} className="day-card">
                            <Card.Header className="day-header">
                                <h6>{day}</h6>
                            </Card.Header>
                            <Card.Body>
                                {getTimetableForDay(day).length > 0 ? (
                                    getTimetableForDay(day)
                                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                        .map((entry, index) => (
                                            <div key={index} className="timetable-entry">
                                                <div className="entry-time">
                                                    <FaClock /> {entry.startTime} - {entry.endTime}
                                                </div>
                                                <div className="entry-subject">{entry.subjectName}</div>
                                                <div className="entry-teacher">
                                                    <FaChalkboardTeacher /> {entry.teacherName}
                                                </div>
                                                <div className="entry-room">
                                                    <FaMapMarkerAlt /> Room: {entry.roomNo}
                                                </div>
                                                {entry.batch && (
                                                    <Badge bg="info" className="batch-badge">
                                                        Batch: {entry.batch}
                                                    </Badge>
                                                )}
                                            </div>
                                        ))
                                ) : (
                                    <div className="no-class">No classes scheduled</div>
                                )}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <Card className="day-card single-day">
                        <Card.Header className="day-header">
                            <h6>{selectedDay}</h6>
                        </Card.Header>
                        <Card.Body>
                            {filteredTimetable.length > 0 ? (
                                filteredTimetable
                                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                    .map((entry, index) => (
                                        <div key={index} className="timetable-entry detailed">
                                            <Row>
                                                <Col md={2}>
                                                    <div className="time-badge">
                                                        {entry.startTime} - {entry.endTime}
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <h6>{entry.subjectName}</h6>
                                                    <p className="text-muted">Code: {entry.subjectCode}</p>
                                                </Col>
                                                <Col md={3}>
                                                    <p><FaChalkboardTeacher /> {entry.teacherName}</p>
                                                </Col>
                                                <Col md={3}>
                                                    <p><FaMapMarkerAlt /> Room {entry.roomNo}</p>
                                                    {entry.batch && (
                                                        <Badge bg="info">Batch: {entry.batch}</Badge>
                                                    )}
                                                </Col>
                                            </Row>
                                        </div>
                                    ))
                            ) : (
                                <div className="no-class">No classes scheduled for this day</div>
                            )}
                        </Card.Body>
                    </Card>
                )}
            </div>

            <Card className="mt-4">
                <Card.Header>
                    <h5>Weekly Schedule Summary</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {days.map(day => {
                            const dayClasses = timetable.filter(e => e.day === day);
                            return (
                                <Col md={2} key={day} className="mb-3">
                                    <div className="day-summary">
                                        <h6>{day.substring(0, 3)}</h6>
                                        <p className="class-count">{dayClasses.length} classes</p>
                                        {dayClasses.length > 0 && (
                                            <small>
                                                {dayClasses[0]?.startTime} - {dayClasses[dayClasses.length-1]?.endTime}
                                            </small>
                                        )}
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

export default ViewTimetable;
