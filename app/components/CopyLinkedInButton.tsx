'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  text: string;
  linkedInUrl?: string;
}

export default function CopyLinkedInButton({ text, linkedInUrl = 'https://www.linkedin.com/feed/' }: Props) {
  const [phase, setPhase] = useState<'idle' | 'shimmer' | 'done'>('idle');

  const handleClick = async () => {
    if (phase !== 'idle') return;
    setPhase('shimmer');

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard not available in all contexts
    }

    setTimeout(() => {
      setPhase('done');
      window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    }, 1200);

    setTimeout(() => setPhase('idle'), 3000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={phase === 'shimmer'}
      whileHover={phase === 'idle' ? { scale: 1.03 } : {}}
      whileTap={phase === 'idle' ? { scale: 0.97 } : {}}
      className="relative overflow-hidden w-full py-3.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200"
      style={{
        background: phase === 'done'
          ? 'linear-gradient(135deg, #00aa44, #006622)'
          : 'linear-gradient(135deg, #0077b5, #004f77)',
        border: '1px solid rgba(0, 119, 181, 0.5)',
      }}
    >
      {/* Shimmer overlay */}
      <AnimatePresence>
        {phase === 'shimmer' && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.55) 60%, transparent 80%)',
              zIndex: 10,
            }}
          />
        )}
      </AnimatePresence>

      {/* Particle burst on done */}
      <AnimatePresence>
        {phase === 'done' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i / 6) * Math.PI * 2) * 50,
                  y: Math.sin((i / 6) * Math.PI * 2) * 30,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full pointer-events-none"
                style={{
                  background: i % 2 === 0 ? '#003399' : '#FF0000',
                  zIndex: 20,
                  marginLeft: -4,
                  marginTop: -4,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Label */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <LinkedInIcon />
              Share the Love
            </motion.span>
          )}
          {phase === 'shimmer' && (
            <motion.span
              key="shimmer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              ✨ Copying…
            </motion.span>
          )}
          {phase === 'done' && (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              ✅ Copied! LinkedIn opened
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
