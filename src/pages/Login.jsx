import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import { authStorage } from '../lib/storage';

export function Login({ onLoginSuccess, onNavigateSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user } = authStorage.login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    authStorage.ensureDemoUserExists();
    setEmail('alex.founder@novatask.io');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Main Glass Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/15 shadow-2xl shadow-purple-950/60 relative overflow-hidden backdrop-blur-2xl">
          {/* Subtle Top Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-lg shadow-purple-500/30 mb-4 animate-bounce">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Sign In to <span className="text-gradient">TaskNova</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-2">
              Next-gen intelligent SaaS task management
            </p>
          </div>

          {/* Demo User Fast-Fill Badge */}
          <div className="mb-6 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-purple-200">Instant Demo Account</span>
            </div>
            <button
              id="quick-demo-fill-btn"
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 font-semibold transition-all border border-purple-400/30 hover:border-purple-300"
            >
              Fill Credentials
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <button
                id="login-to-signup-toggle-btn"
                type="button"
                onClick={onNavigateSignup}
                className="text-purple-300 hover:text-purple-200 font-semibold underline underline-offset-4"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
          <span>Local client-side encryption & instant persistence</span>
        </div>
      </motion.div>
    </div>
  );
}
