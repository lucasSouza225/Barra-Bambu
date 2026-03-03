import { useState } from 'react';

const CardapioAdmin = () => {
  const [itens, setItens] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-bg">Gerenciar Cardápio</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-primary text-dark-bg px-4 py-2 rounded-lg hover:bg-secondary"
        >
          {mostrarForm ? 'Cancelar' : '+ Novo Item'}
        </button>
      </div>

      {/* Formulário para novo item */}
      {mostrarForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Novo Item</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Nome do prato"
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Descrição"
              className="w-full p-2 border rounded"
              rows="3"
            />
            <input
              type="number"
              placeholder="Preço"
              className="w-full p-2 border rounded"
            />
            <button className="bg-primary text-dark-bg px-4 py-2 rounded-lg">
              Salvar
            </button>
          </form>
        </div>
      )}

      {/* Lista de itens */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Preço</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  Nenhum item cadastrado
                </td>
              </tr>
            ) : (
              itens.map(item => (
                <tr key={item.id}>
                  <td className="p-3">{item.nome}</td>
                  <td className="p-3">R$ {item.preco}</td>
                  <td className="p-3">
                    <button className="text-blue-600 mr-2">✏️</button>
                    <button className="text-red-600">🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardapioAdmin;