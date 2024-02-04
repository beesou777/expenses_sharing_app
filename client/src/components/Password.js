import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import icon from '../assets/group.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/authStore';
import { verifyPassword } from '../helper/helper';
import loginSvg from '../assets/login.svg';
import loadingSvg from '../assets/loading.svg';
import serverErrorSvg from '../assets/server_error.svg';
import Animation from '../middleware/Animation';

import styles from '../styles/Username.module.css';

export default function Password() {

    const navigate = useNavigate();
    const { username } = useAuthStore(state => state.auth);
    const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);

    const formik = useFormik({
        initialValues: {
            password: ''
        },
        validate: passwordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let loginPromise = verifyPassword({ username, password: values.password })
            toast.promise(loginPromise, {
                loading: "Logging in...",
                success: <b>Logged in successfully!</b>,
                error: <b>Incorrect password! Try again!</b>
            });
            loginPromise.then((res) => {
                const { token } = res.data;
                localStorage.setItem('token', token);
                navigate('/');
            });
        }
    })

    if (isLoading) return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder='false'></Toaster>
            <div className='h-[100vh] flex justify-center items-center'>
              <img src={loadingSvg} alt='loading' className='h-[100px] lg:h-[150px]' />
            </div>
        </div>
    );

    if (serverError) return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder='false'></Toaster>
            <div className='h-[100vh] flex flex-col justify-center items-center gap-8 text-center text-xl text-theme-plum'>
              <img src={serverErrorSvg} alt='server error' className='w-[250px]'/>
              <h6 className='font-bold'>Internal Server Error</h6>
              <p>Sorry! Something went wrong.</p>
              <Link className='w-full' to='/'><button className={styles.btn} >Home</button></Link>
            </div>
        </div>
    );

    return (
        <Animation>
            <Toaster position='top-center' reverseOrder='false'></Toaster>
            <div className="fixed w-full h-full p-5 overflow-y-auto">
                <div className='w-full min-h-full flex flex-row justify-center items-center'>
                    <div className='w-1/2 hidden justify-center items-center lg:flex'>
                        <img src={loginSvg} alt='Login illustration' className='w-[80%] max-h-[500px]' />
                    </div>
                    <div className={styles.glass}>
                        <div className="title flex flex-col items-center">
                            <h4 className='heading text-2xl font-bold text-center lg:text-3xl'><nobr>{apiData?.groupname || apiData?.username},</nobr> Welcome Back! </h4>
                            <span className='py-4 text-base w-2/3 text-center text-gray-500 lg:text-lg'>
                                Record and Share expenses easily.
                            </span>
                        </div>

                        <form className='py-1' onSubmit={formik.handleSubmit}>
                            <div className="profile flex justify-center py-4">
                                <img className={styles.icon_img} src={apiData?.icon || icon} alt="icon" />
                            </div>

                            <div className="textbox flex flex-col items-center gap-4">
                                <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder='Password' />
                                <button className={styles.btn} type="submit">Login</button>
                            </div>

                            <div className="text-center py-4">
                                <span className='text-base text-gray-500 lg:text-lg'><Link className='user-link' to='/recovery'>Fogot Password?</Link></span>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </Animation>
    )
}
