
import React from 'react';
import PoliticalClientSignUpForm from '@/components/auth/PoliticalClientSignUpForm';
import Header from '@/components/layout/Header';
import ThreeBackground from '@/components/ThreeBackground';

const PoliticalClientSignUp: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Add the ThreeBackground component */}
      <ThreeBackground />
      
      {/* Header and main content */}
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 py-12 relative z-10">
        <div className="bg-white/95 dark:bg-gray-800/95 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <PoliticalClientSignUpForm />
        </div>
      </main>
    </div>
  );
};

export default PoliticalClientSignUp;
