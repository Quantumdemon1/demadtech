
import React from 'react';
import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface PersonalInfoFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    occupation: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
}) => {
  return (
    <>
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
    </>
  );
};

export default PersonalInfoFields;
