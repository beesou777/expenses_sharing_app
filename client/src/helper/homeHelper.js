import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** add expense function */
export async function addExpense(values) {
    try {
        const token = localStorage.getItem('token');
        if(!token) return Promise.reject({error: "You must first login to add expense!"});
        const {data} = await axios.put('api/addExpense',values, {headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve(data);
    }
    catch(error) {
        return Promise.reject({error: "Unable to add expense! Try again!"});
    }
}

/** add member function */
export async function addMember(values) {
    try {
        const token = localStorage.getItem('token');
        if(!token) return Promise.reject({error: "You must first login to add member!"});
        const {data} = await axios.put('api/addMember',values, {headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve(data);
    }
    catch(error) {
        return Promise.reject({error: "Unable to add member! Try again!"});
    }
}

/** update member function */
export async function updateMember(values) {
    try {
        const token = localStorage.getItem('token');
        if(!token) return Promise.reject({error: "You must first login to add member!"});
        const {data} = await axios.put('api/editMember',values, {headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve(data);
    }
    catch(error) {
        return Promise.reject({error: "Unable to add member! Try again!"});
    }
}

/** delete member function */
export async function deleteMember(values) {
    try {
        const token = localStorage.getItem('token');
        if(!token) return Promise.reject({error: "You must first login to delete member!"});
        const {data} = await axios.put('api/deleteMember',values, {headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve(data);
    }
    catch(error) {
        return Promise.reject({error: "Unable to delete member! Try again!"});
    }
}

/** delete expense function */
export async function deleteExpense(values) {
    try {
        const token = localStorage.getItem('token');
        if(!token) return Promise.reject({error: "You must first login to delete expense!"});
        const {data} = await axios.put('api/deleteExpense',values, {headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve(data);
    }
    catch(error) {
        return Promise.reject({error: "Unable to delete expense! Try again!"});
    }
}

/** delete expense function */
export async function updateExpense(values) {
    try {
        const token = localStorage.getItem('token');
        if(!token) return Promise.reject({error: "You must first login to udpate expense!"});
        const {data} = await axios.put('api/editExpense',values, {headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve(data);
    }
    catch(error) {
        return Promise.reject({error: "Unable to udpate expense! Try again!"});
    }
}

/** share expense function */
export async function shareExpenses(values) {
    try {
        const token = localStorage.getItem('token');
        if(!token) return Promise.reject({error: "You must first login to share expenses!"});
        const {data} = await axios.put('api/sharedExpenses',values, {headers: {"Authorization": `Bearer ${token}`}});
        return Promise.resolve(data);
    }
    catch(error) {
        return Promise.reject({error: "Unable to share expenses! Try again!"});
    }
}

/** get today date String e.g. 2023-01-26 */
export function todayDateString() {
    const date = new Date();
    return date.getFullYear() + '-' + (date.getMonth()+1).toString().padStart(2, 0) + '-' + (date.getDate()).toString().padStart(2, 0);
}

/** convert iso date string to DD-MMM-YYYY */
export function dateStringFormat(dateStr) {
    const dateArr = dateStr.split('T')[0].split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = dateArr[0];
    const month = months[dateArr[1]-1];
    const day = dateArr[2];

    return `${day}-${month}-${year}`;
}

/** convert iso date string to MMM-YYYY */
export function monthStringFormat(dateStr) {
    const dateArr = dateStr.split('T')[0].split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = dateArr[0];
    const month = months[dateArr[1]-1];
    return `${month}-${year}`;
}

/** coverter for currency */
export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});