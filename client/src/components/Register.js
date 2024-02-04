import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import icon from '../assets/group.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
import joinSvg from '../assets/join.svg';
import Animation from '../middleware/Animation';

import styles from '../styles/Username.module.css';

export default function Register() {

    const navigate = useNavigate();
    const [file, setFile] = useState();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            email: ""
        },
        validate: registerValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, { icon: file || "" });
            let registerPromise = registerUser(values);
            toast.promise(registerPromise, {
                loading: 'Creating...',
                success: ({msg}) => <b>Registered Successfully! {msg}</b>,
                error: <b>Couldn't register! Please try with another user name.</b>
            });
            registerPromise.then(() => navigate('/'));
        }
    })

    /** Formik doesn't support file upload so we need to create this handler */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

    return (
        <Animation>
            <Toaster position='top-center' reverseOrder='false'></Toaster>
            <div className="fixed w-full h-full p-5 overflow-y-auto">
                <div className='w-full min-h-full flex flex-row justify-center items-center'>
                    <div className='w-1/2 hidden justify-center items-center lg:flex'>
                        <img src={joinSvg} alt='Payment illustration' className='w-[80%] max-h-[500px]' />
                    </div>
                    <div className={styles.glass}>
                        <div className="title flex flex-col items-center">
                            <h4 className='heading text-2xl font-bold text-center lg:text-3xl'>Create Account</h4>
                            <span className='py-4 text-base w-2/3 text-center text-gray-500 lg:text-lg'>
                                Register an account to be shared with your <nobr>group members.</nobr>
                            </span>
                        </div>

                        <form className='py-1' onSubmit={formik.handleSubmit}>
                            <div className="profile flex justify-center pb-4">
                                <label htmlFor="icon">
                                    <img className={styles.icon_img} src={file || icon} alt="icon" />
                                </label>
                                <input onChange={onUpload} type="file" accept="image/*" id="icon" name="icon" />
                            </div>

                            <div className="textbox flex flex-col items-center gap-4">
                                <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Account Name *' autocapitalize="off"/>
                                <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder='Password *' />
                                <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email *' />
                                <button className={styles.btn} type="submit">Register</button>
                            </div>
                            
                            <div className="text-base py-4 flex flex-wrap justify-center items-center gap-2">
                                <span className='text-gray-500 lg:text-lg'>Already have an account?</span>
                                <Link className='user-link' to='/'>Login</Link>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </Animation>
    )
}
