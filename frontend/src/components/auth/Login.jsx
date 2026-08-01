import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChartLine, FaGraduationCap, FaLock, FaUserShield } from 'react-icons/fa';
import './Login.css';

const LoginSchema = Yup.object().shape({
    username: Yup.string()
        .required('Username is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
});

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const featureCards = [
        {
            icon: FaUserShield,
            title: 'Secure access',
            text: 'JWT-based authentication for administrators, teachers, and students.'
        },
        {
            icon: FaChartLine,
            title: 'Live visibility',
            text: 'See marks, attendance, and fees in a cleaner operational flow.'
        },
        {
            icon: FaGraduationCap,
            title: 'Academic focus',
            text: 'Build a smoother experience for every classroom interaction.'
        }
    ];
    const demoAccounts = [
        { role: 'Admin', username: 'admin', password: 'admin123' },
        { role: 'Teacher', username: 'teacher', password: 'teacher123' },
        { role: 'Student', username: 'student', password: 'student123' }
    ];

    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        const result = await login(values.username, values.password);
        setLoading(false);
        setSubmitting(false);
        
        if (result.success) {
            // Redirect based on role
            switch(result.role) {
                case 'ADMIN':
                    navigate('/admin');
                    break;
                case 'TEACHER':
                    navigate('/teacher');
                    break;
                case 'STUDENT':
                    navigate('/student');
                    break;
                default:
                    navigate('/dashboard');
            }
        }
    };

    return (
        <motion.div 
            className="login-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="login-layout">
                <div className="login-showcase">
                    <span className="login-kicker">Campus command center</span>
                    <h1>Make your ERP look vibrant, modern, and built for real campus workflows.</h1>
                    <p>
                        Sign in to manage attendance, marks, fees, subjects, and reporting through a brighter experience that feels more advanced than a plain admin template.
                    </p>

                    <div className="login-feature-grid">
                        {featureCards.map(({ icon: Icon, title, text }) => (
                            <div className="login-feature-card" key={title}>
                                <span className="login-feature-icon">
                                    <Icon />
                                </span>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="login-demo-panel">
                        <div className="login-demo-header">
                            <span>Ready-to-test accounts</span>
                            <small>Use these demo credentials to explore the app.</small>
                        </div>
                        <div className="demo-credentials-grid">
                            {demoAccounts.map((account) => (
                                <div className="demo-credential-card" key={account.role}>
                                    <strong>{account.role}</strong>
                                    <span>{account.username}</span>
                                    <small>{account.password}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="login-box">
                    <div className="login-header">
                        <span className="login-eyebrow">Secure Sign In</span>
                        <h2>Welcome back</h2>
                        <p>Enter your credentials to access the ERP workspace.</p>
                    </div>

                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="login-form">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <Field
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        placeholder="Enter username"
                                    />
                                    <ErrorMessage name="username" component="div" className="error-message" />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                    />
                                    <ErrorMessage name="password" component="div" className="error-message" />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary login-submit"
                                    disabled={isSubmitting || loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            <span> Logging in...</span>
                                        </>
                                    ) : (
                                        <>
                                            Continue to Dashboard
                                            <FaArrowRight />
                                        </>
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    
                    <div className="login-footer">
                        <div className="login-links">
                            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                            <Link to="/register" className="register-link">Create account</Link>
                        </div>
                        <div className="login-helper">
                            <FaLock />
                            <span>Protected with role-based JWT authentication</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
