import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth, updateProfile, updateEmail, deleteUser } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Plan {
  id: string;
  name: string;
  description: string;
  period: 'monthly' | 'yearly';
  price: number;
}

const Profile = () => {
  const { user } = useAuth();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchUserPlan();
    }
  }, [currentUser]);

  const fetchUserPlan = async () => {
    if (!currentUser) return;

    const userDoc = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists() && userSnapshot.data().planId) {
      const planDoc = doc(db, 'plans', userSnapshot.data().planId);
      const planSnapshot = await getDoc(planDoc);

      if (planSnapshot.exists()) {
        setUserPlan({
          id: planSnapshot.id,
          ...planSnapshot.data()
        } as Plan);
      }
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentUser) {
        await updateProfile(currentUser, { displayName: name });
        if (currentUser.email !== email) {
          await updateEmail(currentUser, email);
        }
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir sua conta? Essa ação é irreversível.'
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(currentUser);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Informações Pessoais</h2>
          {isEditing ? (
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </form>
          ) : (
            <>
              <p>Nome: {currentUser?.displayName}</p>
              <p>Email: {currentUser?.email}</p>
            </>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Seu Plano</CardTitle>
            <Star className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {userPlan ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">{userPlan.name}</div>
                <p className="text-muted-foreground">{userPlan.description}</p>
                <p className="font-medium">
                  R$ {userPlan.price}/{userPlan.period === 'monthly' ? 'mês' : 'ano'}
                </p>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/plans">Gerenciar Plano</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Você ainda não possui um plano.
                </p>
                <Button asChild className="w-full">
                  <Link to="/plans">Ver Planos Disponíveis</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Configurações</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Excluir Conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
