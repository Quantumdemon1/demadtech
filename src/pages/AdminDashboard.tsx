
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import useAuthCheck from '@/hooks/useAuthCheck';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Award, Users, UserCheck } from 'lucide-react';
import { getTestDataForRole } from '@/utils/authUtils';

const AdminDashboard: React.FC = () => {
  const { user, loginUsername, isAuthenticated, loading } = useAuthCheck(true);
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    totalAwards: 12,
    activePoliticalClients: 8,
    totalDonors: 150,
  });

  // Load test data when component mounts
  useEffect(() => {
    if (user?.role === 'admin') {
      const testData = getTestDataForRole('admin');
      if (testData.pendingCampaigns) {
        setStats(prevStats => ({
          ...prevStats,
          pendingApprovals: testData.pendingCampaigns.length || 0
        }));
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container flex-1 py-8 text-center">Loading admin data...</main>
      </div>
    );
  }

  // Protect the route: only admins should access this page
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  // Mock statistics - replace with API calls later
  const mockStats = {
    pendingApprovals: 5,
    totalAwards: 12,
    activePoliticalClients: 8,
    totalDonors: 150,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}!
          </p>
        </div>

        {/* Overview Statistics Section */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">System Overview</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="animate-fade-in-up">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Campaign Approvals</CardTitle>
                <CheckCircle className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">Campaigns awaiting review</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Awards Managed</CardTitle>
                <Award className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalAwards}</div>
                <p className="text-xs text-muted-foreground">Total award types in system</p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in-up animation-delay-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Political Clients</CardTitle>
                <UserCheck className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activePoliticalClients}</div>
                <p className="text-xs text-muted-foreground">Currently active clients</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                <Users className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalDonors}</div>
                <p className="text-xs text-muted-foreground">Registered donor accounts</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions / Navigation Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Admin Actions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-campaign-orange mb-2" />
                <CardTitle>Campaign Approvals</CardTitle>
                <CardDescription>Review and approve or reject submitted ad campaigns.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-campaign-orange hover:bg-campaign-orange-dark">
                  <Link to="/admin/campaign-approval">
                    Manage Approvals {stats.pendingApprovals > 0 && `(${stats.pendingApprovals})`}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-8 w-8 text-campaign-navy mb-2" />
                <CardTitle>Manage Awards</CardTitle>
                <CardDescription>Create, edit, and manage the types of awards available in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/admin/manage-awards">Manage Awards</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
