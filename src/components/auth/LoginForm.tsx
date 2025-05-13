import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon, UserIcon, ShieldIcon, BuildingIcon } from 'lucide-react';
import RoleSelection, { UserRole } from './RoleSelection';

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

  const loginWithDemoAccount = async (type: 'user' | 'admin' | 'political') => {
    setIsLoading(true);
    try {
      if (type === 'user') {
        await login('demo@adtech.com', 'demo123', 'donor');
      } else if (type === 'admin') {
        await login('admin@adtech.com', 'admin123', 'admin');
      } else if (type === 'political') {
        await login('political', 'client123', 'politicalClient');
      }
      navigate('/dashboard');
    } catch (error) {
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

  return (
    <div className="animate-fade-in-up form-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Login</h1>
        <p className="text-muted-foreground mt-2">
          Enter your credentials to access your account
        </p>
      </div>
      
      {showRoleSelection ? (
        <>
          <RoleSelection 
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
            showAdmin={true}
          />
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-campaign-orange hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="text-sm font-medium">
                  {getLoginLabel()}
                </label>
                <button
                  type="button"
                  className="text-xs text-campaign-orange hover:underline"
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
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-campaign-orange hover:underline">
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
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 border-t pt-6">
            <p className="text-center text-sm font-medium text-muted-foreground mb-3">
              Or try our demo accounts
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center justify-center" 
                onClick={() => loginWithDemoAccount('user')}
                disabled={isLoading}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Donor</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center" 
                onClick={() => loginWithDemoAccount('political')}
                disabled={isLoading}
              >
                <BuildingIcon className="mr-2 h-4 w-4" />
                <span>Political</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center" 
                onClick={() => loginWithDemoAccount('admin')}
                disabled={isLoading}
              >
                <ShieldIcon className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-campaign-orange hover:underline">
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
