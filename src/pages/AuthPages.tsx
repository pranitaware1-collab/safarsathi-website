import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, User, ArrowRight, Github, Chrome, 
  ChevronLeft, CheckCircle2, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { user, loading, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col space-y-6">
        <p className="text-gray-600 text-center leading-relaxed">
          Join SafarSathi to explore the world's most beautiful destinations with AI-powered recommendations.
        </p>
        
        <button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={cn(
            "flex items-center justify-center space-x-4 py-5 rounded-2xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all font-bold text-gray-700 w-full shadow-lg shadow-gray-100",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Chrome className="w-6 h-6 text-indigo-600" />
              <span className="text-lg">Continue with Google</span>
            </>
          )}
        </button>

        <div className="flex items-center space-x-3 text-xs text-gray-400 justify-center uppercase tracking-widest font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>Secure Google Authentication</span>
        </div>
      </div>
    </div>
  );
};

export const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen pt-16 flex flex-col lg:flex-row bg-white">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={isLogin 
              ? "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2021" 
              : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070"
            } 
            alt="Auth Visual" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-900/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-24 max-w-2xl">
          <motion.div
            key={isLogin ? 'login-text' : 'signup-text'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              {isLogin ? 'Welcome Back to SafarSathi.' : 'Start Your Journey With Us Today.'}
            </h2>
            <p className="text-xl text-indigo-100 leading-relaxed font-light">
              {isLogin 
                ? 'Sign in to access your saved destinations, personalized itineraries, and smart travel recommendations.' 
                : 'Create an account to unlock AI-powered travel planning, budget tracking, and exclusive destination guides.'}
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">50k+</div>
              <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Active Travelers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">120+</div>
              <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Destinations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-24 bg-white relative">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:-translate-x-1 transition-transform">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Welcome to SafarSathi
            </h1>
            <p className="text-gray-500">
              Please sign in with your Google account to continue.
            </p>
          </div>

          <AuthForm type={isLogin ? 'login' : 'signup'} />

          <p className="mt-12 text-center text-sm text-gray-400">
            By continuing, you agree to our <Link to="#" className="font-bold text-gray-600">Terms of Service</Link> and <Link to="#" className="font-bold text-gray-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
