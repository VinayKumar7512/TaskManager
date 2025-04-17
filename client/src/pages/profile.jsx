import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MdPerson, MdEmail, MdCalendarToday, MdEdit } from 'react-icons/md';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getInitials } from '../utils';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: 'Loading...',
    role: 'Loading...',
    createdAt: new Date().toISOString(),
    isActive: true,
    title: 'Loading...',
    id: 'Loading...'
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || 'Not provided',
        email: user.email || 'Not provided',
        role: user.role || 'User',
        createdAt: user.createdAt || new Date().toISOString(),
        isActive: user.isActive !== undefined ? user.isActive : true,
        title: user.title || 'Not provided',
        id: user.id || user._id || 'Unknown ID'
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="h-full py-4">
        <div className="w-full h-full flex flex-col gap-6 2xl:gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">Please log in to view your profile.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full py-4">
      <div className="w-full h-full flex flex-col gap-6 2xl:gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Link to="/settings" className="text-blue-600 hover:underline flex items-center gap-1">
              <MdEdit size={18} />
              <span>Edit Settings</span>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {getInitials(userData.name)}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{userData.name}</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MdEmail className="text-gray-500" />
                    <span className="text-gray-700">{userData.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MdPerson className="text-gray-500" />
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">
                        Role: <span className="capitalize bg-blue-50 px-2 py-1 rounded-md inline-block">{userData.role}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MdCalendarToday className="text-gray-500" />
                    <span className="text-gray-700">Joined {moment(userData.createdAt).format('MMMM YYYY')}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Account Status</h3>
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userData.isActive 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}>
                      {userData.isActive ? "Active" : "Inactive"}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {userData.isActive ? "Your account is active" : "Your account is inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 