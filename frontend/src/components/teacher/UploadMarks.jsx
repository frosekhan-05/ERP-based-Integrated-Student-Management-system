
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Table, Row, Col, Spinner, Badge, Alert } from 'react-bootstrap';
import { FaSave, FaUpload, FaFileExcel, FaDownload } from 'react-icons/fa';
import teacherService from '../../services/teacherService';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import './UploadMarks.css';

const UploadMarks = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [marks, setMarks] = useState({});
    const [existingMarks, setExistingMarks] = useState(null);

    useEffect(() => {
        fetchSubjects();
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedSubject && selectedExam) {
            fetchStudents();
            checkExistingMarks();
        }
    }, [selectedSubject, selectedExam]);

    const fetchSubjects = async () => {
        try {
            const data = await teacherService.getSubjects();
            setSubjects(data);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };

    const fetchExams = async () => {
        try {
            const data = await teacherService.getExams();
            setExams(data);
        } catch (error) {
            toast.error('Failed to fetch exams');
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await teacherService.getStudentsBySubject(selectedSubject);
            setStudents(data);
            
            // Initialize marks object
            const initialMarks = {};
            data.forEach(student => {
                initialMarks[student.id] = {
                    marksObtained: '',
                    remarks: ''
                };
            });
            setMarks(initialMarks);
        } catch (error) {
            toast.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const checkExistingMarks = async () => {
        try {
            const data = await teacherService.getMarksByExam(selectedExam, selectedSubject);
            if (data && data.length > 0) {
                setExistingMarks(data);
                // Pre-fill existing marks
                const existing = {};
                data.forEach(record => {
                    existing[record.studentId] = {
                        marksObtained: record.marksObtained,
                        remarks: record.remarks || ''
                    };
                });
                setMarks(existing);
            } else {
                setExistingMarks(null);
            }
        } catch (error) {
            console.error('Error checking existing marks:', error);
        }
    };

    const handleMarksChange = (studentId, field, value) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedSubject || !selectedExam) {
            toast.error('Please select subject and exam');
            return;
        }

        const marksData = students.map(student => ({
            studentId: student.id,
            subjectId: selectedSubject,
            examId: selectedExam,
            marksObtained: parseFloat(marks[student.id]?.marksObtained) || 0,
            remarks: marks[student.id]?.remarks || ''
        }));

        try {
            await teacherService.uploadBulkMarks(marksData);
            toast.success(existingMarks ? 'Marks updated successfully' : 'Marks uploaded successfully');
            checkExistingMarks();
        } catch (error) {
            toast.error('Failed to save marks');
        }
    };

    const downloadTemplate = () => {
        const template = students.map(student => ({
            'Student ID': student.studentId,
            'Name': `${student.firstName} ${student.lastName}`,
            'Marks Obtained': '',
            'Remarks': ''
        }));

        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Marks Template');
        XLSX.writeFile(wb, 'marks_template.xlsx');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const newMarks = { ...marks };
                jsonData.forEach(row => {
                    const student = students.find(s => s.studentId === row['Student ID']);
                    if (student) {
                        newMarks[student.id] = {
                            marksObtained: row['Marks Obtained'],
                            remarks: row['Remarks'] || ''
                        };
                    }
                });
                setMarks(newMarks);
                toast.success('Marks uploaded from file');
            } catch (error) {
                toast.error('Failed to parse file');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="upload-marks">
            <Card className="mb-4">
                <Card.Body>
                    <h4>Upload Marks</h4>
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
                                <Form.Label>Select Exam</Form.Label>
                                <Form.Select 
                                    value={selectedExam} 
                                    onChange={(e) => setSelectedExam(e.target.value)}
                                    required
                                >
                                    <option value="">Choose Exam</option>
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.examName} ({exam.examType})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                            <Button variant="info" onClick={downloadTemplate} className="me-2">
                                <FaDownload /> Template
                            </Button>
                            <Form.Group>
                                <Form.Label className="d-none">Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileUpload}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {selectedSubject && selectedExam && (
                <>
                    {existingMarks && (
                        <Alert variant="info" className="mb-4">
                            <FaUpload /> Marks already exist for this exam. You can update them below.
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
                                            <th>Marks Obtained</th>
                                            <th>Max Marks</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => {
                                            const exam = exams.find(e => e.id === parseInt(selectedExam));
                                            return (
                                                <tr key={student.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.studentId}</td>
                                                    <td>{student.firstName} {student.lastName}</td>
                                                    <td>{student.rollNo || '-'}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            value={marks[student.id]?.marksObtained || ''}
                                                            onChange={(e) => handleMarksChange(student.id, 'marksObtained', e.target.value)}
                                                            min="0"
                                                            max={exam?.maxMarks || 100}
                                                            step="0.01"
                                                            style={{ width: '100px' }}
                                                        />
                                                    </td>
                                                    <td>{exam?.maxMarks || 100}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            value={marks[student.id]?.remarks || ''}
                                                            onChange={(e) => handleMarksChange(student.id, 'remarks', e.target.value)}
                                                            placeholder="Optional"
                                                            size="sm"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>

                                <div className="text-end mt-3">
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        size="lg"
                                        disabled={students.length === 0}
                                    >
                                        <FaSave /> {existingMarks ? 'Update Marks' : 'Save Marks'}
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

export default UploadMarks;
