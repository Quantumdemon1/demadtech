
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import RoleSelection, { UserRole } from './RoleSelection';
import { toast } from 'sonner';
import TestAccountSection from './TestAccountSection';
import LoginCredentialsForm from './LoginCredentialsForm';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email or username');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password, selectedRole || undefined);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the auth context
      console.error('Login form error:', error);
      setIsLoading(false);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  // Update the test account login handler to always redirect to /dashboard
  const loginAsTestAccount = (role: UserRole) => {
    setIsLoading(true);
    
    // Create mock user data based on role
    const mockUserData = {
      donor: {
        id: 'test-donor-id',
        name: 'Test Donor',
        email: 'testdonor@example.com',
        role: 'donor',
        balance: 1000,
        joinDate: new Date().toISOString()
      },
      politicalClient: {
        id: 'test-org-id',
        name: 'Test Organization',
        loginUsername: 'testorg',
        role: 'politicalClient',
        email: 'testorg@example.com',
        joinDate: new Date().toISOString()
      },
      admin: {
        id: 'test-admin-id',
        name: 'Test Admin',
        email: 'testadmin@example.com',
        role: 'admin',
        joinDate: new Date().toISOString()
      }
    };
    
    const userData = mockUserData[role];
    
    // Store mock user in localStorage to simulate login
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Show success message
    toast.success(`Logged in as ${role} successfully`);
    
    // Set loading to false
    setIsLoading(false);
    
    // Always navigate to /dashboard regardless of role
    navigate('/dashboard');
  };

  return (
    <div className="form-container shadow-lg bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Welcome Back</h1>
        <p className="text-muted-foreground text-lg">
          Enter your credentials to access your account
        </p>
      </div>
      
      {showRoleSelection ? (
        <>
          <RoleSelection 
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
            showAdmin={false} // Removing admin option as it will use real backend
          />
          
          <TestAccountSection 
            isLoading={isLoading} 
            loginAsTestAccount={loginAsTestAccount} 
          />
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-campaign-orange hover:underline font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </>
      ) : (
        <LoginCredentialsForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          selectedRole={selectedRole}
          setShowRoleSelection={setShowRoleSelection}
        />
      )}
    </div>
  );
};

export default LoginForm;
