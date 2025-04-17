import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';
import { motion } from 'framer-motion';
import { MdChevronLeft, MdChevronRight, MdOutlineEvent, MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
      setLoading(false);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      // Skip tasks without a date
      if (!task.date) return false;
      
      try {
        const taskDate = parseISO(task.date);
        return isSameDay(taskDate, date);
      } catch (error) {
        console.error('Error parsing date for task:', task._id, error);
        return false;
      }
    });
  };

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Task Calendar
            </h1>
            <Link
              to="/tasks/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MdAdd className="w-5 h-5" />
              <span>New Task</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <MdChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <MdChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-100 dark:bg-gray-800 p-4 text-center font-semibold text-gray-700 dark:text-gray-300"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {daysInMonth.map((date, index) => {
                const dayTasks = getTasksForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isSelected = isSameDay(date, selectedDate);

                return (
                  <motion.div
                    key={date.toString()}
                    whileHover={{ scale: 0.98 }}
                    className={`
                      min-h-[120px] p-2 bg-white dark:bg-gray-800 
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                      ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                      cursor-pointer
                    `}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`
                        text-sm font-medium mb-1
                        ${isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}
                        ${isSelected ? 'text-blue-600 dark:text-blue-400' : ''}
                      `}>
                        {format(date, 'd')}
                      </span>
                      <div className="flex-1 space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task._id}
                            className="flex items-center gap-2 p-1 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                            <span className="truncate text-gray-700 dark:text-gray-300">{task.title}</span>
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Tasks */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <Link
                  to={`/tasks/new?date=${format(selectedDate, 'yyyy-MM-dd')}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <MdAdd className="w-4 h-4" />
                  <span>Add Task</span>
                </Link>
              </div>

              {selectedDateTasks.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateTasks.map((task) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className={`w-3 h-3 rounded-full mt-1 ${priorityColors[task.priority]}`} />
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">{task.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`
                                px-2 py-0.5 rounded-full text-xs font-medium
                                ${task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                }
                              `}>
                                {task.priority}
                              </span>
                              {task.date && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(parseISO(task.date), 'h:mm a')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/tasks/edit/${task._id}`}
                            className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                          >
                            <MdEdit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No tasks scheduled for this date</p>
                  <Link
                    to={`/tasks/new?date=${format(selectedDate, 'yyyy-MM-dd')}`}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MdAdd className="w-5 h-5" />
                    <span>Add New Task</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar; 