
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;
