
import { Navigate} from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token');

    if(!token) {
        return <Navigate to={'/'} replace={true}/>
    }
    return children;
}

export const ProtectRoute = ({children}) => {
    const username = useAuthStore.getState().auth.username;
    if(!username) {
        return <Navigate to={'/'} replace={true}/>
    }
    return children;
}

export const RedirectLoginUser = ({children}) => {
    const token = localStorage.getItem('token');
    if(token) {
        return <Navigate to={'/home'} replace={true}/>
    }
    return children;
}