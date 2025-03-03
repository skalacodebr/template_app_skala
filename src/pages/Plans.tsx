import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Check } from 'lucide-react';

interface PlanFeature {
  id: string;
  description: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: PlanFeature[];
  isActive: boolean;
  userType: 'user' | 'partner';
}

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSubscription, setUserSubscription] = useState<string | null>(null);
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchPlans();
    if (user?.id) {
      fetchUserSubscription();
    }
  }, [user?.id]);

  const fetchPlans = async () => {
    const plansCollection = collection(db, 'plans');
    const plansSnapshot = await getDocs(plansCollection);
    const plansList = plansSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Plan[];
    
    // Filtrar apenas planos ativos e do tipo correspondente ao usuário
    const filteredPlans = plansList.filter(plan => 
      plan.isActive && plan.userType === user?.role
    );
    
    setPlans(filteredPlans);
  };

  const fetchUserSubscription = async () => {
    if (!user?.id) return;
    
    const userDoc = doc(db, 'users', user.id);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      setUserSubscription(userData.planId || null);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user?.id) {
      alert('Você precisa estar logado para assinar um plano.');
      return;
    }

    try {
      const userDoc = doc(db, 'users', user.id);
      await setDoc(userDoc, { planId }, { merge: true });
      setUserSubscription(planId);
      alert('Plano assinado com sucesso!');
    } catch (error) {
      console.error('Erro ao assinar o plano:', error);
      alert('Erro ao assinar o plano. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Planos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="relative p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {userSubscription === plan.id && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              
              <div>
                <span className="text-3xl font-bold">R$ {plan.price}</span>
                <span className="text-muted-foreground">/{plan.period === 'monthly' ? 'mês' : 'ano'}</span>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Recursos Incluídos:</h3>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                className="w-full"
                variant={userSubscription === plan.id ? "secondary" : "default"}
                disabled={userSubscription === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {userSubscription === plan.id ? 'Assinado' : 'Assinar'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
