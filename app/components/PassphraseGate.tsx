'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'vog2026_auth';

interface Props {
  children: React.ReactNode;
}

export default function PassphraseGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUnlocked(true);
    }
    setReady(true);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || checking) return;
    setChecking(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase: input.trim() }),
      });

      if (res.ok) {
        localStorage.setItem(STORAGE_KEY, input.trim());
        setUnlocked(true);
      } else {
        setError('Wrong passphrase. Try again.');
        setInput('');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setChecking(false);
    }
  };

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#121212' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xs"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>🍝</span>
          <div className="text-xs font-bold tracking-widest uppercase mt-3 mb-1" style={{ color: '#FF0000' }}>
            AIESEC × Aleyna
          </div>
          <h1 className="text-2xl font-black text-white">Voice of Gen 2026</h1>
          <p className="text-sm mt-1" style={{ color: '#5a5a70' }}>Enter your passphrase to continue.</p>
        </div>

        {/* Input */}
        <div className="rounded-2xl p-6 glow-blue" style={{ background: '#161619', border: '1px solid rgba(0,51,153,0.3)' }}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Passphrase"
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 textarea-glow mb-4"
            style={{ background: '#1e1e22', border: '1px solid rgba(255,255,255,0.06)' }}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!input.trim() || checking}
            className="w-full py-3 rounded-xl font-black text-sm tracking-wider uppercase text-white disabled:opacity-40 btn-red-glow"
            style={{ background: '#003399', border: '1px solid rgba(0,51,153,0.4)' }}
          >
            {checking ? 'Checking…' : 'Enter →'}
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-center mt-3"
                style={{ color: '#ff5555' }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
