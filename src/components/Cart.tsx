import s from '@/styles/Cart.module.scss'
import {observer} from 'mobx-react'
import cs from '@/stores/CartStore'
import Image from 'next/image'
import {ChangeEventHandler, useRef} from 'react'

interface CartProps {
  isOpen: boolean
  close: () => void
}

export default observer(({isOpen, close}: CartProps) => {
  const commentRef = useRef<HTMLTextAreaElement>(null)

  const onCommentChange: ChangeEventHandler<HTMLTextAreaElement> = () => {
    if (commentRef.current) {
      commentRef.current.style.height = 'auto'
      commentRef.current.style.height = commentRef.current.scrollHeight + 'px'
    }
  }

  return (
    <div className={`${s.cart} ${isOpen && s.open}`}>
      <div className={s.cartHeader}>
        <h3>ВАШ ЗАКАЗ</h3>
        <button className={s.editButton} onClick={close}>Изменить</button>
      </div>
      <div className={s.cartProductList}>
        {cs.cart.map(p => (
          <div className={s.product} key={p.id}>
            <Image src={p.images[0].src} alt={'Фото ' + p.name} className={s.productImage} width={70} height={70}/>
            <div className={s.productTextContainer}>
              <div>
                <span className={s.productName}>{p.name}</span>
                <span className={s.productQuantity}> {p.quantity}x</span>
              </div>
              <div className={s.shortDescription} dangerouslySetInnerHTML={{__html: p.short_description}}/>
            </div>
            <div className={s.productPrice}>{p.price}&nbsp;₽</div>
          </div>
        ))}
      </div>
      <div className={s.totalBlock}>
        <span>Подытог</span>
        <span className={s.totalSum}>
          {cs.cart.length
            && cs.cart.map(p => Number(p.price) * Number(p.quantity))
              .reduce((a, b) => a + b)
          }&nbsp;₽
        </span>
      </div>
      <textarea
        ref={commentRef}
        name="comment"
        id="comment-textarea"
        cols={30}
        rows={1}
        onChange={onCommentChange}
        placeholder="Комментарий..."
      />
      <div className={s.subscript}>Любые особые просьбы, детали, последние желания и т. д.</div>
    </div>
  )
})
