import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Campo vazio",
        description: "Por favor informe seu e-mail.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-md animate-scale-in">
          <Card className="glass-panel border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto rounded-full bg-primary/10 p-3 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold">E-mail enviado!</CardTitle>
              <CardDescription>
                Se existir uma conta com o e-mail {email}, você receberá instruções para redefinir sua senha.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="glass-panel border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="w-12 h-12 rounded-md bg-primary mx-auto flex items-center justify-center mb-2">
              <span className="text-primary-foreground font-bold text-xl">AB</span>
            </div>
            <CardTitle className="text-2xl font-bold">Esqueceu sua senha?</CardTitle>
            <CardDescription>
              Informe seu e-mail para receber um link de recuperação de senha
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
                    Enviando...
                  </>
                ) : (
                  'Enviar link de recuperação'
                )}
              </Button>
              <div className="text-center text-sm">
                <Link to="/login" className="text-primary hover:underline flex items-center justify-center">
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Voltar para o login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
