import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { authStorage } from '../lib/storage';

export function Signup({ onSignupSuccess, onNavigateLogin }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { user } = authStorage.signup(email, password, displayName);
      onSignupSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account.');
    } finally {
      setIsLoading(false);
    }
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
          {/* Top Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-lg shadow-purple-500/30 mb-4 animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-2">
              Start managing your projects with 3D precision
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-confirm-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Feature Perks Checklist */}
            <div className="py-2 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant seed tasks and live analytics dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted local storage — no external servers required</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              id="signup-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                id="signup-to-login-toggle-btn"
                type="button"
                onClick={onNavigateLogin}
                className="text-purple-300 hover:text-purple-200 font-semibold underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-5 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
          <span>Local client-side encryption & instant persistence</span>
        </div>
      </motion.div>
    </div>
  );
}
