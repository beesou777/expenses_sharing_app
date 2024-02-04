import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom';
import forgetPasswordSvg from '../assets/forgot_password.svg';
import Animation from '../middleware/Animation';

import styles from '../styles/Username.module.css';

export default function Recovery() {

    const navigate = useNavigate();
    const { username } = useAuthStore(state => state.auth);
    const [OTP, setOTP] = useState();
    const [remainSecond, setRemainSecond] = useState(0); // allow to resend only after 60 sec
    const [resetDisabled, setResetDisabled] = useState(false); //prevent resend multiple time at once

    useEffect(() => {
        setResetDisabled(true);
        let sendPromise = generateOTP(username);
        toast.promise(sendPromise, {
            loading: "Sending email...",
            success: <b>OTP has been send to your email!</b>,
            error: <b>Some issue happened when sending OTP to your email. Please try again later.</b>
        });
        sendPromise.then(()=> {
            setRemainSecond(60);
        })
        .finally(() => {
            setResetDisabled(false);
        });

    }, [username]);

    useEffect(()=> {
        let countdown = setInterval(()=> {
            if(remainSecond > 0) {
                setRemainSecond((prevSecond) => prevSecond - 1);
            } 
            else {
                clearInterval(countdown);
            }
        }, 1000);
        return () => clearInterval(countdown);
    }, [remainSecond]);
    

    const onSubmit = async (e) => {
        e.preventDefault();

        let verifyPromise = verifyOTP({ username, code: OTP });
        toast.promise(verifyPromise, {
            loading: "Verifying...",
            success: <b>OTP verified!</b>,
            error: <b>Incorrect OTP. Please check email again!</b>
        });
        verifyPromise.then(() => {
            navigate('/reset');
        })
    }

    const resendOTP = async () => {
        setResetDisabled(true);
        let sendPromise = generateOTP(username);
        toast.promise(sendPromise, {
            loading: "Sending email...",
            success: <b>OTP has been send to your email!</b>,
            error: <b>Some issue happened when sending OTP to your email. Please try again later.</b>
        });
        sendPromise.then(()=> {
            setRemainSecond(60);
        })
        .finally(() => {
            setResetDisabled(false);
        });
    };

    return (
        <Animation>
            <Toaster position='top-center' reverseOrder='false'></Toaster>
            <div className="fixed w-full h-full p-5 overflow-y-auto">
                <div className='w-full min-h-full flex flex-row justify-center items-center'>
                    <div className='w-1/2 hidden justify-center items-center lg:flex'>
                        <img src={forgetPasswordSvg} alt='Payment illustration' className='w-[80%] max-h-[500px]' />
                    </div>
                    <div className={styles.glass}>
                        <div className="title flex flex-col items-center">
                            <h4 className='heading text-2xl font-bold text-center lg:text-3xl'>Account Recovery</h4>
                            <span className='py-4 text-base w-2/3 text-center text-gray-500 lg:text-lg'>
                                Enter OTP to reset password.
                            </span>
                        </div>

                        <form className='py-10' onSubmit={onSubmit}>
                            <div className="textbox flex flex-col items-center gap-4">
                                <div className="input text-center">
                                    <p className='text-sm text-gray-500 text-center py-4 lg:text-m'>
                                        Enter 6 digital OTP sent to your <nobr>email address</nobr>
                                    </p>
                                    <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" maxLength="6" placeholder='OTP' />
                                </div>
                                <button className={styles.btn} type="submit">Verify</button>
                            </div>

                            <div className="text-base py-4 flex flex-wrap justify-center items-center gap-2">
                                <span className='text-base text-gray-500 lg:text-lg'>Didn't receieve OTP?</span>
                                {remainSecond > 0 ? 
                                    <span className="text-gray-400">Resend OTP in {remainSecond}s</span> 
                                    : <button className={resetDisabled ? 'text-gray-400' : 'user-link'} onClick={resendOTP} disabled={resetDisabled} type="button">Resend OTP</button>}
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </Animation>
    )
}
