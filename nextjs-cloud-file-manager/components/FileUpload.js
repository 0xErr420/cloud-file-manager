'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatBytes } from '@/utils/formatBytes';
import { fetcher } from '@/utils/fetcher';
import FolderTree from './FolderTree';

const FileUpload = ({ isOpen, onClose, uploadFolder, setUploadFolder, openedFolders, setOpenedFolders, prefetchedFolders, setPrefetchedFolders }) => {
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    // Handle the files
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const clearFiles = () => {
    setFiles([]);
    setFileErrors({});
  };

  const handleUpload = async () => {
    // For now it uploads only to one folder
    // TODO: To upload different files to different folders we could implement it later

    if (files.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append('folder', uploadFolder);

    files.forEach((file) => {
      formData.append('file', file);
    });

    try {
      const response = await fetcher('/files/upload/', 'POST', formData, true);

      if (response.status === 200) {
        // Clear the files list
        setFiles([]);
        setFileErrors({});
      } else if (response.status === 207) {
        // Process failed uploads
        const failedUploads = response.data.failed;

        // Leave only those files that are failed to upload
        const failedUploadFilenames = failedUploads.map((failedUpload) => failedUpload.filename);
        const newFiles = files.filter((file) => failedUploadFilenames.includes(file.name));

        const newFileErrors = failedUploads.reduce((acc, failedFile) => {
          acc[failedFile.filename] = failedFile.message;
          return acc;
        }, {});

        setFiles(newFiles);
        setFileErrors(newFileErrors);
      }
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  useEffect(() => {
    // This function runs when the component unmounts
    return () => {
      // Loop through each file and revoke the object URL
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]); // Dependency array, cleanup runs when files change

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex justify-center items-center">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-center text-base font-bold leading-9 tracking-tight text-gray-700 dark:text-gray-300">Drag and drop files here, or click to select files</h3>

        <div className="flex space-x-3">
          <div className="w-52 x-scroll py-2 pr-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <FolderTree
              selectedFolder={uploadFolder}
              onFolderSelect={setUploadFolder}
              openedFolders={openedFolders}
              setOpenedFolders={setOpenedFolders}
              prefetchedFolders={prefetchedFolders}
              setPrefetchedFolders={setPrefetchedFolders}
            />
          </div>

          {/* Drag and Drop area */}
          <div
            {...getRootProps()}
            className={`relative w-96 h-96 bg-gray-100 dark:bg-gray-900 cursor-pointer border-2 border-dashed ${
              isDragActive
                ? 'border-blue-500 dark:border-blue-500 text-blue-500/30 dark:text-blue-500/30'
                : 'border-gray-200 dark:border-gray-800 text-gray-500/10 dark:text-gray-600/10'
            }  hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-500/30 dark:hover:text-blue-500/30`}
          >
            <input {...getInputProps()} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`absolute inset-0 m-auto w-20 h-20`}>
              <path
                d="M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM11 11H8V13H11V16H13V13H16V11H13V8H11V11Z"
                fill="currentColor"
              ></path>
            </svg>

            {/* Files list */}
            <ul className="overflow-auto scrollbar-hide space-y-2 w-full h-full flex flex-col p-3 text-gray-700 dark:text-gray-300">
              {files.map((file) => (
                <li key={file.path} title={file.path} className="flex space-x-2">
                  <div
                    className={`relative w-20 h-20 rounded overflow-hidden shrink-0 border ${fileErrors[file.name] ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    {/* Show error icon if failed while uploading for current file */}
                    {fileErrors[file.name] && (
                      <div title={fileErrors[file.name]} className="absolute w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-red-500">
                          <path
                            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    )}

                    {/* Show image preview or svg icon */}
                    {file.type.startsWith('image/') ? (
                      <img src={file.preview} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="text-gray-300 dark:text-gray-700 w-12 h-12">
                          <path
                            d="M9 2.00318V2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8L9 2.00318ZM5.82918 8H9V4.83086L5.82918 8ZM11 4V9C11 9.55228 10.5523 10 10 10H5V20H19V4H11Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow text-sm h-full px-1">
                    <p className="line-clamp-2 overflow-hidden mb-2">{file.path}</p>
                    <p className="flex justify-between text-gray-400 dark:text-gray-600">
                      <span className="tracking-wide line-clamp-1 overflow-hidden">{file.type}</span>
                      <span>{formatBytes(file.size)}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Close or Upload buttons */}

        <div className="flex mt-4">
          {/* Close button */}
          <button className="absolute top-2 right-2 p-2 hover:bg-gray-100 dark:hover:bg-black rounded text-gray-700 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-gray-600 dark:text-gray-400" onClick={onClose}>
              <path
                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
          {/* Clear selected files */}
          <button
            onClick={clearFiles}
            className="button-border font-bold text-md flex items-center hover:bg-gray-100 dark:hover:bg-black rounded text-gray-700 dark:text-gray-300 px-1.5 py-1 pr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 h-6 w-6 text-gray-600 dark:text-gray-400">
              <path
                d="M8.58564 8.85449L3.63589 13.8042L8.83021 18.9985L9.99985 18.9978V18.9966H11.1714L14.9496 15.2184L8.58564 8.85449ZM9.99985 7.44027L16.3638 13.8042L19.1922 10.9758L12.8283 4.61185L9.99985 7.44027ZM13.9999 18.9966H20.9999V20.9966H11.9999L8.00229 20.9991L1.51457 14.5113C1.12405 14.1208 1.12405 13.4877 1.51457 13.0971L12.1212 2.49053C12.5117 2.1 13.1449 2.1 13.5354 2.49053L21.3136 10.2687C21.7041 10.6592 21.7041 11.2924 21.3136 11.6829L13.9999 18.9966Z"
                fill="currentColor"
              ></path>
            </svg>
            Clear
          </button>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            className="ml-auto button-border font-bold text-md flex items-center hover:bg-gray-100 dark:hover:bg-black rounded text-gray-700 dark:text-gray-300 px-1.5 py-1 pr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-1 h-6 w-6 text-gray-600 dark:text-gray-400">
              <path d="M3 19H21V21H3V19ZM13 5.82843V17H11V5.82843L4.92893 11.8995L3.51472 10.4853L12 2L20.4853 10.4853L19.0711 11.8995L13 5.82843Z" fill="currentColor"></path>
            </svg>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
