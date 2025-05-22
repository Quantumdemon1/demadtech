
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';
import ThreeBackground from '@/components/ThreeBackground';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <Header />
      
      {/* Background */}
      <ThreeBackground />
      
      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-4 py-12 relative z-10">
        <div className="bg-white/95 dark:bg-gray-800/95 p-8 rounded-lg shadow-lg backdrop-blur-sm w-full max-w-2xl mx-auto">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
