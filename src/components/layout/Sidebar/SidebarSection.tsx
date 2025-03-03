import React from 'react';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection = ({ title, children }: SidebarSectionProps) => (
  <div className="space-y-2">
    <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {title}
    </div>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export default SidebarSection;
