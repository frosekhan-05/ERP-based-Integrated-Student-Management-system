import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Form, Spinner, Badge, Button } from 'react-bootstrap';
import { FaChartLine, FaStar, FaAward } from 'react-icons/fa';
import studentService from '../../services/studentService';
import { toast } from 'react-toastify';
import './ViewMarks.css';

const ViewMarks = () => {
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [selectedExamType, setSelectedExamType] = useState('all');
    const [newMark, setNewMark] = useState({
        examName: '',
        subjectName: '',
        semester: '',
        examType: 'INTERNAL',
        marksObtained: '',
        maxMarks: '100'
    });

    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            const data = await studentService.getMarks();
            setMarks(data);
        } catch (error) {
            toast.error('Failed to fetch marks');
        } finally {
            setLoading(false);
        }
    };

    const calculateGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    };

    const getResult = (mark, percentage) => {
        if (mark?.result) return mark.result;
        return percentage >= 40 ? 'PASS' : 'FAIL';
    };

    const handleNewMarkChange = (e) => {
        const { name, value } = e.target;
        setNewMark((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetNewMarkForm = () => {
        setNewMark({
            examName: '',
            subjectName: '',
            semester: '',
            examType: 'INTERNAL',
            marksObtained: '',
            maxMarks: '100'
        });
    };

    const addManualMark = (e) => {
        e.preventDefault();

        const marksObtained = Number(newMark.marksObtained);
        const maxMarks = Number(newMark.maxMarks);
        const semester = Number(newMark.semester);

        if (!newMark.examName || !newMark.subjectName || !semester || !newMark.examType || maxMarks <= 0) {
            toast.error('Please fill exam name, subject, semester, exam type and valid marks.');
            return;
        }

        if (marksObtained < 0 || marksObtained > maxMarks) {
            toast.error('Marks obtained must be between 0 and max marks.');
            return;
        }

        const percentage = Number(((marksObtained / maxMarks) * 100).toFixed(1));
        const grade = calculateGrade(percentage);
        const result = percentage >= 40 ? 'PASS' : 'FAIL';

        const manualEntry = {
            id: `manual-${Date.now()}`,
            examName: newMark.examName,
            subjectName: newMark.subjectName,
            semester,
            examType: newMark.examType,
            marksObtained,
            maxMarks,
            percentage,
            grade,
            result,
            manual: true
        };

        setMarks((prev) => [...prev, manualEntry]);
        resetNewMarkForm();
        toast.success('Marks added to detailed list.');
    };

    const enrichedMarks = marks.map((mark) => {
        const examName = mark.examName || mark.exam?.name || 'N/A';
        const subjectName = mark.subjectName || mark.subject?.subjectName || 'N/A';
        const semester = mark.semester || mark.subject?.semester || null;
        const examType = mark.examType || mark.exam?.examType || 'N/A';
        const maxMarks = Number(mark.maxMarks || mark.exam?.maxMarks || 100);
        const marksObtained = Number(mark.marksObtained || 0);
        const percentage = maxMarks > 0 ? Number(((marksObtained / maxMarks) * 100).toFixed(1)) : 0;
        const grade = calculateGrade(percentage);
        const result = getResult(mark, percentage);

        return {
            ...mark,
            examName,
            subjectName,
            semester,
            examType,
            marksObtained,
            maxMarks,
            percentage,
            grade,
            result
        };
    });

    const filteredMarks = enrichedMarks.filter(mark => {
        const matchesSemester = selectedSemester === 'all' || mark.semester === parseInt(selectedSemester);
        const matchesExamType = selectedExamType === 'all' || mark.examType === selectedExamType;
        return matchesSemester && matchesExamType;
    });

    const calculateOverallStats = () => {
        if (filteredMarks.length === 0) return null;

        const totalMarks = filteredMarks.reduce((sum, m) => sum + m.marksObtained, 0);
        const maxMarks = filteredMarks.reduce((sum, m) => sum + m.maxMarks, 0);
        const percentage = (totalMarks / maxMarks * 100).toFixed(2);
        
        const sgpa = (percentage / 9.5).toFixed(2);
        
        const grade = calculateGrade(percentage);
        
        return { totalMarks, maxMarks, percentage, sgpa, grade };
    };

    const getGradeColor = (grade) => {
        const colors = {
            'A+': 'success',
            'A': 'success',
            'B+': 'info',
            'B': 'info',
            'C': 'warning',
            'D': 'warning',
            'F': 'danger'
        };
        return colors[grade] || 'secondary';
    };

    const subjectWiseMap = filteredMarks.reduce((acc, mark) => {
        const key = mark.subjectId || mark.subjectName || 'Unknown';
        if (!acc[key]) {
            acc[key] = {
                subjectName: mark.subjectName || 'Unknown Subject',
                values: []
            };
        }
        acc[key].values.push(mark);
        return acc;
    }, {});

    const subjectWiseAnalysis = Object.values(subjectWiseMap).map((subject) => {
        const avgMarks = subject.values.reduce((sum, m) => sum + m.marksObtained, 0) / subject.values.length;
        const bestMarks = Math.max(...subject.values.map((m) => m.marksObtained));
        return {
            subjectName: subject.subjectName,
            avgMarks: avgMarks.toFixed(2),
            bestMarks,
            examCount: subject.values.length
        };
    });

    const topPerformances = [...filteredMarks]
        .sort((a, b) => b.percentage - a.percentage || b.marksObtained - a.marksObtained)
        .slice(0, 5);

    const semesterPerformanceMap = filteredMarks.reduce((acc, mark) => {
        const key = mark.semester || 'N/A';
        if (!acc[key]) {
            acc[key] = { total: 0, max: 0 };
        }
        acc[key].total += mark.marksObtained;
        acc[key].max += mark.maxMarks;
        return acc;
    }, {});

    const semesterPerformance = Object.entries(semesterPerformanceMap).map(([semester, data]) => ({
        semester,
        percentage: data.max > 0 ? Number(((data.total / data.max) * 100).toFixed(1)) : 0
    }));

    const bestSemester = semesterPerformance.length > 0
        ? semesterPerformance.sort((a, b) => b.percentage - a.percentage)[0]
        : null;

    const stats = calculateOverallStats();

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="view-marks">
            <Card className="mb-4">
                <Card.Body>
                    <h4>Academic Performance</h4>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header>
                    <h5>Add Detailed Marks</h5>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={addManualMark}>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Exam Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="examName"
                                        value={newMark.examName}
                                        onChange={handleNewMarkChange}
                                        placeholder="Mid Term 1"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subjectName"
                                        value={newMark.subjectName}
                                        onChange={handleNewMarkChange}
                                        placeholder="Mathematics"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Semester</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="12"
                                        name="semester"
                                        value={newMark.semester}
                                        onChange={handleNewMarkChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Exam Type</Form.Label>
                                    <Form.Select
                                        name="examType"
                                        value={newMark.examType}
                                        onChange={handleNewMarkChange}
                                    >
                                        <option value="INTERNAL">Internal</option>
                                        <option value="EXTERNAL">External</option>
                                        <option value="SEMESTER">Semester</option>
                                        <option value="PRACTICAL">Practical</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Max</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="maxMarks"
                                        value={newMark.maxMarks}
                                        onChange={handleNewMarkChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Obtained</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="marksObtained"
                                        value={newMark.marksObtained}
                                        onChange={handleNewMarkChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex gap-2">
                            <Button type="submit" variant="primary">Add Marks</Button>
                            <Button type="button" variant="secondary" onClick={resetNewMarkForm}>Clear</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {stats && (
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="stats-card primary">
                            <Card.Body>
                                <h6>Total Marks</h6>
                                <h3>{stats.totalMarks}/{stats.maxMarks}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card success">
                            <Card.Body>
                                <h6>Percentage</h6>
                                <h3>{stats.percentage}%</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card info">
                            <Card.Body>
                                <h6>SGPA</h6>
                                <h3>{stats.sgpa}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="stats-card warning">
                            <Card.Body>
                                <h6>Overall Grade</h6>
                                <h3>
                                    <Badge bg={getGradeColor(stats.grade)} className="grade-badge-large">
                                        {stats.grade}
                                    </Badge>
                                </h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Filter by Semester</Form.Label>
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
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Exam Type</Form.Label>
                                <Form.Select 
                                    value={selectedExamType} 
                                    onChange={(e) => setSelectedExamType(e.target.value)}
                                >
                                    <option value="all">All Exams</option>
                                    <option value="INTERNAL">Internal</option>
                                    <option value="EXTERNAL">External</option>
                                    <option value="SEMESTER">Semester</option>
                                    <option value="PRACTICAL">Practical</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {subjectWiseAnalysis.length > 0 && (
                <Card className="mb-4">
                    <Card.Header>
                        <h5><FaChartLine /> Subject-wise Analysis</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            {subjectWiseAnalysis.map(subject => (
                                <Col md={6} key={subject.subjectName} className="mb-3">
                                    <Card>
                                        <Card.Body>
                                            <h6>{subject.subjectName}</h6>
                                            <div className="subject-stats">
                                                <div className="stat-item">
                                                    <small>Average</small>
                                                    <strong>{subject.avgMarks}</strong>
                                                </div>
                                                <div className="stat-item">
                                                    <small>Best</small>
                                                    <strong>{subject.bestMarks}</strong>
                                                </div>
                                                <div className="stat-item">
                                                    <small>Exams</small>
                                                    <strong>{subject.examCount}</strong>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            )}

            <Card>
                <Card.Header>
                    <h5>Detailed Marks</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Subject</th>
                                <th>Semester</th>
                                <th>Exam Type</th>
                                <th>Marks Obtained</th>
                                <th>Max Marks</th>
                                <th>Percentage</th>
                                <th>Grade</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMarks.map((mark, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{mark.examName || 'N/A'}</td>
                                        <td>{mark.subjectName || 'N/A'}</td>
                                        <td>Sem {mark.semester || 'N/A'}</td>
                                        <td>{mark.examType || 'N/A'}</td>
                                        <td className="fw-bold">{mark.marksObtained}</td>
                                        <td>{mark.maxMarks}</td>
                                        <td>{mark.percentage}%</td>
                                        <td>
                                            <Badge bg={getGradeColor(mark.grade)}>
                                                {mark.grade}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={mark.result === 'PASS' ? 'success' : 'danger'}>
                                                {mark.result}
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                    {filteredMarks.length === 0 && (
                        <div className="text-center text-muted py-4">
                            No marks found for the selected filters.
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Row className="mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5><FaStar /> Top Performances</h5>
                        </Card.Header>
                        <Card.Body>
                            {bestSemester && (
                                <div className="mb-3">
                                    <Badge bg="info">Best Semester: Semester {bestSemester.semester} ({bestSemester.percentage}%)</Badge>
                                </div>
                            )}
                            {topPerformances.length > 0 ? (
                                <Table responsive size="sm" className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Semester</th>
                                            <th>Subject</th>
                                            <th>Exam Type</th>
                                            <th>Exam Name</th>
                                            <th>Marks</th>
                                            <th>%</th>
                                            <th>Grade</th>
                                            <th>Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topPerformances.map((mark, index) => (
                                            <tr key={`${mark.id || mark.examName}-${index}`}>
                                                <td>Sem {mark.semester || 'N/A'}</td>
                                                <td>{mark.subjectName || 'N/A'}</td>
                                                <td>{mark.examType || 'N/A'}</td>
                                                <td>{mark.examName || 'N/A'}</td>
                                                <td>{mark.marksObtained}/{mark.maxMarks}</td>
                                                <td>{mark.percentage}%</td>
                                                <td><Badge bg={getGradeColor(mark.grade)}>{mark.grade}</Badge></td>
                                                <td><Badge bg={mark.result === 'PASS' ? 'success' : 'danger'}>{mark.result}</Badge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted mb-0">No top performance data available.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5><FaAward /> Achievements</h5>
                        </Card.Header>
                        <Card.Body>
                            {filteredMarks.filter(m => (m.marksObtained / m.maxMarks * 100) >= 90).length > 0 ? (
                                <>
                                    <p className="text-success">
                                        <FaAward /> You have scored 90%+ in {filteredMarks.filter(m => (m.marksObtained / m.maxMarks * 100) >= 90).length} subjects!
                                    </p>
                                    <ul>
                                        {filteredMarks
                                            .filter(m => (m.marksObtained / m.maxMarks * 100) >= 90)
                                            .map((m, i) => (
                                                <li key={i}>{m.subjectName} - {((m.marksObtained / m.maxMarks) * 100).toFixed(1)}%</li>
                                            ))
                                        }
                                    </ul>
                                </>
                            ) : (
                                <p className="text-muted">Keep working hard! Aim for 90%+ in your next exams.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ViewMarks;
