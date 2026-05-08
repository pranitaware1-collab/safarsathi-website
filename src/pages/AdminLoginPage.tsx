import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { isAdmin, loginAsAdmin, clearAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Clear admin state whenever we hit the login page to ensure "every time" access
    clearAdmin();
  }, [clearAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsAdmin(password)) {
      navigate('/admin/dashboard', { state: { authorized: true }, replace: true });
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button 
          onClick={() => {
            clearAdmin();
            navigate('/');
          }}
          className="flex items-center text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Site
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="text-center mb-10 relative z-10">
            <div className="flex flex-col items-center mb-4">
              <span className="text-2xl font-black text-gray-900 tracking-tighter leading-none uppercase">Admin Panel</span>
              <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase mt-1">SafarSathi</span>
            </div>
            <p className="text-gray-500 text-sm">Enter your secure password to access business controls.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Admin Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={cn(
                    "w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none",
                    error && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs font-bold mt-2 flex items-center"
                >
                  <ShieldAlert className="w-4 h-4 mr-1" />
                  Invalid admin password. Access denied.
                </motion.p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              <span>Unlock Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Developed by Pranit Aware</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
