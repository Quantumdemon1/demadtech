
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, UserIcon, ShieldIcon } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the context
      setIsLoading(false);
    }
  };

  const loginWithDemoAccount = async (type: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      if (type === 'user') {
        await login('demo@adtech.com', 'demo123');
      } else {
        await login('admin@adtech.com', 'admin123');
      }
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up form-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Login</h1>
        <p className="text-muted-foreground mt-2">
          Enter your credentials to access your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
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
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-center" 
            onClick={() => loginWithDemoAccount('user')}
            disabled={isLoading}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Demo User</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center" 
            onClick={() => loginWithDemoAccount('admin')}
            disabled={isLoading}
          >
            <ShieldIcon className="mr-2 h-4 w-4" />
            <span>Demo Admin</span>
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
    </div>
  );
};

export const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    occupation: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
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
      await signup(userData, formData.password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the context
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up form-container max-w-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground mt-2">
          Fill in your details to get started
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name *
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name *
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Account *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />
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
        
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(123) 456-7890"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="occupation" className="text-sm font-medium">
            Occupation
          </label>
          <Input
            id="occupation"
            name="occupation"
            placeholder="Your occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main St"
            value={formData.address}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <Input
              id="city"
              name="city"
              placeholder="New York"
              value={formData.city}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium">
              State
            </label>
            <Input
              id="state"
              name="state"
              placeholder="NY"
              value={formData.state}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label htmlFor="zip" className="text-sm font-medium">
              Zip
            </label>
            <Input
              id="zip"
              name="zip"
              placeholder="10001"
              value={formData.zip}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
        
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p>
          By signing up to create an account I accept{' '}
          <Link to="/terms" className="text-campaign-orange hover:underline">
            Company's Terms of Use and Privacy Policy
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

export const AccountForm: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
      // In a real app, we would update the user in the API
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in localStorage
      if (user) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update in registered users
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUsers = registeredUsers.map((u: any) => 
          u.id === user.id ? { ...u, ...formData } : u
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }
      
      toast.success('Account updated successfully');
    } catch (error) {
      toast.error('Failed to update account');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your account</div>;
  }

  return (
    <div className="animate-fade-in-up form-container max-w-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name *
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name *
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Account *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            disabled
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(123) 456-7890"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <Input
            id="address"
            name="address"
            placeholder="123 Main St"
            value={formData.address}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <Input
              id="city"
              name="city"
              placeholder="New York"
              value={formData.city}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium">
              State
            </label>
            <Input
              id="state"
              name="state"
              placeholder="NY"
              value={formData.state}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label htmlFor="zip" className="text-sm font-medium">
              Zip
            </label>
            <Input
              id="zip"
              name="zip"
              placeholder="10001"
              value={formData.zip}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
        
        <div className="pt-2">
          <Button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};
