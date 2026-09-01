import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ListTodo,
  Calendar,
  Sparkles,
  Flame,
  Menu,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { taskStorage } from '../lib/storage';

export function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState(() => taskStorage.getTasksForUser(user.uid));
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Quick Celebration Trigger
  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#a855f7', '#6366f1', '#06b6d4', '#ec4899', '#10b981'],
    });
  };

  // Toggle Task Completion
  const handleToggleComplete = (taskId) => {
    const { updatedTasks, isCompleted } = taskStorage.toggleComplete(user.uid, taskId);
    setTasks(updatedTasks);
    if (isCompleted) {
      triggerConfetti();
    }
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    const updated = taskStorage.deleteTask(user.uid, taskId);
    setTasks(updated);
  };

  // Save Task (Create or Update)
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      const updated = taskStorage.updateTask(user.uid, editingTask.id, taskData);
      setTasks(updated);
    } else {
      const newTask = taskStorage.addTask(user.uid, taskData);
      setTasks([newTask, ...tasks]);
    }
    setEditingTask(null);
  };

  // Open Edit Modal
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Open New Task Modal
  const handleOpenNewModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Computed Dates & Statistics
  const todayStr = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const todayCount = tasks.filter((t) => t.dueDate === todayStr).length;

    // Calculate this week's tasks (today + next 7 days)
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    const weekCount = tasks.filter((t) => t.dueDate && t.dueDate >= todayStr && t.dueDate <= nextWeekStr).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, todayCount, weekCount, completionRate };
  }, [tasks, todayStr]);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Main navigation filter
    if (currentFilter === 'today') {
      result = result.filter((t) => t.dueDate === todayStr);
    } else if (currentFilter === 'week') {
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];
      result = result.filter((t) => t.dueDate && t.dueDate >= todayStr && t.dueDate <= nextWeekStr);
    } else if (currentFilter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Category tag filter
    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const pOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default: dueDate or newest
      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [tasks, currentFilter, selectedCategory, priorityFilter, searchQuery, sortBy, todayStr]);

  return (
    <div className="min-h-screen relative z-10 flex text-slate-100">
      {/* Dynamic 3D Sidebar */}
      <Sidebar
        currentFilter={currentFilter}
        selectedCategory={selectedCategory}
        onSelectFilter={setCurrentFilter}
        onSelectCategory={setSelectedCategory}
        stats={stats}
        user={user}
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Workspace Area */}
      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-8 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        } max-w-7xl mx-auto w-full`}
      >
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2 rounded-xl glass-panel text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Welcome back, {user.displayName}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Live
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Quick Create Task CTA */}
          <div className="flex items-center gap-3">
            <button
              id="quick-add-task-cta-btn"
              onClick={handleOpenNewModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-sm font-bold shadow-lg shadow-purple-600/30 hover:shadow-purple-500/40 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Task</span>
            </button>
          </div>
        </div>

        {/* Analytics Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5 my-6">
          <AnalyticsCard
            title="Total Tasks"
            value={stats.total}
            subtitle={`${stats.pending} remaining`}
            icon={ListTodo}
            colorScheme="purple"
          />
          <AnalyticsCard
            title="Today's Focus"
            value={stats.todayCount}
            subtitle="Scheduled for today"
            icon={Calendar}
            colorScheme="cyan"
          />
          <AnalyticsCard
            title="Completed"
            value={stats.completed}
            subtitle={`${stats.completionRate}% completion`}
            icon={CheckCircle2}
            trend={`${stats.completionRate}%`}
            colorScheme="emerald"
          />
          <AnalyticsCard
            title="Weekly Sprint"
            value={stats.weekCount}
            subtitle="Next 7 days due"
            icon={Flame}
            colorScheme="amber"
          />
        </div>

        {/* Filters, Search Bar & Sorters */}
        <div className="glass-card rounded-2xl p-4 md:p-5 border border-white/10 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="tasks-search-input"
                type="text"
                placeholder="Search tasks or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              {/* Priority Select */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  id="filter-priority-select"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900">All Priorities</option>
                  <option value="urgent" className="bg-slate-900">Urgent</option>
                  <option value="high" className="bg-slate-900">High</option>
                  <option value="medium" className="bg-slate-900">Medium</option>
                  <option value="low" className="bg-slate-900">Low</option>
                </select>
              </div>

              {/* Sort By Select */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  id="sort-by-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="date" className="bg-slate-900">Sort by Due Date</option>
                  <option value="priority" className="bg-slate-900">Sort by Priority</option>
                  <option value="title" className="bg-slate-900">Sort Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Task List Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white capitalize">
              {currentFilter === 'all' ? 'All Workspace Tasks' : `${currentFilter} Tasks`}
            </h2>
            <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 font-semibold">
              {filteredTasks.length}
            </span>
          </div>

          {selectedCategory !== 'all' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tag:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                {selectedCategory}
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-slate-500 hover:text-white underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Task List Content */}
        {filteredTasks.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-white/10 max-w-lg mx-auto mt-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 mb-4 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No tasks found</h3>
            <p className="text-xs md:text-sm text-slate-400 mb-6">
              {searchQuery
                ? `No tasks matched "${searchQuery}". Try a different keyword or filter.`
                : 'You have no tasks in this view. Ready to plan your next milestone?'}
            </p>
            <button
              id="empty-state-add-task-btn"
              onClick={handleOpenNewModal}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 inline-flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Task Creation/Editing Modal */}
      <TaskModal
        isOpen={isModalOpen}
        initialTask={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
}
