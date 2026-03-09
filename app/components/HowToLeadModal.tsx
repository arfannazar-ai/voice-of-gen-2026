'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'The Mood',
    label: 'Strategic Diplomat · Empathetic Leader · Disruptive Activist',
    body: "Choose who we're being today. This isn't decoration. It rewires how every word lands. A Strategic Diplomat builds the architecture. An Empathetic Leader reaches through the screen. A Disruptive Activist says what nobody else will.",
  },
  {
    num: '02',
    title: 'The Dump',
    label: 'No checkboxes. No bureaucracy.',
    body: "Just tell me what you care about right now. Raw. Messy. Real. Don't sanitise it for the engine — the engine was built exactly for the unsanitised version. Radical clarity starts here.",
  },
  {
    num: '03',
    title: 'Speak Up',
    label: 'Watch raw thoughts become Relevant Impact.',
    body: "Hit the button. Your frustrations, your vision, your urgency — they come out the other side as communication that moves people. Not polished for polish's sake. Sharp for the sake of being heard. Brick by brick.",
  },
  {
    num: '04',
    title: 'The Legacy',
    label: "Hit 'Share the Love'. Open LinkedIn.",
    body: "I take AIESEC personal, and so should your posts. Every word you put out is a brick. Every post is a statement of what the 2026 generation actually stands for. Leading with integrity means showing up — publicly, consistently, with purpose.",
  },
];

export default function HowToLeadModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="w-full max-w-lg rounded-2xl overflow-hidden"
              style={{
                background: '#161619',
                border: '1px solid rgba(255,0,0,0.2)',
                boxShadow: '0 0 60px rgba(255,0,0,0.08), 0 24px 64px rgba(0,0,0,0.6)',
                pointerEvents: 'auto',
                maxHeight: 'calc(100vh - 48px)',
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px', paddingBottom: '20px' }}
              >
                <div>
                  <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#FF0000' }}>
                    How to Lead
                  </div>
                  <h2 className="text-white font-black text-lg">Four steps. Zero bureaucracy.</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: '#5a5a70', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  ✕
                </button>
              </div>

              {/* Steps */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
                    style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
                  >
                    {/* Number badge */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        letterSpacing: '0.05em',
                        marginTop: '2px',
                        background: i === 0 ? 'rgba(0,51,153,0.2)' : i === 1 ? 'rgba(255,0,0,0.1)' : i === 2 ? 'rgba(0,170,102,0.12)' : 'rgba(255,0,0,0.1)',
                        color: i === 0 ? '#4477dd' : i === 1 ? '#ff5555' : i === 2 ? '#44cc88' : '#ff5555',
                        border: `1px solid ${i === 0 ? 'rgba(0,51,153,0.3)' : i === 1 ? 'rgba(255,0,0,0.25)' : i === 2 ? 'rgba(0,170,102,0.25)' : 'rgba(255,0,0,0.25)'}`,
                      }}
                    >
                      {step.num}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>{step.title}</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#FF0000', opacity: 0.75, fontWeight: 600, letterSpacing: '0.01em' }}>{step.label}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', lineHeight: 1.65, color: '#8888a0', margin: 0 }}>
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-xs italic" style={{ color: '#3a3a50' }}>
                  &ldquo;Peace is not a poster. It&apos;s not a hashtag.&rdquo;
                </p>
                <button
                  onClick={onClose}
                  className="text-xs font-bold px-4 py-2 rounded-lg"
                  style={{ background: 'rgba(255,0,0,0.12)', color: '#FF0000', border: '1px solid rgba(255,0,0,0.25)' }}
                >
                  Got it →
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
