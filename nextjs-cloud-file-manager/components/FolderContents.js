'use client';
import React, { useState, useEffect } from 'react';
import { fetcher } from '@/utils/fetcher';
import { formatBytes } from '@/utils/formatBytes';
import { formatDate } from '@/utils/formatDate';

const FolderContents = ({ viewType, currentFolder, onFolderSelect, selectedItems, onSlectItems }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolderContents = async () => {
      setIsLoading(true);
      try {
        const folderContents = await fetcher(`/folders/${currentFolder}/`);
        setFiles(folderContents.data.files);
        setFolders(folderContents.data.child_folders);
        setError(null);
      } catch (error) {
        console.error('Error fetching folder contents:', error);
        setError('Failed to load folder contents');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentFolder) {
      fetchFolderContents();
    }
  }, [currentFolder]);

  const renderTable = () => {
    return (
      <table className="min-w-full">
        {/* Table headers */}
        <thead className="border-b bg-gray-200 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <tr>
            <th scope="col" className="text-sm font-medium px-6 py-4 text-left whitespace-nowrap">
              Name
            </th>
            <th scope="col" className="text-sm font-medium px-6 py-4 text-left whitespace-nowrap">
              Size
            </th>
            <th scope="col" className="text-sm font-medium px-6 py-4 text-left whitespace-nowrap">
              Date uploaded
            </th>
            <th scope="col" className="text-sm font-medium px-6 py-4 text-left whitespace-nowrap">
              Last modified
            </th>
            <th scope="col" className="text-sm font-medium px-6 py-4 text-left whitespace-nowrap">
              Date created
            </th>
          </tr>
        </thead>

        <tbody className="overflow-hidden overflow-y-scroll">
          {folders.map((folder) => (
            <tr key={folder.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-selection dark:hover:bg-selection-dark">
              <td
                title={folder.name}
                className="cursor-pointer text-sm font-medium px-6 py-4 whitespace-nowrap text-folder dark:text-folder-dark"
                onClick={() => onFolderSelect(folder.id)}
              >
                {folder.name}
              </td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap"></td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap"></td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap"></td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap"></td>
            </tr>
          ))}
          {files.map((file) => (
            <tr key={file.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-selection dark:hover:bg-selection-dark">
              <td title={file.name} className="cursor-pointer text-sm font-medium px-6 py-4 whitespace-nowrap">
                {file.name}
              </td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap">{formatBytes(file.size)}</td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap" title={file.date_uploaded}>
                {formatDate(file.date_uploaded)}
              </td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap" title={file.last_modified}>
                {formatDate(file.last_modified)}
              </td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap" title={file.meta_date_created}>
                {formatDate(file.meta_date_created)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderTiles = () => {
    return (
      <div className="p-5 flex flex-wrap items-stretch gap-4">
        {folders.map((folder) => (
          <div
            key={folder.name}
            title={folder.name}
            onClick={() => onFolderSelect(folder.id)}
            className="relative flex flex-col button-border p-4 rounded w-36 h-40 items-center cursor-pointer hover:bg-selection dark:hover:bg-selection-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="opacity-80 text-folder dark:text-folder-dark w-16 h-16 flex-grow shrink-0 pb-4">
              <path
                d="M22 8V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V7H21C21.5523 7 22 7.44772 22 8ZM12.4142 5H2V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5Z"
                fill="currentColor"
              ></path>
            </svg>
            <div className="absolute inset-0 p-2 flex flex-col items-center">
              <p className="truncate w-full mt-auto">{folder.name}</p>
            </div>
          </div>
        ))}
        {files.map((file) => (
          <div
            key={file.name}
            title={file.name}
            className="relative flex flex-col button-border p-4 rounded w-36 h-40 items-center cursor-pointer hover:bg-selection dark:hover:bg-selection-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="text-gray-200 dark:text-gray-800 w-16 h-16 flex-grow shrink-0 pb-4">
              <path
                d="M3 8L9.00319 2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8ZM10 3.5L4.5 9H10V3.5Z"
                fill="currentColor"
              ></path>
            </svg>
            <div className="absolute inset-0 p-2 flex flex-col items-center">
              <p className="truncate w-full mt-auto">{file.name}</p>
              <p className="whitespace-nowrap font-light">{formatBytes(file.size)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex-grow x-scroll overflow-auto overflow-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {(isLoading || error) && (
        <div className="absolute inset-0 w-full bg-gray-100/90 dark:bg-gray-900/90 flex flex-col justify-center items-center">
          {isLoading && <div>Loading...</div>}
          {error && <div className="text-red-500 rounded-lg bg-gray-100 dark:bg-gray-900 px-2">Error: {error}</div>}
        </div>
      )}

      {/* View render */}
      {viewType === 'table' ? renderTable() : renderTiles()}
    </div>
  );
};

export default FolderContents;
