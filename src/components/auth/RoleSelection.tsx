
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserIcon, BuildingIcon, ShieldIcon } from 'lucide-react';

export type UserRole = 'donor' | 'politicalClient' | 'admin';

interface RoleSelectionProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  showAdmin?: boolean;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onRoleSelect,
  showAdmin = false,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Account Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant={selectedRole === 'donor' ? 'default' : 'outline'}
          className={`flex items-center justify-center h-20 ${
            selectedRole === 'donor' ? 'ring-2 ring-campaign-orange' : ''
          }`}
          onClick={() => onRoleSelect('donor')}
        >
          <div className="flex flex-col items-center">
            <UserIcon className="h-6 w-6 mb-1" />
            <span>Donor</span>
            <span className="text-xs text-muted-foreground mt-1">Support campaigns with donations</span>
          </div>
        </Button>
        
        <Button
          variant={selectedRole === 'politicalClient' ? 'default' : 'outline'}
          className={`flex items-center justify-center h-20 ${
            selectedRole === 'politicalClient' ? 'ring-2 ring-campaign-orange' : ''
          }`}
          onClick={() => onRoleSelect('politicalClient')}
        >
          <div className="flex flex-col items-center">
            <BuildingIcon className="h-6 w-6 mb-1" />
            <span>Political Organization</span>
            <span className="text-xs text-muted-foreground mt-1">Create initiatives and manage donors</span>
          </div>
        </Button>
        
        {showAdmin && (
          <Button
            variant={selectedRole === 'admin' ? 'default' : 'outline'}
            className={`flex items-center justify-center h-20 ${
              selectedRole === 'admin' ? 'ring-2 ring-campaign-orange' : ''
            }`}
            onClick={() => onRoleSelect('admin')}
          >
            <div className="flex flex-col items-center">
              <ShieldIcon className="h-6 w-6 mb-1" />
              <span>Administrator</span>
              <span className="text-xs text-muted-foreground mt-1">Manage platform and all accounts</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
