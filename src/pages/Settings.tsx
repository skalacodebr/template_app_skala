import React from 'react';

const Settings = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Preferências de Idioma</h2>
          <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
            <option>Português</option>
            <option>Inglês</option>
            <option>Espanhol</option>
          </select>
        </div>
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Notificações</h2>
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2">Receber notificações por email</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
