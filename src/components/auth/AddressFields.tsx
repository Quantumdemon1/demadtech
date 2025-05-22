
import React from 'react';
import { Input } from '@/components/ui/input';

interface AddressFieldsProps {
  formData: {
    address: string;
    city: string;
    state: string;
    zip: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors?: {[key: string]: string};
}

const AddressFields: React.FC<AddressFieldsProps> = ({
  formData,
  handleChange,
  formErrors = {},
}) => {
  return (
    <>
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
          className={`input-field ${formErrors.address ? 'border-red-500' : ''}`}
        />
        {formErrors.address && (
          <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input
            id="city"
            name="city"
            placeholder="Anytown"
            value={formData.city}
            onChange={handleChange}
            className={`input-field ${formErrors.city ? 'border-red-500' : ''}`}
          />
          {formErrors.city && (
            <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <Input
            id="state"
            name="state"
            placeholder="CA"
            value={formData.state}
            onChange={handleChange}
            className={`input-field ${formErrors.state ? 'border-red-500' : ''}`}
          />
          {formErrors.state && (
            <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="zip" className="text-sm font-medium">
          ZIP Code
        </label>
        <Input
          id="zip"
          name="zip"
          placeholder="12345"
          value={formData.zip}
          onChange={handleChange}
          className={`input-field ${formErrors.zip ? 'border-red-500' : ''}`}
        />
        {formErrors.zip && (
          <p className="text-red-500 text-sm mt-1">{formErrors.zip}</p>
        )}
      </div>
    </>
  );
};

export default AddressFields;
