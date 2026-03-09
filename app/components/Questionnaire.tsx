'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionnaireData, LeadershipMood } from '@/app/lib/types';

interface Props {
  onComplete: (data: QuestionnaireData) => void;
  onOpenGuide?: () => void;
}

const STEPS = [
  {
    id: 'mood',
    question: "Aleyna, what's your Leadership Mood right now?",
    subtitle: 'This shapes how your voice speaks today.',
    type: 'mood',
  },
  {
    id: 'focus',
    question: 'What AIESEC initiative or challenge are you focusing on?',
    subtitle: 'Be specific — vague in, vague out.',
    type: 'text',
    placeholder: 'e.g. Global Volunteer recruitment drive, EB transition...',
  },
  {
    id: 'audience',
    question: 'Who needs to hear this?',
    subtitle: 'Your voice, their ears.',
    type: 'text',
    placeholder: 'e.g. OC leads, incoming EBs, external partners, the chapter...',
  },
  {
    id: 'tone',
    question: 'What emotional register should this hit?',
    subtitle: 'Beyond the bureaucratic noise.',
    type: 'text',
    placeholder: 'e.g. urgent but calm, inspiring with accountability, warm yet direct...',
  },
  {
    id: 'platform',
    question: 'Where is this going?',
    subtitle: 'Format matters for impact.',
    type: 'text',
    placeholder: 'e.g. LinkedIn post, internal email, EB alignment call, conference speech...',
  },
];

const MOOD_OPTIONS: { value: LeadershipMood; description: string; emoji: string }[] = [
  {
    value: 'Strategic',
    description: 'Seeing the board, moving pieces, building the future.',
    emoji: '♟',
  },
  {
    value: 'Disruptive',
    description: 'Breaking what needs breaking. No apologies.',
    emoji: '⚡',
  },
  {
    value: 'Empathetic',
    description: 'Human first. Connection over efficiency.',
    emoji: '🌿',
  },
];

export default function Questionnaire({ onComplete, onOpenGuide }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuestionnaireData>({
    mood: null,
    focus: '',
    audience: '',
    tone: '',
    platform: '',
  });
  const [textValue, setTextValue] = useState('');

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  const handleMoodSelect = (mood: LeadershipMood) => {
    setData((d) => ({ ...d, mood }));
    setTimeout(() => setStep(1), 350);
  };

  const handleNext = () => {
    const key = current.id as keyof QuestionnaireData;
    const updated = { ...data, [key]: textValue };
    setData(updated);
    setTextValue('');
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        {/* Pasta bowl — a nod to the first protest */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            title="First protest: kids deserve good food 🍝"
            style={{ fontSize: '1.1rem', opacity: 0.35, cursor: 'default', userSelect: 'none' }}
            aria-label="Pasta bowl — the first protest"
          >
            🍝
          </span>
        </div>
        <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#FF0000' }}>
          AIESEC × Aleyna
        </div>
        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#fff' }}>
          The Voice of{' '}
          <span
            className="inline-block"
            style={{
              background: 'linear-gradient(90deg, #003399, #FF0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Gen 2026
          </span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#8888a0' }}>
          Your AI-powered communication engine
        </p>
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{
              color: '#5a5a70',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>?</span>
            How to Lead
          </button>
        )}
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: '#8888a0' }}>
          <span>Setting the stage</span>
          <span>{step + 1} / {STEPS.length}</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: '#1e1e22' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #003399, #FF0000)' }}
            animate={{ width: `${progress + (100 / STEPS.length)}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="w-full max-w-lg rounded-2xl p-8 glow-blue"
          style={{ background: '#161619', border: '1px solid rgba(0, 51, 153, 0.3)' }}
        >
          <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#003399' }}>
            Step {step + 1}
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">{current.question}</h2>
          <p className="text-sm mb-6" style={{ color: '#8888a0' }}>{current.subtitle}</p>

          {current.type === 'mood' ? (
            <div className="space-y-3">
              {MOOD_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMoodSelect(opt.value)}
                  className="w-full text-left rounded-xl transition-all duration-200 flex items-center gap-4"
                  style={{
                    background: data.mood === opt.value ? 'rgba(0, 51, 153, 0.2)' : '#1e1e22',
                    border: data.mood === opt.value
                      ? '1px solid #003399'
                      : '1px solid rgba(255,255,255,0.06)',
                    padding: '14px 16px',
                    minHeight: '64px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      width: '32px',
                      flexShrink: 0,
                      textAlign: 'center',
                      lineHeight: 1,
                    }}
                  >
                    {opt.emoji}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-bold text-white" style={{ lineHeight: 1.2 }}>{opt.value}</div>
                    <div className="text-xs" style={{ color: '#8888a0', marginTop: '3px', lineHeight: 1.4 }}>{opt.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && textValue.trim() && handleNext()}
                placeholder={current.placeholder}
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 transition-all duration-200 textarea-glow"
                style={{ background: '#1e1e22', border: '1px solid rgba(255,255,255,0.06)' }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!textValue.trim()}
                className="mt-4 w-full py-3 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-40"
                style={{ background: textValue.trim() ? '#003399' : '#1e1e22' }}
              >
                {step === STEPS.length - 1 ? "Let's go →" : 'Continue →'}
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
