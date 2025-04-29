
import { useContext } from 'react';
import { TasksContext } from '@/context/TasksContext';
import { TaskFilter, Task } from '@/types';

export const useTasks = () => {
  const context = useContext(TasksContext);
  
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  
  const { tasks, filter, ...rest } = context;
  
  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  return { ...rest, tasks: filteredTasks, filter };
};
