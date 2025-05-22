
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import RoleSelection, { UserRole } from './RoleSelection';
import PersonalInfoFields from './PersonalInfoFields';
import AddressFields from './AddressFields';
import SignUpFormActions from './SignUpFormActions';

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
    role: 'donor' as UserRole
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const { signup } = useAuth();
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
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // ZIP code validation (if provided)
    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      errors.zip = 'Please enter a valid ZIP code';
    }
    
    // Phone validation (if provided)
    if (formData.phone && !/^[\d\s()-+]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
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
      if (selectedRole) {
        userData.role = selectedRole;
      }
      await signup(userData, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the context
      setIsLoading(false);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    if (role === 'politicalClient') {
      navigate('/political-signup');
      return;
    }
    
    if (role === 'admin') {
      toast.info('Admin registration requires approval. Please contact support.');
      return;
    }
    
    setShowRoleSelection(false);
    setFormData({
      ...formData,
      role
    });
  };

  return (
    <div className="animate-fade-in-up form-container max-w-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground mt-2">
          Fill in your details to get started
        </p>
      </div>
      
      {showRoleSelection ? (
        <>
          <RoleSelection 
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
          />
          
          <div className="mt-6 text-center text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-campaign-orange hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PersonalInfoFields
              formData={formData}
              handleChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              formErrors={formErrors}
            />
            
            <AddressFields 
              formData={formData} 
              handleChange={handleChange}
              formErrors={formErrors}  
            />
            
            <SignUpFormActions isLoading={isLoading} />
          </form>
        </>
      )}
    </div>
  );
};

export default SignUpForm;
