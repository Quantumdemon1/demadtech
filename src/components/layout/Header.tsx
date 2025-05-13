
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path 
      ? 'nav-link-active' 
      : 'nav-link';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-campaign-navy dark:text-white">
              Ad<span className="text-campaign-orange">Tech</span>
            </span>
          </Link>
          
          {user && user.role === 'admin' ? (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
                Dashboard
              </Link>
              <Link to="/admin/campaign-approval" className={getLinkClass('/admin/campaign-approval')}>
                Campaign Approvals
              </Link>
              <Link to="/admin/manage-awards" className={getLinkClass('/admin/manage-awards')}>
                Manage Awards
              </Link>
            </nav>
          ) : user && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                My Campaigns
              </Link>
              <Link to="/create-campaign" className={getLinkClass('/create-campaign')}>
                Create A New Campaign
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? "/admin/dashboard" : "/account"} className={getLinkClass(user.role === 'admin' ? '/admin/dashboard' : '/account')}>
                {user.role === 'admin' ? 'Admin Panel' : 'My Account'}
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="hidden md:inline-flex"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={getLinkClass('/login')}>
                Log In
              </Link>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-campaign-orange hover:bg-campaign-orange-dark"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
