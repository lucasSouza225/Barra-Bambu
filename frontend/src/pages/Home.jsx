import React from 'react'
import Carrossel from '../components/home/Carrossel'
import Sobre from '../components/home/Sobre'
import Promo from '../components/home/Promo'
import Cardapio from '../components/home/Cardapio'
import Filosofia from '../components/home/Filosofia'


const Home = () => {
  return (
    <main>
        <Carrossel />
        <Sobre />
        <Promo />
        <Cardapio />
        <Filosofia />
    </main>
  )
}

export default Home