import { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext({});

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
};

export const CarrinhoProvider = ({ children }) => {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [observacoes, setObservacoes] = useState('');

  // Adicionar item ao carrinho
  const adicionarItem = (item, quantidade = 1) => {
    setItensCarrinho(prev => {
      const existe = prev.find(i => i._id === item._id);
      
      if (existe) {
        return prev.map(i => 
          i._id === item._id 
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        );
      }
      
      return [...prev, { ...item, quantidade }];
    });
  };

  // Remover item do carrinho
  const removerItem = (itemId) => {
    setItensCarrinho(prev => prev.filter(i => i._id !== itemId));
  };

  // Atualizar quantidade
  const atualizarQuantidade = (itemId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerItem(itemId);
      return;
    }
    
    setItensCarrinho(prev => 
      prev.map(i => 
        i._id === itemId 
          ? { ...i, quantidade: novaQuantidade }
          : i
      )
    );
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setItensCarrinho([]);
    setObservacoes('');
  };

  // Calcular total
  const totalCarrinho = itensCarrinho.reduce(
    (acc, item) => acc + (item.preco * item.quantidade), 
    0
  );

  // Gerar mensagem do WhatsApp
  const gerarMensagemWhatsApp = () => {
    let mensagem = "🛵 *NOVO PEDIDO - BARRA BAMBU*\n\n";
    mensagem += "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n\n";
    
    itensCarrinho.forEach(item => {
      mensagem += `• *${item.quantidade}x ${item.nome}*\n`;
      mensagem += `  R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
      if (item.observacao) {
        mensagem += `  _Obs: ${item.observacao}_\n`;
      }
      mensagem += '\n';
    });
    
    mensagem += "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n";
    mensagem += `*TOTAL: R$ ${totalCarrinho.toFixed(2)}*\n\n`;
    
    if (observacoes) {
      mensagem += `📝 *Observações gerais:*\n${observacoes}\n\n`;
    }
    
    mensagem += "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n";
    mensagem += "📍 *Endereço de entrega:*\n[Cliente informará]\n\n";
    mensagem += "💳 *Forma de pagamento:*\n[Cliente informará]\n\n";
    mensagem += "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n";
    mensagem += "_Obrigado pela preferência!_" ;
    
    return encodeURIComponent(mensagem);
  };

  // Enviar para WhatsApp
  const enviarWhatsApp = () => {
    const numero = '5511936340295'; // Substitua pelo número real
    const mensagem = gerarMensagemWhatsApp();
    window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
    limparCarrinho();
  };

  return (
    <CarrinhoContext.Provider value={{
      itensCarrinho,
      observacoes,
      setObservacoes,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      totalCarrinho,
      enviarWhatsApp
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
};