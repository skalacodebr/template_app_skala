import React from 'react';
import { Home, Bell, Box, User, BarChart, UserCog, Layers, FileBarChart, LayoutDashboard, FileText, Mail, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MobileMenu() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isPartner = user?.role === 'partner';

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <div className="flex flex-col items-center gap-4 text-lg">
        <Link to="/" className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link to="/notifications" className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <span>Notificações</span>
        </Link>
        <Link to="/plans" className="flex items-center gap-2">
          <Box className="w-5 h-5" />
          <span>Planos</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </Link>

        {isAdmin && (
          <>
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/manage-users" className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              <span>Usuários</span>
            </Link>
            <Link to="/admin/manage-plans" className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <span>Planos</span>
            </Link>
            <Link to="/admin/manage-highlights" className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              <span>Destaques</span>
            </Link>
            <Link to="/admin/manage-notifications" className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <span>Notificações</span>
            </Link>
            <Link to="/admin/activity-logs" className="flex items-center gap-2">
              <FileBarChart className="w-5 h-5" />
              <span>Logs de Atividade</span>
            </Link>
          </>
        )}

        {(isAdmin || isPartner) && (
          <Link to="/reports" className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5" />
            <span>Relatórios</span>
          </Link>
        )}

        <Link to="/terms-privacy" className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span>Termos & Privacidade</span>
        </Link>
        <Link to="/contact-support" className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          <span>Contato</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span>Configurações</span>
        </Link>
      </div>
    </div>
  );
}
