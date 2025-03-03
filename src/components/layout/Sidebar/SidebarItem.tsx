import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Badge } from '../../ui/badge';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
  badge?: string;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, to, end = false, badge, onClick }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-scale",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-foreground/70 hover:text-foreground hover:bg-accent"
      )}
      onClick={onClick}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
      {badge && (
        <Badge className="ml-auto" variant="secondary">
          {badge}
        </Badge>
      )}
    </Link>
  );
};

export default SidebarItem;
