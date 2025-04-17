import React from 'react';
import { useSelector } from 'react-redux';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const currentTime = new Date();
  const hours = currentTime.getHours();
  
  // Determine greeting based on time of day
  let greeting = 'Good morning';
  if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon';
  } else if (hours >= 17 || hours < 5) {
    greeting = 'Good evening';
  }
  
  // Get current date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = currentTime.toLocaleDateString('en-US', options);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden mb-6"
    >
      <div className="p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {greeting}, {user?.name || 'User'}!
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Here's what's happening with your tasks today.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
              <FaRegCalendarAlt className="text-blue-200" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
              <FaRegClock className="text-blue-200" />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-1">Tasks Due Today</h3>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-1">Completed This Week</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-1">Team Activity</h3>
            <p className="text-3xl font-bold">8</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Welcome; 