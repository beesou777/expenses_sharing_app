import axios from 'axios';
// import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Make API Request */

/** To get username from Token */
// export async function getUsername() {
//     const token = localStorage.getItem('token');
//     if(!token) {
//         return Promise.reject("Cannot find token");
//     }
//     let decode = jwt_decode(token);
//     return Promise.resolve(decode);
// }

/** authenticate function */
export async function authenticate(username) {
    try {
        return await axios.post("/api/authenticate", { username }); //nothing will be returned res.end()
    }
    catch(error) {
        return {error: "Username doesn't exist"};
    }
}

/** get User basic info - for generateOTP */
export async function getUser({ username }) {
    try {
        // res.data
        const { data } = await axios.get(`api/user/${username}`);
        return data;
    }
    catch(error) {
        return {error: "Password doesn't match!"};
    }
}

/** register user function */
export async function registerUser(credentials) {
    try {
        const {status} = await axios.post("api/register", credentials);
        let {username, email} = credentials;
        /** send email */
        if(status === 201) {
            try {
                await axios.post('api/registerMail', {username, userEmail: email});
                return Promise.resolve({msg: 'The welcome email has been sent to your email address.'});
            }
            catch(error) {
                return Promise.resolve({msg: 'Unfortunately, the welcome email cannot be sent to your email address.'});
            }
        }
    }
    catch (error) {
        return Promise.reject({error: error.message});
    }
}

/** login function */
export async function verifyPassword({username, password}) {
    try {
        if(username) {
            const {data} = await axios.post('api/login', {username, password});
            return Promise.resolve({data}); 
        }
    }
    catch(error) {
        return Promise.reject({error: "Password doesn't match!"});
    }
}

/** update user function */
export async function updateUser(response) {
    try {
        const token = localStorage.getItem('token');
        const data = await axios.put('api/updateuser', response, {headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve({data});
    }
    catch(error) {
        return Promise.reject({error: "Couldn't update user!"});
    }
}

/** generate OTP */
export async function generateOTP(username){
    try {
        // since code is inside response.data
        const {data: {code}, status} = await axios.get(`api/generateOTP`,{params: {username}});
        
        // send email with OTP
        if(status === 201) {
            let {email} = await getUser({username});
            await axios.post('api/OTPMail', {username, userEmail: email, code});
        }

        return Promise.resolve(code);
    }
    catch(error) {
        return Promise.reject(error);
    }
}

/** verify OTP */
export async function verifyOTP({username, code}){
    try {
        const {data, status} = await axios.get(`api/verifyOTP`,{params: {username, code}});
        return Promise.resolve({data, status});
    }
    catch(error) {
        return Promise.reject(error); 
    }
}

/** reset password */
export async function resetPassword({username, password}) {
    try {
        const {data, status} = await axios.put(`api/resetPassword`,{username, password});
        return Promise.resolve({data, status});
    }
    catch(error) {
        return Promise.reject(error); 
    }
}