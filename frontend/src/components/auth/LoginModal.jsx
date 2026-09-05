import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, LogIn, Lock, Mail, Shield, User, GraduationCap, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginModal = () => {
  const { authModal, setAuthModal, loginUser, switchRole } = useApp();
  const [email, setEmail] = useState('ananya.sharma@imd.gov.in');
  const [role, setRole] = useState('trainee');
  const [password, setPassword] = useState("");

  if (!authModal.isOpen || authModal.mode !== 'login') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, role);
  };

  const handleQuickDemoFill = (selectedRole) => {
    if (selectedRole === 'trainee') {
      setEmail('ananya.sharma@imd.gov.in');
      setRole('trainee');
    } else if (selectedRole === 'trainer') {
      setEmail('rajesh.verma@imd.gov.in');
      setRole('trainer');
    } else if (selectedRole === 'admin') {
      setEmail('arvind.saxena@moes.gov.in');
      setRole('admin');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-moes-700 to-navy-900 px-6 py-5 text-white relative">
          <button
            onClick={() => setAuthModal({ isOpen: false, mode: 'login' })}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-moes-500/40 flex items-center justify-center">
              <LogIn className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">MoES Portal Authentication</span>
          </div>
          <h2 className="text-xl font-bold">Sign In to CAPACITY CONNECT</h2>
          <p className="text-xs text-sky-200 mt-1">Select your organizational role to access portal tools</p>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-700">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-moes-500" />
            <span>Quick Autofill for SIH Evaluators:</span>
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('trainee')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                role === 'trainee'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Trainee
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('trainer')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                role === 'trainer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('admin')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className={`flex flex-col items-center p-2.5 rounded-xl border text-center cursor-pointer transition ${
                role === 'trainee' 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="trainee" 
                  checked={role === 'trainee'} 
                  onChange={() => setRole('trainee')}
                  className="sr-only" 
                />
                <GraduationCap className="w-5 h-5 mb-1 text-blue-500" />
                <span className="text-xs">Trainee</span>
              </label>

              <label className={`flex flex-col items-center p-2.5 rounded-xl border text-center cursor-pointer transition ${
                role === 'trainer' 
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="trainer" 
                  checked={role === 'trainer'} 
                  onChange={() => setRole('trainer')}
                  className="sr-only" 
                />
                <UserCheck className="w-5 h-5 mb-1 text-indigo-500" />
                <span className="text-xs">Trainer</span>
              </label>

              <label className={`flex flex-col items-center p-2.5 rounded-xl border text-center cursor-pointer transition ${
                role === 'admin' 
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="admin" 
                  checked={role === 'admin'} 
                  onChange={() => setRole('admin')}
                  className="sr-only" 
                />
                <Shield className="w-5 h-5 mb-1 text-emerald-500" />
                <span className="text-xs">Admin</span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official Email Address (@gov.in / @res.in)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-moes-500 outline-none"
                placeholder="name@imd.gov.in"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                defaultValue="••••••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-moes-500 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Authenticate & Access Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Switch to Signup */}
          <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <span>New trainee or trainer? </span>
            <button
              type="button"
              onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              className="text-moes-600 dark:text-sky-400 font-bold hover:underline"
            >
              Create Account (Subject to Approval)
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
