'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LoveLetter, LeadershipMood } from '@/app/lib/types';

interface Props {
  letters: LoveLetter[];
  onSelect: (letter: LoveLetter) => void;
  selectedId?: string;
}

const MOOD_COLORS: Record<LeadershipMood, string> = {
  Strategic: '#003399',
  Disruptive: '#FF0000',
  Empathetic: '#00aa66',
};

const MOOD_EMOJI: Record<LeadershipMood, string> = {
  Strategic: '♟',
  Disruptive: '⚡',
  Empathetic: '🌿',
};

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Sidebar({ letters, onSelect, selectedId }: Props) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="p-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#FF0000' }}>
          Love Letters
        </div>
        <p className="text-xs" style={{ color: '#5a5a70' }}>
          Your AIESEC communications archive
        </p>
      </div>

      {/* Letters list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence>
          {letters.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-3xl mb-3">💌</div>
              <p className="text-xs" style={{ color: '#5a5a70' }}>
                Your first love letter is waiting to be written.
              </p>
            </div>
          ) : (
            [...letters].reverse().map((letter, i) => (
              <motion.button
                key={letter.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelect(letter)}
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: selectedId === letter.id ? 'rgba(0, 51, 153, 0.15)' : '#23232b',
                  border: selectedId === letter.id
                    ? '1px solid rgba(0, 51, 153, 0.5)'
                    : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {/* Mood badge + time */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${MOOD_COLORS[letter.mood]}22`,
                      color: MOOD_COLORS[letter.mood],
                    }}
                  >
                    {MOOD_EMOJI[letter.mood]} {letter.mood}
                  </span>
                  <span className="text-xs" style={{ color: '#5a5a70' }}>
                    {formatTime(letter.timestamp)}
                  </span>
                </div>

                {/* Thought preview */}
                <p
                  className="text-xs leading-relaxed line-clamp-2"
                  style={{ color: '#8888a0' }}
                >
                  {letter.thoughtDump}
                </p>

                {/* Output preview */}
                <p
                  className="text-xs mt-1.5 line-clamp-1 font-medium"
                  style={{ color: '#c8c8d8' }}
                >
                  {letter.output.slice(0, 80)}…
                </p>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xs text-center" style={{ color: '#3a3a50' }}>
          {letters.length} letter{letters.length !== 1 ? 's' : ''} written
        </div>
      </div>
    </div>
  );
}
