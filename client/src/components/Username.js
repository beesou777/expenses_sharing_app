import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import icon from '../assets/group.png';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';
import { useAuthStore } from '../store/authStore';
import paymentsvg from '../assets/payment.svg';
import Animation from '../middleware/Animation';
import logo from '../assets/logo.svg';

import styles from '../styles/Username.module.css';

export default function Username() {

    const navigate = useNavigate();
    const setUsername = useAuthStore(state => state.setUsername);

    const formik = useFormik({
        initialValues: {
            username: ''
        },
        validate: usernameValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            setUsername(values.username);
            navigate('/password');
        }
    })

    return (
        <Animation>
            <Toaster position='top-center' reverseOrder='false'></Toaster>
            <div className="fixed w-full h-full p-5 overflow-y-auto">
                <div className='w-full min-h-full flex flex-row justify-center items-center'>
                    <div className='w-1/2 hidden justify-center items-center lg:flex'>
                        <img src={paymentsvg} alt='Payment illustration' className='w-[80%] max-h-[500px]' />
                    </div>
                    <div className={styles.glass}>
                        <div className="title flex flex-col items-center">
                            <h4 className='logo heading py-1 text-3xl font-bold text-center lg:text-4xl'>Expenses Sharing</h4>
                            <span className='py-4 text-m w-2/3 text-center text-gray-500 lg:text-xl'>
                                Record and Share expenses easily.
                            </span>
                        </div>

                        <form className='py-1' onSubmit={formik.handleSubmit}>
                            <div className="profile flex justify-center pb-4">
                                <img className="w-[100px] p-4" src={logo} alt="icon"/>
                                {/* <div className='icon_img logo heading font-extrabold text-7xl'>%</div> */}

                            </div>

                            <div className="textbox flex flex-col items-center gap-4">
                                <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Account Name' autocapitalize="off"/>
                                <button className={styles.btn} type="submit">Next</button>
                            </div>

                            <div className="text-base py-4 flex flex-wrap justify-center items-center gap-2">
                                <span className='text-gray-500 lg:text-lg'>Don't have an account?</span>
                                <Link className='user-link' to='/register'>Register Now</Link>
                            </div>
                        </form>
                    </div>
                </div>       
            </div>
        </Animation>
    )
}
