
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
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { politicalClientSignup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Required field validation
    if (!formData.politicalClientName.trim()) {
      errors.politicalClientName = 'Organization name is required';
    }
    
    if (!formData.loginUsername.trim()) {
      errors.loginUsername = 'Username is required';
    } else if (formData.loginUsername.length < 3) {
      errors.loginUsername = 'Username must be at least 3 characters';
    }
    
    // Password validation - Enhanced with strength requirements
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Password must include at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must include at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must include at least one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      await politicalClientSignup(userData, formData.password);
      toast.success('Political organization account created successfully!');
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
            className={formErrors.politicalClientName ? 'border-red-500' : ''}
          />
          {formErrors.politicalClientName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.politicalClientName}</p>
          )}
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
            className={formErrors.loginUsername ? 'border-red-500' : ''}
          />
          {formErrors.loginUsername && (
            <p className="text-red-500 text-sm mt-1">{formErrors.loginUsername}</p>
          )}
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
              className={`pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
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
              className={`pr-10 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
            )}
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
        <p className="mt-2">
          <Link to="/signup" className="text-campaign-orange hover:underline">
            ← Back to account type selection
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PoliticalClientSignUpForm;
