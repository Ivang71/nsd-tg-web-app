import s from '@/styles/ProductList.module.scss'
import Image from 'next/image'
import ps from '@/stores/ProductStore'
import cs from '@/stores/CartStore'
import {HiMinus, HiPlus} from 'react-icons/hi'
import {useEffect} from 'react'
import {observer} from 'mobx-react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {tg} from '@/pages/_app'

export default observer(({staticProducts}: { staticProducts: any[] }) => {
  useEffect(() => {
    ps.getProducts()
  }, [])

  const products = ps.didFirstFetch ? ps.products : staticProducts
  const fetching = ps.fetching && ps.didFirstFetch
  const nothingFound = ps.didFirstFetch && !fetching && !products.length

  return nothingFound ? (
    <div className={s.nothingFound}>
      <h1>Ничего не найдено</h1>
    </div>
  ) : (
    <div className={s.productList}>
      {products.map((p) => {
        const isInCart = cs.isInCart(p)
        return fetching ?
          <Skeleton
            height={194}
            width={140}
            className={s.productCard + s.skeleton}
            baseColor={tg?.themeParams.hint_color}
            highlightColor={tg?.themeParams.bg_color}
          /> : (
            <div className={s.productCard} key={p.id}>
              <div className={s.imageContainer}>
                <Image src={p.images[0].src} alt={'Фото ' + p.name} className={s.productImage} width={140}
                       height={140}/>
                {isInCart && <span className={s.productQuantity}>{p.quantity}</span>}
              </div>
              <div className={s.productName}>
                <span>{p.name} </span>
                <span className={s.price}>{p.price} ₽</span>
              </div>
              <div className={s.buttons}>
                <button
                  className={s.buttonRemove}
                  onClick={() => cs.remove(p)}
                  id={p.id.toString()}
                  disabled={products === staticProducts}
                >
                  <HiMinus/>
                </button>
                <button
                  className={`${s.buttonAdd} ${isInCart && s.shrink}`}
                  onClick={() => cs.add(p)}
                  disabled={products === staticProducts}
                >
                  {isInCart ? <HiPlus/> : <span className={s.addText}>Добавить</span>}
                </button>
              </div>
            </div>
          )
      })}
    </div>
  )
})
