
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import RoleSelection, { UserRole } from './RoleSelection';
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password, selectedRole || undefined);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the context
      setIsLoading(false);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  // Label text depends on selected role
  const getLoginLabel = () => {
    if (selectedRole === 'politicalClient') {
      return 'Username';
    }
    return 'Email';
  };

  // Placeholder text depends on selected role
  const getLoginPlaceholder = () => {
    if (selectedRole === 'politicalClient') {
      return 'your-username';
    }
    return 'your@email.com';
  };

  // Mock test account login handlers
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
    
    // Navigate to dashboard
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 500);
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
          
          {/* Test Account Section */}
          <div className="mt-12 border-t pt-8">
            <h3 className="text-lg font-medium text-center mb-6">Test Accounts</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Try out the platform with these test accounts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="p-4"
                onClick={() => loginAsTestAccount('donor')}
                disabled={isLoading}
              >
                Try as Donor
              </Button>
              <Button
                variant="outline"
                className="p-4"
                onClick={() => loginAsTestAccount('politicalClient')}
                disabled={isLoading}
              >
                Try as Organization
              </Button>
              <Button
                variant="outline"
                className="p-4"
                onClick={() => loginAsTestAccount('admin')}
                disabled={isLoading}
              >
                Try as Admin
              </Button>
            </div>
          </div>
          
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
        <>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="text-base font-medium">
                  {getLoginLabel()}
                </label>
                <button
                  type="button"
                  className="text-sm text-campaign-orange hover:underline"
                  onClick={() => setShowRoleSelection(true)}
                >
                  Change account type
                </button>
              </div>
              <Input
                id="email"
                type={selectedRole === 'politicalClient' ? 'text' : 'email'}
                placeholder={getLoginPlaceholder()}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field h-12 text-base"
                autoComplete={selectedRole === 'politicalClient' ? 'username' : 'email'}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-base font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-campaign-orange hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field h-12 text-base pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full btn-primary transition-all duration-200 mt-8 h-12 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-campaign-orange hover:underline font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginForm;
