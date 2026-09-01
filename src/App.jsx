import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { authStorage } from './lib/storage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ThreeBackground } from './components/ThreeBackground';
import { FloatingParticles } from './components/FloatingParticles';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Seed initial demo credentials in background so user can log in immediately
    authStorage.ensureDemoUserExists();
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authStorage.logout();
    setCurrentUser(null);
    setAuthView('login');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#06040d] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans select-none">
      {/* Dynamic 3D Three.js Animated Canvas Background */}
      <ThreeBackground />

      {/* Floating Sparkle/Dust Ambient Particles */}
      <FloatingParticles />

      {/* Primary Application Flow */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentUser ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard user={currentUser} onLogout={handleLogout} />
            </motion.div>
          ) : authView === 'login' ? (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <Login
                onLoginSuccess={handleLoginSuccess}
                onNavigateSignup={() => setAuthView('signup')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="signup-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Signup
                onSignupSuccess={handleLoginSuccess}
                onNavigateLogin={() => setAuthView('login')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
