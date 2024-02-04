import React, {useState} from 'react'
import { Outlet, NavLink, useOutletContext, useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { shareExpenses } from '../../helper/homeHelper';
import { toast } from 'react-hot-toast';

import styles from '../../styles/Home.module.css';

export default function Summary() {

  const navigate = useNavigate();
  const [apiData] = useOutletContext();
  const [isOpenSettleDebtsPopup, setOpenSettleDebtsPopup] = useState(false);

  async function handleShareExpense() {
    let sharePromise = shareExpenses();
    toast.promise(sharePromise, {
      loading: 'Settling Debts...',
      success: <b>All the expenses have been marked as shared!</b>,
      error: <b>Unable to settle debts! Please try again later.</b>
    });
    sharePromise.then(() => navigate(0));
  }

  return (
    <div className={styles.glass + ' px-0 h-full'}>

      {/* Popup Window for No Member Case */}
      {apiData?.members.length === 0 &&
        <div className='add-edit-member-bg bg-black bg-opacity-30 w-screen h-screen fixed z-30 top-0 left-0'>
          <div className={'add-edit-member-popup bg-white w-[90%] rounded-xl shadow-lg flex flex-col items-center py-10 gap-10 '
            + 'sm:w-[400px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] lg:translate-x-[calc(-50%_+_145px)]'}
          >
            <h6 className='heading font-bold text-lg'>Welcome!</h6>
            <p className='text-base text-gray-600 max-w-[200px] text-center ' >
              To get started, add members to this group account.
            </p>
            <p className='text-base text-gray-600 max-w-[200px] text-center ' >
              Then, add expenses so that we can help you all sharing expenses!
            </p>
            <button
              className="bg-theme-light-blue text-white text-base text-center w-full max-w-[250px] border py-3 rounded-lg shadow-md mx-auto mb-3 lg:text-lg hover:bg-theme-blue"
              onClick={() => navigate('members')}
            >
              Navigate to Members Page
            </button>
          </div>
        </div>
      }

      {/* Popup Window for settle debts */}
      {isOpenSettleDebtsPopup &&
        <div className='bg-black bg-opacity-30 w-screen h-screen fixed z-30 top-0 left-0'>
          <div className={'bg-white w-[90%] rounded-xl shadow-lg flex flex-col items-center p-4 gap-2 '
            + 'sm:w-[400px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] lg:translate-x-[calc(-50%_+_145px)]'}
          >
            <IoClose className='text-2xl text-theme-blue self-end' onClick={() => setOpenSettleDebtsPopup(false)} />
            <h6 className='heading font-bold text-lg'>Settled Debts</h6>
            <p className='text-base text-gray-600 max-w-[270px] text-center my-3' >
              Please make sure everyone on the list has paid the correct amounts to the corresponding member(s).
            </p>
            <p className='text-base text-gray-600 max-w-[270px] text-center my-3' >
              After clicking the confirm button, all the current expenses will be marked as 'shared', which is <span className='text-theme-plum'>non-reversible</span>.
            </p>
            <button
              className="bg-theme-light-blue text-white text-base text-center w-full max-w-[250px] border py-3 rounded-lg shadow-md mx-auto mb-4 lg:text-lg hover:bg-theme-blue"
              onClick={handleShareExpense}
            >
              Confirm
            </button>
          </div>
        </div>
      }

      <div className='fixed z-20 w-[95%] max-w-[1000px] left-1/2 translate-x-[-50%] lg:w-[calc(95%_-_310px)] lg:translate-x-[calc(-50%_+_145px)]'>

        <div className="title">
          <h4 className='heading py-1 text-xl font-bold text-center lg:text-2xl lg:mt-5'>Summary</h4>
        </div>

        <div className='flex text-base justify-around my-2 text-theme-light-blue shadow-sm lg:text-lg lg:my-5'>
          <NavLink to='' end className={({ isActive }) => 'leading-10 hover:text-theme-blue ' + (isActive && 'text-theme-blue border-b-4 border-theme-blue')}>Share Expenses</NavLink>
          <NavLink to='expenses-analysis' className={({ isActive }) => 'leading-10  hover:text-theme-blue ' + (isActive && 'text-theme-blue border-b-4 border-theme-blue')}>Expenses Analysis</NavLink>
        </div>

      </div>

      <Outlet context={[apiData, setOpenSettleDebtsPopup]} />

    </div>
  )
}
