import s from '@/styles/ProductList.module.scss'
import Image from 'next/image'
import cs from '@/stores/CartStore'
import {HiMinus, HiPlus} from 'react-icons/hi'
import {useEffect} from 'react'
import {observer} from 'mobx-react'

export default observer(({staticProducts}: { staticProducts: any[] }) => {
  useEffect(() => {
    cs.getInitialProducts()
  }, [])

  const currentProducts = cs.firstFetch === 'done' ? cs.products : staticProducts

  return (
    <div className={s.productList}>
      {currentProducts.map((product) => {
        const isInCart = cs.isInCart(product)
        return (
          <div className={s.productCard} key={product.id}>
            <div className={s.imageContainer}>
              <Image src={product.images[0].src} alt={'Фото ' + product.name} className={s.productImage} width={140}
                     height={140}/>
              {product.quantity && <span className={s.productQuantity}>{product.quantity}</span>}
            </div>
            <div className={s.productName}>
              <span>{product.name} </span>
              <span className={s.price}>{product.price} ₽</span>
            </div>
            <div className={s.buttons}>
              <button
                className={s.buttonRemove}
                onClick={() => cs.remove(product)}
                id={product.id}
              >
                <HiMinus/>
              </button>
              <button
                className={`${s.buttonAdd} ${isInCart && s.shrink}`}
                onClick={() => cs.add(product)}
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
