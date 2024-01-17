import React from 'react';
import Link from 'next/link';

const MainSideBar = () => {
  // This will eventually come from your state or props
  const categories = [
    {
      name: 'Explorer',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
          <path
            d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM4 7V19H20V7H4Z"
            fill="currentColor"
          ></path>
        </svg>
      ),
      path: '/explorer',
    },
    // {
    //   name: 'Recent',
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
    //       <path
    //         d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"
    //         fill="currentColor"
    //       ></path>
    //     </svg>
    //   ),
    //   path: '/recent',
    // },
    // {
    //   name: 'Deleted',
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
    //       <path
    //         d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z"
    //         fill="currentColor"
    //       ></path>
    //     </svg>
    //   ),
    //   path: '/deleted',
    // },
    // {
    //   name: 'Shared',
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-style">
    //       <path
    //         d="M22 13H20V7H11.5858L9.58579 5H4V19H13V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5H21C21.5523 5 22 5.44772 22 6V13ZM18 17V13.5L23 18L18 22.5V19H15V17H18Z"
    //         fill="currentColor"
    //       ></path>
    //     </svg>
    //   ),
    //   path: '/shared',
    // },
  ];

  return (
    <aside className="w-44 shrink-0 overflow-hidden flex flex-col relative bg-sidebar dark:bg-sidebar-dark border-r-2 border-gray-200 dark:border-gray-700" aria-label="Sidebar">
      <div className="h-0 w-full">
        <div className="absolute top-4 left-32 w-20 h-20 bg-pink-300 dark:bg-pink-800 rounded-lg opacity-70"></div>
        <div className="absolute top-40 -left-14 w-40 h-40 bg-blue-300 dark:bg-blue-800 rounded-full opacity-70"></div>
        <div className="absolute top-96 left-18 w-56 h-56 bg-green-300 dark:bg-green-800 rounded-full opacity-70"></div>
      </div>

      <div className="flex-grow backdrop-blur-xl bg-white/30 dark:bg-black/30 bg-blend-multiply py-4 px-1.5 rounded">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={category.path}
                className="flex items-center p-2 text-base font-normal rounded-lg text-gray-900 dark:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-gray-700/40"
              >
                {category.icon}
                <span className="ml-3">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default MainSideBar;
