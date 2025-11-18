
import React from 'react';
import { EmergencyIcon, VolunteerIcon, SafetyIcon, SuicidePreventionIcon } from '../components/icons';

const UseCaseCard: React.FC<{
  icon: React.FC;
  title: string;
  description: string;
  examples: string[];
}> = ({ icon: Icon, title, description, examples }) => {
  return (
    <div className="bg-gray-100/50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-transparent hover:border-blue-500/50 transition-all">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-lg mr-4">
          <Icon />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {examples.map((example, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-500 mr-2 mt-1">✓</span>
            <span className="text-gray-600 dark:text-gray-300">{example}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          How CrisisLink Works
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400">
          CrisisLink provides a suite of specialized AI agents designed to handle specific aspects of emergency management. Select an agent that best fits your needs for targeted and effective support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UseCaseCard
          icon={EmergencyIcon}
          title="Emergency Response"
          description="For immediate, life-threatening situations. This agent provides clear, step-by-step instructions based on established emergency protocols."
          examples={[
            "What are the warning signs of a heart attack?",
            "How to perform CPR on an adult.",
            "My area is under a flood warning, what should I do?"
          ]}
        />
        <UseCaseCard
          icon={VolunteerIcon}
          title="Volunteer & Donation"
          description="Coordinates community efforts. Use this agent to find volunteer opportunities, locate donation centers, or organize local aid initiatives."
          examples={[
            "Where can I donate non-perishable food?",
            "Find local shelters that need volunteers.",
            "How to start a clothing drive for flood victims."
          ]}
        />
        <UseCaseCard
          icon={SafetyIcon}
          title="Safety & Preparation"
          description="Focuses on proactive measures. This agent helps you prepare for potential disasters by providing checklists, safety tips, and planning advice."
          examples={[
            "Create a family emergency plan.",
            "What should be in a 72-hour survival kit?",
            "How to secure my home before a hurricane."
          ]}
        />
        <UseCaseCard
          icon={SuicidePreventionIcon}
          title="Suicide Prevention"
          description="A dedicated agent offering immediate, confidential support for individuals in emotional distress. It provides a safe space to talk and connects you with resources."
          examples={[
            "I'm feeling overwhelmed and don't know what to do.",
            "Talk to me about why I shouldn't give up.",
            "Connect me with a crisis hotline."
          ]}
        />
      </div>
    </div>
  );
};

export default AboutPage;
