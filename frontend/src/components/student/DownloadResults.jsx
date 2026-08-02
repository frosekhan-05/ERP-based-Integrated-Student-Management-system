import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaDownload, FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';
import studentService from '../../services/studentService';
import { toast } from 'react-toastify';
import './DownloadResults.css';

const DownloadResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        fetchResults();
        fetchStudentInfo();
    }, []);

    const fetchResults = async () => {
        try {
            const data = await studentService.getMarks();
            setResults(data);
        } catch (error) {
            toast.error('Failed to fetch results');
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

    const filteredResults = selectedSemester === 'all' 
        ? results 
        : results.filter(r => r.semester === parseInt(selectedSemester));

    const calculateSemesterStats = (semesterResults) => {
        const totalMarks = semesterResults.reduce((sum, r) => sum + r.marksObtained, 0);
        const maxMarks = semesterResults.reduce((sum, r) => sum + r.maxMarks, 0);
        const percentage = maxMarks > 0 ? (totalMarks / maxMarks * 100).toFixed(2) : 0;
        
        return {
            totalMarks,
            maxMarks,
            percentage,
            subjects: semesterResults.length,
            passed: semesterResults.filter(r => r.result === 'PASS').length
        };
    };

    const downloadPDF = async () => {
        try {
            const response = await studentService.downloadResults('pdf', { semester: selectedSemester });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `results_semester_${selectedSemester}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('PDF downloaded successfully');
        } catch (error) {
            toast.error('Failed to download PDF');
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await studentService.downloadResults('excel', { semester: selectedSemester });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `results_semester_${selectedSemester}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Excel downloaded successfully');
        } catch (error) {
            toast.error('Failed to download Excel');
        }
    };

    const printResults = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    const semesterStats = filteredResults.length > 0 
        ? calculateSemesterStats(filteredResults) 
        : null;

    return (
        <div className="download-results">
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h4>Download Results</h4>
                            {studentInfo && (
                                <p className="text-muted mb-0">
                                    {studentInfo.firstName} {studentInfo.lastName} - {studentInfo.studentId}
                                </p>
                            )}
                        </Col>
                        <Col md={4}>
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
                                <option value="7">Semester 7</option>
                                <option value="8">Semester 8</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {semesterStats && (
                <Card className="mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={3}>
                                <div className="stats-card">
                                    <h6>Total Marks</h6>
                                    <h3>{semesterStats.totalMarks}/{semesterStats.maxMarks}</h3>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="stats-card">
                                    <h6>Percentage</h6>
                                    <h3>{semesterStats.percentage}%</h3>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="stats-card">
                                    <h6>Subjects</h6>
                                    <h3>{semesterStats.subjects}</h3>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="stats-card">
                                    <h6>Passed</h6>
                                    <h3>{semesterStats.passed}/{semesterStats.subjects}</h3>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            <Card className="mb-4">
                <Card.Header>
                    <Row>
                        <Col>
                            <h5 className="mb-0">Result Details</h5>
                        </Col>
                        <Col className="text-end">
                            <Button 
                                variant="success" 
                                size="sm" 
                                className="me-2"
                                onClick={downloadPDF}
                            >
                                <FaFilePdf /> PDF
                            </Button>
                            <Button 
                                variant="info" 
                                size="sm" 
                                className="me-2"
                                onClick={downloadExcel}
                            >
                                <FaFileExcel /> Excel
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={printResults}
                            >
                                <FaPrint /> Print
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Table striped hover responsive className="results-table">
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>Semester</th>
                                <th>Marks Obtained</th>
                                <th>Max Marks</th>
                                <th>Percentage</th>
                                <th>Grade</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.subjectCode}</td>
                                    <td>{result.subjectName}</td>
                                    <td>Sem {result.semester}</td>
                                    <td>{result.marksObtained}</td>
                                    <td>{result.maxMarks}</td>
                                    <td>{result.percentage}%</td>
                                    <td>
                                        <span className={`grade-badge grade-${result.grade?.toLowerCase()}`}>
                                            {result.grade}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`result-badge ${result.result?.toLowerCase()}`}>
                                            {result.result}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {filteredResults.length > 0 && (
                            <tfoot>
                                <tr className="table-info">
                                    <td colSpan="3"><strong>Total</strong></td>
                                    <td><strong>{semesterStats.totalMarks}</strong></td>
                                    <td><strong>{semesterStats.maxMarks}</strong></td>
                                    <td><strong>{semesterStats.percentage}%</strong></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </Table>

                    {filteredResults.length === 0 && (
                        <Alert variant="info" className="text-center">
                            No results found for the selected semester.
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">Grading System</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <div className="grade-info">
                                <span className="grade-circle grade-a">A</span>
                                <span>90% and above</span>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="grade-info">
                                <span className="grade-circle grade-b">B</span>
                                <span>75% - 89%</span>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="grade-info">
                                <span className="grade-circle grade-c">C</span>
                                <span>60% - 74%</span>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="grade-info">
                                <span className="grade-circle grade-d">D</span>
                                <span>50% - 59%</span>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="grade-info">
                                <span className="grade-circle grade-f">F</span>
                                <span>Below 50%</span>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default DownloadResults;
