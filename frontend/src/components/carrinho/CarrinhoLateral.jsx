import { useState } from "react";
import { useCarrinho } from "../../contexts/carrinho/CarrinhoContext";
import { FiShoppingCart, FiCheckCircle, FiX, FiAlertCircle } from "react-icons/fi";
import { IoRestaurant, IoClose } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import FormularioEntrega from "./FormularioEntrega";

const CarrinhoLateral = () => {
  const [aberto, setAberto] = useState(false);
  const [mostrarFormEntrega, setMostrarFormEntrega] = useState(false);
  const [mensagemToast, setMensagemToast] = useState(null);
  const {
    itensCarrinho,
    observacoes,
    setObservacoes,
    removerItem,
    atualizarQuantidade,
    totalCarrinho,
    limparCarrinho,
  } = useCarrinho();

  const totalItens = itensCarrinho.reduce(
    (acc, item) => acc + item.quantidade,
    0,
  );

  const formatarPreco = (preco) => {
    return preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const mostrarToast = (tipo, titulo, mensagem) => {
    setMensagemToast({ tipo, titulo, mensagem });
    setTimeout(() => {
      setMensagemToast(null);
    }, 4000);
  };

  const formatarPagamento = (forma) => {
    switch (forma) {
      case "dinheiro":
        return "Dinheiro";
      case "cartao":
        return "Cartão";
      case "pix":
        return "Pix";
      default:
        return forma;
    }
  };

  const handleFinalizarPedido = (dadosEntrega) => {
    let message = "Olá! Gostaria de fazer um pedido para entrega:\n\n";
    message += "📋 *DETALHES DO PEDIDO*\n";

    itensCarrinho.forEach((item) => {
      const itemTotal = item.preco * item.quantidade;
      message += `• ${item.quantidade}x ${item.nome}\n`;
      message += `  R$ ${itemTotal.toFixed(2).replace(".", ",")}\n\n`;
    });

    message += `💰 *TOTAL: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}*\n`;

    if (observacoes) {
      message += `📝 *Observações:*\n${observacoes}\n\n`;
    }

    message += "📍 *DADOS PARA ENTREGA*\n";
    message += `🏠 Rua: ${dadosEntrega.rua}, ${dadosEntrega.numero}\n`;
    message += `📍 Bairro: ${dadosEntrega.bairro}\n`;
    if (dadosEntrega.complemento) {
      message += `📌 Complemento: ${dadosEntrega.complemento}\n`;
    }
    message += `📱 Telefone: ${dadosEntrega.telefone}\n\n`;

    message += "💳 *FORMA DE PAGAMENTO*\n";
    message += `${formatarPagamento(dadosEntrega.formaPagamento)}\n`;
    
    if (dadosEntrega.formaPagamento === "dinheiro" && dadosEntrega.troco) {
      const trocoNum = parseFloat(dadosEntrega.troco);
      if (trocoNum > 0) {
        message += `Troco para: R$ ${trocoNum.toFixed(2).replace(".", ",")}\n`;
      }
    }

    message += "✅ *Confirme a disponibilidade*\n";
    message += "e o prazo de entrega!\n";
    message += "_Obrigado pela preferência!_ 🙏";

    const numero = "551136340295";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    limparCarrinho();
    setMostrarFormEntrega(false);
    setAberto(false);

    mostrarToast(
      "success",
      "✅ Pedido enviado!",
      "Seu pedido foi enviado para nosso WhatsApp. Em breve entraremos em contato para confirmar."
    );
  };

  const coresToast = {
    success: {
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      icon: <FiCheckCircle className="text-white text-xl" />
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      icon: <FiAlertCircle className="text-white text-xl" />
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: <GiConfirmed className="text-white text-xl" />
    }
  };

  const toastCor = mensagemToast ? coresToast[mensagemToast.tipo] || coresToast.success : coresToast.success;

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-6 right-6 bg-primary text-dark-bg p-4 rounded-full shadow-lg hover:bg-secondary transition-colors z-40"
      >
        <div className="relative">
          <FiShoppingCart className="text-2xl" />
          {totalItens > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {totalItens}
            </span>
          )}
        </div>
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-dark-bg text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Seu Pedido</h2>
          <button
            onClick={() => setAberto(false)}
            className="text-white hover:text-primary transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
          {itensCarrinho.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingCart className="text-6xl mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {itensCarrinho.map((item) => (
                <div key={item._id} className="flex gap-3 border-b pb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                    {item.imagem ? (
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IoRestaurant className="text-2xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-dark-bg">{item.nome}</h3>
                    <p className="text-sm text-gray-600">
                      {formatarPreco(item.preco)} cada
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          atualizarQuantidade(item._id, item.quantidade - 1)
                        }
                        className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold w-6 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() =>
                          atualizarQuantidade(item._id, item.quantidade + 1)
                        }
                        className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removerItem(item._id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>

                    {item.observacao && (
                      <p className="text-xs text-gray-500 mt-1">
                        Obs: {item.observacao}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {itensCarrinho.length > 0 && (
          <div className="p-4 border-t">
            <label className="block text-gray-700 mb-2">
              Observações gerais
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Alguma observação?"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              rows="2"
            />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {formatarPreco(totalCarrinho)}
            </span>
          </div>

          <button
            onClick={() => setMostrarFormEntrega(true)}
            disabled={itensCarrinho.length === 0}
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
              itensCarrinho.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700"
            }`}
          >
            <FaWhatsapp className="text-lg" />
            Finalizar Pedido
          </button>
        </div>
      </div>

      <FormularioEntrega
        aberto={mostrarFormEntrega}
        onClose={() => setMostrarFormEntrega(false)}
        onSubmit={handleFinalizarPedido}
        totalPedido={totalCarrinho}
      />

      {/* TOAST DE CONFIRMAÇÃO COM REACT ICONS */}
      {mensagemToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className={`${toastCor.bg} text-white rounded-xl shadow-2xl max-w-sm overflow-hidden ring-1 ring-white/20`}>
            <div className="flex items-start p-4">
              <div className="shrink-0 bg-white/20 rounded-full p-1">
                {toastCor.icon}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold">
                  {mensagemToast.titulo}
                </p>
                <p className="text-xs mt-1 opacity-95 leading-relaxed">
                  {mensagemToast.mensagem}
                </p>
              </div>
              <button
                onClick={() => setMensagemToast(null)}
                className="ml-4 shrink-0 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-1 hover:bg-white/20"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarrinhoLateral;