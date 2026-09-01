import React from 'react';
import { motion } from 'motion/react';

export function AnalyticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'purple',
}) {
  const schemes = {
    purple: {
      border: 'border-purple-500/30',
      bg: 'from-purple-900/20 to-indigo-900/10',
      iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      glow: 'shadow-purple-900/20',
    },
    cyan: {
      border: 'border-cyan-500/30',
      bg: 'from-cyan-900/20 to-blue-900/10',
      iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      glow: 'shadow-cyan-900/20',
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'from-emerald-900/20 to-teal-900/10',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      glow: 'shadow-emerald-900/20',
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'from-amber-900/20 to-orange-900/10',
      iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      glow: 'shadow-amber-900/20',
    },
  };

  const current = schemes[colorScheme] || schemes.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl p-4 md:p-5 glass-card border ${current.border} bg-gradient-to-br ${current.bg} shadow-lg ${current.glow} overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
        </div>

        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${current.iconBg} shadow-inner`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-xs text-slate-400">
        <span>{subtitle}</span>
        {trend && <span className="font-semibold text-purple-300">{trend}</span>}
      </div>
    </motion.div>
  );
}
