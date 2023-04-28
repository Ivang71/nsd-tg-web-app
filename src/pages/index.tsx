import Head from 'next/head'
import {GetStaticProps} from 'next'
import StoreHeader from '@/components/StoreHeader'
import Cart from '@/components/Cart'
import {useEffect, useState} from 'react'
import {observer} from 'mobx-react'
import ProductList from '@/components/ProductList'
import ps from '@/stores/ProductStore'
import cs from '@/stores/CartStore'
import Checkout from '@/components/Checkout'

export let tg: any = null
let phases: any

export default observer(({staticProducts}: { staticProducts: any[] }) => {
  const [isCart, setIsCart] = useState<boolean>(false)
  const [isCheckout, setIsCheckout] = useState<boolean>(false)
  const [activePhase, setActivePhase] = useState<'main' | 'cart' | 'checkout'>('main')

  useEffect(() => {
    phases = {
      main: () => {
        setIsCart(false)
        setIsCheckout(false)
        tg.BackButton.hide()
        tg.MainButton.text = 'Посмотреть заказ'
        tg.MainButton.onClick(() => {
          setActivePhase('cart')
          tg.expand()
        })
      },
      cart: () => {
        setIsCart(true)
        setIsCheckout(false)
        tg.BackButton.show()
        tg.BackButton.onClick(() => setActivePhase('main'))
        tg.MainButton.text = 'Оформить заказ'
        tg.MainButton.onClick(() => setActivePhase('checkout'))
      },
      checkout: () => {
        setIsCart(false)
        setIsCheckout(true)
        tg.BackButton.show()
        tg.BackButton.onClick(() => setActivePhase('cart'))
        tg.MainButton.text = 'Отправить заказ'
        // tg.MainButton.onClick(() => phases.active = 'cart') send data and exit app
      },
    }
    document.body.style.overflow = (isCart || isCheckout) ? 'hidden' : 'auto'
  })

  useEffect(() => {
    tg && phases[activePhase]()
  }, [activePhase])

  useEffect(() => {
    tg = window.Telegram.WebApp
    tg.ready && tg.ready()
    tg.BackButton.hide()
    tg.MainButton.text = 'Посмотреть заказ'
    tg.MainButton.onClick(() => {
      setActivePhase('cart')
      tg.expand()
    })
    tg.MainButton.color = '#31b545'
    tg.MainButton.textColor = '#fff'
    if (tg.colorScheme !== 'light') {
      document.documentElement.style.setProperty('--bg-color', '#fff')
      document.documentElement.style.setProperty('--secondary-bg-color', '#f3f2f8')
      document.documentElement.style.setProperty('--hint-color', '#8f8f8f')
      document.documentElement.style.setProperty('--text-color', '#000')
    } else {
      document.documentElement.style.setProperty('--bg-color', '#181818')
      document.documentElement.style.setProperty('--secondary-bg-color', '#000')
      document.documentElement.style.setProperty('--hint-color', '#8b97a3')
      document.documentElement.style.setProperty('--text-color', '#fafafa')
    }
  }, [])

  if (cs.cart.length > 0) {
    tg.enableClosingConfirmation()
    tg.MainButton.show()
  } else {
    tg && tg.disableClosingConfirmation()
    tg && tg.MainButton.hide()
  }

  return (
    <>
      <Head>
        <title>No Smoke Division</title>
        <meta name="description" content="Магазин снюса No Smoke Division"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <main>
        <StoreHeader/>
        <ProductList staticProducts={staticProducts}/>
        <Cart isOpen={isCart} close={() => setActivePhase('main')}/>
        <Checkout isOpen={isCheckout}/>
      </main>
    </>
  )
})

export const getStaticProps: GetStaticProps = async () => {
  await ps.getProducts()
  return {
    props: {
      staticProducts: ps.products,
    },
  }
}
