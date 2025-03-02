
import React from 'react';
import { AccountForm } from '@/components/auth/AuthForms';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Account: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 py-12">
        <AccountForm />
      </main>
    </div>
  );
};

export default Account;
