
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
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
      if (selectedRole) {
        userData.role = selectedRole;
      }
      await signup(userData, formData.password);
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
    
    setShowRoleSelection(false);
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
            />
            
            <AddressFields 
              formData={formData} 
              handleChange={handleChange} 
            />
            
            <SignUpFormActions isLoading={isLoading} />
          </form>
        </>
      )}
    </div>
  );
};

export default SignUpForm;
