
import React, { useState, useEffect } from 'react';
import type { AgentType } from '../types';
import { EmergencyIcon, VolunteerIcon, SafetyIcon, SuicidePreventionIcon } from './icons';

interface Agent {
  id: AgentType;
  name: string;
  icon: React.FC;
}

const AGENTS: Agent[] = [
  { id: 'Emergency', name: 'Emergency Response', icon: EmergencyIcon },
  { id: 'Volunteer', name: 'Volunteer & Donation', icon: VolunteerIcon },
  { id: 'Safety', name: 'Safety & Preparation', icon: SafetyIcon },
  { id: 'SuicidePrevention', name: 'Suicide Prevention', icon: SuicidePreventionIcon },
];

interface AgentSelectorProps {
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
  isSessionLoading: boolean;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ selectedAgent, onSelectAgent, isSessionLoading }) => {
  return (
    <aside className="h-full w-full md:w-72 lg:w-80 flex-shrink-0 p-4 bg-gray-100/60 dark:bg-zinc-900/60 backdrop-blur-2xl border-r border-black/10 dark:border-white/10 flex flex-col">
      <div className="flex items-center mb-10 px-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crisis Agents</h1>
      </div>
      <nav className="flex-grow space-y-2">
          {AGENTS.map((agent) => {
            const isSelected = agent.id === selectedAgent;
            return (
              <button
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                disabled={isSessionLoading}
                className={`w-full flex items-center p-3 rounded-xl text-left transition-all duration-200 ease-in-out
                  ${isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }
                  ${isSessionLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <agent.icon />
                <span className="ml-4">{agent.name}</span>
              </button>
            );
          })}
      </nav>
      <div className="mt-auto pt-4 text-xs text-center text-gray-400 dark:text-gray-500">
        <p>CrisisLink v1.0</p>
      </div>
    </aside>
  );
};

export default AgentSelector;
