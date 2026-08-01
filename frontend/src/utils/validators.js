// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone number validation
export const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

// Password validation
export const isValidPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
};

// Roll number validation
export const isValidRollNumber = (rollNo) => {
    const rollRegex = /^[A-Z0-9-]+$/;
    return rollRegex.test(rollNo);
};

// Date validation
export const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
};

// Future date validation
export const isFutureDate = (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    return inputDate > today;
};

// Past date validation
export const isPastDate = (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    return inputDate < today;
};

// Age validation
export const isValidAge = (dateOfBirth, minAge = 16, maxAge = 100) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= minAge && age - 1 <= maxAge;
    }
    return age >= minAge && age <= maxAge;
};

// Marks validation
export const isValidMarks = (marks, maxMarks) => {
    return marks >= 0 && marks <= maxMarks;
};

// Percentage validation
export const isValidPercentage = (percentage) => {
    return percentage >= 0 && percentage <= 100;
};

// Required field validation
export const isRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Numeric validation
export const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

// Positive number validation
export const isPositiveNumber = (value) => {
    return isNumeric(value) && parseFloat(value) > 0;
};

// Validate form
export const validateForm = (values, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const fieldRules = rules[field];
        const value = values[field];
        
        if (fieldRules.required && !isRequired(value)) {
            errors[field] = `${field} is required`;
        } else if (value) {
            if (fieldRules.email && !isValidEmail(value)) {
                errors[field] = 'Invalid email address';
            }
            if (fieldRules.phone && !isValidPhone(value)) {
                errors[field] = 'Invalid phone number';
            }
            if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = `Minimum ${fieldRules.minLength} characters required`;
            }
            if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
                errors[field] = `Maximum ${fieldRules.maxLength} characters allowed`;
            }
            if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
                errors[field] = fieldRules.message || 'Invalid format';
            }
        }
    });
    
    return errors;
};