import React from 'react';
import { cn } from '../../../lib/utils';
import { useIsMobile } from '../../../hooks/use-mobile';
import SidebarHeader from './SidebarHeader';
import SidebarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar = ({ isOpen, onClose, onLogout }: SidebarProps) => {
  const isMobile = useIsMobile();

  return (
    <aside 
      className={cn(
        "w-64 border-r bg-card fixed inset-y-0 z-50 flex flex-col transition-transform duration-300 ease-in-out",
        (isMobile && !isOpen) && "-translate-x-full",
        !isMobile && "translate-x-0"
      )}
    >
      <SidebarHeader onClose={onClose} isMobile={isMobile} />
      <SidebarContent onItemClick={isMobile ? onClose : undefined} />
      <SidebarFooter onLogout={onLogout} />
    </aside>
  );
};

export default Sidebar;
