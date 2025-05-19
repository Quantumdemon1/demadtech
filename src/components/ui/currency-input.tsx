
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  onValueChange?: (value: number | undefined) => void;
  defaultValue?: string | number;
  value?: string | number;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, prefix = '$', onValueChange, defaultValue, value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      formatValue(value !== undefined ? value : defaultValue)
    );

    // Format value as currency string
    function formatValue(val: string | number | undefined): string {
      if (val === undefined || val === '') return '';
      
      // Convert to number and format
      const numericValue = typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) : val;
      
      if (isNaN(numericValue)) return '';
      
      const formatted = numericValue.toFixed(2);
      return formatted === '0.00' ? '' : formatted;
    }

    // Parse string to numeric value
    function parseValue(val: string): number | undefined {
      const cleaned = val.replace(/[^\d.-]/g, '');
      const numeric = parseFloat(cleaned);
      return isNaN(numeric) ? undefined : numeric;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow backspace to clear input
      if (e.target.value === '') {
        setInternalValue('');
        if (onValueChange) onValueChange(undefined);
        if (onChange) onChange(e);
        return;
      }

      // Only allow numbers and decimals
      const value = e.target.value.replace(/[^\d.]/g, '');
      const parts = value.split('.');
      
      // Ensure at most one decimal point
      let formatted = parts[0];
      if (parts.length > 1) {
        formatted += '.' + parts.slice(1).join('').slice(0, 2); // Max 2 decimal places
      }
      
      setInternalValue(formatted);
      
      const numericValue = parseValue(formatted);
      if (onValueChange) onValueChange(numericValue);
      if (onChange) onChange(e);
    };

    // Handle external value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(formatValue(value));
      }
    }, [value]);

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{prefix}</span>
        <Input
          type="text"
          className={cn("pl-6", className)}
          ref={ref}
          value={internalValue}
          onChange={handleChange}
          inputMode="decimal"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
