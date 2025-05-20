
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { UserRole } from './RoleSelection';

interface LoginCredentialsFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  selectedRole: UserRole | null;
  setShowRoleSelection: (show: boolean) => void;
}

const LoginCredentialsForm: React.FC<LoginCredentialsFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  handleSubmit,
  selectedRole,
  setShowRoleSelection,
}) => {
  const [showPassword, setShowPassword] = useState(false);

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
  );
};

export default LoginCredentialsForm;
