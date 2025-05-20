
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4 md:p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
