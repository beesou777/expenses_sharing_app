import React, { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import icon from '../../assets/group.png';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidate } from '../../helper/validate';
import convertToBase64 from '../../helper/convert';
import { updateUser } from '../../helper/helper';
import { useAuthStore } from '../../store/authStore';

import styles from '../../styles/Home.module.css';

export default function Profile() {

    const navigate = useNavigate();
    const [file, setFile] = useState();
    const [apiData] = useOutletContext();
    const setUsername = useAuthStore(state => state.setUsername);

    const formik = useFormik({
        initialValues: {
            groupname: apiData?.groupname || '',
            email: apiData?.email || ''
        },
        enableReinitialize: true, // this is important to initialize with apiData!
        validate: profileValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, { icon: file || apiData?.icon || '' });
            console.log(values);
            let updatePromise = updateUser(values);
            toast.promise(updatePromise, {
                loading: "Updating...",
                success: <b>Account Details updated!</b>,
                error: <b>Unable to update the account details. Please try again!</b>
            });
            updatePromise.then(() => navigate(0));
        }
    })

    /** Formik doesn't support file upload so we need to create this handler */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

    const resetPassword = async () => {
        setUsername(apiData?.username);
        navigate('/recovery');
    }

    return (
        <div className={styles.glass + ' px-0 h-full'}>

            <div className='fixed z-20 w-[95%] max-w-[1000px] left-1/2 translate-x-[-50%] lg:w-[calc(95%_-_310px)] lg:translate-x-[calc(-50%_+_145px)]'>
                <div className="title">
                    <h4 className='heading py-1 text-xl font-bold text-center lg:text-2xl lg:mt-5'>Account Details</h4>
                </div>
            </div>

            <div className='fixed z-10 w-full max-w-[1000px] mobile-h-safe left-1/2 translate-x-[-50%] overflow-hidden pb-[20px] pt-[50px] lg:w-[calc(95%_-_310px)] lg:pt-[60px] lg:h-[calc(100%_-_40px)] lg:translate-x-[calc(-50%_+_145px)] '>
                <div className='h-full overflow-x-hidden overflow-y-auto px-6 text-gray-600 lg:w-full'>

                    <form className='py-1' onSubmit={formik.handleSubmit}>
                        <div className="profile flex justify-center py-4">
                            <label htmlFor="icon">
                                <img className={styles.icon_img_edit} src={file || apiData?.icon || icon} alt="icon" />
                            </label>
                            <input onChange={onUpload} type="file" accept="image/*" id="icon" name="icon" />
                        </div>

                        <div className="textbox mx-auto w-max flex flex-col gap-6">
                            <div className='flex flex-col gap-3 relative z-0 sm:flex-row sm:my-1 sm:items-center sm:justify-between sm:max-w-[380px]'>
                                <label className='text-gray-600 text-base whitespace-nowrap lg:text-lg'>Account Name: </label>
                                <div {...formik.getFieldProps('groupname')} className={styles.textbox_disable}>{apiData?.username}</div>
                            </div>
                            <div className='flex flex-col gap-3 relative z-0 sm:flex-row sm:my-1 sm:items-center sm:justify-between sm:max-w-[380px]'>
                                <label htmlFor='groupname' className='text-gray-600 text-base whitespace-nowrap lg:text-lg'>Group Name: </label>
                                <input {...formik.getFieldProps('groupname')} className={styles.textbox} type="text" placeholder='Group Name' id='groupname' />
                            </div>
                            <div className='flex flex-col gap-3 relative z-0 sm:flex-row sm:my-1 sm:items-center sm:justify-between sm:max-w-[380px]'>
                                <label htmlFor='email' className='text-gray-600 text-base whitespace-nowrap lg:text-lg'>Email*: </label>
                                <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email *' id='email' />
                            </div>
                            {/* <input {...formik.getFieldProps('groupname')} className={styles.textbox} type="text" placeholder='Group Name' id='groupname' /> */}
                            {/* <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email *' id='email' /> */}
                            <button className='bg-theme-light-blue text-white text-base text-center w-3/4 max-w-[200px] 
                                 border py-3 rounded-lg shadow-md mt-5 mb-5 mx-auto lg:text-lg hover:bg-theme-blue' type="submit">Update</button>
                        </div>
                    </form>
                    <div className='text-center'>
                        <button className='user-link' onClick={resetPassword}>Reset Password</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
