import React from "react";
import {
  MdOutlineDashboard,
  MdOutlineTask,
  MdOutlineAnalytics,
  MdOutlineDelete,
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
    setSidebarOpen(false);
  };

  const NavLink = ({ el }) => {
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
      {/* Desktop Sidebar */}
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

      {/* Mobile Sidebar */}
      <div
        className={clsx(
          "md:hidden fixed inset-0 z-40 flex",
          sidebarOpen ? "visible" : "invisible"
        )}
      >
        {/* Overlay */}
        <div
          className={clsx(
            "fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={closeSidebar}
        />

        {/* Sidebar Panel */}
        <div
          className={clsx(
            "relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Task Manager</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
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
    </>
  );
};

export default Sidebar;