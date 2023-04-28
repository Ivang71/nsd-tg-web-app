import s from '@/styles/Checkout.module.scss'
import cs from '@/stores/CartStore'
import Image from 'next/image'
import {ChangeEvent, useState} from 'react'

const pricesForDelivery: {[x: string]: number} = {
  pickup: 0,
  courierSubway: 300,
  courierMoscow: 350,
  courierMoscowRegion: 350,
  yandexDostavista: 200,
  postCdek: 150,
}

export default ({isOpen}: { isOpen: boolean }) => {
  const [form, setForm] = useState({
    deliveryType: 'pickup'
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prevForm => ({
      ...form,
      [name]: value
    }))
  }

  const subtotal = cs.cart.length
    && cs.cart.map(p => Number(p.price) * Number(p.quantity))
      .reduce((a, b) => a + b)

  const total = subtotal + pricesForDelivery[form.deliveryType]


  return (
    <>
      <div className={`${s.checkout} ${isOpen && s.open}`}>
        {cs.cart.map(p => (
          <div className={s.product} key={p.id}>
            <Image src={p.images[0].src} alt={'Фото ' + p.name} className={s.productImage} width={30} height={30}/>
            <div className={s.productTextContainer}>
              <span className={s.productName}>{p.name}</span>
              <span className={s.productQuantity}> {p.quantity}x</span>
            </div>
            <div className={s.productPrice}>{p.price}&nbsp₽</div>
          </div>
        ))}
        <div>
          <label htmlFor="promocode">Промокод <span className={s.red}>*</span></label>
          <input type="text" id="promocode" placeholder="Промокод"/>
        </div>
        <div className={s.totalBlock}>
          <span>Подытог</span>
          <span className={s.subtotal}>
            {subtotal}&nbsp;₽
          </span>
        </div>
        <fieldset className={s.deliveryType}>
          <legend>Выберите способ доставки:</legend>
          <div>
            <input type="radio" id="pickup" name="deliveryType" value="pickup" onChange={onChange} defaultChecked/>
            <label htmlFor="pickup">Самовывоз<span>0 ₽</span></label>
          </div>
          <div>
            <input type="radio" id="courierSubway" name="deliveryType" value="courierSubway" onChange={onChange}/>
            <label htmlFor="courierSubway"><span>Нашим курьером до метро</span><span>300 ₽</span></label>
          </div>
          <div>
            <input type="radio" id="courierMoscow" name="deliveryType" value="courierMoscow" onChange={onChange}/>
            <label htmlFor="courierMoscow"><span>Нашим курьером до адреса в Москве</span><span>350 ₽</span></label>
          </div>
          <div>
            <input type="radio" id="courierMoscowRegion" name="deliveryType" value="courierMoscowRegion" onChange={onChange}/>
            <label htmlFor="courierMoscowRegion"><span>По Московской области</span><span>350 ₽</span></label>
          </div>
          <div>
            <input type="radio" id="yandexDostavista" name="deliveryType" value="yandexDostavista" onChange={onChange}/>
            <label htmlFor="yandexDostavista"><span>Dostavista, Yandex.Go</span><span>200 ₽</span></label>
          </div>
          <div>
            <input type="radio" id="postCdek" name="deliveryType" value="postCdek" onChange={onChange}/>
            <label htmlFor="postCdek"><span>Почта России, СДЭК</span><span>150 ₽</span></label>
          </div>
        </fieldset>
        <div className={s.totalBlock}>
          <span>Итог</span>
          <span className={s.total}>
            {total}&nbsp;₽
          </span>
        </div>
        <div className={s.paymentDetails}>
          После отправки заказа с вами свяжется менеджер для выбора способа оплаты
        </div>
      </div>
    </>
  )
}
