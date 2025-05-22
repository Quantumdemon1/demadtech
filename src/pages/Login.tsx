
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';
import { getTestCredentials } from '@/utils/authUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const Login: React.FC = () => {
  const [showTestAccounts, setShowTestAccounts] = useState(true);
  const testCreds = getTestCredentials();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 py-12 px-4 md:px-8">
        {/* Test Accounts Section */}
        <section className="w-full max-w-4xl mb-8 bg-amber-50 border-t-4 border-amber-400 rounded-lg animate-fade-in-up">
          <div className="container py-6 px-4">
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

        <div className="w-full animate-fade-in-up">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
