
import React from 'react';
import PoliticalClientSignUpForm from '@/components/auth/PoliticalClientSignUpForm';
import Header from '@/components/layout/Header';

const PoliticalClientSignUp: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 py-12">
        <PoliticalClientSignUpForm />
      </main>
    </div>
  );
};

export default PoliticalClientSignUp;
