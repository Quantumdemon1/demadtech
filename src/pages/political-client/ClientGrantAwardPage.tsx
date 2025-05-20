
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Award as AwardIcon, CheckCircle } from 'lucide-react';
import PoliticalClientLayout from '@/components/layout/PoliticalClientLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DonorSearch from '@/components/donors/DonorSearch';
import useAuth from '@/hooks/useAuth';
import { getPoliticalClientInitiativesAPI, getAllAwardsAPI, politicalClientGrantAwardAPI } from '@/services/api';
import { Initiative, Award } from '@/types';

// Create a schema for form validation
const awardSchema = z.object({
  donorGuid: z.string().min(1, "Donor ID is required"),
  awardGuid: z.string().min(1, "Award is required"),
  initiativeGuid: z.string().optional(),
  adCampaignGuid: z.string().optional(),
});

type AwardFormValues = z.infer<typeof awardSchema>;

const ClientGrantAwardPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const loginUsername = user?.loginUsername || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup
  const form = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      donorGuid: '',
      awardGuid: '',
      initiativeGuid: '',
      adCampaignGuid: '',
    },
  });

  // Fetch initiatives
  const { data: initiatives, isLoading: isLoadingInitiatives } = useQuery({
    queryKey: ['politicalClientInitiatives', loginUsername],
    queryFn: () => getPoliticalClientInitiativesAPI(loginUsername),
    enabled: !!loginUsername
  });

  // Fetch awards - using the correct API function with username
  const { data: awards, isLoading: isLoadingAwards } = useQuery({
    queryKey: ['awards', loginUsername],
    queryFn: () => getAllAwardsAPI(loginUsername),
    enabled: !!loginUsername
  });

  // Award grant mutation
  const grantAwardMutation = useMutation({
    mutationFn: (data: {
      donorGuid: string;
      awardGuid: string;
      initiativeGuid?: string;
      adCampaignGuid?: string;
    }) => politicalClientGrantAwardAPI(loginUsername, data),
    onSuccess: () => {
      toast.success('Award granted successfully');
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to grant award: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (values: AwardFormValues) => {
    setIsSubmitting(true);
    grantAwardMutation.mutate({
      donorGuid: values.donorGuid,
      awardGuid: values.awardGuid,
      initiativeGuid: values.initiativeGuid || undefined,
      adCampaignGuid: values.adCampaignGuid || undefined,
    });
  };

  const handleDonorSelect = (donorGuid: string) => {
    form.setValue('donorGuid', donorGuid);
  };

  return (
    <PoliticalClientLayout title="Grant Awards">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AwardIcon className="mr-2 h-5 w-5 text-yellow-500" />
              Grant Award to Donor
            </CardTitle>
            <CardDescription>
              Recognize donors' contributions with awards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Donor Selection */}
                <FormField
                  control={form.control}
                  name="donorGuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Donor</FormLabel>
                      <FormControl>
                        <DonorSearch 
                          loginUsername={loginUsername}
                          selectedDonorGuid={field.value}
                          onSelect={handleDonorSelect}
                          disabled={!loginUsername}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Award Selection */}
                <FormField
                  control={form.control}
                  name="awardGuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Award</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={isLoadingAwards}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select award" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingAwards ? (
                            <div className="p-2">
                              <Skeleton className="h-6 w-full" />
                            </div>
                          ) : awards && awards.length > 0 ? (
                            awards.map((award: Award) => (
                              <SelectItem key={award.awardGuid} value={award.awardGuid}>
                                {award.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No awards available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Initiative Selection (Optional) */}
                <FormField
                  control={form.control}
                  name="initiativeGuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initiative (Optional)</FormLabel>
                      <Select 
                        value={field.value || ''} 
                        onValueChange={field.onChange}
                        disabled={isLoadingInitiatives}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select initiative" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None (General Award)</SelectItem>
                          {initiatives?.map((initiative: Initiative) => (
                            <SelectItem key={initiative.id} value={initiative.id}>
                              {initiative.initiativeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground mt-1">
                        Optionally associate the award with a specific initiative
                      </p>
                    </FormItem>
                  )}
                />

                {/* Ad Campaign ID (Optional) */}
                <FormField
                  control={form.control}
                  name="adCampaignGuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Campaign ID (Optional)</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          disabled={!form.watch('donorGuid') || !form.watch('initiativeGuid')}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ad campaign" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {/* We would add campaign options here when we have the API */}
                            <SelectItem value="placeholder-campaign">Sample Campaign (placeholder)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground mt-1">
                        Optionally associate the award with a specific ad campaign
                      </p>
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Grant Award
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>About Awards</CardTitle>
              <CardDescription>
                How the award system works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Types of Awards</h3>
                <p className="text-sm text-muted-foreground">
                  Awards can be granted for various achievements, from participation to exceptional campaign performance.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Award Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Awarded donors will see their achievements displayed on their profile and can share them on social media.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Finding Donor Information</h3>
                <p className="text-sm text-muted-foreground">
                  Use the donor search box above to find donors by name or email.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PoliticalClientLayout>
  );
};

export default ClientGrantAwardPage;
