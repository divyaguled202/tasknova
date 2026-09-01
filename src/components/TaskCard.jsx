import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Check,
  Clock,
  Edit3,
  Flame,
  MoreVertical,
  Trash2,
  AlertCircle,
  Tag,
} from 'lucide-react';

const PRIORITY_CONFIG = {
  urgent: {
    label: 'Urgent',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: Flame,
    glow: 'shadow-rose-500/10',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: AlertCircle,
    glow: 'shadow-amber-500/10',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Clock,
    glow: 'shadow-blue-500/10',
  },
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    icon: Clock,
    glow: 'shadow-slate-500/10',
  },
};

const CATEGORY_COLORS = {
  work: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  development: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  design: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  personal: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  other: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const categoryStyle = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.other;

  // Format date helper
  const isDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today;
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`group relative rounded-2xl p-4 md:p-5 transition-all duration-300 ${
        task.completed
          ? 'bg-slate-900/40 border border-white/5 opacity-70 hover:opacity-100'
          : 'glass-card border border-white/10 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-900/20'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Animated Custom Checkbox */}
        <button
          id={`task-complete-btn-${task.id}`}
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${
            task.completed
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'border border-white/30 bg-white/5 hover:border-purple-400 hover:bg-purple-500/10'
          }`}
          title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </motion.div>
          )}
        </button>

        {/* Task Core Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-base font-semibold transition-all ${
                task.completed
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-white group-hover:text-purple-200'
              }`}
            >
              {task.title}
            </h4>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                id={`task-edit-btn-${task.id}`}
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-500/15 transition-colors"
                title="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                id={`task-delete-btn-${task.id}`}
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p
              className={`text-xs md:text-sm mt-1.5 line-clamp-2 leading-relaxed ${
                task.completed ? 'text-slate-500' : 'text-slate-300'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges, Priority, Category, & Due Date */}
          <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-2 border-t border-white/5">
            {/* Priority Tag */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priority.badgeClass}`}
            >
              <priority.icon className="w-3 h-3" />
              <span>{priority.label}</span>
            </span>

            {/* Category Tag */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${categoryStyle}`}
            >
              <Tag className="w-3 h-3" />
              <span>{task.category}</span>
            </span>

            {/* Due Date Indicator */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isOverdue()
                    ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    : isDueToday()
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>
                  {isDueToday() ? 'Today' : isOverdue() ? `Overdue: ${task.dueDate}` : task.dueDate}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
