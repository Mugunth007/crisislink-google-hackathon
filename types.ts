
export type AgentType = 'Emergency' | 'Volunteer' | 'Safety' | 'SuicidePrevention';

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'error';
  content: string;
}
