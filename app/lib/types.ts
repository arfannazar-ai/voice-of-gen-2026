export type LeadershipMood = 'Strategic' | 'Disruptive' | 'Empathetic';

export interface QuestionnaireData {
  mood: LeadershipMood | null;
  focus: string;
  audience: string;
  tone: string;
  platform: string;
}

export interface LoveLetter {
  id: string;
  timestamp: Date;
  mood: LeadershipMood;
  thoughtDump: string;
  output: string;
}
