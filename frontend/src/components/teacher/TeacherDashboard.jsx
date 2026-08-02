import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import teacherService from '../../services/teacherService';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const data = await teacherService.getDashboard();
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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

    return (
        <motion.div 
            className="teacher-dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <Header />
            <div className="d-flex">
                <Sidebar role="TEACHER" />
                <div className="main-content p-4">
                    <h2 className="mb-1">Teacher Dashboard</h2>
                    {user?.teacherId && <p className="text-muted mb-4">Teacher ID: {user.teacherId}</p>}
                    {dashboardData?.interestedCourse && (
                        <p className="text-muted mb-4">Interested Course: {dashboardData.interestedCourse}</p>
                    )}
                    
                    <Row className="mb-4">
                        <Col md={3}>
                            <Card className="stats-card primary">
                                <Card.Body>
                                    <h6 className="text-muted">Total Students</h6>
                                    <h3>{dashboardData?.totalStudents || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={3}>
                            <Card className="stats-card success">
                                <Card.Body>
                                    <h6 className="text-muted">Subjects</h6>
                                    <h3>{dashboardData?.totalSubjects || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={3}>
                            <Card className="stats-card warning">
                                <Card.Body>
                                    <h6 className="text-muted">Classes Today</h6>
                                    <h3>{dashboardData?.classesToday || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={3}>
                            <Card className="stats-card info">
                                <Card.Body>
                                    <h6 className="text-muted">Assignments</h6>
                                    <h3>{dashboardData?.totalAssignments || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={6}>
                            <Card>
                                <Card.Header>
                                    <h5>Today's Schedule</h5>
                                </Card.Header>
                                <Card.Body>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Time</th>
                                                <th>Subject</th>
                                                <th>Class</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData?.todaySchedule?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.time}</td>
                                                    <td>{item.subject}</td>
                                                    <td>{item.class}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={6}>
                            <Card>
                                <Card.Header>
                                    <h5>Pending Tasks</h5>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-group">
                                        {dashboardData?.pendingTasks?.map((task, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                {task.description}
                                                <span className="badge bg-warning">{task.deadline}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </motion.div>
    );
};

export default TeacherDashboard;
