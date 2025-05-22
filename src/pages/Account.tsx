
import React from 'react';
import AccountForm from '@/components/auth/AccountForm';
import Header from '@/components/layout/Header';
import useAuth from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import ThreeBackground from '@/components/ThreeBackground';
import { Skeleton } from '@/components/ui/skeleton';

const Account: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center p-4 py-12">
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Add ThreeBackground for visual consistency with other pages */}
      <ThreeBackground />
      
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 py-12 relative z-10">
        <div className="bg-white/95 dark:bg-gray-800/95 p-8 rounded-lg shadow-lg backdrop-blur-sm w-full animate-fade-in-up max-w-4xl">
          <AccountForm />
        </div>
      </main>
    </div>
  );
};

export default Account;
