import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface PlanFeature {
  id: string;
  description: string;
}

interface Plan {
  id?: string;
  name: string;
  description: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: PlanFeature[];
  isActive: boolean;
  userType: 'user' | 'partner';
}

const ManagePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [newPlan, setNewPlan] = useState<Plan>({
    name: '',
    description: '',
    price: 0,
    period: 'monthly',
    features: [],
    isActive: true,
    userType: 'user'
  });
  const [newFeature, setNewFeature] = useState('');
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const db = getFirestore();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const plansCollection = collection(db, 'plans');
    const plansSnapshot = await getDocs(plansCollection);
    const plansList = plansSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Plan[];
    setPlans(plansList);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setNewPlan(prev => ({
        ...prev,
        features: [...prev.features, { id: Date.now().toString(), description: newFeature.trim() }]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureId: string) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== featureId)
    }));
  };

  const handleAddPlan = async () => {
    const plansCollection = collection(db, 'plans');
    await addDoc(plansCollection, newPlan);
    setNewPlan({
      name: '',
      description: '',
      price: 0,
      period: 'monthly',
      features: [],
      isActive: true,
      userType: 'user'
    });
    fetchPlans();
  };

  const handleUpdatePlan = async (planId: string, updatedPlan: Partial<Plan>) => {
    const planDoc = doc(db, 'plans', planId);
    await updateDoc(planDoc, updatedPlan);
    setEditingPlan(null);
    fetchPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    const planDoc = doc(db, 'plans', planId);
    await deleteDoc(planDoc);
    fetchPlans();
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Planos</h1>
      <div className="space-y-6">
        {/* Formulário para adicionar/editar plano */}
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingPlan ? 'Editar Plano' : 'Adicionar Novo Plano'}
          </h2>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="period">Período</Label>
              <Select
                value={newPlan.period}
                onValueChange={(value: 'monthly' | 'yearly') => setNewPlan({ ...newPlan, period: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <Select
                value={newPlan.userType}
                onValueChange={(value: 'user' | 'partner') => setNewPlan({ ...newPlan, userType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="partner">Parceiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={newPlan.isActive}
                onCheckedChange={(checked) => setNewPlan({ ...newPlan, isActive: checked })}
              />
              <Label>Plano Ativo</Label>
            </div>
            
            <div className="grid gap-2">
              <Label>Recursos</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Adicionar novo recurso"
                />
                <Button onClick={handleAddFeature}>Adicionar</Button>
              </div>
              <div className="space-y-2">
                {newPlan.features.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-2">
                    <span>{feature.description}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveFeature(feature.id)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={handleAddPlan}>
              {editingPlan ? 'Atualizar Plano' : 'Adicionar Plano'}
            </Button>
          </div>
        </div>

        {/* Lista de planos */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="p-4 border rounded-lg shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <p className="text-muted-foreground">{plan.description}</p>
                  <p className="font-semibold mt-2">
                    R$ {plan.price} / {plan.period === 'monthly' ? 'mês' : 'ano'}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {plan.userType === 'user' ? 'Usuário' : 'Parceiro'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <strong>Recursos:</strong>
                    <ul className="list-disc list-inside mt-2">
                      {plan.features.map((feature) => (
                        <li key={feature.id}>{feature.description}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button onClick={() => setEditingPlan(plan.id)}>Editar</Button>
                  <Button variant="destructive" onClick={() => handleDeletePlan(plan.id!)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePlans;
