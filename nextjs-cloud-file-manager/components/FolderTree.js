'use client';

import React, { useState, useEffect } from 'react';
import { fetcher } from '@/utils/fetcher';

const FolderTree = ({ selectedFolder, onFolderSelect, openedFolders, setOpenedFolders, prefetchedFolders, setPrefetchedFolders }) => {
  const [rootFolders, setRootFolders] = useState([]);
  const [folderErrors, setFolderErrors] = useState({});

  const fetchFolders = async (parentId) => {
    const endpoint = parentId ? `/folders/${parentId}/child-folders/` : `/folders/root/`;
    try {
      // Use the fetcher utility for the API call
      const response = await fetcher(endpoint);
      setFolderErrors((prevErrors) => ({ ...prevErrors, [parentId]: null }));
      return response.data;
    } catch (error) {
      // Handle or throw the error as appropriate
      console.error('Error fetching folders:', error);
      setFolderErrors((prevErrors) => ({
        ...prevErrors,
        [parentId]: error.toString(), // Storing the error as a string
      }));

      throw error;
    }
  };

  // TODO: Handle error on initial request
  useEffect(() => {
    fetchFolders(null).then((data) => {
      setRootFolders(data);
    });
  }, []);

  const toggleFolder = async (folderId, parentId = null) => {
    console.log('ToggleFolder async call, rootFolders = ', rootFolders);
    console.log('ToggleFolder async call, folderId = ', folderId);
    console.log('ToggleFolder async call, parentId = ', parentId);

    if (openedFolders[folderId]) {
      setOpenedFolders({ ...openedFolders, [folderId]: !openedFolders[folderId] });
    } else {
      if (!prefetchedFolders[folderId]) {
        try {
          const childFolders = await fetchFolders(folderId);
          setPrefetchedFolders({
            ...prefetchedFolders,
            [folderId]: { parent: parentId, children: childFolders },
          });
        } catch (error) {
          console.log('Failed to fetch child folder:', error);
        }
      }
      setOpenedFolders({ ...openedFolders, [folderId]: true });
    }
    onFolderSelect(folderId);

    console.log('ToggleFolder async call, END openedFolders:', openedFolders);
    console.log('ToggleFolder async call, END prefetchedFolders:', prefetchedFolders);
  };

  const renderFolderTree = (folders, parentId) => {
    return (
      <ul className="flex-grow h-full flex flex-col w-full pl-[16px]">
        {folders.map((folder) => (
          <li key={folder.id} className="rounded-md w-full">
            <div
              onClick={() => toggleFolder(folder.id, parentId)}
              className={`flex w-full items-center cursor-pointer whitespace-nowrap rounded-sm px-1 text-gray-800 dark:text-gray-200 ${
                selectedFolder === folder.id ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-975' : 'hover:bg-gray-200 dark:hover:bg-gray-925'
              }`}
              title={folder.name}
            >
              {/* Folder icon, or error folder icon */}
              <div className={`mr-2 ${folderErrors[folder.id] ? 'text-red-500' : 'text-folder dark:text-folder-dark'}`} title={`${folderErrors[folder.id]}`}>
                {folderErrors[folder.id] ? (
                  // Error folder icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
                    <path
                      d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM11 9V14H13V9H11ZM11 15V17H13V15H11Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                ) : (
                  // Folder icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
                    <path
                      d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                )}
              </div>

              <span className="pr-2">{folder.name}</span>
            </div>
            {openedFolders[folder.id] && prefetchedFolders[folder.id] && <>{renderFolderTree(prefetchedFolders[folder.id].children, folder.id)}</>}
          </li>
        ))}
      </ul>
    );
  };

  return <>{renderFolderTree(rootFolders)}</>;
};

export default FolderTree;
