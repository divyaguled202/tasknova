import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export function FloatingParticles() {
  const particles = useMemo(() => {
    const colors = [
      'rgba(168, 85, 247, 0.4)', // Purple
      'rgba(99, 102, 241, 0.4)', // Indigo
      'rgba(6, 182, 212, 0.35)', // Cyan
      'rgba(236, 72, 153, 0.35)', // Pink
    ];

    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
      color: colors[i % colors.length],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full blur-[0.5px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: ['0px', '-40px', '20px', '0px'],
            x: ['0px', '30px', '-20px', '0px'],
            opacity: [0.2, 0.8, 0.4, 0.2],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
