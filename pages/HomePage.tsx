
import React from 'react';
import type { Page } from '../App';
import { EmergencyIcon, VolunteerIcon, SafetyIcon } from '../components/icons';

interface HomePageProps {
  setPage: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.FC, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-gray-100/50 dark:bg-zinc-900/50 p-6 rounded-2xl text-center flex flex-col items-center">
        <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full mb-4">
           <Icon />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  return (
    <div className="w-full">
        {/* Hero Section */}
        <section className="text-center py-20 lg:py-32 px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Immediate support, guided by intelligence.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                CrisisLink connects you to specialized AI agents for emergency response, volunteer coordination, and safety preparation, providing clear and instant guidance when it matters most.
            </p>
            <button
                onClick={() => setPage('chat')}
                className="px-8 py-3 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
            >
                Get Help Now
            </button>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-[#1C1C1E] px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Your Direct Line to Assistance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={EmergencyIcon}
                        title="Emergency Response"
                        description="Get real-time instructions and information during critical events."
                    />
                    <FeatureCard 
                        icon={VolunteerIcon}
                        title="Coordinate Volunteers"
                        description="Organize and manage donation and volunteer efforts efficiently."
                    />
                    <FeatureCard 
                        icon={SafetyIcon}
                        title="Stay Prepared"
                        description="Access checklists and advice to prepare for any potential crisis."
                    />
                </div>
            </div>
        </section>
        
        <footer className="text-center py-8 border-t border-black/10 dark:border-white/10">
          <p className="text-gray-500 dark:text-gray-400">© 2025 CrisisLink. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default HomePage;
