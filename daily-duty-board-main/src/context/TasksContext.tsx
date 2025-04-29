import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskFilter, TasksContextType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from './AuthContext';

// Mock initial tasks data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project requirements',
    description: 'Finish the documentation for the new feature set',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '2',
    title: 'Weekly team meeting',
    description: 'Discuss progress and roadblocks with the team',
    completed: true,
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    userId: '1',
  },
  {
    id: '3',
    title: 'Review pull requests',
    description: 'Check and approve pending PRs for the frontend',
    completed: false,
    priority: 'low',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    userId: '1',
  },
  {
    id: '4',
    title: 'Learn TypeScript',
    description: 'Complete online course module 3',
    completed: false,
    priority: 'medium',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    userId: '2',
  },
  {
    id: '5',
    title: 'Update portfolio website',
    description: 'Add recent projects and update bio',
    completed: true,
    priority: 'low',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    userId: '2',
  },
];

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  setFilter: () => {},
});

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const { toast } = useToast();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadTasks = () => {
      try {
        setIsLoading(true);
        
        // Get tasks from localStorage or use initialTasks
        const storedTasks = localStorage.getItem('tasks');
        let loadedTasks = storedTasks ? JSON.parse(storedTasks) : initialTasks;
        
        // Filter tasks for current user
        if (user) {
          loadedTasks = loadedTasks.filter((task: Task) => task.userId === user.id);
        }
        
        setTasks(loadedTasks);
      } catch (err: any) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load tasks',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [user, toast]);

  const saveTasksToStorage = (updatedTasks: Task[]) => {
    // In a real app, we'd send this to an API
    // For now, store in localStorage
    const allTasks = localStorage.getItem('tasks') 
      ? JSON.parse(localStorage.getItem('tasks') || '[]')
      : initialTasks;
      
    // Update tasks for current user, keep other users' tasks
    const otherUsersTasks = user 
      ? allTasks.filter((task: Task) => task.userId !== user.id)
      : [];
      
    const tasksToSave = [...otherUsersTasks, ...updatedTasks];
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
    
    // Update state with user's tasks only
    return updatedTasks;
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setIsLoading(true);
      setError(null);
      
      const newTask: Task = {
        ...taskData,
        id: uuidv4(),
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      
      const updatedTasks = [...tasks, newTask];
      const savedTasks = saveTasksToStorage(updatedTasks);
      
      setTasks(savedTasks);
      toast({
        title: 'Task added',
        description: 'Your task has been added successfully.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to add task',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setIsLoading(true);
      setError(null);
      
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      );
      
      const savedTasks = saveTasksToStorage(updatedTasks);
      
      setTasks(savedTasks);
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to update task',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setIsLoading(true);
      setError(null);
      
      const updatedTasks = tasks.filter((task) => task.id !== id);
      const savedTasks = saveTasksToStorage(updatedTasks);
      
      setTasks(savedTasks);
      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Failed to delete task',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        filter,
        addTask,
        updateTask,
        deleteTask,
        setFilter,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
