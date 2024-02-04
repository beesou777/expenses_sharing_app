import toast from 'react-hot-toast';

/** validate add expense form */
export function addExpenseValidate(values) {
    const errors = amountVerify({}, values);
    dateVerify(errors, values);
    descriptionVerify(errors, values);
    return errors;
}

function amountVerify(error={}, values) {
    if(!values.amount) {
        error.amount = toast.error("Amount Required!");
    }
    else if(values.amount < 0) {
        error.amount = toast.error("Amount must be positive value!");
    }
    return error;
}

function dateVerify(error={}, values) {
    if(!values.date) {
        error.date = toast.error("Date Required!");
    }
    return error;
}

function descriptionVerify(error={}, values) {
    if(!values.description) {
        error.description = toast.error("Description Required!");
    }
    return error;
}