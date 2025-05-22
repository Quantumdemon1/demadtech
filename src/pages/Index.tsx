
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { ArrowRight, Share2, PieChart, Trophy } from 'lucide-react';
import { getTestCredentials } from '@/utils/authUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index: React.FC = () => {
  const { user } = useAuth();
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const testCreds = getTestCredentials();
  
  return <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden bg-campaign-navy py-20 text-white">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-campaign-navy via-campaign-navy-light to-campaign-navy-dark opacity-90"></div>
          <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1505623776320-7edecf5f0771?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
          
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Shape the Future with Impactful Voting Campaigns
              </h1>
              <p className="animate-fade-in-up animation-delay-200 mt-6 text-lg md:text-xl lg:text-2xl text-white/85">
                Create and manage personalized social media campaigns to drive voter engagement and make a difference.
              </p>
              <div className="animate-fade-in-up animation-delay-300 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-campaign-orange hover:bg-campaign-orange-dark">
                  <Link to={user ? "/create-campaign" : "/signup"}>
                    {user ? "Create A Campaign" : "Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {user ? <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <Link to="/dashboard">View My Campaigns</Link>
                  </Button> : <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <Link to="/login">Log In</Link>
                  </Button>}
              </div>
            </div>
          </div>
        </section>
        
        {/* Test Accounts Section - Only show in development */}
        {import.meta.env.DEV && (
          <section className="py-8 bg-amber-50 border-t-4 border-amber-400">
            <div className="container">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-amber-800">🧪 Test Account System</h2>
                <p className="text-amber-700 mt-2">
                  Three fully functional test accounts with realistic data
                </p>
                <button
                  onClick={() => setShowTestAccounts(!showTestAccounts)}
                  className="mt-2 text-amber-600 hover:text-amber-800 underline"
                >
                  {showTestAccounts ? 'Hide' : 'Show'} Test Credentials
                </button>
              </div>
              
              {showTestAccounts && (
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-blue-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">👤 Donor Account</CardTitle>
                        <Badge variant="outline" className="bg-blue-50">Active Campaigns</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div><strong>Email:</strong> {testCreds.donor.username}</div>
                        <div><strong>Password:</strong> {testCreds.donor.password}</div>
                        <div className="pt-2 text-gray-600">
                          <strong>Features:</strong>
                          <ul className="list-disc list-inside mt-1">
                            <li>3 active campaigns</li>
                            <li>Campaign metrics</li>
                            <li>Initiative browsing</li>
                            <li>Account management</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">🏛️ Political Client</CardTitle>
                        <Badge variant="outline" className="bg-purple-50">Initiative Creator</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div><strong>Username:</strong> {testCreds.politicalClient.username}</div>
                        <div><strong>Password:</strong> {testCreds.politicalClient.password}</div>
                        <div className="pt-2 text-gray-600">
                          <strong>Features:</strong>
                          <ul className="list-disc list-inside mt-1">
                            <li>Create initiatives</li>
                            <li>Manage campaigns</li>
                            <li>Donor management</li>
                            <li>Analytics dashboard</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">⚙️ Admin Account</CardTitle>
                        <Badge variant="outline" className="bg-red-50">Full Access</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div><strong>Email:</strong> {testCreds.admin.username}</div>
                        <div><strong>Password:</strong> {testCreds.admin.password}</div>
                        <div className="pt-2 text-gray-600">
                          <strong>Features:</strong>
                          <ul className="list-disc list-inside mt-1">
                            <li>Campaign approval</li>
                            <li>User management</li>
                            <li>System oversight</li>
                            <li>Award management</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Features section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-fade-in-up text-sm font-medium uppercase tracking-wider text-campaign-orange">Why Choose Our Platform</p>
              <h2 className="animate-fade-in-up mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Amplify Your Voice, Inspire Action
              </h2>
              <p className="animate-fade-in-up mt-4 text-xl text-muted-foreground">
                Our platform empowers you to create targeted campaigns that reach voters and drive meaningful engagement.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="animate-fade-in-up group rounded-xl border p-8 transition-all duration-300 hover:border-campaign-orange hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-campaign-orange/10 text-campaign-orange transition-transform duration-300 group-hover:scale-110">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Amplify Your Message</h3>
                <p className="mt-2 text-muted-foreground">
                  Create social media campaigns that resonate with your audience and inspire them to take action.
                </p>
              </div>
              
              <div className="animate-fade-in-up animation-delay-200 group rounded-xl border p-8 transition-all duration-300 hover:border-campaign-orange hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-campaign-orange/10 text-campaign-orange transition-transform duration-300 group-hover:scale-110">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Track Your Impact</h3>
                <p className="mt-2 text-muted-foreground">
                  Monitor campaign performance with detailed analytics to understand your reach and engagement.
                </p>
              </div>
              
              <div className="animate-fade-in-up animation-delay-400 group rounded-xl border p-8 transition-all duration-300 hover:border-campaign-orange hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-campaign-orange/10 text-campaign-orange transition-transform duration-300 group-hover:scale-110">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Drive Real Results</h3>
                <p className="mt-2 text-muted-foreground">
                  See the direct impact of your campaigns on voter awareness and participation.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-16 md:py-24 bg-campaign-beige">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-fade-in-up text-sm font-medium uppercase tracking-wider text-campaign-orange">Step-by-Step Process</p>
              <h2 className="animate-fade-in-up mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                How It Works
              </h2>
              <p className="animate-fade-in-up mt-4 text-xl text-muted-foreground">
                Creating impactful voting campaigns has never been easier
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-4">
              <div className="animate-fade-in-up rounded-xl bg-white p-8 transition-all duration-300 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-campaign-navy text-white">
                  1
                </div>
                <h3 className="text-xl font-bold">Select a Candidate</h3>
                <p className="mt-2 text-muted-foreground">
                  Choose the candidate you want to support and create a campaign around.
                </p>
              </div>
              
              <div className="animate-fade-in-up animation-delay-200 rounded-xl bg-white p-8 transition-all duration-300 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-campaign-navy text-white">
                  2
                </div>
                <h3 className="text-xl font-bold">Answer Questions</h3>
                <p className="mt-2 text-muted-foreground">
                  Provide information about your values and why voting matters to you.
                </p>
              </div>
              
              <div className="animate-fade-in-up animation-delay-400 rounded-xl bg-white p-8 transition-all duration-300 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-campaign-navy text-white">
                  3
                </div>
                <h3 className="text-xl font-bold">Generate Content</h3>
                <p className="mt-2 text-muted-foreground">
                  Our system generates personalized content aligned with your values.
                </p>
              </div>
              
              <div className="animate-fade-in-up animation-delay-600 rounded-xl bg-white p-8 transition-all duration-300 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-campaign-navy text-white">
                  4
                </div>
                <h3 className="text-xl font-bold">Launch & Track</h3>
                <p className="mt-2 text-muted-foreground">
                  Launch your campaign and track its performance with detailed metrics.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button asChild size="lg" className="bg-campaign-orange hover:bg-campaign-orange-dark">
                <Link to={user ? "/create-campaign" : "/signup"}>
                  {user ? "Create Your Campaign" : "Get Started Now"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-white py-12">
        <div className="container">
          <div className="text-center">
            <p className="font-bold text-campaign-navy dark:text-white">
              VOTE<span className="text-campaign-orange">Tech</span>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">© 2024 AdTech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
