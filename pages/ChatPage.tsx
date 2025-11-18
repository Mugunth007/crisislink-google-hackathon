import React, { useState, useEffect, useCallback } from 'react';
import AgentSelector from '../components/AgentSelector';
import ChatWindow from '../components/ChatWindow';
import type { AgentType } from '../types';
import { createSession } from '../services/api';

const AGENT_ID_MAP: Record<AgentType, string> = {
  Emergency: 'emergency_response_agent',
  Volunteer: 'volunteer_donation_agent',
  Safety: 'safety_preparation_agent',
  SuicidePrevention: 'suicide_prevention_agent',
};

const ChatPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('Emergency');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  const handleCreateSession = useCallback(async (agent: AgentType) => {
    const agentId = AGENT_ID_MAP[agent];
    setIsSessionLoading(true);
    setSessionError(null);
    setSessionId(null);
    try {
      console.log(`Creating session for ${agent} with id ${agentId}...`);
      const newSessionId = await createSession(agentId);
      setSessionId(newSessionId);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setSessionError(error.message);
      } else {
        setSessionError("An unknown error occurred while creating a session.");
      }
    } finally {
      setIsSessionLoading(false);
    }
  }, []);
  
  // Effect to create a session when the component mounts for the first time
  useEffect(() => {
      handleCreateSession(selectedAgent);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSelectAgent = (agent: AgentType) => {
    if (agent !== selectedAgent) {
      setSelectedAgent(agent);
      handleCreateSession(agent);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-screen overflow-hidden">
      <AgentSelector 
        selectedAgent={selectedAgent} 
        onSelectAgent={handleSelectAgent} 
        isSessionLoading={isSessionLoading} 
      />
      <ChatWindow 
        selectedAgent={selectedAgent} 
        sessionId={sessionId}
        sessionError={sessionError}
        agentId={AGENT_ID_MAP[selectedAgent]}
      />
    </div>
  );
};

export default ChatPage;