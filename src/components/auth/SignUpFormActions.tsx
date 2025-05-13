
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SignUpFormActionsProps {
  isLoading: boolean;
}

const SignUpFormActions: React.FC<SignUpFormActionsProps> = ({
  isLoading,
}) => {
  return (
    <>
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </div>
      
      <div className="mt-6 text-center text-sm">
        <p>
          By signing up to create an account I accept{' '}
          <Link to="/terms" className="text-campaign-orange hover:underline">
            Company's Terms of Use and Privacy Policy
          </Link>
        </p>
        <p className="mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-campaign-orange hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </>
  );
};

export default SignUpFormActions;
