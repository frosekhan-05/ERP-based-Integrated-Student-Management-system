import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Table, Spinner } from 'react-bootstrap';
import { FaFilePdf, FaFileExcel, FaDownload, FaChartBar } from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './Reports.css';

const Reports = () => {
    const [reportType, setReportType] = useState('attendance');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [courseId, setCourseId] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const reportTypes = [
        { value: 'attendance', label: 'Attendance Report' },
        { value: 'marks', label: 'Marks Report' },
        { value: 'fees', label: 'Fee Report' },
        { value: 'student', label: 'Student List' },
        { value: 'teacher', label: 'Teacher List' },
        { value: 'performance', label: 'Student Performance' }
    ];

    const generateReport = async () => {
        setLoading(true);
        try {
            const params = {
                type: reportType,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                courseId: courseId
            };
            const data = await adminService.generateReport(reportType, params);
            setReportData(data);
            toast.success('Report generated successfully');
        } catch (error) {
            toast.error('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        try {
            const response = await adminService.downloadReport(reportType, 'pdf', {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportType}_report.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download PDF');
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await adminService.downloadReport(reportType, 'excel', {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportType}_report.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download Excel');
        }
    };

    const renderChart = () => {
        if (!reportData?.chartData) return null;

        const chartConfig = {
            attendance: {
                type: 'line',
                data: {
                    labels: reportData.chartData.labels,
                    datasets: [{
                        label: 'Attendance %',
                        data: reportData.chartData.values,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    }]
                }
            },
            marks: {
                type: 'bar',
                data: {
                    labels: reportData.chartData.labels,
                    datasets: [{
                        label: 'Average Marks',
                        data: reportData.chartData.values,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgb(54, 162, 235)',
                        borderWidth: 1
                    }]
                }
            },
            fees: {
                type: 'pie',
                data: {
                    labels: ['Paid', 'Pending', 'Overdue'],
                    datasets: [{
                        data: reportData.chartData.values,
                        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
                    }]
                }
            }
        };

        const config = chartConfig[reportType] || chartConfig.attendance;

        return (
            <Card className="mt-4">
                <Card.Header>
                    <h5>Visual Representation</h5>
                </Card.Header>
                <Card.Body>
                    {config.type === 'line' && <Line data={config.data} />}
                    {config.type === 'bar' && <Bar data={config.data} />}
                    {config.type === 'pie' && <Pie data={config.data} />}
                </Card.Body>
            </Card>
        );
    };

    return (
        <div className="reports-container">
            <Card className="mb-4">
                <Card.Header>
                    <h4><FaChartBar className="me-2" /> Generate Reports</h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Report Type</Form.Label>
                                <Form.Select 
                                    value={reportType} 
                                    onChange={(e) => setReportType(e.target.value)}
                                >
                                    {reportTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Course (Optional)</Form.Label>
                                <Form.Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                                    <option value="">All Courses</option>
                                    <option value="1">Computer Science</option>
                                    <option value="2">Engineering</option>
                                    <option value="3">Business</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col className="text-end">
                            <Button 
                                variant="primary" 
                                onClick={generateReport} 
                                disabled={loading}
                                className="me-2"
                            >
                                {loading ? <Spinner size="sm" /> : 'Generate Report'}
                            </Button>
                            <Button 
                                variant="success" 
                                onClick={downloadPDF}
                                className="me-2"
                                disabled={!reportData}
                            >
                                <FaFilePdf /> PDF
                            </Button>
                            <Button 
                                variant="info" 
                                onClick={downloadExcel}
                                disabled={!reportData}
                            >
                                <FaFileExcel /> Excel
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {reportData && (
                <>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5>Report Summary</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <div className="summary-card">
                                        <h6>Total Records</h6>
                                        <h3>{reportData.summary?.totalRecords || 0}</h3>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="summary-card">
                                        <h6>Average</h6>
                                        <h3>{reportData.summary?.average || '0'}</h3>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="summary-card">
                                        <h6>Maximum</h6>
                                        <h3>{reportData.summary?.maximum || '0'}</h3>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="summary-card">
                                        <h6>Minimum</h6>
                                        <h3>{reportData.summary?.minimum || '0'}</h3>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {renderChart()}

                    <Card className="mt-4">
                        <Card.Header>
                            <h5>Detailed Report</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        {reportData.columns?.map(col => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.rows?.map((row, index) => (
                                        <tr key={index}>
                                            {Object.values(row).map((value, i) => (
                                                <td key={i}>{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Reports;