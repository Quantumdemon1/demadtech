
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Edit, FileImage, DollarSign, Award } from 'lucide-react';
import Header from '@/components/layout/Header';
import useAuth from '@/hooks/useAuth';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';

interface PoliticalClientLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PoliticalClientLayout: React.FC<PoliticalClientLayoutProps> = ({ children, title }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'politicalClient') {
    return <Navigate to="/" />;
  }

  const navLinks = [
    { 
      to: '/political-client/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard 
    },
    { 
      to: '/political-client/profile', 
      label: 'Profile', 
      icon: User 
    },
    { 
      to: '/political-client/initiative/create', 
      label: 'Create Initiative', 
      icon: Edit 
    },
    { 
      to: '/political-client/payments', 
      label: 'Payments', 
      icon: DollarSign 
    },
    { 
      to: '/political-client/awards', 
      label: 'Awards', 
      icon: Award 
    }
  ];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? "bg-muted text-primary font-medium flex items-center w-full px-3 py-2 rounded-md" : 
    "hover:bg-muted/50 flex items-center w-full px-3 py-2 rounded-md";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container flex flex-1">
        <Sidebar className="w-60 border-r p-4 hidden md:flex flex-col">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navLinks.map((link) => (
                    <SidebarMenuItem key={link.to}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={link.to} 
                          className={getNavLinkClass}
                          end={link.to === '/political-client/dashboard'}
                        >
                          <link.icon className="mr-2 h-4 w-4" />
                          <span>{link.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 p-6">
          {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
};

export default PoliticalClientLayout;
