import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdOutlineCalendarToday,
  MdOutlineDelete,
  MdOutlineAnalytics,
  MdOutlineCheckCircle,
  MdOutlineAssignment,
  MdOutlinePending,
  MdOutlineDashboard,
  MdOutlineTask,
  MdOutlinePerson
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import { motion } from "framer-motion";

const linkData = [
  {
    title: 'Dashboard',
    icon: <MdOutlineDashboard className="w-6 h-6" />,
    link: '/dashboard'
  },
  {
    title: 'Tasks',
    icon: <MdOutlineTask className="w-6 h-6" />,
    link: '/tasks'
  },
  {
    title: 'Analytics',
    icon: <MdOutlineAnalytics className="w-6 h-6" />,
    link: '/analytics'
  },
  {
    title: 'Trash',
    icon: <MdOutlineDelete className="w-6 h-6" />,
    link: '/trash'
  },
  {
    title: 'Profile',
    icon: <MdOutlinePerson className="w-6 h-6" />,
    link: '/profile'
  }
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    // Check if the current path exactly matches the link path
    const isActive = location.pathname === el.link;
  
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          to={el.link}
          onClick={closeSidebar}
          className={clsx(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
            isActive 
              ? "bg-blue-600 text-white shadow-lg" 
              : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <span className={clsx(
            "flex items-center justify-center",
            isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
          )}>
            {el.icon}
          </span>
          <span className={clsx(
            "font-medium",
            isActive ? "text-white" : "text-gray-700 dark:text-gray-300"
          )}>
            {el.title}
          </span>
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible on desktop, hidden on mobile */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Task Manager</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {sidebarLinks.map((link, index) => (
                  <NavLink key={index} el={link} />
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Only visible when sidebarOpen is true */}
      <div
        className={clsx(
          "md:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Task Manager</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {sidebarLinks.map((link, index) => (
                <NavLink key={index} el={link} />
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;