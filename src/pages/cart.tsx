import {observer} from 'mobx-react'
import {ChangeEventHandler, useEffect, useRef} from 'react'
import ms from '@/stores/MetaStore'
import s from '@/styles/Cart.module.scss'
import cs from '@/stores/CartStore'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {tg} from '@/pages/_app'

export default observer(() => {
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const onCommentChange: ChangeEventHandler<HTMLTextAreaElement> = () => {
    if (commentRef.current) {
      commentRef.current.style.height = 'auto'
      commentRef.current.style.height = commentRef.current.scrollHeight + 'px'
    }
    ms.orderNote = commentRef.current?.value || ''
  }

  useEffect(() => {
    tg.expand()
    tg.BackButton.show()
    tg.MainButton.text = 'Оформить заказ'
    tg.MainButton.onClick(() => router.push('/checkout'))
    tg.BackButton.onClick(() => router.push('/'))
    return () => {
      tg.MainButton.onClick(() => router.push('/checkout'))
      tg.BackButton.onClick(() => router.push('/'))
    }
  }, [tg])

  return (
    <div className={s.cart}>
      <div className={s.cartHeader}>
        <h3>ВАШ ЗАКАЗ</h3>
        <button className={s.editButton} onClick={() => router.push('/')}>Изменить</button>
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
        value={ms.orderNote}
        placeholder="Комментарий..."
      />
      <div className={s.subscript}>Любые особые просьбы, детали, последние желания и т. д.</div>
    </div>
  )
})