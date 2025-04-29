
export type User = {
  id: string;
  email: string;
  name?: string;
};

export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  userId: string;
};

export type TaskFilter = 'all' | 'active' | 'completed';

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export type TasksContextType = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: TaskFilter;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
};
