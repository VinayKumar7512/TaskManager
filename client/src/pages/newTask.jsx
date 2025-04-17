import React from 'react';
import TaskForm from '../components/tasks/TaskForm';

const NewTask = () => {
  return (
    <div className="h-full py-4">
      <div className="w-full h-full flex flex-col gap-6 2xl:gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Create New Task</h1>
          <TaskForm />
        </div>
      </div>
    </div>
  );
};

export default NewTask; 