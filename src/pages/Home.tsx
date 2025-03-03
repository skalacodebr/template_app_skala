import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as Icons from 'lucide-react';

interface Highlight {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  buttonText: string;
  buttonLink: string;
  userType: 'user' | 'partner' | 'all';
}

const Home = () => {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const isAdmin = user?.role === 'admin';
  const isPartner = user?.role === 'partner';
  const db = getFirestore();

  useEffect(() => {
    fetchHighlights();
  }, [user]);

  const fetchHighlights = async () => {
    const highlightsCollection = collection(db, 'highlights');
    const highlightsSnapshot = await getDocs(highlightsCollection);
    const highlightsList = highlightsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Highlight[];

    // Filtrar destaques baseado no tipo de usuário
    const filteredHighlights = highlightsList.filter(highlight => 
      highlight.userType === 'all' || 
      highlight.userType === user?.role
    );

    setHighlights(filteredHighlights);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name}!</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin && "Gerencie todos os aspectos da plataforma como administrador."}
          {isPartner && "Visualize e gerencie suas parcerias e relatórios."}
          {!isAdmin && !isPartner && "Explore nossos planos e recursos para otimizar sua experiência."}
        </p>
      </div>

      {/* Featured Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Destaques</h2>
          {isAdmin && (
            <Button variant="outline" asChild>
              <Link to="/admin/manage-highlights">
                Gerenciar Destaques
              </Link>
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <Card key={highlight.id} className="flex flex-col hover-scale overflow-hidden">
              <div 
                className="h-36 flex items-center justify-center text-white"
                style={{ background: highlight.color }}
              >
                {React.createElement(Icons[highlight.icon], { className: 'h-12 w-12' })}
              </div>
              <CardHeader>
                <CardTitle>{highlight.title}</CardTitle>
                <CardDescription>{highlight.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{highlight.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={highlight.buttonLink}>{highlight.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin/Partner-specific content */}
      {(isAdmin || isPartner) && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Gestão</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isAdmin && (
              <>
                <Card className="hover-scale">
                  <CardHeader>
                    <CardTitle>Gerenciar Usuários</CardTitle>
                    <CardDescription>
                      Gerencie todos os usuários da plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Adicione, edite, ou remova contas de usuário.</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to="/admin/manage-users">Acessar</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="hover-scale">
                  <CardHeader>
                    <CardTitle>Gerenciar Planos</CardTitle>
                    <CardDescription>
                      Configure planos e preços
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Adicione ou modifique planos disponíveis para os usuários.</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to="/admin/manage-plans">Acessar</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
            
            <Card className="hover-scale">
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>
                  Análise de desempenho e métricas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Visualize relatórios detalhados de uso e desempenho.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/reports">Acessar</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
