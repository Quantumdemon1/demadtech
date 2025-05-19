
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Edit, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PoliticalClientLayout from '@/components/layout/PoliticalClientLayout';
import useAuth from '@/hooks/useAuth';
import { getPoliticalClientInitiativesAPI } from '@/services/api';
import { Initiative } from '@/types';

const PoliticalClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const loginUsername = user?.loginUsername || '';
  
  const { data: initiatives, isLoading, isError, error } = useQuery({
    queryKey: ['politicalClientInitiatives', loginUsername],
    queryFn: () => getPoliticalClientInitiativesAPI(loginUsername),
    enabled: !!loginUsername
  });

  if (isError) {
    toast.error(`Error loading initiatives: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return (
    <PoliticalClientLayout title="Political Client Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Initiatives</h2>
          <Button asChild>
            <Link to="/political-client/initiative/create">
              <Plus className="mr-2 h-4 w-4" /> Create New Initiative
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : initiatives && initiatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((initiative: Initiative) => (
              <Card key={initiative.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{initiative.initiativeName}</CardTitle>
                      <CardDescription>Status: {initiative.status}</CardDescription>
                    </div>
                    {initiative.initiativeImageUrl && (
                      <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                        <img 
                          src={initiative.initiativeImageUrl} 
                          alt={initiative.initiativeName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">{initiative.objective}</p>
                  {initiative.seedQuestions && initiative.seedQuestions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Seed Questions: {initiative.seedQuestions.length}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2 justify-between">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/political-client/initiative/edit/${initiative.id}`}>
                      <Edit className="mr-1 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/political-client/initiative/assets/${initiative.id}`}>
                      <FileImage className="mr-1 h-4 w-4" /> Manage Assets
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium mb-2">No Initiatives Found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first initiative to start engaging with donors.
            </p>
            <Button asChild>
              <Link to="/political-client/initiative/create">
                <Plus className="mr-2 h-4 w-4" /> Create New Initiative
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PoliticalClientLayout>
  );
};

export default PoliticalClientDashboard;
