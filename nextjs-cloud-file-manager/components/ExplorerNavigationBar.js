'use client';
import React from 'react';

const ExplorerNavigationBar = ({ onNavigateToRoot, onBack, onForth, onNavigateUp, onRefresh, currentPath, onNavigatePath, onSearch }) => {
  return (
    <div className="flex shrink-0 items-center justify-between x-scroll h-10 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 text-black dark:text-white">
      <div className="flex space-x-1 pr-3">
        <button onClick={onNavigateToRoot} className="button-style button-border">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M13 19H19V9.97815L12 4.53371L5 9.97815V19H11V13H13V19ZM21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20Z"
              fill="currentColor"
            ></path>
          </svg>
          Main
        </button>
        <button onClick={onBack} className="button-style button-border">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
            <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z" fill="currentColor"></path>
          </svg>
        </button>
        <button onClick={onForth} className="button-style button-border">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" fill="currentColor"></path>
          </svg>
        </button>
        <button onClick={onNavigateUp} className="button-style button-border">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
            <path d="M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z" fill="currentColor"></path>
          </svg>
        </button>
        <button onClick={onRefresh} className="button-style button-border">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
            <path
              d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>

      <div className="flex-grow px-3">
        {/* Display the current path */}
        <div className="flex bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
          <div className="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-gray-600 dark:text-gray-400">
              <path
                d="M4 5V19H20V7H11.5858L9.58579 5H4ZM12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <span className="pl-1 pr-0 py-0.5 text-sm text-gray-700 dark:text-gray-300">Path://</span>
          <input type="text" className="border-0 flex-grow py-0.5 ml-0.5 pr-1 text-sm bg-transparent" placeholder={currentPath} />
        </div>
      </div>

      <div className="pl-3">
        {/* Search area */}
        <div className="flex border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
          <input type="text" className="px-3 py-0.5 text-sm text-gray-700 bg-gray-100 dark:bg-gray-800" placeholder="Search" />
          <button className="p-1 bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-gray-600 dark:text-gray-400">
              <path
                d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplorerNavigationBar;
