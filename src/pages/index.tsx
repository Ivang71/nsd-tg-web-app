import Head from 'next/head'
import {GetStaticProps} from 'next'
import StoreHeader from '@/components/StoreHeader'
import {baseApiUrl} from '@/lib/telegram'
import Cart from '@/components/Cart'
import React, {useState} from 'react'
import {observer} from 'mobx-react'
import ProductList from '@/components/ProductList'

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
  const staticProducts = await fetch(baseApiUrl + '/products?per_page=33').then((res) => res.json())
  return {
    props: {
      staticProducts,
    },
  }
}
