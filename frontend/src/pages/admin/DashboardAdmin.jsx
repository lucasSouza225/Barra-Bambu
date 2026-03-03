const DashboardAdmin = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-bg mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de cardápio */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">🍽️ Cardápio</h3>
          <p className="text-gray-600">Gerencie os itens do cardápio</p>
          <p className="text-3xl font-bold mt-4">0</p>
          <p className="text-sm text-gray-500">itens cadastrados</p>
        </div>

        {/* Card de galeria */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">📸 Galeria</h3>
          <p className="text-gray-600">Gerencie as fotos</p>
          <p className="text-3xl font-bold mt-4">0</p>
          <p className="text-sm text-gray-500">imagens</p>
        </div>

        {/* Card de carrossel */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">🎠 Carrossel</h3>
          <p className="text-gray-600">Banners do site</p>
          <p className="text-3xl font-bold mt-4">0</p>
          <p className="text-sm text-gray-500">banners ativos</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;