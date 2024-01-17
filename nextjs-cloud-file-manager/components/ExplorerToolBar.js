'use client';
import React from 'react';

const ExplorerToolBar = ({ onUploadClick, onAddFile, onAddFolder, onCopy, onMove, onDownload, onRename, onDelete }) => {
  return (
    <div className="flex shrink-0 items-center justify-between x-scroll h-11 bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b-2 border-gray-200 dark:border-gray-700">
      <div className="flex space-x-2 pr-4 border-r-2 border-gray-200 dark:border-gray-700">
        <button onClick={onUploadClick} className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M12 12.5858L16.2426 16.8284L14.8284 18.2426L13 16.415V22H11V16.413L9.17157 18.2426L7.75736 16.8284L12 12.5858ZM12 2C15.5934 2 18.5544 4.70761 18.9541 8.19395C21.2858 8.83154 23 10.9656 23 13.5C23 16.3688 20.8036 18.7246 18.0006 18.9776L18.0009 16.9644C19.6966 16.7214 21 15.2629 21 13.5C21 11.567 19.433 10 17.5 10C17.2912 10 17.0867 10.0183 16.8887 10.054C16.9616 9.7142 17 9.36158 17 9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9C7 9.36158 7.03838 9.7142 7.11205 10.0533C6.91331 10.0183 6.70879 10 6.5 10C4.567 10 3 11.567 3 13.5C3 15.2003 4.21241 16.6174 5.81986 16.934L6.00005 16.9646L6.00039 18.9776C3.19696 18.7252 1 16.3692 1 13.5C1 10.9656 2.71424 8.83154 5.04648 8.19411C5.44561 4.70761 8.40661 2 12 2Z"
              fill="currentColor"
            ></path>
          </svg>
          Upload
        </button>
        <button onClick={onAddFile} className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 11V8H13V11H16V13H13V16H11V13H8V11H11Z"
              fill="currentColor"
            ></path>
          </svg>
          Add file
        </button>
        <button onClick={onAddFolder} className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM4 5V19H20V7H11.5858L9.58579 5H4ZM11 12V9H13V12H16V14H13V17H11V14H8V12H11Z"
              fill="currentColor"
            ></path>
          </svg>
          Add folder
        </button>
      </div>

      <div className="flex space-x-3 mx-4">
        <button onClick={onCopy} className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"
              fill="currentColor"
            ></path>
          </svg>
          Copy
        </button>
        <button onClick={onMove} className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M4 18.9997H20V13.9997H22V19.9997C22 20.552 21.5523 20.9997 21 20.9997H3C2.44772 20.9997 2 20.552 2 19.9997V13.9997H4V18.9997ZM16.1716 6.9997L12.2218 3.04996L13.636 1.63574L20 7.9997L13.636 14.3637L12.2218 12.9495L16.1716 8.9997H5V6.9997H16.1716Z"
              fill="currentColor"
            ></path>
          </svg>
          Move
        </button>
        <button onClick={onDownload} className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M13 13V18.585L14.8284 16.7574L16.2426 18.1716L12 22.4142L7.75736 18.1716L9.17157 16.7574L11 18.585V13H13ZM12 2C15.5934 2 18.5544 4.70761 18.9541 8.19395C21.2858 8.83154 23 10.9656 23 13.5C23 16.3688 20.8036 18.7246 18.0006 18.9776L18.0009 16.9644C19.6966 16.7214 21 15.2629 21 13.5C21 11.567 19.433 10 17.5 10C17.2912 10 17.0867 10.0183 16.8887 10.054C16.9616 9.7142 17 9.36158 17 9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9C7 9.36158 7.03838 9.7142 7.11205 10.0533C6.91331 10.0183 6.70879 10 6.5 10C4.567 10 3 11.567 3 13.5C3 15.2003 4.21241 16.6174 5.81986 16.934L6.00005 16.9646L6.00039 18.9776C3.19696 18.7252 1 16.3692 1 13.5C1 10.9656 2.71424 8.83154 5.04648 8.19411C5.44561 4.70761 8.40661 2 12 2Z"
              fill="currentColor"
            ></path>
          </svg>
          Download
        </button>
        <button onClick={onRename} className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"
              fill="currentColor"
            ></path>
          </svg>
          Rename
        </button>
        <button onClick={onDelete} className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
              fill="currentColor"
            ></path>
          </svg>
          Delete
        </button>
      </div>

      <div className="flex space-x-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
        <button className="button-style">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 icon-style">
            <path
              d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"
              fill="currentColor"
            ></path>
          </svg>
          All tools
        </button>
      </div>
    </div>
  );
};

export default ExplorerToolBar;
