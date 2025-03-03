import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/use-mobile';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import BottomBar from './BottomBar';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar only */}
      {!isMobile && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      )}

      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen',
          !isMobile && 'pl-64'
        )}
      >
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />

        <main
          className={cn(
            'flex-1 p-6 overflow-y-auto animate-fade-in',
            isMobile && 'pb-20'
          )}
        >
          {children}
        </main>

        {/* BottomBar for mobile */}
        {isMobile && (
          <BottomBar />
        )}
      </div>
    </div>
  );
};

export default AppLayout;
