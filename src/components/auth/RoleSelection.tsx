
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Building, Shield } from 'lucide-react';

export type UserRole = 'donor' | 'politicalClient' | 'admin';

interface RoleSelectionProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  showAdmin?: boolean;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onRoleSelect,
  showAdmin = true, // Changed default to true to enable admin selection
}) => {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium text-center">Select Account Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Button
          variant="outline"
          className={`flex flex-col items-center justify-center p-8 h-auto w-full transition-all duration-200
          ${selectedRole === 'donor' 
            ? 'border-campaign-orange ring-2 ring-campaign-orange ring-offset-2 bg-campaign-orange/10' 
            : 'hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md'
          }`}
          onClick={() => onRoleSelect('donor')}
          data-selected={selectedRole === 'donor'}
        >
          <div className="flex flex-col items-center">
            <User className="h-10 w-10 mb-3" />
            <span className="text-xl font-semibold mb-2">Donor</span>
            <span className="text-sm text-muted-foreground text-center">Support campaigns with donations</span>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className={`flex flex-col items-center justify-center p-8 h-auto w-full transition-all duration-200
          ${selectedRole === 'politicalClient' 
            ? 'border-campaign-orange ring-2 ring-campaign-orange ring-offset-2 bg-campaign-orange/10' 
            : 'hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md'
          }`}
          onClick={() => onRoleSelect('politicalClient')}
          data-selected={selectedRole === 'politicalClient'}
        >
          <div className="flex flex-col items-center">
            <Building className="h-10 w-10 mb-3" />
            <span className="text-xl font-semibold mb-2">Political Organization</span>
            <span className="text-sm text-muted-foreground text-center">Create initiatives and manage donors</span>
          </div>
        </Button>
        
        {showAdmin && (
          <Button
            variant="outline"
            className={`flex flex-col items-center justify-center p-8 h-auto w-full md:col-span-2 transition-all duration-200
            ${selectedRole === 'admin' 
              ? 'border-campaign-orange ring-2 ring-campaign-orange ring-offset-2 bg-campaign-orange/10' 
              : 'hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md'
            }`}
            onClick={() => onRoleSelect('admin')}
            data-selected={selectedRole === 'admin'}
          >
            <div className="flex flex-col items-center">
              <Shield className="h-10 w-10 mb-3" />
              <span className="text-xl font-semibold mb-2">Administrator</span>
              <span className="text-sm text-muted-foreground text-center">Manage platform and all accounts</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
