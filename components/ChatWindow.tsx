
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AgentType, Message } from '../types';
import { streamAgentResponse } from '../services/api';
import { EmergencyIcon, VolunteerIcon, SafetyIcon, SendIcon, SuicidePreventionIcon } from './icons';

interface ChatWindowProps {
  selectedAgent: AgentType;
  sessionId: string | null;
  sessionError: string | null;
  agentId: string;
}

const AGENT_DETAILS: Record<AgentType, { name: string; icon: React.FC; welcome: string }> = {
  Emergency: {
    name: 'Emergency Response',
    icon: EmergencyIcon,
    welcome: 'Welcome to the Emergency Response channel. How can I assist you with the current crisis?',
  },
  Volunteer: {
    name: 'Volunteer & Donation',
    icon: VolunteerIcon,
    welcome: 'Hello! This is the Volunteer & Donation hub. How would you like to contribute?',
  },
  Safety: {
    name: 'Safety & Preparation',
    icon: SafetyIcon,
    welcome: 'Welcome to Safety & Preparation. Ask me anything about staying safe and preparing for emergencies.',
  },
  SuicidePrevention: {
    name: 'Suicide Prevention',
    icon: SuicidePreventionIcon,
    welcome: 'You are not alone. I am here to listen and provide support. Please tell me what\'s on your mind.',
  },
};

const ChatMessage: React.FC<{ message: Message }> = React.memo(({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  const baseBubbleClasses = 'p-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg break-words';
  
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white'
    : isError
    ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
    : 'bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white';
    
  return (
    <div className={`flex my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${baseBubbleClasses} ${bubbleClasses}`}>
        <p className="text-base whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
});


const ChatWindow: React.FC<ChatWindowProps> = ({ selectedAgent, sessionId, sessionError, agentId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agentDetails = AGENT_DETAILS[selectedAgent];

  useEffect(() => {
    setMessages([{
      id: 'welcome-message',
      role: 'agent',
      content: agentDetails.welcome,
    }]);
  }, [selectedAgent, agentDetails.welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping || !sessionId) {
      if (!sessionId) {
          setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              role: 'error',
              content: sessionError || "Cannot send message: no active session. Please wait or select an agent.",
          }]);
      }
      return;
    }

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userInput.trim(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);

    let agentMessageId: string | null = null;
    
    await streamAgentResponse(
      userInput.trim(),
      sessionId,
      agentId,
      (chunk) => {
        setMessages(prevMessages => {
          if (agentMessageId) {
             const lastMessage = prevMessages[prevMessages.length - 1];
             if (lastMessage?.id === agentMessageId && lastMessage.role === 'agent') {
                return [
                  ...prevMessages.slice(0, -1),
                  { ...lastMessage, content: lastMessage.content + chunk }
                ];
             }
          }
          const newAgentMessageId = crypto.randomUUID();
          agentMessageId = newAgentMessageId;
          return [
            ...prevMessages,
            { id: newAgentMessageId, role: 'agent', content: chunk }
          ];
        });
      },
      (error) => {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'error',
          content: `An error occurred: ${error.message}`,
        }]);
      },
      () => {
        setIsTyping(false);
      }
    );
  }, [userInput, isTyping, sessionId, sessionError, agentId]);

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#121212]">
      <header className="flex-shrink-0 flex items-center p-4 border-b border-black/10 dark:border-white/10 bg-gray-100/80 dark:bg-zinc-950/80 backdrop-blur-2xl z-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 mr-4">
          <agentDetails.icon />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{agentDetails.name}</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {sessionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Session Error: </strong>
            <span className="block sm:inline">{sessionError}</span>
          </div>
        )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && (
             <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 flex-shrink-0 bg-transparent">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping || !!sessionError}
            className="w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-gray-200 dark:bg-zinc-800 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isTyping || !!sessionError}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-white rounded-full transition-colors duration-200 ease-in-out
                       enabled:bg-blue-600 enabled:hover:bg-blue-700
                       disabled:bg-gray-300 disabled:dark:bg-zinc-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;