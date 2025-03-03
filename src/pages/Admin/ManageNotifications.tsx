import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../hooks/use-toast";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";

interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'users' | 'partners' | 'specific';
  specificUsers?: string[];
  createdAt: Timestamp;
  scheduledFor?: Timestamp;
  status: 'draft' | 'scheduled' | 'sent';
  category: string;
}

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState<Notification>({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    createdAt: Timestamp.now(),
    status: 'draft',
    category: 'general'
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const db = getFirestore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const notificationsCollection = collection(db, 'notifications');
    const notificationsSnapshot = await getDocs(notificationsCollection);
    const notificationsList = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    setNotifications(notificationsList);
  };

  const handleCreateNotification = async () => {
    try {
      const notificationData = {
        ...newNotification,
        scheduledFor: selectedDate ? Timestamp.fromDate(selectedDate) : undefined
      };

      const notificationsCollection = collection(db, 'notifications');
      await addDoc(notificationsCollection, notificationData);
      await fetchNotifications();
      setIsCreateDialogOpen(false);
      resetNotificationForm();
      
      toast({
        title: "Notificação criada",
        description: "A notificação foi criada com sucesso.",
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Erro ao criar",
        description: "Não foi possível criar a notificação.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNotification = async (id: string, updates: Partial<Notification>) => {
    try {
      const notificationDoc = doc(db, 'notifications', id);
      await updateDoc(notificationDoc, updates);
      await fetchNotifications();
      
      toast({
        title: "Notificação atualizada",
        description: "A notificação foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating notification:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a notificação.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta notificação?')) {
      return;
    }

    try {
      const notificationDoc = doc(db, 'notifications', id);
      await deleteDoc(notificationDoc);
      await fetchNotifications();
      
      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a notificação.",
        variant: "destructive",
      });
    }
  };

  const resetNotificationForm = () => {
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      targetAudience: 'all',
      createdAt: Timestamp.now(),
      status: 'draft',
      category: 'general'
    });
    setSelectedDate(undefined);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Notificações</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nova Notificação</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Notificação</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da nova notificação.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({
                    ...newNotification,
                    title: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({
                    ...newNotification,
                    message: e.target.value
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value: 'info' | 'warning' | 'success' | 'error') =>
                      setNewNotification({
                        ...newNotification,
                        type: value
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informação</SelectItem>
                      <SelectItem value="warning">Aviso</SelectItem>
                      <SelectItem value="success">Sucesso</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="targetAudience">Público Alvo</Label>
                  <Select
                    value={newNotification.targetAudience}
                    onValueChange={(value: 'all' | 'users' | 'partners' | 'specific') =>
                      setNewNotification({
                        ...newNotification,
                        targetAudience: value
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="users">Usuários</SelectItem>
                      <SelectItem value="partners">Parceiros</SelectItem>
                      <SelectItem value="specific">Específicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Data de Envio</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                resetNotificationForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleCreateNotification}>
                Criar Notificação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Público Alvo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Agendamento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.title}</TableCell>
                <TableCell>
                  <Badge variant={
                    notification.type === 'success' ? 'default' :
                    notification.type === 'error' ? 'destructive' :
                    notification.type === 'warning' ? 'secondary' :
                    'outline'
                  }>
                    {notification.type}
                  </Badge>
                </TableCell>
                <TableCell>{notification.targetAudience}</TableCell>
                <TableCell>
                  <Badge variant={
                    notification.status === 'sent' ? 'default' :
                    notification.status === 'scheduled' ? 'outline' :
                    'secondary'
                  }>
                    {notification.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {notification.scheduledFor ? 
                    format(notification.scheduledFor.toDate(), 'dd/MM/yyyy HH:mm') : 
                    'Não agendado'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Implementar edição
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteNotification(notification.id!)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageNotifications;
