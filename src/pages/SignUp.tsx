
import React from 'react';
import { SignUpForm } from '@/components/auth/AuthForms';
import Header from '@/components/layout/Header';

const SignUp: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 py-12">
        <SignUpForm />
      </main>
    </div>
  );
};

export default SignUp;
