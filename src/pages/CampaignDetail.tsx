
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import CampaignMetrics from '@/components/campaigns/CampaignMetrics';
import { useAuth } from '@/contexts/AuthContext';
import { Campaign } from '@/types';
import { Button } from '@/components/ui/button';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch the campaign from an API
    // For now, we'll just use dummy data
    if (!id) return;

    const mockCampaign: Campaign = {
      id,
      name: 'Support for Education Reform',
      userId: user?.id || '',
      contestId: '123',
      contest: {
        id: '123',
        state: 'California',
        district: '12',
        electionDate: '2024-11-05',
        democratFirstName: 'Jane',
        democratLastName: 'Smith',
        republicanFirstName: 'John',
        republicanLastName: 'Doe',
      },
      contentType: 'formal',
      contentText: 'Education is the foundation of our democracy. Vote for Jane Smith to ensure our schools get the funding they deserve.',
      startDate: '2024-09-01',
      endDate: '2024-11-04',
      adSpend: 500,
      status: 'active',
      metrics: {
        impressions: 5200,
        clicks: 1200,
        shares: 300,
      },
      createdAt: '2024-08-15',
    };

    setTimeout(() => {
      setCampaign(mockCampaign);
      setLoading(false);
    }, 1000);
  }, [id, user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
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
  }

  if (!campaign) {
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
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-sm text-campaign-orange hover:underline">
              ← Back to Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{campaign.name}</h1>
          </div>
          <Button asChild className="bg-campaign-orange hover:bg-campaign-orange-dark">
            <Link to={`/campaigns/${campaign.id}/edit`}>Edit Campaign</Link>
          </Button>
        </div>

        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 text-2xl font-bold">Campaign Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p>
                <span className="font-medium">Dem. Contestant Name:</span>{' '}
                {campaign.contest?.democratFirstName} {campaign.contest?.democratLastName}
              </p>
              <p>
                <span className="font-medium">Rep. Contestant Name:</span>{' '}
                {campaign.contest?.republicanFirstName} {campaign.contest?.republicanLastName}
              </p>
              <p>
                <span className="font-medium">State:</span> {campaign.contest?.state}
              </p>
              <p>
                <span className="font-medium">District #:</span> {campaign.contest?.district}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Campaign Length:</span>{' '}
                {campaign.startDate} - {campaign.endDate}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="capitalize">{campaign.status}</span>
              </p>
              <p>
                <span className="font-medium">Ad Spend:</span> ${campaign.adSpend}
              </p>
              <p>
                <span className="font-medium">Content Type:</span>{' '}
                <span className="capitalize">{campaign.contentType}</span>
              </p>
            </div>
          </div>
        </div>

        <CampaignMetrics
          metrics={campaign.metrics || { impressions: 0, clicks: 0, shares: 0 }}
          showViewAllLink={true}
        />

        <div className="mt-8 rounded-lg border p-6">
          <h2 className="mb-4 text-2xl font-bold">Campaign Content</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium">Content Preview</h3>
              <div className="overflow-hidden rounded-lg border">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
                  alt="Campaign Preview"
                  className="h-64 w-full object-cover"
                />
                <div className="p-4">
                  <p>{campaign.contentText}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium">Campaign Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium">Campaign Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium">Content Approved</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        new Date(campaign.createdAt).getTime() + 86400000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium">Campaign Launched</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {campaign.status !== 'completed' ? (
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      ⋯
                    </div>
                    <div>
                      <p className="font-medium">Campaign End</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium">Campaign Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignDetail;
