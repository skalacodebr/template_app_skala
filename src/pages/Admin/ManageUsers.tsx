import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
import { Switch } from "../../components/ui/switch";
import { toast } from "../../hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'partner';
  isActive: boolean;
  planId?: string | null;
  createdAt: string;
  lastLogin?: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toLocaleDateString() || 'N/A',
      lastLogin: doc.data().lastLogin?.toDate?.().toLocaleDateString() || 'N/A'
    })) as User[];
    setUsers(usersList);
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, updates);
      await fetchUsers();
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      const userDoc = doc(db, 'users', userId);
      await deleteDoc(userDoc);
      await fetchUsers();
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    await handleUpdateUser(userId, { isActive });
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Último login</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={
                    user.role === 'admin' 
                      ? 'default' 
                      : user.role === 'partner' 
                        ? 'secondary' 
                        : 'outline'
                  }>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={(checked) => handleToggleStatus(user.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  {user.planId || 'Sem plano'}
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setSelectedUser(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      {selectedUser && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Usuário</DialogTitle>
                            <DialogDescription>
                              Faça as alterações necessárias nos dados do usuário.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Nome</Label>
                              <Input
                                id="name"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({
                                  ...selectedUser,
                                  name: e.target.value
                                })}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="role">Tipo de Usuário</Label>
                              <Select
                                value={selectedUser.role}
                                onValueChange={(value: 'admin' | 'user' | 'partner') =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    role: value
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Usuário</SelectItem>
                                  <SelectItem value="partner">Parceiro</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => {
                                handleUpdateUser(selectedUser.id, {
                                  name: selectedUser.name,
                                  role: selectedUser.role
                                });
                                setIsEditDialogOpen(false);
                              }}
                            >
                              Salvar alterações
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
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

export default ManageUsers;
