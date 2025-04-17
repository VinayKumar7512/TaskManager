import React, { useState } from "react";
import { MdOutlineSearch, MdOutlineMenu, MdOutlineNotifications } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className='flex justify-between items-center bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0 shadow-sm'>
      <div className='flex gap-4 items-center'>
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className='text-2xl text-gray-500 block md:hidden hover:text-gray-700 transition-colors'
        >
          <MdOutlineMenu size={24} />
        </button>

        <div 
          className={`w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full transition-all duration-300 ${
            isSearchFocused 
              ? 'bg-white shadow-md ring-1 ring-blue-200' 
              : 'bg-[#f3f4f6]'
          }`}
        >
          <MdOutlineSearch className='text-gray-500 text-xl' />

          <input
            type='text'
            placeholder='Search tasks, projects, or people...'
            className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      <div className='flex gap-4 items-center'>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NotificationPanel />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserAvatar />
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;