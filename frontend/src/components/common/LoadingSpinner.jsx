import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullPage = false }) => {
    const spinnerSize = {
        sm: { width: '2rem', height: '2rem' },
        md: { width: '3rem', height: '3rem' },
        lg: { width: '5rem', height: '5rem' }
    };

    if (fullPage) {
        return (
            <div className="full-page-spinner">
                <Spinner 
                    animation="border" 
                    variant="primary" 
                    style={spinnerSize[size]}
                />
                {text && <p className="mt-3 text-muted">{text}</p>}
            </div>
        );
    }

    return (
        <div className="loading-spinner">
            <Spinner 
                animation="border" 
                variant="primary" 
                style={spinnerSize[size]}
            />
            {text && <span className="ms-2 text-muted">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;