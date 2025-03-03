import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const SidebarHeader = ({ onClose, isMobile }: SidebarHeaderProps) => (
  <div className="h-16 flex items-center justify-between px-4 border-b">
    <Link to="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold">AB</span>
      </div>
      <h1 className="text-xl font-semibold">AppBase</h1>
    </Link>
    {isMobile && onClose && (
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    )}
  </div>
);
export default SidebarHeader;
