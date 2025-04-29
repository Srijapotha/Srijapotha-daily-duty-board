
import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock API calls for auth - in a real app these would connect to a backend
const mockUsers = [
  { id: '1', email: 'user1@example.com', password: 'password1', name: 'Test User 1' },
  { id: '2', email: 'user2@example.com', password: 'password2', name: 'Test User 2' },
];

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: (mockUsers.length + 1).toString(),
        email,
        name: email.split('@')[0],
      };
      
      // In a real app, we'd send this to an API
      mockUsers.push({ ...newUser, password });
      
      // Store user in localStorage (simulating JWT token)
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: 'Account created!',
        description: 'You have successfully registered.',
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Find user
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage (simulating JWT token)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
