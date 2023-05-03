import Head from 'next/head'
import {GetStaticProps} from 'next'
import StoreHeader from '@/components/StoreHeader'
import {observer} from 'mobx-react'
import ProductList from '@/components/ProductList'
import ps from '@/stores/ProductStore'
import {useEffect} from 'react'
import {tg} from '@/pages/_app'
import {useRouter} from 'next/router'

export default observer(({staticProducts}: { staticProducts: any[] }) => {
  const router = useRouter()

  useEffect(() => {
    tg.BackButton.hide()
    tg.MainButton.text = 'Посмотреть заказ'
    tg.MainButton.onClick(() => router.push('/cart'))
    return () => tg.MainButton.offClick(() => router.push('/cart'))
  }, [tg])

  return (
    <>
      <button onClick={() => router.push('/checkout')}>to checkout</button>
      <Head>
        <title>No Smoke Division</title>
        <meta name="title" content="Купить снюс - лучший выбор для любителей табака"/>
        <meta name="description" content="Магазин снюса No Smoke Division"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <main>
        <StoreHeader/>
        <ProductList staticProducts={staticProducts}/>
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
