import React, { useEffect, useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom';
import icon from '../../assets/personal.png';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import convertToBase64 from '../../helper/convert';
import { toast } from 'react-hot-toast';
import { addMember, updateMember, deleteMember } from '../../helper/homeHelper';

import styles from '../../styles/Home.module.css';

export default function Members() {

    const navigate = useNavigate();
    const [apiData] = useOutletContext();
    const [members, setMembers] = useState([]);
    const [memberid, setMemberid] = useState('');
    const [membername, setMembername] = useState('');
    const [membericon, setMembericon] = useState('');
    const [isOpenPopup, setOpenPopup] = useState(false);
    const [isDelete, setDelete] = useState(false);

    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [swipedExpenseIndex, setSwipedExpenseIndex] = useState(-1);

    useEffect(() => {
        if (apiData) {
            setMembers(apiData.members);
        }
    }, [apiData]);

    function handleSearch(e) {
        const keyword = e.target.value;
        const filteredMembers = apiData.members.filter(member => member.membername.toLowerCase().includes(keyword.toLowerCase()));
        setMembers(filteredMembers);
    }

    async function onUpload(e) {
        const base64 = await convertToBase64(e.target.files[0]);
        setMembericon(base64);
    }

    function handleEdit(index) {
        setMemberid(members[index]._id);
        setMembername(members[index].membername);
        setMembericon(members[index].membericon);
        setDelete(false);
        setOpenPopup(true);
    }

    function handleAdd() {
        setMemberid('');
        setMembername('');
        setMembericon('');
        setDelete(false);
        setOpenPopup(true);
    }

    function handleDelete(index) {
        setMemberid(members[index]._id);
        setMembername(members[index].membername);
        setMembericon(members[index].membericon);
        setDelete(true);
        setOpenPopup(true);
    }

    function handleTouchStart(e) {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(e.targetTouches[0].clientX);
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

    async function handleSubmit(e) {
        e.preventDefault();

        if (membername === '') return toast.error('Member Name required!');

        if (isDelete) {
            //delete member
            const values = { memberid };
            let deletePromise = deleteMember(values);
            toast.promise(deletePromise, {
                loading: 'Deleting Member...',
                success: <b>Deleted member Successfully!</b>,
                error: <b>Unable to delete member! Please try again later.</b>
            });
            deletePromise.then(() => navigate(0));
            return;
        }

        if (memberid) {
            //update member
            const values = { memberid, membername, membericon };
            let updatePromise = updateMember(values);
            toast.promise(updatePromise, {
                loading: 'Updating Member...',
                success: <b>Updated member Successfully!</b>,
                error: <b>Unable to update member! Please try again later.</b>
            });
            updatePromise.then(() => navigate(0));
            return;
        }

        //add member
        const values = { membername, membericon };
        let addPromise = addMember(values);
        toast.promise(addPromise, {
            loading: 'Adding Member...',
            success: <b>Added member Successfully!</b>,
            error: <b>Unable to add member! Please try again later.</b>
        });
        addPromise.then(() => navigate(0));
    }


    return (
        <div className={styles.glass + ' px-0 h-full'}>

            {/* Popup Window for Add or Update or Delete */}
            <div className={'add-edit-member-bg bg-black bg-opacity-30 w-screen h-screen fixed z-30 top-0 left-0 ' + (isOpenPopup ? 'visible' : 'invisible')}>
                <div className={'add-edit-member-popup bg-white min-h-[270px] min-w-[270px] rounded-xl shadow-lg flex flex-col items-center p-4 gap-2 '
                    + 'lg:min-w-[500px] absolute top-1/2 left-1/2 translate-x-[-50%] lg:translate-x-[calc(-50%_+_145px)] transition-all duration-500 '
                    + (isOpenPopup ? 'translate-y-[-50%] opacity-100' : 'translate-y-[-100%] opacity-0')}
                >
                    <IoClose className='text-2xl text-theme-blue self-end' onClick={() => setOpenPopup(false)} />
                    <h6 className='heading font-bold text-lg'>{isDelete ? "Delete Member" : memberid ? 'Update Member' : 'Add Member'}</h6>
                    <p className='text-sm text-gray-600 w-3/4 text-center lg:w-full' >
                        {isDelete ? 'Are you sure you want to delete the following user?' : memberid ? 'Edit the following member information:' : 'Fill in the following member information:'}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="profile flex justify-center py-4">
                            <label htmlFor="icon">
                                <img className={styles.icon_img_edit} src={membericon || icon} alt="icon" />
                            </label>
                            <input onChange={onUpload} type="file" accept="image/*" id="icon" name="icon" disabled={isDelete} />
                        </div>

                        <div className="textbox flex flex-col items-center gap-6">
                            <input className={styles.textbox} type="text" placeholder='Member name' name="membername" value={membername} disabled={isDelete} onChange={(e) => setMembername(e.target.value)} />
                            {isDelete && <p className='text-sm  text-theme-plum w-3/4 text-center lg:w-full'>The expense records for this user will also be deleted!</p>}
                            <button className="bg-theme-light-blue text-white text-base text-center w-full max-w-[300px] 
                                                border py-3 rounded-lg shadow-md mx-auto mb-3 lg:text-lg hover:bg-theme-blue" type="submit">{isDelete ? "Delete" : memberid ? 'Update' : 'Add'}</button>
                        </div>
                    </form>

                </div>
            </div>

            <div className='fixed z-20 w-[95%] max-w-[1000px] left-1/2 translate-x-[-50%] lg:w-[calc(95%_-_310px)] lg:translate-x-[calc(-50%_+_145px)]'>
                <div className="title">
                    <h4 className='heading py-1 text-xl font-bold text-center lg:text-2xl lg:mt-5'>Members</h4>
                </div>

                {/* Seach Bar and Add Button */}
                <div className='flex justify-center items-center gap-3'>
                    <div className="search-bar grow flex flex-row gap-2 p-3 rounded-xl my-5 max-w-[250px] shadow-md text-gray-600 bg-white lg:text-lg lg:max-w-[500px]">
                        <MdSearch className='text-gray-500 text-2xl' />
                        <input type='text' placeholder='Search' className='focus:outline-none w-full' onChange={handleSearch} />
                    </div>
                    <div>
                        <button className="text-white p-[16px] rounded-lg shadow-md bg-theme-light-blue hover:bg-theme-blue" onClick={() => handleAdd()}>
                            <FaPlus />
                        </button>
                    </div>
                </div>
            </div>

            <div className='fixed z-10 w-full max-w-[1000px] mobile-h-safe left-1/2 translate-x-[-50%] overflow-hidden pb-[20px] pt-[124px] lg:w-[calc(95%_-_310px)] lg:pt-[152px] lg:h-[calc(100%_-_40px)] lg:translate-x-[calc(-50%_+_145px)] '>
                <div className='h-full overflow-x-hidden overflow-y-auto px-6 text-gray-600 lg:w-full'>

                    {/* Member List */}
                    <div className='member-list grid grid-template-col-250 gap-2 my-5 overflow-hidden'>
                        {
                            members.length === 0 ? <div className='text-lg text-gray-400 text-center'>No member in this account!</div> :
                                members.map((member, index) => (
                                    <div
                                        key={member._id} className="w-full flex justify-between py-2 px-3 bg-white rounded-lg bg-opacity-50 shadow-sm relative"
                                        onTouchStart={handleTouchStart}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={(e) => handleTouchEnd(e, index)}
                                    >
                                        <div className='grow flex items-center gap-5 py-1 text-gray-600 overflow-hidden'>
                                            <img src={member.membericon || icon} alt="icon" className="w-[50px] h-[50px] rounded-full border-2 border-white shadow-md object-cover " />
                                            <span className='whitespace-nowrap overflow-hidden text-ellipsis'>{member.membername}</span>
                                        </div>

                                        <div className={'flex items-center text-2xl absolute w-full h-full top-0 left-0 justify-around bg-white bg-opacity-90 rounded-lg '
                                            + 'md:mx-3 md:w-auto md:bg-transparent md:gap-2 md:justify-center md:relative md:visible transition-all ' + (index === swipedExpenseIndex ? 'visible' : 'invisible translate-x-[50%] md:translate-x-0')} >
                                            <MdEdit className='h-full flex-grow p-4 text-theme-light-blue cursor-pointer md:h-[30px] md:p-0 hover:text-theme-blue' onClick={() => handleEdit(index)} />
                                            <MdDelete className='h-full flex-grow p-4 text-theme-light-plum cursor-pointer border-l-2 border-gray-200 md:border-l-0 md:h-[30px] md:p-0 hover:text-theme-plum' onClick={() => handleDelete(index)} />
                                        </div>
                                    </div>
                                ))}
                    </div>

                </div>

            </div>
        </div>
    )
}
