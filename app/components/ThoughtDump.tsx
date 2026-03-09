'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QuestionnaireData, LeadershipMood } from '@/app/lib/types';

interface Props {
  questionnaireData: QuestionnaireData;
  onGenerate: (thought: string, output: string) => void;
}

const MOOD_PROMPT: Record<LeadershipMood, string> = {
  Strategic: 'Think systems. Think leverage. What moves the board?',
  Disruptive: 'No filter. No apologies. What needs to be said?',
  Empathetic: 'From the heart. Who are you speaking for today?',
};

const MOOD_COLORS: Record<LeadershipMood, string> = {
  Strategic: '#003399',
  Disruptive: '#FF0000',
  Empathetic: '#00aa66',
};

function PendulumLoader() {
  return (
    <motion.div
      style={{ transformOrigin: '50% 0%', display: 'inline-block', lineHeight: 0 }}
      animate={{ rotate: [-32, 32, -32] }}
      transition={{
        duration: 1.4,
        repeat: Infinity,
        ease: [0.45, 0.05, 0.55, 0.95],
        times: [0, 0.5, 1],
      }}
    >
      <svg width="18" height="30" viewBox="0 0 18 30" fill="none">
        {/* Rope */}
        <line x1="9" y1="0" x2="9" y2="18" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Wrecking ball */}
        <circle cx="9" cy="23" r="6" fill="white" opacity="0.9" />
        <circle cx="7" cy="21" r="1.5" fill="rgba(0,0,0,0.2)" />
      </svg>
    </motion.div>
  );
}

export default function ThoughtDump({ questionnaireData, onGenerate }: Props) {
  const [thought, setThought] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  const mood = questionnaireData.mood as LeadershipMood;
  const moodColor = MOOD_COLORS[mood];

  const handleGenerate = async () => {
    if (!thought.trim()) return;
    setIsGenerating(true);
    setError('');
    setOutput('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thought, questionnaire: questionnaireData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          full += chunk;
          setOutput(full);
          if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
          }
        }
      }

      onGenerate(thought, full);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = thought.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Mood indicator */}
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: moodColor, boxShadow: `0 0 8px ${moodColor}` }}
        />
        <span className="text-sm font-bold" style={{ color: moodColor }}>
          {mood} Mode
        </span>
        <span className="text-sm" style={{ color: '#5a5a70' }}>
          — {MOOD_PROMPT[mood]}
        </span>
      </div>

      {/* Context pills */}
      <div className="flex flex-wrap gap-2">
        {[questionnaireData.focus, questionnaireData.audience, questionnaireData.platform].map(
          (val, i) =>
            val ? (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(0, 51, 153, 0.12)',
                  border: '1px solid rgba(0, 51, 153, 0.25)',
                  color: '#7799dd',
                }}
              >
                {val}
              </span>
            ) : null
        )}
      </div>

      {/* Thought dump textarea */}
      <div className="relative flex-1 min-h-[160px]">
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Dump everything here. Raw thoughts, frustrations, half-formed ideas, what you actually want to say vs. what AIESEC protocol expects you to say. No filter needed — the engine handles it."
          className="w-full h-full min-h-[160px] resize-none rounded-2xl px-5 py-4 text-white placeholder-gray-600 leading-relaxed text-sm transition-all duration-300 textarea-glow"
          style={{
            background: '#1a1a1e',
            border: `1px solid rgba(0, 51, 153, 0.3)`,
          }}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate();
          }}
        />
        <div
          className="absolute bottom-3 right-4 text-xs"
          style={{ color: wordCount > 10 ? '#5a5a70' : '#3a3a50' }}
        >
          {wordCount} words
        </div>
      </div>

      {/* Generate button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleGenerate}
        disabled={isGenerating || !thought.trim()}
        className="w-full py-4 rounded-2xl font-black text-sm tracking-wider uppercase transition-all duration-200 disabled:opacity-40 relative overflow-hidden btn-red-glow"
        style={{
          background: isGenerating
            ? '#1e1e22'
            : `linear-gradient(135deg, #003399, #0044cc)`,
          border: isGenerating ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,51,153,0.4)',
          color: 'white',
          boxShadow: isGenerating ? 'none' : '0 0 20px rgba(255,0,0,0.25), 0 0 40px rgba(255,0,0,0.1)',
        }}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-3">
            <PendulumLoader />
            Channeling your voice…
          </span>
        ) : (
          <>Speak Up <span style={{ color: '#FF0000' }}>→</span></>
        )}
      </motion.button>

      <div className="text-xs text-center" style={{ color: '#3a3a50' }}>
        ⌘ + Enter to generate
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl text-sm"
          style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ff6666' }}
        >
          {error}
        </motion.div>
      )}

      {/* Output */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(0, 51, 153, 0.3)', background: '#1a1a1e' }}
        >
          <div
            className="px-5 py-3 text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(0, 51, 153, 0.15)',
              borderBottom: '1px solid rgba(0, 51, 153, 0.2)',
              color: '#003399',
            }}
          >
            Your Love Letter
          </div>
          <div
            ref={outputRef}
            className="p-5 text-sm leading-relaxed overflow-y-auto max-h-80 whitespace-pre-wrap"
            style={{ color: '#d8d8e8' }}
          >
            {output}
            {isGenerating && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-0.5 h-4 ml-0.5 align-text-bottom"
                style={{ background: '#003399' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
