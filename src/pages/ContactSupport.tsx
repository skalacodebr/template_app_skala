import React from 'react';

const ContactSupport = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Contato / Suporte</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Abrir Chamado</h2>
          <p>Preencha o formulário abaixo para abrir um chamado de suporte.</p>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
              <textarea id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
