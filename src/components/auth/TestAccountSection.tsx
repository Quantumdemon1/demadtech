
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from './RoleSelection';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getTestCredentials } from '@/utils/authUtils';

interface TestAccountSectionProps {
  isLoading: boolean;
  loginAsTestAccount: (role: UserRole) => void;
}

const TestAccountSection: React.FC<TestAccountSectionProps> = ({
  isLoading,
  loginAsTestAccount,
}) => {
  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-lg font-medium text-center mb-6">Test Accounts</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Try out the platform with these test accounts
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="p-4"
          onClick={() => loginAsTestAccount('donor')}
          disabled={isLoading}
        >
          Try as Donor
        </Button>
        <Button
          variant="outline"
          className="p-4"
          onClick={() => loginAsTestAccount('politicalClient')}
          disabled={isLoading}
        >
          Try as Organization
        </Button>
        <Button
          variant="outline"
          className="p-4"
          onClick={() => loginAsTestAccount('admin')}
          disabled={isLoading}
        >
          Try as Admin
        </Button>
      </div>
    </div>
  );
};

export default TestAccountSection;
