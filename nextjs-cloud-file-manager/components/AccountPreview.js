'use client';
import React, { useEffect, useState } from 'react';

const AccountPreview = () => {
  const [username, setUsername] = useState('Login');

  useEffect(() => {
    // Fetch the username from the API
    const fetchUsername = async () => {
      const response = await fetch('https://127.0.0.1:8000/api/account/', {
        credentials: 'include', // Ensure cookies are sent
      });
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      } else {
        // Handle error or set a default username
        setUsername('Guest');
      }
    };

    fetchUsername();
  }, []);

  return (
    <>
      <span className="text-black dark:text-white">{username}</span>
      <div className="rounded-full bg-gray-300 dark:bg-gray-700 p-2 w-10 h-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </>
  );
};

export default AccountPreview;
