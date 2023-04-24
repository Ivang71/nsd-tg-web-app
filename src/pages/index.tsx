import Head from 'next/head'
import {GetStaticProps} from 'next'
import StoreHeader from '@/components/StoreHeader'
import Cart from '@/components/Cart'
import {useState} from 'react'
import {observer} from 'mobx-react'
import ProductList from '@/components/ProductList'
import ps from '@/stores/ProductStore'

export default observer(({staticProducts}: { staticProducts: any[] }) => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)

  return (
    <>
      <Head>
        <title>No Smoke Division</title>
        <meta name="description" content="Магазин снюса No Smoke Division"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <main>
        <StoreHeader toggleCart={() => setIsCartOpen(!isCartOpen)}/>
        <ProductList staticProducts={staticProducts}/>
        <Cart isOpen={isCartOpen} close={() => setIsCartOpen(false)}/>
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
