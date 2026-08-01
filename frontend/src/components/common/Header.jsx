import React from 'react';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaBell, FaSignOutAlt, FaCog, FaTachometerAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Campus User';
    const initials = ((user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || user?.username?.slice(0, 2) || 'EP')).toUpperCase();
    const roleIdentifier = user?.role === 'TEACHER'
        ? user?.teacherId
        : user?.role === 'STUDENT'
            ? user?.studentId
            : null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        switch(user?.role) {
            case 'ADMIN': return '/admin';
            case 'TEACHER': return '/teacher';
            case 'STUDENT': return '/student';
            default: return '/dashboard';
        }
    };

    return (
        <Navbar expand="lg" className="header">
            <Container fluid="lg">
                <Navbar.Brand as={Link} to="/" className="brand">
                    <span className="brand-mark">ERP</span>
                    <span className="brand-copy">
                        <strong>ERP Student</strong>
                        <small>Management System</small>
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {user ? (
                            <>
                                <Nav.Link as={Link} to={getDashboardLink()}>
                                    <FaTachometerAlt /> Dashboard
                                </Nav.Link>

                                <Dropdown align="end" className="mx-2">
                                    <Dropdown.Toggle variant="link" className="text-white p-0">
                                        <FaBell size={20} />
                                        <Badge bg="danger" className="notification-badge">3</Badge>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Header>Notifications</Dropdown.Header>
                                        <Dropdown.Divider />
                                        <Dropdown.Item>New attendance marked</Dropdown.Item>
                                        <Dropdown.Item>Fee payment reminder</Dropdown.Item>
                                        <Dropdown.Item>Assignment deadline</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="link" className="text-white p-0">
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {initials}
                                            </div>
                                            <div className="d-flex flex-column text-start">
                                                <span className="user-name">
                                                    {displayName}
                                                </span>
                                                {roleIdentifier && (
                                                    <small className="opacity-75">{roleIdentifier}</small>
                                                )}
                                            </div>
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Header>
                                            <strong>{user?.role}</strong><br />
                                            {roleIdentifier && (
                                                <>
                                                    <small>{roleIdentifier}</small>
                                                    <br />
                                                </>
                                            )}
                                            <small>{user?.email}</small>
                                        </Dropdown.Header>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/profile">
                                            <FaUser className="me-2" /> Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/settings">
                                            <FaCog className="me-2" /> Settings
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout}>
                                            <FaSignOutAlt className="me-2" /> Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
