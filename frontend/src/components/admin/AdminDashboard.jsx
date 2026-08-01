import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaUsers, FaChalkboardTeacher, FaBook, FaRupeeSign } from 'react-icons/fa';
import adminService from '../../services/adminService';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsData, activitiesData] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getRecentActivities()
            ]);
            setStats(statsData);
            setRecentActivities(activitiesData);
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

    const attendanceChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                label: 'Attendance %',
                data: [85, 88, 92, 87, 90, 75],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }
        ]
    };

    const courseDistributionData = {
        labels: ['Computer Science', 'Engineering', 'Business', 'Arts'],
        datasets: [
            {
                data: [300, 450, 200, 150],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }
        ]
    };

    return (
        <motion.div 
            className="admin-dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <Header />
            <div className="d-flex">
                <Sidebar role="ADMIN" />
                <div className="main-content p-4">
                    <h2 className="mb-4">Admin Dashboard</h2>
                    
                    {/* Stats Cards */}
                    <Row className="mb-4">
                        <Col md={3}>
                            <Card className="stats-card primary">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted">Total Students</h6>
                                            <h3>{stats?.totalStudents || 0}</h3>
                                        </div>
                                        <FaUsers size={40} className="stats-icon" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={3}>
                            <Card className="stats-card success">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted">Total Teachers</h6>
                                            <h3>{stats?.totalTeachers || 0}</h3>
                                        </div>
                                        <FaChalkboardTeacher size={40} className="stats-icon" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={3}>
                            <Card className="stats-card warning">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted">Total Courses</h6>
                                            <h3>{stats?.totalCourses || 0}</h3>
                                        </div>
                                        <FaBook size={40} className="stats-icon" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={3}>
                            <Card className="stats-card info">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted">Revenue</h6>
                                            <h3>₹{stats?.totalRevenue || 0}</h3>
                                        </div>
                                        <FaRupeeSign size={40} className="stats-icon" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Charts */}
                    <Row className="mb-4">
                        <Col md={8}>
                            <Card>
                                <Card.Header>
                                    <h5>Attendance Overview</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Line data={attendanceChartData} />
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={4}>
                            <Card>
                                <Card.Header>
                                    <h5>Course Distribution</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Doughnut data={courseDistributionData} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Recent Activities */}
                    <Row>
                        <Col md={12}>
                            <Card>
                                <Card.Header>
                                    <h5>Recent Activities</h5>
                                </Card.Header>
                                <Card.Body>
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Activity</th>
                                                <th>User</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentActivities.map((activity, index) => (
                                                <tr key={index}>
                                                    <td>{activity.date}</td>
                                                    <td>{activity.description}</td>
                                                    <td>{activity.user}</td>
                                                    <td>
                                                        <span className={`badge bg-${activity.status === 'Success' ? 'success' : 'warning'}`}>
                                                            {activity.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;