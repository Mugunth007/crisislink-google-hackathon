
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ChatPage from './pages/ChatPage';
import HelpLinePage from './pages/HelpLinePage';

export type Page = 'home' | 'about' | 'helpline' | 'chat';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage setPage={setPage} />;
      case 'about':
        return <AboutPage />;
      case 'helpline':
        return <HelpLinePage />;
      case 'chat':
        return <ChatPage />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 overflow-x-hidden font-sans antialiased">
      <Navbar currentPage={page} setPage={setPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
