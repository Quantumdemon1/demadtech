
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export const PoliticalClientSignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    politicalClientName: '',
    loginUsername: '',
    password: '',
    confirmPassword: '',
    ein: '',
    email: '',
    fecNum: '',
    fundingMethod: '',
    pacId: '',
    platform: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { politicalClientSignup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <div className="animate-fade-in-up form-container max-w-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Register Political Organization</h1>
        <p className="text-muted-foreground mt-2">
          Create an account for your political organization
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="politicalClientName" className="text-sm font-medium">
            Organization Name *
          </label>
          <Input
            id="politicalClientName"
            name="politicalClientName"
            placeholder="Your political organization name"
            value={formData.politicalClientName}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="loginUsername" className="text-sm font-medium">
              Username *
            </label>
            <Input
              id="loginUsername"
              name="loginUsername"
              placeholder="Choose a username"
              value={formData.loginUsername}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="contact@organization.org"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password *
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password *
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="ein" className="text-sm font-medium">
              EIN Number
            </label>
            <Input
              id="ein"
              name="ein"
              placeholder="XX-XXXXXXX"
              value={formData.ein}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="fecNum" className="text-sm font-medium">
              FEC Number
            </label>
            <Input
              id="fecNum"
              name="fecNum"
              placeholder="CXXXXXXX"
              value={formData.fecNum}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="fundingMethod" className="text-sm font-medium">
              Funding Method
            </label>
            <Input
              id="fundingMethod"
              name="fundingMethod"
              placeholder="e.g., PAC, Direct"
              value={formData.fundingMethod}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="pacId" className="text-sm font-medium">
              PAC ID (if applicable)
            </label>
            <Input
              id="pacId"
              name="pacId"
              placeholder="PAC identifier"
              value={formData.pacId}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="platform" className="text-sm font-medium">
            Platform Description
          </label>
          <Textarea
            id="platform"
            name="platform"
            placeholder="Tell us about your organization's platform and goals..."
            value={formData.platform}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register Organization'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p>
          By registering you accept our{' '}
          <Link to="/terms" className="text-campaign-orange hover:underline">
            Terms of Service and Privacy Policy
          </Link>
        </p>
        <p className="mt-4">
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
