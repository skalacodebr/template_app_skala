import React from 'react';
import { Home, Box, User, Bell, BarChart, UserCog, Layers, FileText, Mail, Settings, FileBarChart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import SidebarSection from './SidebarSection';
import SidebarItem from './SidebarItem';

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isPartner = user?.role === 'partner';

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      <SidebarSection title="Navegação">
        <SidebarItem 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          to="/" 
          end 
          onClick={onItemClick}
        />
        <SidebarItem 
          icon={<Bell className="w-5 h-5" />} 
          label="Notificações" 
          to="/notifications" 
          onClick={onItemClick}
        />
        <SidebarItem 
          icon={<Box className="w-5 h-5" />} 
          label="Planos" 
          to="/plans" 
          onClick={onItemClick}
        />
        <SidebarItem 
          icon={<User className="w-5 h-5" />} 
          label="Perfil" 
          to="/profile" 
          onClick={onItemClick}
        />
      </SidebarSection>

      {isAdmin && (
        <SidebarSection title="Administração">
          <SidebarItem 
            icon={<BarChart className="w-5 h-5" />} 
            label="Dashboard" 
            to="/admin/dashboard" 
            onClick={onItemClick}
          />
          <SidebarItem 
            icon={<UserCog className="w-5 h-5" />} 
            label="Usuários" 
            to="/admin/manage-users" 
            onClick={onItemClick}
          />
          <SidebarItem 
            icon={<Layers className="w-5 h-5" />} 
            label="Planos" 
            to="/admin/manage-plans" 
            onClick={onItemClick}
          />
          <SidebarItem
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Destaques"
            to="/admin/manage-highlights"
            onClick={onItemClick}
          />
          <SidebarItem 
            icon={<Bell className="w-5 h-5" />} 
            label="Notificações" 
            to="/admin/manage-notifications" 
            onClick={onItemClick}
          />
          <SidebarItem 
            icon={<FileBarChart className="w-5 h-5" />} 
            label="Logs de Atividade" 
            to="/admin/activity-logs" 
            onClick={onItemClick}
          />
        </SidebarSection>
      )}

      {(isAdmin || isPartner) && (
        <SidebarSection title="Relatórios">
          <SidebarItem 
            icon={<FileBarChart className="w-5 h-5" />} 
            label="Relatórios" 
            to="/reports" 
            onClick={onItemClick}
          />
        </SidebarSection>
      )}

      <SidebarSection title="Suporte">
        <SidebarItem 
          icon={<FileText className="w-5 h-5" />} 
          label="Termos & Privacidade" 
          to="/terms-privacy" 
          onClick={onItemClick}
        />
        <SidebarItem 
          icon={<Mail className="w-5 h-5" />} 
          label="Contato" 
          to="/contact-support" 
          onClick={onItemClick}
        />
        <SidebarItem 
          icon={<Settings className="w-5 h-5" />} 
          label="Configurações" 
          to="/settings" 
          onClick={onItemClick}
        />
      </SidebarSection>
    </div>
  );
};

export default SidebarContent;
