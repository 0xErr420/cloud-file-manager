'use client';
import React, { useEffect, useState } from 'react';

const getInitialTheme = () => {
  if (typeof document !== 'undefined') {
    const themeCookie = document.cookie.split('; ').find((row) => row.startsWith('theme='));
    if (themeCookie) {
      const themeValue = themeCookie.split('=')[1];
      return themeValue === 'dark' ? 'dark' : 'light';
    }
  }
  return 'light'; // Default theme
};

const ThemeSwitch = () => {
  // Determine if the dark mode is enabled on initial load
  const [isDark, setIsDark] = useState(getInitialTheme() === 'dark');

  const setCookie = (name, value) => {
    const maxAge = 182 * 24 * 60 * 60; // Convert days to seconds (182 days should be enough)
    document.cookie = `${name}=${value};max-age=${maxAge};path=/`;
  };

  // This effect runs once on mount and whenever 'isDark' changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      setCookie('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setCookie('theme', 'light');
    }
  }, [isDark]); // Only re-run the effect if 'isDark' changes

  return (
    <button onClick={() => setIsDark(!isDark)} className="rounded-full">
      <div className={`relative w-14 h-8 bg-gray-200 dark:bg-gray-600 rounded-full p-1 transition-all duration-300`}>
        <div
          className={`absolute left-1 top-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-400 w-6 h-6 rounded-full transition-all duration-300 ${
            isDark ? 'translate-x-6' : ''
          }`}
        >
          {isDark ? (
            // Moon Icon for Dark Mode
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M11.3807 2.01886C9.91573 3.38768 9 5.3369 9 7.49999C9 11.6421 12.3579 15 16.5 15C18.6631 15 20.6123 14.0843 21.9811 12.6193C21.6613 17.8537 17.3149 22 12 22C6.47715 22 2 17.5228 2 12C2 6.68514 6.14629 2.33869 11.3807 2.01886Z"
                fill="white"
              />
            </svg>
          ) : (
            // Sun Icon for Light Mode
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"
                fill="black"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeSwitch;
