
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';

const NotFoundState: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold">Campaign Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-4 bg-campaign-orange hover:bg-campaign-orange-dark">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFoundState;
