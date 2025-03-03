import React from 'react';

const Reports = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
      <div className="space-y-4">
        {/* Exemplo de relatório */}
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Relatório de Vendas</h2>
          <p>Total de Vendas: 150</p>
        </div>
        {/* Adicione mais relatórios conforme necessário */}
      </div>
    </div>
  );
};

export default Reports;
