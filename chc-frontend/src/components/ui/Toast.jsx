import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

// ──────────────────────────────────────────────────────────────
// Simple event-bus so any component can fire toasts without props
// ──────────────────────────────────────────────────────────────
const listeners = new Set();

export const toast = {
  success: (message, duration = 4000) => emit({ type: 'success', message, duration }),
  error:   (message, duration = 5000) => emit({ type: 'error',   message, duration }),
  info:    (message, duration = 4000) => emit({ type: 'info',    message, duration }),
  warning: (message, duration = 4500) => emit({ type: 'warning', message, duration }),
};

function emit(toast) {
  listeners.forEach(fn => fn({ ...toast, id: Date.now() + Math.random() }));
}

// ──────────────────────────────────────────────────────────────
// ToastContainer — mount once in App.jsx (or index.jsx)
// ──────────────────────────────────────────────────────────────
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (t) => {
      setToasts(prev => [...prev.slice(-4), t]); // max 5 toasts
      setTimeout(() => remove(t.id), t.duration);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, [remove]);

  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️',
  };

  const colors = {
    success: { bg: 'rgba(16,185,129,0.12)', border: '#10b981', text: '#34d399' },
    error:   { bg: 'rgba(244,63,94,0.12)',  border: '#f43f5e', text: '#fb7185' },
    info:    { bg: 'rgba(0,230,217,0.12)',  border: '#00e6d9', text: '#00e6d9' },
    warning: { bg: 'rgba(245,158,11,0.12)', border: '#f59e0b', text: '#fbbf24' },
  };

  return createPortal(
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px',
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {toasts.map(t => {
          const c = colors[t.type] || colors.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0,  scale: 1   }}
              exit  ={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                pointerEvents: 'auto',
                minWidth: '280px', maxWidth: '400px',
                padding: '14px 18px',
                background: c.bg,
                border: `1px solid ${c.border}40`,
                borderLeft: `4px solid ${c.border}`,
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${c.border}15`,
                cursor: 'default',
              }}
            >
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icons[t.type]}</span>
              <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.4 }}>
                {t.message}
              </span>
              <button
                onClick={() => remove(t.id)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-tertiary)',
                  cursor: 'pointer', fontSize: '1rem', padding: '0 4px', flexShrink: 0,
                  lineHeight: 1,
                }}
              >✕</button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body
  );
}
