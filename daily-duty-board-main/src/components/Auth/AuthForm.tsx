
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AuthFormProps = {
  type: 'login' | 'register';
};

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      name?: string;
    } = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Name validation (only for register)
    if (type === 'register' && !name.trim() && name !== '') {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (type === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: type === 'login' ? 'Login failed' : 'Registration failed',
        description: (error as Error).message || 'An error occurred',
      });
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div className="space-y-6">
        {type === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-white">
              Full Name
            </Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                <User size={18} />
              </div>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateForm}
                disabled={isLoading}
                className={`pl-10 bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/30 text-white placeholder:text-white/50 transition-all ${
                  errors.name ? 'border-red-400' : ''
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-400 mt-1">{errors.name}</p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white">
            Email
          </Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
              <Mail size={18} />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateForm}
              disabled={isLoading}
              className={`pl-10 bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/30 text-white placeholder:text-white/50 transition-all ${
                errors.email ? 'border-red-400' : ''
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-400 mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-white">
            Password
          </Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
              <Lock size={18} />
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validateForm}
              disabled={isLoading}
              className={`pl-10 pr-10 bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/30 text-white placeholder:text-white/50 transition-all ${
                errors.password ? 'border-red-400' : ''
              }`}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={toggleShowPassword}
                className="text-white/50 hover:text-white transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400 mt-1">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 shadow-lg bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 border-none text-md font-semibold"
          disabled={isLoading}
        >
          {isLoading
            ? 'Processing...'
            : type === 'login'
            ? 'Sign In'
            : 'Create Account'}
        </Button>
        
        {type === 'login' && (
          <div className="text-center">
            <a href="#" className="text-sm text-white/80 hover:text-white hover:underline transition-colors">
              Forgot your password?
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
