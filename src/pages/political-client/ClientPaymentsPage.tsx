
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PoliticalClientLayout from '@/components/layout/PoliticalClientLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from '@/components/ui/currency-input'; // This is a custom component we'll create
import useAuth from '@/hooks/useAuth';
import { getPoliticalClientInitiativesAPI, politicalClientPayDonorAPI } from '@/services/api';
import { Initiative } from '@/types';

// Create a schema for form validation
const paymentSchema = z.object({
  donorGuid: z.string().min(1, "Donor ID is required"),
  initiativeGuid: z.string().min(1, "Initiative is required"),
  amount: z.string().min(1, "Amount is required").refine(value => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    return !isNaN(numValue) && numValue > 0;
  }, {
    message: "Amount must be greater than 0"
  }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const ClientPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const loginUsername = user?.loginUsername || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      donorGuid: '',
      initiativeGuid: '',
      amount: '',
    },
  });

  // Fetch initiatives
  const { data: initiatives, isLoading: isLoadingInitiatives } = useQuery({
    queryKey: ['politicalClientInitiatives', loginUsername],
    queryFn: () => getPoliticalClientInitiativesAPI(loginUsername),
    enabled: !!loginUsername
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: (data: {
      donorGuid: string;
      initiativeGuid: string;
      amount: string;
    }) => politicalClientPayDonorAPI(loginUsername, data),
    onSuccess: () => {
      toast.success('Payment processed successfully');
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['politicalClientInitiatives'] });
    },
    onError: (error) => {
      toast.error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (values: PaymentFormValues) => {
    setIsSubmitting(true);
    paymentMutation.mutate({
      donorGuid: values.donorGuid,
      initiativeGuid: values.initiativeGuid,
      amount: values.amount.replace(/[^0-9.]/g, ''), // Clean currency formatting
    });
  };

  return (
    <PoliticalClientLayout title="Donor Payments">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Process Donor Payment</CardTitle>
            <CardDescription>
              Add funds to a donor's account for ad campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="donorGuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donor ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter donor ID" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter the unique identifier for the donor
                      </p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="initiativeGuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initiative</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={isLoadingInitiatives || !initiatives}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select initiative" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {initiatives?.map((initiative: Initiative) => (
                            <SelectItem key={initiative.id} value={initiative.id}>
                              {initiative.initiativeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="$0.00"
                          onChange={(e) => {
                            // Format as currency
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue)) {
                              field.onChange(`$${numValue.toFixed(2)}`);
                            } else {
                              field.onChange('');
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Process Payment'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Important details about processing payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Finding Donor IDs</h3>
                <p className="text-sm text-muted-foreground">
                  Currently, donors must provide you with their unique Donor ID. This can be found in their account settings.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Payment Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Payments are processed immediately and added to the donor's available balance for ad campaigns.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Initiative Association</h3>
                <p className="text-sm text-muted-foreground">
                  Funds added to a donor's account are associated with the selected initiative. Donors can only use these funds for ad campaigns related to that initiative.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PoliticalClientLayout>
  );
};

export default ClientPaymentsPage;
