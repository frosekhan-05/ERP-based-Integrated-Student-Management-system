import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ProgressBar, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import studentService from '../../services/studentService';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [studentData, setStudentData] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [marks, setMarks] = useState([]);
    const [fees, setFees] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const [profile, attendanceData, marksData, feesData] = await Promise.all([
                studentService.getProfile(),
                studentService.getAttendance(),
                studentService.getMarks(),
                studentService.getFees()
            ]);
            
            setStudentData(profile);
            setAttendance(attendanceData);
            setMarks(marksData);
            setFees(feesData);
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    const attendancePercentage = attendance.length > 0
        ? (attendance.filter(a => a.status === 'PRESENT').length / attendance.length * 100).toFixed(1)
        : 0;

    const averageMarks = marks.length > 0
        ? (marks.reduce((acc, curr) => acc + curr.marksObtained, 0) / marks.length).toFixed(1)
        : 0;
    const courseName = studentData?.courseName || studentData?.course?.courseName || 'N/A';

    return (
        <motion.div 
            className="student-dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <Header />
            <div className="d-flex">
                <Sidebar role="STUDENT" />
                <div className="main-content p-4">
                    <h2 className="mb-4">Welcome, {studentData?.firstName}!</h2>
                    
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card className="profile-card">
                                <Card.Body>
                                    <div className="text-center mb-3">
                                        <div className="profile-avatar">
                                            {studentData?.firstName?.charAt(0)}{studentData?.lastName?.charAt(0)}
                                        </div>
                                        <h5>{studentData?.firstName} {studentData?.lastName}</h5>
                                        <p className="text-muted">{studentData?.studentId}</p>
                                    </div>
                                    <hr />
                                    <div className="profile-info">
                                        <p><strong>Course:</strong> {courseName}</p>
                                        <p><strong>Semester:</strong> {studentData?.semester}</p>
                                        <p><strong>Batch:</strong> {studentData?.batch}</p>
                                        <p><strong>Email:</strong> {studentData?.email}</p>
                                        <p><strong>Phone:</strong> {studentData?.phoneNumber}</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={8}>
                            <Row>
                                <Col md={6}>
                                    <Card className="attendance-card">
                                        <Card.Body>
                                            <h6>Attendance Overview</h6>
                                            <h2 className="mb-3">{attendancePercentage}%</h2>
                                            <ProgressBar 
                                                now={attendancePercentage} 
                                                variant={attendancePercentage >= 75 ? "success" : "warning"}
                                                className="mb-3"
                                            />
                                            <div className="d-flex justify-content-between">
                                                <span>Present: {attendance.filter(a => a.status === 'PRESENT').length}</span>
                                                <span>Total: {attendance.length}</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                                <Col md={6}>
                                    <Card className="marks-card">
                                        <Card.Body>
                                            <h6>Academic Performance</h6>
                                            <h2 className="mb-3">{averageMarks}%</h2>
                                            <div className="subject-marks">
                                                {marks.slice(0, 3).map((mark, index) => (
                                                    <div key={index} className="d-flex justify-content-between mb-2">
                                                        <span>{mark.subjectName}</span>
                                                        <span className="badge bg-primary">{mark.marksObtained}/{mark.maxMarks}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            
                            <Row className="mt-4">
                                <Col md={12}>
                                    <Card className="fees-card">
                                        <Card.Body>
                                            <h6>Fee Status</h6>
                                            <Row>
                                                <Col md={6}>
                                                    <div className="fee-details">
                                                        <p><strong>Total Fees:</strong> ₹{fees?.totalAmount}</p>
                                                        <p><strong>Paid Amount:</strong> ₹{fees?.paidAmount}</p>
                                                        <p><strong>Due Amount:</strong> ₹{fees?.dueAmount}</p>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="fee-status text-center">
                                                        <div className={`status-badge ${fees?.status?.toLowerCase()}`}>
                                                            {fees?.status}
                                                        </div>
                                                        {fees?.dueDate && (
                                                            <p className="mt-3">
                                                                <small>Due Date: {new Date(fees.dueDate).toLocaleDateString()}</small>
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
