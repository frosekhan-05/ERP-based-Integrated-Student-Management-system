import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaArrowRight,
    FaBolt,
    FaCalendarCheck,
    FaChartLine,
    FaChalkboardTeacher,
    FaCog,
    FaMoneyCheckAlt,
    FaShieldAlt,
    FaUserGraduate
} from 'react-icons/fa';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import './HomePage.css';

const featureCards = [
    {
        icon: FaUserGraduate,
        title: 'Student journeys',
        text: 'Profiles, results, fee status, and academic progress stay connected in one clean flow.'
    },
    {
        icon: FaChalkboardTeacher,
        title: 'Teacher workspace',
        text: 'Attendance, marks, and announcements move faster with role-focused tools and clearer screens.'
    },
    {
        icon: FaMoneyCheckAlt,
        title: 'Finance clarity',
        text: 'Fee tracking and payment visibility stay readable instead of getting buried inside admin forms.'
    },
    {
        icon: FaCalendarCheck,
        title: 'Daily rhythm',
        text: 'Timetables, schedules, and operational activity feel coordinated across every campus role.'
    }
];

const dashboardStats = [
    { value: '96.4%', label: 'Attendance marked on time' },
    { value: '148', label: 'Exam uploads processed' },
    { value: '320', label: 'Live sessions across roles' }
];

const liveMetrics = [
    { label: 'Attendance', value: '96.4%', detail: 'Marked today', tone: 'cyan' },
    { label: 'Fee Collection', value: '82%', detail: 'Monthly target', tone: 'orange' },
    { label: 'Exam Uploads', value: '148', detail: 'Results processed', tone: 'blue' },
    { label: 'Active Sessions', value: '320', detail: 'Across all roles', tone: 'teal' }
];

const workflowSteps = [
    {
        icon: FaBolt,
        title: 'Fast entry points',
        text: 'Students, teachers, and admins land in the right workspace immediately instead of navigating through clutter.'
    },
    {
        icon: FaShieldAlt,
        title: 'Role-aware structure',
        text: 'Sensitive actions stay protected while each user sees only the tools that matter to their day.'
    },
    {
        icon: FaChartLine,
        title: 'Readable performance',
        text: 'Metrics, reports, and daily activity show up in panels that are easy to scan at a glance.'
    }
];

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const HomePage = () => {
    return (
        <motion.div 
            className="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Header />

            <main className="home-page__main">
                <section className="home-hero">
                    <motion.div 
                        className="hero-copy"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.span variants={fadeUp} className="hero-kicker">Full-screen campus operating system</motion.span>
                        <motion.h1 variants={fadeUp} className="hero-title">
                            A sharper, faster workspace for every classroom, office, and student.
                        </motion.h1>
                        <motion.p variants={fadeUp} className="hero-description">
                            Manage attendance, marks, communication, fees, and reporting through one immersive interface
                            that feels closer to a modern product than a boxed admin page.
                        </motion.p>

                        <motion.div variants={fadeUp} className="hero-actions">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button as={Link} to="/dashboard" className="hero-primary">
                                    Open Dashboard <FaArrowRight />
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button as={Link} to="/register" className="hero-secondary">
                                    Create Account
                                </Button>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={fadeUp} className="hero-stat-grid">
                            {dashboardStats.map((stat) => (
                                <div className="hero-stat" key={stat.label}>
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <div className="hero-stage">
                        <div className="stage-glow" />
                        <div className="stage-floating stage-floating-top">Live campus pulse</div>
                        <div className="stage-floating stage-floating-bottom">Faster than scattered tools</div>

                        <div className="stage-window">
                            <div className="stage-window__top">
                                <div className="window-dots">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                                <div className="window-chip">Realtime command center</div>
                            </div>

                            <div className="stage-window__body">
                                <div className="stage-window__main">
                                    <div className="window-label">
                                        <FaBolt /> Live campus view
                                    </div>

                                    <div className="metric-grid">
                                        {liveMetrics.map((metric) => (
                                            <div className={`metric-panel metric-panel--${metric.tone}`} key={metric.label}>
                                                <span>{metric.label}</span>
                                                <strong>{metric.value}</strong>
                                                <small>{metric.detail}</small>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="signal-strip">
                                        <span>Role-based secure access</span>
                                        <span>Synchronized workflows</span>
                                        <span>Cleaner reporting</span>
                                    </div>
                                </div>

                                <div className="stage-window__side">
                                    <div className="activity-panel">
                                        <span className="activity-panel__label">Today&apos;s focus</span>
                                        <h3>Keep the entire campus in one visible flow.</h3>
                                        <p>
                                            Attendance, fees, marks, and announcements stay connected instead of split
                                            across disconnected screens.
                                        </p>
                                    </div>

                                    <div className="timeline-panel">
                                        <div className="timeline-item">
                                            <span className="timeline-time">08:30</span>
                                            <div>
                                                <strong>Attendance sync</strong>
                                                <small>All morning sections updated</small>
                                            </div>
                                        </div>
                                        <div className="timeline-item">
                                            <span className="timeline-time">11:15</span>
                                            <div>
                                                <strong>Marks uploaded</strong>
                                                <small>Semester dashboards refreshed</small>
                                            </div>
                                        </div>
                                        <div className="timeline-item">
                                            <span className="timeline-time">14:40</span>
                                            <div>
                                                <strong>Fee alerts sent</strong>
                                                <small>Pending dues summary shared</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="feature-band">
                    <div className="section-heading">
                        <span className="section-kicker">Built to feel like a real product</span>
                        <h2>More canvas, less clutter.</h2>
                        <p>
                            The layout stretches with the screen, keeps important actions visible, and adds motion that
                            supports focus instead of distracting from it.
                        </p>
                    </div>

                    <div className="feature-grid">
                        {featureCards.map(({ icon: Icon, title, text }) => (
                            <article className="feature-card" key={title}>
                                <div className="feature-card__icon">
                                    <Icon />
                                </div>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="workflow-showcase">
                    <div className="workflow-story">
                        <span className="section-kicker">Operational rhythm</span>
                        <h2>Designed for dashboards, not cramped forms.</h2>
                        <p>
                            Each area now behaves more like a modern application shell: broader layout, stronger visual
                            hierarchy, and movement that gives the page energy without slowing people down.
                        </p>
                    </div>

                    <div className="workflow-grid">
                        {workflowSteps.map(({ icon: Icon, title, text }) => (
                            <article className="workflow-card" key={title}>
                                <div className="workflow-card__icon">
                                    <Icon />
                                </div>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </article>
                        ))}

                        <article className="workflow-card workflow-card--wide">
                            <div className="workflow-card__icon">
                                <FaCog />
                            </div>
                            <h3>Fullscreen-ready foundation</h3>
                            <p>
                                Wide spacing, viewport-based sections, responsive panels, and smoother transitions make
                                the experience feel closer to polished apps like Google products and modern SaaS tools.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="cta-panel">
                    <div>
                        <span className="section-kicker">Ready to launch</span>
                        <h2>Open the workspace and manage the campus in one place.</h2>
                    </div>
                    <Button as={Link} to="/dashboard" className="hero-primary">
                        Launch Now <FaArrowRight />
                    </Button>
                </section>
            </main>

            <Footer />
        </motion.div>
    );
};

export default HomePage;
