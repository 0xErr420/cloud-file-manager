'use client';
import React, { useState } from 'react';
import ExplorerToolBar from '@/components/ExplorerToolBar';
import ExplorerNavigationBar from '@/components/ExplorerNavigationBar';
import FolderTree from '@/components/FolderTree';
import FolderContents from '@/components/FolderContents';
import FileUpload from '@/components/FileUpload';

const Explorer = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewType, setViewType] = useState('table'); // Options: 'table', 'tiles'

  const [currentFolder, setCurrentFolder] = useState(null);
  const [uploadFolder, setUploadFolder] = useState(null);
  const [openedFolders, setOpenedFolders] = useState({});
  const [prefetchedFolders, setPrefetchedFolders] = useState({});
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);

  const constructPath = (folderId, folders) => {
    if (!folderId || !folders[folderId]) return '';

    const folder = folders[folderId];
    const parentPath = constructPath(folder.parentId, folders);
    console.log('PATH BUILD --- folder:', folder);
    console.log('PATH BUILD --- folders:', folders);
    return `${parentPath}/${folder.name}`;
  };

  const openUploadWindow = () => setIsUploadOpen(true);
  const closeUploadWindow = () => setIsUploadOpen(false);
  const onFolderSelect = (folderId) => {
    setCurrentFolder(folderId);
    console.log('setCurrentFolder:', folderId, '    uploadFolder:', uploadFolder);

    // Update the path
    // const newPath = constructPath(folderId, prefetchedFolders);
    // console.log('newPath: ', newPath);
    // setCurrentPath(newPath);
  };

  return (
    <div className="flex-grow h-full flex flex-col x-scroll">
      {/* Top row */}
      <ExplorerToolBar onUploadClick={openUploadWindow} />
      <ExplorerNavigationBar
        onNavigateToRoot={() => {
          onFolderSelect(null);
        }}
      />

      {/* Bottom row */}
      <div className="flex main-content relative">
        {/* Left side */}
        <div className="w-52 flex flex-col shrink-0 x-scroll py-2 pr-2 bg-gray-100 dark:bg-gray-900 border-r-2 border-gray-200 dark:border-gray-700">
          <div className="w-fit min-w-full flex-grow overflow-hidden overflow-y-auto scrollbar-hide">
            <FolderTree
              selectedFolder={currentFolder}
              onFolderSelect={onFolderSelect}
              openedFolders={openedFolders}
              setOpenedFolders={setOpenedFolders}
              prefetchedFolders={prefetchedFolders}
              setPrefetchedFolders={setPrefetchedFolders}
            />
          </div>
        </div>

        {/* Right side */}
        <FolderContents viewType={viewType} currentFolder={currentFolder} onFolderSelect={onFolderSelect} />

        {/* Switcher button */}
        <div className="absolute bottom-2 right-2">
          <button onClick={() => setViewType(viewType === 'table' ? 'tiles' : 'table')} className="button-style">
            {viewType === 'table' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
                <path
                  d="M22 12.999V20C22 20.5523 21.5523 21 21 21H13V12.999H22ZM11 12.999V21H3C2.44772 21 2 20.5523 2 20V12.999H11ZM11 3V10.999H2V4C2 3.44772 2.44772 3 3 3H11ZM21 3C21.5523 3 22 3.44772 22 4V10.999H13V3H21Z"
                  fill="currentColor"
                ></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
                <path
                  d="M3 3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H3ZM11 5V8H4V5H11ZM4 14V10H11V14H4ZM4 16H11V19H4V16ZM13 16H20V19H13V16ZM20 14H13V10H20V14ZM20 5V8H13V5H20Z"
                  fill="currentColor"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Upload window overlay on the front */}
      <FileUpload
        isOpen={isUploadOpen}
        onClose={closeUploadWindow}
        uploadFolder={uploadFolder}
        setUploadFolder={(folderId) => {
          setUploadFolder(folderId);
          console.log('  currentFolder:', currentFolder);
          console.log('setUploadFolder:', folderId);
        }}
        openedFolders={openedFolders}
        setOpenedFolders={setOpenedFolders}
        prefetchedFolders={prefetchedFolders}
        setPrefetchedFolders={setPrefetchedFolders}
      />
    </div>
  );
};

export default Explorer;
