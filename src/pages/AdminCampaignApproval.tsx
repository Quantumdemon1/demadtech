
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle, 
  XCircle, 
  Eye,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Campaign } from '@/types';
import { getUnapprovedAdCampaignsAdminAPI, updateAdCampaignStatusAdminAPI } from '@/services/api';

const AdminCampaignApproval: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const queryClient = useQueryClient();

  // Fetch unapproved campaigns
  const { 
    data: campaigns = [], 
    isLoading: loadingCampaigns, 
    error 
  } = useQuery({
    queryKey: ['unapproved-campaigns', user?.loginUsername],
    queryFn: () => user?.loginUsername ? getUnapprovedAdCampaignsAdminAPI(user.loginUsername) : Promise.reject('No user'),
    enabled: !!user?.loginUsername && user?.role === 'admin',
    select: data => data?.campaigns || []
  });

  // Mutation for updating campaign status
  const updateCampaignMutation = useMutation({
    mutationFn: ({ 
      adCampaignId, 
      status 
    }: { 
      adCampaignId: string, 
      status: 'approved' | 'rejected' 
    }) => {
      if (!user?.loginUsername) {
        throw new Error("Not authenticated");
      }
      return updateAdCampaignStatusAdminAPI(user.loginUsername, adCampaignId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unapproved-campaigns'] });
    }
  });

  // Function to handle campaign approval
  const handleApprove = (campaign: Campaign) => {
    toast.promise(updateCampaignMutation.mutateAsync({
      adCampaignId: campaign.id,
      status: 'approved'
    }), {
      loading: `Approving campaign "${campaign.name}"...`,
      success: `Campaign "${campaign.name}" has been approved`,
      error: (err) => `Failed to approve: ${err.message || 'Unknown error'}`
    });
  };

  // Function to handle campaign rejection
  const handleReject = (campaign: Campaign) => {
    toast.promise(updateCampaignMutation.mutateAsync({
      adCampaignId: campaign.id,
      status: 'rejected'
    }), {
      loading: `Rejecting campaign "${campaign.name}"...`,
      success: `Campaign "${campaign.name}" has been rejected`,
      error: (err) => `Failed to reject: ${err.message || 'Unknown error'}`
    });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container flex-1 py-8 text-center">Loading...</main>
      </div>
    );
  }

  // Protect the route: only admins should access this page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container flex-1 py-8">
          <div className="mb-6">
            <Link to="/admin/dashboard" className="inline-flex items-center text-sm text-campaign-orange hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Approvals</h1>
          </div>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              An error occurred: {(error as Error).message || 'Failed to fetch campaigns'}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-8">
        <div className="mb-6">
          <Link to="/admin/dashboard" className="inline-flex items-center text-sm text-campaign-orange hover:underline mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve or reject submitted ad campaigns.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-muted/50">
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Campaigns awaiting admin review before they can go live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCampaigns ? (
              <div className="py-8 text-center text-muted-foreground flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading campaigns...
              </div>
            ) : campaigns.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Contest</TableHead>
                    <TableHead>Content Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        {campaign.contest?.state}, District {campaign.contest?.district}
                        <div className="text-xs text-muted-foreground">
                          {campaign.contest?.democratFirstName} {campaign.contest?.democratLastName} vs. {campaign.contest?.republicanFirstName} {campaign.contest?.republicanLastName}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{campaign.contentType}</TableCell>
                      <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                disabled={updateCampaignMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve Campaign</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve "{campaign.name}"? This will make the campaign active and ready to run.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleApprove(campaign)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={updateCampaignMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Campaign</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject "{campaign.name}"? The campaign creator will be notified.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleReject(campaign)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Reject
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No campaigns pending approval at this time.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Detail Modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedCampaign.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedCampaign(null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Created on {new Date(selectedCampaign.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Campaign Details</h3>
                    <p><strong>Contest:</strong> {selectedCampaign.contest?.state}, District {selectedCampaign.contest?.district}</p>
                    <p><strong>Type:</strong> <span className="capitalize">{selectedCampaign.contentType}</span></p>
                    <p><strong>Run Period:</strong> {new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                    <p><strong>Ad Spend:</strong> ${selectedCampaign.adSpend}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Content Preview</h3>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      {selectedCampaign.contentImage && (
                        <img 
                          src={selectedCampaign.contentImage} 
                          alt="Campaign visual" 
                          className="mb-4 rounded-md w-full h-auto" 
                        />
                      )}
                      <p>{selectedCampaign.contentText}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedCampaign(null)}
                >
                  Close
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedCampaign);
                      setSelectedCampaign(null);
                    }}
                    disabled={updateCampaignMutation.isPending}
                  >
                    Reject Campaign
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(selectedCampaign);
                      setSelectedCampaign(null);
                    }}
                    disabled={updateCampaignMutation.isPending}
                  >
                    Approve Campaign
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCampaignApproval;
