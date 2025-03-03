import React from 'react';

const TermsPrivacy = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Termos de Uso e Privacidade</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Termos de Uso</h2>
          <p>Insira aqui os termos de uso da sua aplicação.</p>
        </div>
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Política de Privacidade</h2>
          <p>Insira aqui a política de privacidade da sua aplicação.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacy;
