import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Row, Col, Spinner, Badge, InputGroup } from 'react-bootstrap';
import { FaSearch, FaEye, FaEnvelope, FaPhone, FaDownload, FaFilter } from 'react-icons/fa';
import teacherService from '../../services/teacherService';
import { toast } from 'react-toastify';
import './StudentList.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentsData, subjectsData] = await Promise.all([
                teacherService.getStudents(),
                teacherService.getSubjects()
            ]);
            setStudents(studentsData);
            setSubjects(subjectsData);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSubject = selectedSubject === 'all' || student.subjectIds?.includes(parseInt(selectedSubject));
        const matchesSemester = selectedSemester === 'all' || student.semester === parseInt(selectedSemester);
        
        return matchesSearch && matchesSubject && matchesSemester;
    });

    const sortedStudents = [...filteredStudents].sort((a, b) => {
        if (sortBy === 'name') {
            return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        } else if (sortBy === 'rollNo') {
            return (a.rollNo || '').localeCompare(b.rollNo || '');
        } else if (sortBy === 'attendance') {
            return (b.attendancePercentage || 0) - (a.attendancePercentage || 0);
        }
        return 0;
    });

    const getAttendanceBadge = (percentage) => {
        if (!percentage) return 'secondary';
        if (percentage >= 75) return 'success';
        if (percentage >= 60) return 'warning';
        return 'danger';
    };

    const exportToCSV = () => {
        const headers = ['Student ID', 'Name', 'Email', 'Phone', 'Course', 'Semester', 'Attendance %'];
        const csvData = sortedStudents.map(s => [
            s.studentId,
            `${s.firstName} ${s.lastName}`,
            s.email,
            s.phoneNumber,
            s.courseName,
            s.semester,
            s.attendancePercentage || 0
        ]);
        
        const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'student_list.csv';
        link.click();
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="student-list">
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h4>My Students</h4>
                            <p className="text-muted mb-0">Total Students: {students.length}</p>
                        </Col>
                        <Col className="text-end">
                            <Button variant="success" onClick={exportToCSV}>
                                <FaDownload /> Export List
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
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={2}>
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
                        </Col>
                        <Col md={2}>
                            <Form.Select 
                                value={selectedSemester} 
                                onChange={(e) => setSelectedSemester(e.target.value)}
                            >
                                <option value="all">All Semesters</option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                                <option value="3">Semester 3</option>
                                <option value="4">Semester 4</option>
                                <option value="5">Semester 5</option>
                                <option value="6">Semester 6</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="rollNo">Sort by Roll No</option>
                                <option value="attendance">Sort by Attendance</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button variant="info" className="w-100" onClick={() => {
                                setSearchTerm('');
                                setSelectedSubject('all');
                                setSelectedSemester('all');
                                setSortBy('name');
                            }}>
                                <FaFilter /> Clear Filters
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Course</th>
                                <th>Semester</th>
                                <th>Contact</th>
                                <th>Attendance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStudents.map(student => (
                                <tr key={student.id}>
                                    <td>
                                        <Badge bg="secondary">{student.studentId}</Badge>
                                    </td>
                                    <td>
                                        <div className="student-avatar">
                                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                                        </div>
                                    </td>
                                    <td>
                                        {student.firstName} {student.lastName}
                                        <br />
                                        <small className="text-muted">Roll: {student.rollNo || 'N/A'}</small>
                                    </td>
                                    <td>{student.courseName}</td>
                                    <td>Sem {student.semester}</td>
                                    <td>
                                        <div>
                                            <FaEnvelope /> {student.email}
                                        </div>
                                        <div>
                                            <FaPhone /> {student.phoneNumber}
                                        </div>
                                    </td>
                                    <td>
                                        <Badge bg={getAttendanceBadge(student.attendancePercentage)}>
                                            {student.attendancePercentage || 0}%
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="info" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => window.location.href = `/teacher/student/${student.id}`}
                                        >
                                            <FaEye /> View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {sortedStudents.length === 0 && (
                        <div className="text-center text-muted py-4">
                            No students found matching the criteria.
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default StudentList;
