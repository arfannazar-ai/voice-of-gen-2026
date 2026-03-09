'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import ThoughtDump from './ThoughtDump';
import CopyLinkedInButton from './CopyLinkedInButton';
import HowToLeadModal from './HowToLeadModal';
import { QuestionnaireData, LoveLetter, LeadershipMood } from '@/app/lib/types';

interface Props {
  questionnaireData: QuestionnaireData;
  onReset: () => void;
}

const MOOD_COLORS: Record<LeadershipMood, string> = {
  Strategic: '#003399',
  Disruptive: '#FF0000',
  Empathetic: '#00aa66',
};

export default function MainApp({ questionnaireData, onReset }: Props) {
  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [latestOutput, setLatestOutput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);

  const mood = questionnaireData.mood as LeadershipMood;
  const moodColor = MOOD_COLORS[mood];

  const handleGenerate = (thought: string, output: string) => {
    const newLetter: LoveLetter = {
      id: Date.now().toString(),
      timestamp: new Date(),
      mood: questionnaireData.mood as LeadershipMood,
      thoughtDump: thought,
      output,
    };
    setLetters((prev) => [...prev, newLetter]);
    setLatestOutput(output);
    setSelectedLetter(null);
  };

  const displayOutput = selectedLetter ? selectedLetter.output : latestOutput;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#121212' }}>
      <HowToLeadModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-shrink-0 overflow-hidden"
            style={{ background: '#161619' }}
          >
            <Sidebar
              letters={letters}
              onSelect={(l) => setSelectedLetter(l)}
              selectedId={selectedLetter?.id}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top nav */}
        <header
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#121212' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              title="Toggle sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8888a0" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: moodColor, boxShadow: `0 0 6px ${moodColor}` }}
                />
                <h1 className="font-black text-white text-sm tracking-wide">
                  Voice of Gen 2026
                </h1>
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#5a5a70' }}>
                {mood} Mode · {questionnaireData.platform}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {displayOutput && (
              <div className="w-56">
                <CopyLinkedInButton text={displayOutput} />
              </div>
            )}
            <button
              onClick={() => setGuideOpen(true)}
              title="How to Lead"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-xs font-black"
              style={{ color: '#FF0000', border: '1px solid rgba(255,0,0,0.2)', background: 'rgba(255,0,0,0.06)' }}
            >
              ?
            </button>
            <button
              onClick={onReset}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#5a5a70', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              New session
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Context summary card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 mb-6"
              style={{
                background: '#1a1a1e',
                border: `1px solid ${moodColor}33`,
              }}
            >
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: moodColor }}>
                Today&apos;s Brief
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Focus', value: questionnaireData.focus },
                  { label: 'Audience', value: questionnaireData.audience },
                  { label: 'Register', value: questionnaireData.tone },
                  { label: 'Platform', value: questionnaireData.platform },
                ].map(({ label, value }) => (
                  value ? (
                    <div key={label}>
                      <div className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#5a5a70' }}>
                        {label}
                      </div>
                      <div className="text-sm text-white font-medium">{value}</div>
                    </div>
                  ) : null
                ))}
              </div>
            </motion.div>

            {/* Selected letter view */}
            <AnimatePresence>
              {selectedLetter && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="rounded-2xl mb-6 overflow-hidden"
                  style={{ border: '1px solid rgba(0, 51, 153, 0.3)', background: '#1a1a1e' }}
                >
                  <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ borderBottom: '1px solid rgba(0,51,153,0.2)', background: 'rgba(0,51,153,0.12)' }}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#003399' }}>
                      Archived Love Letter
                    </span>
                    <button
                      onClick={() => setSelectedLetter(null)}
                      className="text-xs"
                      style={{ color: '#5a5a70' }}
                    >
                      ✕ close
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="text-xs mb-3 p-3 rounded-xl whitespace-pre-wrap" style={{ background: '#121212', color: '#8888a0' }}>
                      <strong className="text-white block mb-1">Original thought:</strong>
                      {selectedLetter.thoughtDump}
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#d8d8e8' }}>
                      {selectedLetter.output}
                    </div>
                    <div className="mt-4">
                      <CopyLinkedInButton text={selectedLetter.output} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thought dump */}
            {!selectedLetter && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ThoughtDump
                  questionnaireData={questionnaireData}
                  onGenerate={handleGenerate}
                />
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
