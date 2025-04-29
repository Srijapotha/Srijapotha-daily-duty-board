
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/Auth/AuthForm';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-gray-900 dark:to-indigo-900">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 right-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Logo */}
      <div className="relative z-10 mt-12 flex justify-center">
        <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
          <div className="bg-white text-primary rounded-lg p-2 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
              Create Your Account
            </h1>
            <p className="text-white/80 mt-2 text-lg">
              Join TaskMaster to manage your tasks efficiently
            </p>
          </div>
          
          <div className="backdrop-blur-xl bg-white/10 dark:bg-slate-900/40 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden transform transition-all duration-300">
            <AuthForm type="register" />
          </div>
          
          <div className="text-center">
            <p className="text-white/80">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white font-medium hover:text-blue-200 underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6 text-center text-sm text-white/70">
        <p>© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Register;
