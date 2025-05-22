
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
}

const AddressFields: React.FC<AddressFieldsProps> = ({
  formData,
  handleChange,
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
    </>
  );
};

export default AddressFields;
