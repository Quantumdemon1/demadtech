
import React from 'react';
import Header from '@/components/layout/Header';

const LoadingState: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container py-8">
        <div className="animate-fade-in flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-campaign-orange mx-auto"></div>
            <p className="text-muted-foreground">Loading campaign details...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoadingState;
