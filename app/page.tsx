'use client';

import { useState } from 'react';
import Questionnaire from './components/Questionnaire';
import MainApp from './components/MainApp';
import HowToLeadModal from './components/HowToLeadModal';
import { QuestionnaireData } from './lib/types';

export default function Home() {
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const handleReset = () => setQuestionnaireData(null);

  if (!questionnaireData) {
    return (
      <>
        <HowToLeadModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
        <Questionnaire onComplete={setQuestionnaireData} onOpenGuide={() => setGuideOpen(true)} />
      </>
    );
  }

  return <MainApp questionnaireData={questionnaireData} onReset={handleReset} />;
}
