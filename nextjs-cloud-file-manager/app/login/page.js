import React from 'react';
import LoginForm from '@/components/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex-grow bg-gray-100 dark:bg-gray-700 overflow-hidden">
      {/* Background blurred shapes */}
      <div className="flex-grow h-0 relative sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="absolute top-16 -right-20 w-64 h-64 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute top-32 -left-10 w-40 h-40 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute top-96 left-18 w-56 h-56 bg-green-300 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
