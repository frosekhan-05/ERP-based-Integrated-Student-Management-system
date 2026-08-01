import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaTachometerAlt, FaUsers, FaChalkboardTeacher, FaBook, 
    FaCalendarAlt, FaClipboardList, FaMoneyBillWave, FaSignOutAlt,
    FaUserGraduate, FaUserTie, FaFileAlt, FaBell
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const adminMenu = [
        { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/admin/students', icon: <FaUserGraduate />, label: 'Students' },
        { path: '/admin/teachers', icon: <FaUserTie />, label: 'Teachers' },
        { path: '/admin/courses', icon: <FaBook />, label: 'Courses' },
        { path: '/admin/subjects', icon: <FaClipboardList />, label: 'Subjects' },
        { path: '/admin/timetable', icon: <FaCalendarAlt />, label: 'Timetable' },
        { path: '/admin/fees', icon: <FaMoneyBillWave />, label: 'Fees' },
        { path: '/admin/reports', icon: <FaFileAlt />, label: 'Reports' }
    ];

    const teacherMenu = [
        { path: '/teacher', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/teacher/students', icon: <FaUsers />, label: 'My Students' },
        { path: '/teacher/attendance', icon: <FaClipboardList />, label: 'Mark Attendance' },
        { path: '/teacher/marks', icon: <FaBook />, label: 'Upload Marks' },
        { path: '/teacher/assignments', icon: <FaFileAlt />, label: 'Assignments' },
        { path: '/teacher/announcements', icon: <FaBell />, label: 'Announcements' },
        { path: '/teacher/timetable', icon: <FaCalendarAlt />, label: 'Timetable' }
    ];

    const studentMenu = [
        { path: '/student', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/student/profile', icon: <FaUserGraduate />, label: 'My Profile' },
        { path: '/student/attendance', icon: <FaClipboardList />, label: 'Attendance' },
        { path: '/student/marks', icon: <FaBook />, label: 'Marks' },
        { path: '/student/timetable', icon: <FaCalendarAlt />, label: 'Timetable' },
        { path: '/student/fees', icon: <FaMoneyBillWave />, label: 'Fees' },
        { path: '/student/results', icon: <FaFileAlt />, label: 'Results' }
    ];

    const getMenuItems = () => {
        switch(role) {
            case 'ADMIN': return adminMenu;
            case 'TEACHER': return teacherMenu;
            case 'STUDENT': return studentMenu;
            default: return [];
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h5>Menu</h5>
            </div>
            
            <Nav className="flex-column">
                {getMenuItems().map((item, index) => (
                    <Nav.Link
                        key={index}
                        as={Link}
                        to={item.path}
                        className={location.pathname === item.path ? 'active' : ''}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-label">{item.label}</span>
                    </Nav.Link>
                ))}
                
                <Nav.Link onClick={logout} className="logout-link">
                    <span className="menu-icon"><FaSignOutAlt /></span>
                    <span className="menu-label">Logout</span>
                </Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;
