import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos vazios",
        description: "Por favor preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  // For demo purposes, let's add quick login buttons
  const handleQuickLogin = async (userType: 'admin' | 'user' | 'partner') => {
    try {
      setIsSubmitting(true);
      
      let demoEmail = '';
      switch (userType) {
        case 'admin':
          demoEmail = 'admin@example.com';
          break;
        case 'user':
          demoEmail = 'user@example.com';
          break;
        case 'partner':
          demoEmail = 'partner@example.com';
          break;
      }
      
      await login(demoEmail, 'password');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="glass-panel border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="w-12 h-12 rounded-md bg-primary mx-auto flex items-center justify-center mb-2">
              <span className="text-primary-foreground font-bold text-xl">AB</span>
            </div>
            <CardTitle className="text-2xl font-bold">Bem-vindo de volta!</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
              <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Registre-se
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        {/* Quick Login Section (for demo only) */}
        <div className="mt-6 space-y-2">
          <p className="text-center text-sm text-muted-foreground">Demo: Acesso rápido</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleQuickLogin('admin')}
              disabled={isSubmitting}
            >
              Admin
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleQuickLogin('user')}
              disabled={isSubmitting}
            >
              Usuário
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleQuickLogin('partner')}
              disabled={isSubmitting}
            >
              Parceiro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
