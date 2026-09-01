import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  CalendarRange,
  CheckCircle2,
  ListTodo,
  LogOut,
  Sparkles,
  Tag,
  Briefcase,
  User as UserIcon,
  Code2,
  Palette,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export function Sidebar({
  currentFilter,
  selectedCategory,
  onSelectFilter,
  onSelectCategory,
  stats,
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) {
  const mainNavItems = [
    { id: 'today', label: 'Today Tasks', icon: Calendar, count: stats.todayCount, color: 'text-amber-400' },
    { id: 'week', label: 'This Week', icon: CalendarRange, count: stats.weekCount, color: 'text-cyan-400' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: stats.completed, color: 'text-emerald-400' },
    { id: 'all', label: 'All Tasks', icon: ListTodo, count: stats.total, color: 'text-purple-400' },
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: Tag, color: 'text-slate-400' },
    { id: 'work', label: 'Work', icon: Briefcase, color: 'text-blue-400' },
    { id: 'development', label: 'Development', icon: Code2, color: 'text-violet-400' },
    { id: 'design', label: 'Design', icon: Palette, color: 'text-pink-400' },
    { id: 'personal', label: 'Personal', icon: UserIcon, color: 'text-emerald-400' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 select-none">
      {/* Brand & Toggle */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="truncate"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-gradient tracking-tight">TaskNova</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">PRO</span>
                </div>
                <p className="text-xs text-slate-400 truncate">SaaS Workspace</p>
              </motion.div>
            )}
          </div>

          <button
            id="sidebar-collapse-toggle-btn"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1 mb-6">
          <div className="px-2 mb-2">
            {!isCollapsed && <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Navigation</span>}
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentFilter === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectFilter(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 border border-purple-500/40 text-white shadow-md shadow-purple-900/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${item.color} ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`} />
                  {!isCollapsed && <span className="font-medium text-sm truncate">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-purple-500/40 text-purple-200'
                        : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="space-y-1">
          <div className="px-2 mb-2 flex items-center justify-between">
            {!isCollapsed && <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Tags & Categories</span>}
          </div>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`sidebar-category-${cat.id}`}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm ${
                  isActive
                    ? 'bg-white/10 text-white font-medium border border-white/15'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
                title={isCollapsed ? cat.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                {!isCollapsed && <span className="truncate">{cat.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Area: Stats Mini Card & User Session */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        {/* Productivity Progress Indicator */}
        {!isCollapsed && (
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Efficiency</span>
              </div>
              <span className="font-bold text-white">{stats.completionRate}%</span>
            </div>
            <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {stats.completed} of {stats.total} completed
            </p>
          </div>
        )}

        {/* User Profile Card & Logout */}
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            )}
          </div>

          <button
            id="sidebar-logout-button"
            onClick={onLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
            title="Sign out of TaskNova"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } glass-panel border-r border-white/10 backdrop-blur-2xl`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 glass-panel border-r border-white/10 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
