import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Home, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface BottomBarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
}

const BottomBarItem = ({ icon, label, to, end = false }: BottomBarItemProps) => {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        'flex flex-col items-center justify-center gap-1 py-1',
        isActive 
          ? 'text-primary' 
          : 'text-muted-foreground'
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
};

const BottomBar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-card z-40 px-2">
      <div className="flex items-center justify-around h-full">
        <BottomBarItem 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          to="/" 
          end 
        />
        <BottomBarItem 
          icon={<Bell className="w-5 h-5" />} 
          label="Notificações" 
          to="/notifications" 
        />
      
          <BottomBarItem 
            icon={<Menu className="w-5 h-5" />} 
            label="Menu" 
            to="/mobile-menu" 
            end 
          />
      
        <BottomBarItem 
          icon={<User className="w-5 h-5" />} 
          label="Perfil" 
          to="/profile" 
        />
      </div>
    </div>
  );
};

export default BottomBar;
