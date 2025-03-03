import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const data = await getNotifications();
//         setNotifications(data);
//         setUnreadCount(data.filter((notification) => !notification.read).length);
//       } catch (error) {
//         console.error('Failed to fetch notifications', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNotifications();
//   }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">
                  {notification.message}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(notification.createdAt.toDate(), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center text-center font-medium">
          <Link to="/notifications">Ver todas</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
