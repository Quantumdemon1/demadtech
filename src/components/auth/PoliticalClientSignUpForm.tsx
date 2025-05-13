
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const PoliticalClientSignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    loginUsername: '',
    politicalClientName: '',
    password: '',
    confirmPassword: '',
    role: 'politicalClient' as const,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { politicalClientSignup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      const { confirmPassword, ...userData } = formData;
      await politicalClientSignup(userData, formData.password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the context
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Political Organization Sign Up</h1>
        <p className="text-muted-foreground mt-2">
          Create an account for your political organization
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="politicalClientName" className="text-sm font-medium">
            Organization Name
          </label>
          <Input
            id="politicalClientName"
            name="politicalClientName"
            value={formData.politicalClientName}
            onChange={handleChange}
            placeholder="Your organization's name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="loginUsername" className="text-sm font-medium">
            Username
          </label>
          <Input
            id="loginUsername"
            name="loginUsername"
            value={formData.loginUsername}
            onChange={handleChange}
            placeholder="Choose a login username"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="pr-10"
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
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="pr-10"
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
        
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-campaign-orange hover:bg-campaign-orange-dark"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-campaign-orange hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PoliticalClientSignUpForm;
