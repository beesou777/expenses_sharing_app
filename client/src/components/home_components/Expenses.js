import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingBasket, FaHamburger, FaHome, FaFaucet, FaIcons, FaBus, FaShieldAlt, FaQuestion } from 'react-icons/fa';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { dateStringFormat, currencyFormatter, deleteExpense } from '../../helper/homeHelper';
import icon from '../../assets/personal.png';
import { useOutletContext, useNavigate } from 'react-router-dom';
import loadingsvg from '../../assets/loading.svg';
import { BiChevronRight, BiChevronDown } from 'react-icons/bi';
import { TbSortAscending, TbSortDescending } from 'react-icons/tb';
import { useExpenseUpdateStore } from '../../store/expenseUpdateStore';
import serverErrorSvg from '../../assets/server_error.svg';

import styles from '../../styles/Home.module.css';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export default function Expenses() {

  const navigate = useNavigate();
  const [apiData] = useOutletContext();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState('');
  const [isLastPage, setIsLastPage] = useState(false);
  const [query, setQuery] = useState({ keyword: '', sort: 'paid_date', sort_ascending: false, show_shared: true, from_date: '', to_date: '', per_page: 5, page: 1 });
  const searchInput = useRef();
  const scrollableDiv = useRef();
  const [isOpenOptions, setOpenOptions] = useState(false);

  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isOpenPopup, setOpenPopup] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [swipedExpenseIndex, setSwipedExpenseIndex] = useState(-1);

  const setExpense = useExpenseUpdateStore(state => state.setExpense);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);
        if(query.page===1) setExpenses([]);

        const token = localStorage.getItem('token');
        if (!token) throw new Error('UnAuthorized Access!');
        const { data, headers } = await axios.get(`/api/getExpenses`, { headers: { "Authorization": `Bearer ${token}` }, params: query });

        setExpenses(prev => [...prev, ...data]);

        setIsLastPage(query.page >= headers['x-totalpage']);
        setIsLoading(false);
      }
      catch (error) {
        setServerError(error);
      }
    }

    fetchData();

  }, [query]);

  const categoryCommonClass = 'text-[60px] p-4 rounded-lg text-white text-opacity-90 shadow-md m-2 flex-shrink-0 ';

  const categories = [
    {
      name: "Grocery",
      icon: <FaShoppingBasket className={categoryCommonClass + 'bg-[#7bdff2]'} />,
    },
    {
      name: "Food",
      icon: <FaHamburger className={categoryCommonClass + 'bg-[#f1c0e8]'} />,
    },
    {
      name: "Housing",
      icon: <FaHome className={categoryCommonClass + 'bg-[#E78EA9]'} />,
    },
    {
      name: "Utilities",
      icon: <FaFaucet className={categoryCommonClass + 'bg-[#fbc4ab]'} />,
    },
    {
      name: "Entertainment",
      icon: <FaIcons className={categoryCommonClass + 'bg-[#CDB699]'} />,
    },
    {
      name: "Transportation",
      icon: <FaBus className={categoryCommonClass + 'bg-[#ccd5ae]'} />,
    },
    {
      name: "Insurance",
      icon: <FaShieldAlt className={categoryCommonClass + 'bg-[#a1c5e7]'} />,
    },
    {
      name: "Others",
      icon: <FaQuestion className={categoryCommonClass + 'bg-[#bcb6f6]'} />,
    }
  ];

  function scrollToTop() {
    scrollableDiv.current.scroll({
      top: 0,
      behavior: "auto"
    });
  }

  function handleSearch(e) {
    e.preventDefault();
    setQuery(prev => ({ ...prev, keyword: e.target[0].value, page: 1 }));
    scrollToTop();
  }

  function handleFromDate(e) {
    setQuery(prev => ({ ...prev, from_date: e.target.value, page: 1 }));
    scrollToTop();
  }

  function handleToDate(e) {
    setQuery(prev => ({ ...prev, to_date: e.target.value, page: 1 }));
    scrollToTop();
  }

  function handleSortOrder(e) {
    setQuery(prev => ({ ...prev, sort_ascending: !prev.sort_ascending, page: 1 }));
    scrollToTop();
  }

  function handleSort(sort) {
    setQuery(prev => ({ ...prev, sort, page: 1 }));
    scrollToTop();
  }

  function handleShowShared() {
    setQuery(prev => ({ ...prev, show_shared: !prev.show_shared, page: 1 }));
    scrollToTop();
  }

  function clearFilters() {
    searchInput.current.value = '';
    setQuery({ keyword: '', sort: 'paid_date', sort_ascending: false, show_shared: true, from_date: '', to_date: '', per_page: 5, page: 1 });
    setOpenOptions(false);
    scrollToTop();
  }


  function handleTouchStart(e) {
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e) {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  function handleTouchEnd(e, index) {
    if (touchStart - touchEnd > 150) {
      setSwipedExpenseIndex(index);
    }

    if (touchStart - touchEnd < -150) {
      setSwipedExpenseIndex(-1);
    }
  }

  function handleDelete(index) {
    setOpenPopup(true);
    setExpenseToDelete(expenses[index]);
  }

  async function handleEdit(index) {
    setExpense(expenses[index]);
    navigate('../update-expense');
  }


  /** Confirm delete */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!expenseToDelete) return toast.error('Member Name required!');

    let deletePromise = deleteExpense({ expenseid: expenseToDelete._id });
    toast.promise(deletePromise, {
      loading: 'Deleting Expense...',
      success: <b>Deleted expense Successfully!</b>,
      error: <b>Unable to delete expense! Please try again later.</b>
    });
    deletePromise.then(() => navigate(0));
    return;
  }

  function loadMore() {
    setQuery(prev => ({ ...prev, page: prev.page + 1 }));
  }

  function showMember(memberId) {
    const member = apiData?.members.find(member => member._id === memberId);
    if (!member) return;
    return (
      <div className='flex items-center gap-2 text-gray-600 text-xs overflow-hidden sm:text-sm'>
        <img src={member.membericon || icon} alt="icon" className="w-[35px] h-[35px] rounded-full border-2 my-2 border-white shadow-md object-cover sm:w-[40px] sm:h-[40px]" />
        <span className='whitespace-nowrap overflow-hidden text-ellipsis'>{member.membername}</span>
      </div>
    );
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
              onClick={() => navigate('../members')}
            >
              Navigate to Members Page
            </button>
          </div>
        </div>
      }

      {/* Popup Window for Add or Update or Delete */}
      <div className={'add-edit-member-bg bg-black bg-opacity-30 w-screen h-screen fixed z-30 top-0 left-0 ' + (isOpenPopup ? 'visible' : 'invisible')}>
        <div className={'add-edit-member-popup bg-white w-[90%] rounded-xl shadow-lg flex flex-col items-center p-4 gap-2 '
          + 'sm:w-[600px] absolute top-1/2 left-1/2 translate-x-[-50%] lg:translate-x-[calc(-50%_+_145px)] transition-all duration-500 '
          + (isOpenPopup ? 'translate-y-[-50%] opacity-100' : 'translate-y-[-100%] opacity-0')}
        >
          <IoClose className='text-2xl text-theme-blue self-end' onClick={() => setOpenPopup(false)} />
          <h6 className='heading font-bold text-lg'>Delete Expense</h6>
          <p className='text-sm text-gray-600 w-3/4 text-center ' >
            Are you sure you want to delete the following user?
          </p>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="expense flex justify-center py-4">
              <div className={"w-full flex justify-between gap-4 p-3 rounded-lg bg-opacity-50"}>

                <div className='w-full flex items-center gap-3 text-gray-600 flex-grow'>

                  {/* category */}
                  {categories.find((cat) => cat.name === expenseToDelete?.category)?.icon}

                  {/* expense info */}
                  <div className='flex-grow overflow-hidden sm:w-full sm:grid sm:items-center sm:gap-2 grid-template-col-expense'>
                    <h6 className='text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis'>{expenseToDelete?.description}</h6>
                    <p className='text-xs text-gray-400'>{expenseToDelete && dateStringFormat(expenseToDelete.date)}</p>
                    {expenseToDelete && showMember(expenseToDelete.member)}
                  </div>

                  {/* expense amount */}
                  <div className='heading text-sm font-bold w-[90px] flex-shrink-0 mr-3 text-right'>
                    {currencyFormatter.format(expenseToDelete?.amount)}
                    {expenseToDelete?.isShared && (<p className='text-sm'>(shared)</p>)}
                  </div>

                </div>
              </div>
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <button className="bg-theme-light-blue text-white text-base text-center w-full max-w-[250px] 
                                                border py-3 rounded-lg shadow-md mx-auto mb-3 lg:text-lg hover:bg-theme-blue" type="submit">Delete</button>
            </div>
          </form>
        </div>
      </div>


      <div className='fixed z-20 w-[95%] max-w-[1000px] left-1/2 translate-x-[-50%] lg:w-[calc(95%_-_310px)] lg:translate-x-[calc(-50%_+_145px)]'>
        <div className="title">
          <h4 className='heading py-1 text-xl font-bold text-center lg:text-2xl lg:mt-5'>Expense Records</h4>
        </div>

        {/* Seach Bar and From To Date */}
        <div className='text-sm max-w-[450px] mx-auto flex flex-col my-5 gap-3 text-gray-600 justify-center items-center lg:max-w-full lg:flex-row lg:gap-8'>

          {/* search bar */}
          <form className="search-bar w-full flex flex-row gap-2 p-3 rounded-xl shadow-md text-gray-600 bg-white" onSubmit={handleSearch}>
            <input ref={searchInput} type='text' placeholder='Search' className='focus:outline-none w-full' name='keyword' id='keyword' />
            <button aria-label='search'><MdSearch className='text-2xl' /></button>
          </form>

          {/* open option */}
          <div className='w-full flex lg:hidden'>
            <button className='flex-grow p-2 flex items-center lg:hidden' onClick={() => setOpenOptions(prev => !prev)}>
              {isOpenOptions ? <BiChevronDown className='text-2xl text-theme-blue' /> : <BiChevronRight className='text-2xl text-theme-blue' />}  Options
            </button>
            <button className='text-theme-plum p-2 hover:underline' onClick={clearFilters}>
              Clear Filters
            </button>
          </div>


          {/* From to date */}
          <div className={'from-to-date w-min flex-wrap justify-end gap-2 md:flex-nowrap ' + (isOpenOptions ? 'flex' : 'hidden lg:flex')}>
            <nobr>From: &nbsp;
              <input type='date' placeholder='From' className="bg-white min-w-[150px] min-h-[48px] rounded-xl shadow-md p-3 outline-none appearance-none" value={query.from_date} onChange={handleFromDate} />
            </nobr>
            <nobr>To: &nbsp;
              <input type='date' placeholder='From' className="bg-white min-w-[150px] min-h-[48px] rounded-xl shadow-md p-3 outline-none appearance-none" value={query.to_date} onChange={handleToDate} />
            </nobr>
          </div>
        </div>

        {/* sort & show Shared */}
        <div className={'text-sm flex flex-col my-5 gap-4 text-gray-500 justify-center items-center lg:max-w-full lg:flex-row lg:gap-8 ' + (isOpenOptions ? 'flex' : 'hidden lg:flex')}>

          {/* sort */}
          <div className='text-sm flex gap-2 justify-center items-center'>
            <label htmlFor='sortOrder'>
              {query.sort_ascending ? <TbSortAscending className='text-white text-4xl p-2 bg-theme-light-blue rounded-full shadow-lg cursor-pointer hover:bg-theme-blue' />
                : <TbSortDescending className='text-white text-4xl p-2 bg-theme-light-blue rounded-full shadow-md cursor-pointer hover:bg-theme-blue' />}
            </label>
            <input type='checkbox' id='sortOrder' className='hidden'
              checked={query.sort_ascending}
              onChange={handleSortOrder}
            />

            Sort: &nbsp;
            <div className='text-sm border-4 rounded-xl bg-theme-extralight-blue border-theme-extralight-blue'>
              <button
                className={'p-2 rounded-xl ' + (query.sort === 'paid_date' ? 'text-theme-blue bg-white' : 'text-white')}
                disabled={query.sort === 'paid_date'}
                onClick={() => handleSort('paid_date')}
              >
                Paid Date
              </button>
              <button
                className={'p-2 rounded-xl ' + (query.sort === 'added_date' ? 'text-theme-blue bg-white' : 'text-white')}
                disabled={query.sort === 'added_date'}
                onClick={() => handleSort('added_date')}
              >
                Added Date
              </button>
            </div>

          </div>

          {/* show shared */}
          <button
            className={'text-sm px-4 py-3 rounded-full flex border-[4px] ' + (!query.show_shared ? 'border-white bg-theme-light-blue text-white hover:bg-theme-blue' : 'border-white bg-white text-gray-300 hover:bg-gray-100')}
            onClick={handleShowShared}
          >
            Unshared Expense Only
          </button>

          {/* clear for lg screen */}
          <button
            className='text-sm hidden lg:flex px-5 py-3 rounded-full outline-none text-white bg-theme-light-plum hover:bg-theme-plum'
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>


      <div className={'fixed z-10 w-full max-w-[1000px] mobile-h-safe left-1/2 translate-x-[-50%] overflow-hidden pb-[20px] pt-[176px] lg:w-[calc(95%_-_310px)] lg:pt-[212px] lg:h-[calc(100%_-_40px)] lg:translate-x-[calc(-50%_+_145px)] ' + (isOpenOptions && 'pt-[410px] lg:pt-[212px]')}>

        <div className='h-full overflow-x-hidden overflow-y-auto px-4 text-gray-600 lg:w-full' ref={scrollableDiv}>
          {/* Expenses List */}
          <div className='expense-list my-5 flex flex-col gap-2'>

            {/* Each expense record */}
            {expenses?.length === 0 && !isLoading && !serverError ? <div className='text-lg text-gray-400 text-center'>No expense record!</div> :
              expenses?.map((expense, index) => (
                <div
                  key={expense._id}
                  className={"w-full p-3 bg-white rounded-lg bg-opacity-50 shadow-sm relative flex items-center justify-between " + (expense.isShared && 'opacity-60')}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => handleTouchEnd(e, index)}
                >

                  <div className='w-full flex justify-between items-center gap-3 text-gray-600'>

                    {/* category */}
                    {categories.find((cat) => cat.name === expense.category).icon}

                    {/* expense info */}
                    <div className='flex-grow overflow-hidden sm:w-full sm:grid sm:items-center sm:gap-2 grid-template-col-expense'>
                      <h6 className='text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis'>{expense.description}</h6>
                      <p className='text-xs text-gray-400 sm:text-sm'>{dateStringFormat(expense.date)}</p>
                      {showMember(expense.member)}
                    </div>

                    {/* expense amount */}
                    <div className='heading text-base font-bold w-[90px] flex-shrink-0 mr-3 text-right'>
                      {currencyFormatter.format(expense.amount)}
                      {expense.isShared && (<p className='text-sm'>(shared)</p>)}
                    </div>

                  </div>

                  <div className={'flex items-center text-2xl absolute w-full h-full top-0 left-0 justify-around bg-white bg-opacity-90 rounded-lg '
                    + 'md:mx-3 md:w-auto md:bg-transparent md:gap-2 md:justify-center md:relative md:visible transition-all ' + (index === swipedExpenseIndex ? 'visible' : 'invisible translate-x-[50%] md:translate-x-0')} >
                    <MdEdit className='h-full flex-grow p-8 text-theme-light-blue cursor-pointer md:h-[30px] md:flex-grow-0 md:p-0 hover:text-theme-blue' onClick={() => handleEdit(index)} />
                    <MdDelete className='h-full flex-grow p-8 text-theme-light-plum cursor-pointer border-l-2 border-gray-200 md:border-l-0 md:flex-grow-0 md:h-[30px] md:p-0 hover:text-theme-plum' onClick={() => handleDelete(index)} />
                  </div>

                </div>

              ))}

          </div>

          {isLoading && (
            <div className='flex justify-center'>
              <img src={loadingsvg} alt='loading' className='h-[100px] lg:h-[150px]' />
            </div>
          )}

          {serverError && (
            <div className='flex flex-col justify-center items-center gap-4 text-center text-xl text-theme-plum'>
              <img src={serverErrorSvg} alt='server error' className='w-[250px]' />
              <h6 className='font-bold'>Internal Server Error</h6>
              <p>Sorry! Something went wrong.</p>
            </div>
          )}

          {/* Load more */}
          {!isLoading && expenses?.length > 0 &&
            <div className='text-center'>
              <button className='text-lg' onClick={loadMore} disabled={isLastPage}>{isLastPage ? (<span className='text-gray-400'>- End of Expense Records -</span>) : (<span className='user-link'>Load more...</span>)}</button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
