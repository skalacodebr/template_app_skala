import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md text-center space-y-5 animate-scale-in">
        <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-bold">Acesso negado</h1>
        
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página. Esta funcionalidade requer privilégios adicionais.
        </p>
        
        <div className="flex flex-col space-y-2">
          <p className="text-sm">
            Logado como: <span className="font-medium">{user?.name}</span>
            <br />
            <span className="text-xs text-muted-foreground">
              Perfil: <span className="capitalize">{user?.role}</span>
            </span>
          </p>
          
          <Button asChild className="mt-2">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar para a página inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
