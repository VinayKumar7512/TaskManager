import React from 'react';
import TaskList from '../components/tasks/TaskList';

const Tasks = () => {
  return (
    <div className="h-full py-4">
      <div className="w-full h-full flex flex-col gap-6 2xl:gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Tasks;