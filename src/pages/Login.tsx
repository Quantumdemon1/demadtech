
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 py-12 px-4 md:px-8">
        <div className="w-full animate-fade-in-up">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
