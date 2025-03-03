import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import NotificationsDropdown from './NotificationsDropdown';
import UserDropdown from './UserDropdown';
import { useIsMobile } from '../../../hooks/use-mobile';

interface HeaderProps {
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Header = ({ toggleSidebar, onLogout }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4">
     
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <NotificationsDropdown />
        {!isMobile && <UserDropdown onLogout={onLogout} />}
      </div>
    </header>
  );
};

export default Header;
