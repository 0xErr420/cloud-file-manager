import MainSideBar from '@/components/MainSideBar';

export default function RootLayout({ children }) {
  return (
    <div className="flex-grow h-full flex bg-background dark:bg-background-dark">
      {/* Left side */}
      <MainSideBar />

      {/* Right side */}
      {/* Children pages */}
      {children}
    </div>
  );
}
