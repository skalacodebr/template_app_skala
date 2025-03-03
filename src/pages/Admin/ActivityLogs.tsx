import React from 'react';

const ActivityLogs = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Logs de Atividades</h1>
      <div className="space-y-4">
        {/* Exemplo de log de atividade */}
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Login</h2>
          <p>Usuário John Doe fez login.</p>
          <span className="text-sm text-muted-foreground">2 horas atrás</span>
        </div>
        {/* Adicione mais logs conforme necessário */}
      </div>
    </div>
  );
};

export default ActivityLogs;
