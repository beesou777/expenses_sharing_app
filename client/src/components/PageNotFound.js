import React from 'react'
import styles from '../styles/Username.module.css';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import pageNotFoundSvg from '../assets/page_not_found.svg';
import Animation from '../middleware/Animation';

export default function PageNotFound() {
  return (
    <Animation>
      <Toaster position='top-center' reverseOrder='false'></Toaster>
      <div className='h-[100vh] flex flex-col justify-center items-center gap-8 text-center text-xl text-theme-plum'>
        <img src={pageNotFoundSvg} alt="404 Page Not Found" className='w-[250px]' />
        <h6 className='font-bold'>Page Not Found!</h6>
        <Link className='w-full' to='/'><button className={styles.btn} >Home</button></Link>
      </div>
    </Animation>
  )
}
