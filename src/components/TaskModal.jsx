import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Flag,
  Tag,
  AlignLeft,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export function TaskModal({
  isOpen,
  initialTask,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority);
      setCategory(initialTask.category);
      setDueDate(initialTask.dueDate || '');
    } else {
      // Default to today's date for quick convenience
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('work');
      setDueDate(today);
    }
    setError('');
  }, [initialTask, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      completed: initialTask ? initialTask.completed : false,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl shadow-purple-950/50 z-10 overflow-hidden"
          >
            {/* Top gradient decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {initialTask ? 'Edit Task' : 'Create New Task'}
                </h3>
              </div>
              <button
                id="task-modal-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Task Title <span className="text-purple-400">*</span>
                </label>
                <input
                  id="task-form-title-input"
                  type="text"
                  required
                  placeholder="e.g. Design 3D animated hero section"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition-all"
                />
              </div>

              {/* Description input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                  Description / Notes (Optional)
                </label>
                <textarea
                  id="task-form-description-input"
                  rows={3}
                  placeholder="Add details, bullet points, or checklist..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition-all resize-none"
                />
              </div>

              {/* Grid: Priority, Category, Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    Priority
                  </label>
                  <select
                    id="task-form-priority-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs capitalize cursor-pointer"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    Category
                  </label>
                  <select
                    id="task-form-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs capitalize cursor-pointer"
                  >
                    <option value="work">Work</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Due Date
                  </label>
                  <input
                    id="task-form-duedate-input"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-purple-500 text-xs cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  id="task-form-cancel-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="task-form-submit-btn"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
