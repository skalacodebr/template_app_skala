import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from '../../components/ui/textarea';
import { toast } from "../../hooks/use-toast";
import * as Icons from 'lucide-react';

interface Highlight {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  buttonText: string;
  buttonLink: string;
  userType: 'user' | 'partner' | 'all';
}

const availableIcons = Object.keys(Icons).filter(key => 
  key !== 'createLucideIcon' && 
  key !== 'default' && 
  typeof Icons[key] === 'function'
);

const ManageHighlights = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [newHighlight, setNewHighlight] = useState<Highlight>({
    title: '',
    subtitle: '',
    description: '',
    icon: 'Star',
    color: '#3b82f6',
    buttonText: 'Saiba mais',
    buttonLink: '/',
    userType: 'all'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const db = getFirestore();

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    const highlightsCollection = collection(db, 'highlights');
    const highlightsSnapshot = await getDocs(highlightsCollection);
    const highlightsList = highlightsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Highlight[];
    setHighlights(highlightsList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const highlightDoc = doc(db, 'highlights', editingId);
        await updateDoc(highlightDoc, newHighlight);
        toast({
          title: "Destaque atualizado",
          description: "O destaque foi atualizado com sucesso.",
        });
      } else {
        await addDoc(collection(db, 'highlights'), newHighlight);
        toast({
          title: "Destaque criado",
          description: "O destaque foi criado com sucesso.",
        });
      }
      
      await fetchHighlights();
      resetForm();
    } catch (error) {
      console.error('Error saving highlight:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o destaque.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este destaque?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'highlights', id));
      await fetchHighlights();
      toast({
        title: "Destaque excluído",
        description: "O destaque foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting highlight:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o destaque.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (highlight: Highlight) => {
    setNewHighlight(highlight);
    setEditingId(highlight.id);
  };

  const resetForm = () => {
    setNewHighlight({
      title: '',
      subtitle: '',
      description: '',
      icon: 'Star',
      color: '#3b82f6',
      buttonText: 'Saiba mais',
      buttonLink: '/',
      userType: 'all'
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Destaques</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Destaque' : 'Novo Destaque'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newHighlight.title}
                  onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={newHighlight.subtitle}
                  onChange={(e) => setNewHighlight({ ...newHighlight, subtitle: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newHighlight.description}
                  onChange={(e) => setNewHighlight({ ...newHighlight, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Select
                    value={newHighlight.icon}
                    onValueChange={(value) => setNewHighlight({ ...newHighlight, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um ícone" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {React.createElement(Icons[icon], { className: 'h-4 w-4' })}
                            {icon}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input
                    id="color"
                    type="color"
                    value={newHighlight.color}
                    onChange={(e) => setNewHighlight({ ...newHighlight, color: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input
                  id="buttonText"
                  value={newHighlight.buttonText}
                  onChange={(e) => setNewHighlight({ ...newHighlight, buttonText: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Link do Botão</Label>
                <Input
                  id="buttonLink"
                  value={newHighlight.buttonLink}
                  onChange={(e) => setNewHighlight({ ...newHighlight, buttonLink: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Usuário</Label>
                <Select
                  value={newHighlight.userType}
                  onValueChange={(value: 'user' | 'partner' | 'all') => 
                    setNewHighlight({ ...newHighlight, userType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="user">Usuários</SelectItem>
                    <SelectItem value="partner">Parceiros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Atualizar' : 'Criar'} Destaque
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Destaques Existentes</h2>
          {highlights.map((highlight) => (
            <Card key={highlight.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(Icons[highlight.icon], { 
                      className: 'h-5 w-5',
                      style: { color: highlight.color }
                    })}
                    {highlight.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEdit(highlight)}>
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => highlight.id && handleDelete(highlight.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
                <div className="mt-2 text-sm">
                  <span className="font-semibold">Visível para: </span>
                  {highlight.userType === 'all' ? 'Todos' : 
                   highlight.userType === 'user' ? 'Usuários' : 'Parceiros'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageHighlights;
