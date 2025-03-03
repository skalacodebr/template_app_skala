import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, orderBy, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Info, AlertCircle, CheckCircle, AlertTriangle, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: Timestamp;
  read: boolean;
  targetAudience: 'all' | 'users' | 'partners' | 'specific';
  specificUsers?: string[];
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('targetAudience', 'in', ['all', user?.role]),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notificationsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];

      // Filtrar notificações específicas para o usuário
      const filteredNotifications = notificationsList.filter(notification => {
        if (notification.targetAudience === 'specific') {
          return notification.specificUsers?.includes(user?.id || '');
        }
        return true;
      });

      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'info':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notificações</h1>
        <Badge variant="secondary">
          {notifications.filter(n => !n.read).length} não lidas
        </Badge>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhuma notificação</h2>
            <p className="text-muted-foreground">
              Você não tem nenhuma notificação no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={cn(
                "transition-colors",
                !notification.read && "bg-muted/40"
              )}
            >
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{notification.title}</h2>
                    <Badge variant={getNotificationBadge(notification.type)}>
                      {notification.type}
                    </Badge>
                    {!notification.read && (
                      <Badge variant="secondary">Nova</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(notification.createdAt.toDate(), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <p>{notification.message}</p>
              </CardContent>

              {!notification.read && (
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="ml-auto"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Marcar como lida
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
