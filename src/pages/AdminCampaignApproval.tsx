
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
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
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Campaign } from '@/types';

const AdminCampaignApproval: React.FC = () => {
  const { user, loading } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Mock data: pending campaigns
  React.useEffect(() => {
    // In a real app, this would be an API call to get pending campaigns
    const mockPendingCampaigns: Campaign[] = [
      {
        id: 'camp-1',
        name: 'Education Reform Support',
        userId: 'user-123',
        contestId: 'contest-1',
        contentType: 'formal',
        contentText: 'Support better education funding in our schools.',
        startDate: '2024-06-01',
        endDate: '2024-07-01',
        adSpend: 500,
        status: 'pending',
        createdAt: '2024-05-10',
        contest: {
          id: 'contest-1',
          state: 'California',
          district: '12',
          electionDate: '2024-11-05',
          democratFirstName: 'Jane',
          democratLastName: 'Smith',
          republicanFirstName: 'John',
          republicanLastName: 'Doe',
        }
      },
      {
        id: 'camp-2',
        name: 'Healthcare Initiative',
        userId: 'user-456',
        contestId: 'contest-2',
        contentType: 'personal',
        contentText: 'My family benefited from healthcare reform. Support Jane Smith.',
        startDate: '2024-06-15',
        endDate: '2024-07-15',
        adSpend: 750,
        status: 'pending',
        createdAt: '2024-05-12',
        contest: {
          id: 'contest-2',
          state: 'New York',
          district: '8',
          electionDate: '2024-11-05',
          democratFirstName: 'David',
          democratLastName: 'Johnson',
          republicanFirstName: 'Sarah',
          republicanLastName: 'Williams',
        }
      },
      {
        id: 'camp-3',
        name: 'Climate Action',
        userId: 'user-789',
        contestId: 'contest-1',
        contentType: 'funny',
        contentText: 'Climate change is no joke, but this ad is! Vote for change.',
        startDate: '2024-07-01',
        endDate: '2024-08-01',
        adSpend: 600,
        status: 'pending',
        createdAt: '2024-05-14',
        contest: {
          id: 'contest-1',
          state: 'California',
          district: '12',
          electionDate: '2024-11-05',
          democratFirstName: 'Jane',
          democratLastName: 'Smith',
          republicanFirstName: 'John',
          republicanLastName: 'Doe',
        }
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setCampaigns(mockPendingCampaigns);
      setLoadingCampaigns(false);
    }, 800);
  }, []);

  // Function to handle campaign approval
  const handleApprove = (campaign: Campaign) => {
    // In a real app, this would be an API call to update the campaign status
    console.log('Approving campaign:', campaign.id);
    toast.success(`Campaign "${campaign.name}" has been approved`);
    
    // Update local state to reflect the change
    setCampaigns(prevCampaigns => 
      prevCampaigns.filter(c => c.id !== campaign.id)
    );
  };

  // Function to handle campaign rejection
  const handleReject = (campaign: Campaign) => {
    // In a real app, this would be an API call to update the campaign status
    console.log('Rejecting campaign:', campaign.id);
    toast.error(`Campaign "${campaign.name}" has been rejected`);
    
    // Update local state to reflect the change
    setCampaigns(prevCampaigns => 
      prevCampaigns.filter(c => c.id !== campaign.id)
    );
  };

  if (loading) {
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
              <div className="py-8 text-center text-muted-foreground">Loading campaigns...</div>
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
                  >
                    Reject Campaign
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(selectedCampaign);
                      setSelectedCampaign(null);
                    }}
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
