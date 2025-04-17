import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { logout } from "../redux/slices/authSlice";
import { toast } from "sonner";

const UserAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutHandler = () => {
    try {
      localStorage.removeItem('token');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/log-in');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const userInitials = user?.name ? getInitials(user.name) : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 2xl:w-12 2xl:h-12 rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="text-white font-semibold text-lg">
          {userInitials}
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-[9999]"
          style={{ position: 'absolute', top: '100%', right: 0 }}
        >
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaUser className="mr-2" />
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/change-password');
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaUserLock className="mr-2" />
              Change Password
            </button>
            <button
              type="button"
              onClick={() => {
                logoutHandler();
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <IoLogOutOutline className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;