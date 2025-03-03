import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Campos vazios",
        description: "Por favor preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(name, email, password, role);
      navigate('/');
    } catch (error) {
      console.error(error);
      // Error is handled in the auth context
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
            <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para se registrar
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Conta</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="partner">Parceiro</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {/* Admin would typically be assigned, not self-registered */}
                  </SelectContent>
                </Select>
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
                    Registrando...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Entrar
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
