import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { useAuth } from '../../../contexts/AuthContext';

interface SidebarFooterProps {
  onLogout: () => void;
}

const SidebarFooter = ({ onLogout }: SidebarFooterProps) => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <Button variant="outline" size="icon" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SidebarFooter;
