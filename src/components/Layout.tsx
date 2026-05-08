import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Compass, Info, Phone, LogIn, UserPlus, LogOut, User as UserIcon, Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
    { name: 'Feedback', path: '/#feedback', icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.jpg" 
              alt="SafarSathi Logo" 
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow-sm group-hover:scale-110 transition-transform"
              onError={(e) => {
                // Fallback to text if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="flex flex-col hidden">
              <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">SAFARSATHI</span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase mt-0.5">Tourism</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "relative text-sm font-bold transition-all hover:text-indigo-600 px-2 py-1",
                  location.pathname === item.path ? "text-indigo-600" : "text-gray-600"
                )}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"
                  />
                )}
              </Link>
            ))}
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Welcome</span>
                    <span className="text-sm font-bold text-gray-900">{user.displayName || user.email?.split('@')[0]}</span>
                  </div>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-indigo-600 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                {user ? (
                  <div className="px-3 py-4 space-y-4">
                    <div className="flex items-center space-x-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <UserIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Welcome</p>
                        <p className="text-sm font-bold text-gray-900">{user.displayName || user.email?.split('@')[0]}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-3 py-3 rounded-xl text-base font-bold"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-indigo-600 text-white px-3 py-4 rounded-xl text-base font-bold text-center shadow-lg shadow-indigo-100"
                  >
                    Sign In with Google
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <img 
                src="/logo.jpg" 
                alt="SafarSathi Logo" 
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shadow-sm group-hover:scale-110 transition-transform"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="flex flex-col hidden">
                <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">SAFARSATHI</span>
                <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase mt-0.5">Tourism</span>
              </div>
            </Link>
            <p className="text-gray-600 max-w-sm leading-relaxed mb-6 italic font-medium">
              "पैसे बँक मे नही यादो मे जमा करो"
            </p>
            <p className="text-gray-600 max-w-sm leading-relaxed mb-8">
              Your smart travel companion for exploring the world's most beautiful destinations. 
              Plan your trips with AI-powered recommendations and real-time insights.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">+91 7972519926</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">suyogaware2@gmail.com</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Owner & Developer</h4>
            <ul className="space-y-6">
              <li>
                <span className="text-xs text-gray-400 block uppercase tracking-widest mb-1">Owner</span>
                <span className="text-gray-900 font-bold block">Suyog Aware</span>
                <span className="text-xs text-gray-500">+91 7972519926</span>
              </li>
              <li>
                <span className="text-xs text-gray-400 block uppercase tracking-widest mb-1">Website Developer</span>
                <span className="text-gray-900 font-bold block">Pranit Aware</span>
                <span className="text-xs text-gray-500">pranitaware1@gmail.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</Link></li>
              <li><Link to="/explore" className="text-gray-600 hover:text-indigo-600 transition-colors">Explore</Link></li>
              <li><Link to="/wishlist" className="text-gray-600 hover:text-indigo-600 transition-colors">Wishlist</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><Link to="/admin/login" className="text-gray-400 hover:text-indigo-600 transition-colors text-xs mt-4 block">Admin Panel</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SafarSathi Tourism. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center">
            Designed & Developed by <span className="font-bold text-indigo-600 ml-1">Pranit Aware</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
