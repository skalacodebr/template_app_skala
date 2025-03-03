import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        {/* Exemplo de estatística */}
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Usuários Ativos</h2>
          <p>150</p>
        </div>
        {/* Adicione mais estatísticas conforme necessário */}
      </div>
    </div>
  );
};

export default Dashboard;
