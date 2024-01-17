'use client';

import React, { useState } from 'react';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [formType, setFormType] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // For registration
  const [password, setPassword] = useState('');
  const [password2, setConfirmPassword] = useState(''); // For registration
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage('');
    const endpoint = formType === 'login' ? 'token/' : 'register/';
    const body = formType === 'login' ? { username, password } : { username, email, password, password2 };

    // API request to the login or register endpoint
    try {
      const response = await fetch('https://127.0.0.1:8000/api/auth/' + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include', // Needed to handle cookies
      });

      if (!response.ok) {
        // Convert non-2xx HTTP responses into errors
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login/Registration failed');
      }
      var inThirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
      console.log('Expires cookie isAuthedC: ' + inThirtyMinutes);
      Cookies.set('isAuthedC', 't', { expires: inThirtyMinutes });

      // Handle successful login here (e.g., redirect to page)
      // router.push('/explorer');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-center px-6 py-12 lg:px-8 text-gray-900 dark:text-gray-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">{formType === 'login' ? 'Sign in to your account' : 'Sign up for an account'}</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 opacity-90 p-8 rounded-lg shadow-lg z-10 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="bg-gray-100 dark:bg-gray-700 placeholder:text-gray-400 block w-full rounded-md border-0 py-1.5 px-2.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-200 dark:focus:ring-blue-700 sm:text-sm sm:leading-6"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {formType === 'register' && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-gray-100 dark:bg-gray-700 placeholder:text-gray-400 block w-full rounded-md border-0 py-1.5 px-2.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-200 dark:focus:ring-blue-700 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={formType === 'register' ? 'new-password' : 'current-password'}
                required
                className="bg-gray-100 dark:bg-gray-700 placeholder:text-gray-400 block w-full rounded-md border-0 py-1.5 px-2.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-200 dark:focus:ring-blue-700 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {formType === 'register' && (
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirm_password" className="block text-sm font-medium leading-6">
                  Confirm password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="bg-gray-100 dark:bg-gray-700 placeholder:text-gray-400 block w-full rounded-md border-0 py-1.5 px-2.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-200 dark:focus:ring-blue-700 sm:text-sm sm:leading-6"
                  value={password2}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          {formType === 'login' ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button className="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setFormType('register')}>
                Register
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button className="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setFormType('login')}>
                Login
              </button>
            </p>
          )}
        </div>

        {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
