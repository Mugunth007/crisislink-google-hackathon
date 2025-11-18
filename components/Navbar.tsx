
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './icons';
import type { Page } from '../App';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const NavLink: React.FC<{
  pageName: Page;
  currentPage: Page;
  setPage: (page: Page) => void;
  children: React.ReactNode;
}> = ({ pageName, currentPage, setPage, children }) => {
  const isActive = currentPage === pageName;
  return (
    <button
      onClick={() => setPage(pageName)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'text-gray-900 dark:text-white'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

const ThemeToggleButton: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      setIsDark(isCurrentlyDark);
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDark(!isDark);
        if (document.documentElement.classList.contains('dark')) {
             localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};

const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage }) => {
  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-white/70 dark:bg-[#121212]/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <button onClick={() => setPage('home')} className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-blue-600 text-white rounded-lg px-2 py-0.5">C</span>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">CrisisLink</span>
          </button>
          <div className="hidden md:flex items-center space-x-2">
            <NavLink pageName="home" currentPage={currentPage} setPage={setPage}>Home</NavLink>
            <NavLink pageName="about" currentPage={currentPage} setPage={setPage}>Use Cases</NavLink>
            <NavLink pageName="helpline" currentPage={currentPage} setPage={setPage}>Helplines</NavLink>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggleButton />
          <button
            onClick={() => setPage('chat')}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Get Help Now
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
