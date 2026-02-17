import React from 'react'
import Carrossel from '../components/home/Carrossel'
import Sobre from '../components/home/Sobre'
import Promo from '../components/home/Promo'
import Cardapio from '../components/home/Cardapio'
import Filosofia from '../components/home/Filosofia'
import Galeria from '../components/home/Galeria'
import Memorias from '../components/home/Memorias'
import Reserva from '../components/home/Reserva'


const Home = () => {
  return (
    <main className='w-full overflow-x-hidden '>
        <Carrossel />
        <Sobre />
        <Promo />
        <Cardapio />
        <Filosofia />
        <Galeria />
        <Memorias />
        <Reserva />
    </main>
  )
}

export default Home