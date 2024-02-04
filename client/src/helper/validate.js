import toast from 'react-hot-toast';
import { authenticate } from './helper';

/** validate login page username */
export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);
    if(values.username) {
        console.log(values.username);
        //check user exist or not
        const {status} = await authenticate(values.username);
        if(status !== 200) {
            errors.exist = toast.error("Invalid Username!");
        } 
    }
    return errors;
}

/** validate password */
export async function passwordValidate(values) {
    const errors = passwordVerify({}, values);

    return errors;
}

/** validate reset password */
export async function resetPasswordValidate(values) {
    const errors = passwordVerify({}, values);
    if(values.password !== values.confirm_password) {
        errors.password = toast.error("Password not match!")
    }
    return errors;
}

/** validate register form */
export async function registerValidate(values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);
    return errors;
}

/** validate profile (account details) */
export async function profileValidate(values) {
    const errors = emailVerify({}, values);
    return errors;
}

/******************************************************************************** */

/** verify username */
function usernameVerify(error={}, values) {

    const usernameFormat = /^[a-z][a-z0-9_]{4,14}$/;

    if(!values.username) {
        error.username = toast.error("Username Required!");
    }
    else if(values.username.includes(" ")) {
        error.username = toast.error("Invalid Username!");
    }
    else if(!usernameFormat.test(values.username)) {
        error.username = toast.error("Username must has 4 to 16 characters and consist of only alphanumeric characters and/or underscores.");
    }
    return error;
}

/** verify password */
function passwordVerify(error={}, values) {

    // const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password) {
        error.password = toast.error("Password Required!");
    }
    else if(values.password.includes(" ")) {
        error.password = toast.error("Invalid Password!");
    }
    else if(values.password.length < 4) {
        error.password = toast.error("Password must be more than or equal to 4 characters!");
    }
    // else if(!specialChars.test(values.password)) {
    //     error.password = toast.error("Password must have special characters!");
    // }

    return error;
}

/** verify email */
function emailVerify(error={}, values) {

    const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(!values.email) {
        error.email = toast.error("Email Address Required!");
    }
    else if(!emailFormat.test(values.email)) {
        error.email = toast.error("Invalid Email Address!");
    }

    return error;
}