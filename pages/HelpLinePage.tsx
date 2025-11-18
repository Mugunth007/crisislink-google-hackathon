
import React from 'react';

interface Helpline {
  name: string;
  number: string;
  description: string;
}

const HELPLINES: Helpline[] = [
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: 'Provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones.',
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Connect with a Crisis Counselor for free, 24/7 support. Text from anywhere in the US.',
  },
  {
    name: 'The Trevor Project',
    number: '1-866-488-7386',
    description: 'A national 24-hour, toll free confidential suicide hotline for LGBTQ youth.',
  },
  {
    name: 'National Domestic Violence Hotline',
    number: '1-800-799-7233',
    description: '24/7 confidential support for anyone experiencing domestic violence or questioning their relationship.',
  },
  {
    name: 'Disaster Distress Helpline',
    number: '1-800-985-5990',
    description: 'Provides immediate crisis counseling for people who are experiencing emotional distress related to any natural or human-caused disaster.',
  },
];

const HelplineCard: React.FC<{ helpline: Helpline }> = ({ helpline }) => {
  const isTextService = helpline.number.toLowerCase().includes('text');
  const phoneNumber = isTextService ? null : helpline.number.replace(/\D/g, '');

  return (
    <div className="bg-gray-100/50 dark:bg-zinc-900/50 p-6 rounded-2xl">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{helpline.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{helpline.description}</p>
      {phoneNumber ? (
        <a 
          href={`tel:${phoneNumber}`} 
          className="inline-block px-5 py-2 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          Call: {helpline.number}
        </a>
      ) : (
        <span className="inline-block px-5 py-2 rounded-full font-semibold bg-gray-500 text-white">
          {helpline.number}
        </span>
      )}
    </div>
  );
};

const HelpLinePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Crisis & Support Helplines
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400">
          If you are in immediate danger, please call 911. For other urgent situations, the following resources are available 24/7 to provide free, confidential support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {HELPLINES.map((helpline) => (
          <HelplineCard key={helpline.name} helpline={helpline} />
        ))}
      </div>
    </div>
  );
};

export default HelpLinePage;
