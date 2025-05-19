
import React from 'react';
import { Input, InputProps } from '@/components/ui/input';

interface CurrencyInputProps extends Omit<InputProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    // Format value as currency
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9.]/g, '');
      const numValue = parseFloat(rawValue);
      
      if (!isNaN(numValue)) {
        onChange(`$${numValue.toFixed(2)}`);
      } else {
        onChange('');
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={value}
        onChange={handleChange}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
