
import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateDonorAPI } from '@/services/api';
import { User } from '@/types';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const AccountForm: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
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

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
      });
    }
  }, [user]);

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
      if (!user) {
        throw new Error('User not found');
      }

      // Only update fields that are supported by the backend
      const updateData: { donorName?: string } = {};

      // Only update donorName if either firstName or lastName changed
      if (formData.firstName !== user.firstName || formData.lastName !== user.lastName) {
        updateData.donorName = `${formData.firstName} ${formData.lastName}`;
      }

      // Only make API call if there are changes to send
      if (Object.keys(updateData).length > 0) {
        await updateDonorAPI(user.email || user.loginUsername || '', updateData);

        // Update the user in context and localStorage with the new data
        const updatedUser: User = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName
        };
        updateUserProfile(updatedUser);
      }
      
      // Always store the local-only fields in context
      // These fields aren't sent to the backend but are kept in the frontend
      const updatedUser: User = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      };
      updateUserProfile(updatedUser);
      
      toast.success('Account updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update account');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your account</div>;
  }

  // Helper to determine if a field is supported by the backend
  const isFieldBackendSupported = (fieldName: string): boolean => {
    // Currently only name fields are supported
    return ['firstName', 'lastName'].includes(fieldName);
  };

  // Render input field with optional tooltip for unsupported fields
  const renderInput = (fieldName: string, label: string, placeholder: string, type = 'text', disabled = false) => {
    const isSupported = isFieldBackendSupported(fieldName);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor={fieldName} className="text-sm font-medium">
            {label}
          </label>
          {!isSupported && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This field is stored locally only and not synchronized with the server.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Input
          id={fieldName}
          name={fieldName}
          placeholder={placeholder}
          value={formData[fieldName as keyof typeof formData] || ''}
          onChange={handleChange}
          type={type}
          className="input-field"
          disabled={disabled}
        />
      </div>
    );
  };

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
          {renderInput('firstName', 'First Name *', 'John')}
          {renderInput('lastName', 'Last Name *', 'Doe')}
        </div>
        
        {renderInput('email', 'Email Account *', 'your@email.com', 'email', true)}
        {user.email && (
          <p className="text-xs text-muted-foreground -mt-2">
            Email cannot be changed
          </p>
        )}
        
        {renderInput('phone', 'Phone Number', '(123) 456-7890', 'tel')}
        {renderInput('address', 'Address', '123 Main St')}
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {renderInput('city', 'City', 'New York')}
          {renderInput('state', 'State', 'NY')}
          
          <div className="col-span-2 md:col-span-1">
            {renderInput('zip', 'Zip', '10001')}
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

export default AccountForm;
