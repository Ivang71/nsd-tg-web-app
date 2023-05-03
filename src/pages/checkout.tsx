import {ChangeEvent, ChangeEventHandler, useEffect, useRef, useState} from 'react'
import ms from '@/stores/MetaStore'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import s from '@/styles/Checkout.module.scss'
import {baseApiUrl} from '@/lib/telegram'
import cs from '@/stores/CartStore'
import {observer} from 'mobx-react'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {tg} from '@/pages/_app'

const deliveryToPrice: { [x: string]: number } = {
  pickup: 0,
  courierSubway: 300,
  courierMoscow: 350,
  courierMoscowRegion: 350,
  yandexDostavista: 200,
  postCdek: 150,
}

const deliveryToName: { [x: string]: string } = {
  pickup: 'Самовывоз',
  courierSubway: 'Курьером до метро',
  courierMoscow: 'Курьером по Москве',
  courierMoscowRegion: 'Курьером по Московской области',
  yandexDostavista: 'Dostavista, Yandex.Go',
  postCdek: 'Почта России, СДЭК',
}

export default observer(() => {
    const [form, setForm] = useState({
      name: '',
      country: 'Россия',
      city: 'Москва',
      address: '',
      phone: '',
      email: '',
      promocode: '',
      deliveryType: 'pickup',
    })
    const [isPromoCorrect, setIsPromoCorrect] = useState<boolean>(false)
    const [isWrongEmail, setIsWrongEmail] = useState<boolean>(false)
    const [discount, setDiscount] = useState<number>(0)
    const router = useRouter()

    useEffect(() => {
      setForm({...form, name: tg?.initDataUnsafe?.user?.first_name || form.name})
      tg.BackButton.show()
      tg.MainButton.text = 'Отправить заказ'
      tg.BackButton.onClick(() => router.push('/cart'))
      return () => {
        tg.BackButton.offClick(() => router.push('/cart'))
      }
    }, [tg])

    useEffect(() => {
      tg.MainButton.onClick(submit)
      return () => tg.MainButton.offClick(submit)
    })

    useEffect(() => {
      const discount = isPromoCorrect && ms.coupons.find(c => c.code === form.promocode.toLowerCase())?.amount
      setDiscount(discount || 0)
    }, [isPromoCorrect])

    const addressRef = useRef<HTMLTextAreaElement>(null)

    const onAddressChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      if (addressRef.current) {
        addressRef.current.style.height = 'auto'
        addressRef.current.style.height = addressRef.current.scrollHeight + 'px'
      }
      onFieldChange(e)
    }

    const onEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setIsWrongEmail(false)
      onFieldChange(e)
    }

    const onEmailBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
      if (!emailRegex.test(e.target.value)) {
        setIsWrongEmail(true)
      }
    }

    const onPromoCodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      e.target.value = e.target.value.toLowerCase()
      const promo = ms.coupons.find(c => e.target.value.includes(c.code))
      setIsPromoCorrect(Boolean(promo))
      onFieldChange(e)
    }

    const onFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prevForm => ({
        ...prevForm,
        [e.target.name]: e.target.value,
      }))

    const submit = async () => {
      const valid = !!form.name && !!form.country && !!form.city && !!form.address && !!form.phone && !isWrongEmail
      if (!valid) {
        toast('Пожалуйста заполните все обязательные поля', {type: 'error', className: s.toast})
        return
      }
      tg.MainButton.showProgress()
      const tgUsername = tg?.initDataUnsafe?.user?.username ? (' @' + tg?.initDataUnsafe?.user?.username) : ''
      // add order to wp
      const body: any = {
        set_paid: true,
        billing: {
          first_name: form.name,
          email: form.email,
        },
        shipping: {
          address_1: form.address,
          city: form.city,
          phone: form.phone,
          country: form.country,
        },
        line_items: cs.cart.map(p => ({
          product_id: p.id,
          quantity: p.quantity,
        })),
        shipping_lines: [
          {
            method_id: 'flat_rate',
            method_title: deliveryToName[form.deliveryType],
            total: deliveryToPrice[form.deliveryType].toString(),
          },
        ],
        coupon_lines: isPromoCorrect ? [{code: form.promocode.trim()}] : [],
      }
      if (tgUsername) {
        body.customer_note = 'Телеграм: ' + tgUsername + '\n' + ms.orderNote
      }
      const res = await fetch(baseApiUrl + '/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        toast(data.message, {type: 'error', className: s.toast})
        return
      }

      // notify telegram bot
      const query_id = tg?.initDataUnsafe?.query_id
      if (!query_id) {
        toast('You shall not pass! 🧙', {type: 'error', className: s.toast})
        return
      }

      let message = `Поздравляем с покупкой!🎉\nВаш заказ:\n\n${cs.cart.map(p => `${p.name} ${p.quantity} шт. ${p.price} руб.`).join('\n')}\n\nТовар: ${subtotal} руб.`
      if (discount) message += `\nСкидка: ${discount} % — ${Math.round(subtotal * discount / 100)} руб.`
      message += `\nДоставка: ${deliveryToName[form.deliveryType]}: ${deliveryToPrice[form.deliveryType]} руб.\nК оплате: ${total} руб.\n\nВ ближайшее время с вами свяжется наш менеджер для уточнения деталей.`

      await fetch('/api/tg', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query_id, message}),
      })
      tg.MainButton.hideProgress()
    }

    const subtotal = cs.cart.length
      && cs.cart.map(p => Number(p.price) * Number(p.quantity))
        .reduce((a, b) => a + b)

    let total: number

    if (discount) {
      total = 0.01 * (100 - discount) * subtotal + deliveryToPrice[form.deliveryType]
    } else {
      total = subtotal + deliveryToPrice[form.deliveryType]
    }

    return (
      <>
        <ToastContainer/>
        <div className={s.checkout}>
          <h3 className={s.title}>Оформление заказа</h3>
          <div className={s.form}>
            <div>
              <label htmlFor="name">Имя <span className={s.red}>*</span></label>
              <input type="text" name="name" autoComplete="given-name" value={form.name} onChange={onFieldChange}/>
            </div>
            <div>
              <label htmlFor="country">Страна <span className={s.red}>*</span></label>
              <input type="text" name="country" autoComplete="country" value={form.country} onChange={onFieldChange}/>
            </div>
            <div>
              <label htmlFor="city">Город <span className={s.red}>*</span></label>
              <input type="text" name="city" autoComplete="address-level2" value={form.city} onChange={onFieldChange}/>
            </div>
            <div>
              <label htmlFor="address">Адрес <span className={s.red}>*</span></label>
              <textarea
                name="address"
                autoComplete="street-address"
                placeholder="Проспект ленина 1, кв 42"
                value={form.address}
                ref={addressRef}
                onChange={onAddressChange}/>
            </div>
            <div>
              <label htmlFor="phone">Телефон <span className={s.red}>*</span></label>
              <input type="text" name="phone" autoComplete="tel" value={form.phone} onChange={onFieldChange}/>
            </div>
            <div className={isWrongEmail ? s.wrongEmail : ''}>
              <label htmlFor="email">Email <span className={s.red}>*</span></label>
              <input type="text" name="email" autoComplete="email" value={form.email} onChange={onEmailChange}
                     onBlur={onEmailBlur}/>
            </div>
          </div>
          <div className={s.checkoutProductList}>
            {cs.cart.map(p => (
              <div className={s.product} key={p.id}>
                <Image src={p.images[0].src} alt={'Фото ' + p.name} className={s.productImage} width={30} height={30}/>
                <div className={s.productTextContainer}>
                  <span className={s.productName}>{p.name}</span>
                  <span className={s.productQuantity}> {p.quantity}x</span>
                </div>
                <div className={s.productPrice}>{p.price}&nbsp;₽</div>
              </div>
            ))}
          </div>
          <div>
            <label htmlFor="promocode">Промокод</label>
            <input type="text" name="promocode" value={form.promocode} onChange={onPromoCodeChange}/>
          </div>
          <div className={`${s.promoDiscount} ${isPromoCorrect && s.promoDiscountOpen}`}>
            Скидка {discount}%
          </div>
          <div className={s.totalBlock}>
            <div className={s.totalItem}>
              <span>Подытог</span>
              <span className={s.subtotal}>
            {subtotal}&nbsp;₽
          </span>
            </div>
            <div className={`${s.totalItem} ${s.promoCodeTotal} ${discount && s.promoCodeOpen}`}>
              <span>Промокод</span>
              <span>- {0.01 * discount * subtotal}&nbsp;₽</span>
            </div>
          </div>
          <fieldset className={s.deliveryType}>
            <legend>Выберите способ доставки:</legend>
            <div>
              <input type="radio" id="pickup" name="deliveryType" value="pickup" onChange={onFieldChange} defaultChecked/>
              <label htmlFor="pickup">Самовывоз<span>0&nbsp;₽</span></label>
            </div>
            <div>
              <input type="radio" id="courierSubway" name="deliveryType" value="courierSubway" onChange={onFieldChange}/>
              <label htmlFor="courierSubway"><span>Нашим курьером до метро</span><span>300&nbsp;₽</span></label>
            </div>
            <div>
              <input type="radio" id="courierMoscow" name="deliveryType" value="courierMoscow" onChange={onFieldChange}/>
              <label htmlFor="courierMoscow"><span>Нашим курьером до адреса в Москве</span><span>350&nbsp;₽</span></label>
            </div>
            <div>
              <input type="radio" id="courierMoscowRegion" name="deliveryType" value="courierMoscowRegion"
                     onChange={onFieldChange}/>
              <label htmlFor="courierMoscowRegion"><span>По Московской области</span><span>350&nbsp;₽</span></label>
            </div>
            <div>
              <input type="radio" id="yandexDostavista" name="deliveryType" value="yandexDostavista"
                     onChange={onFieldChange}/>
              <label htmlFor="yandexDostavista"><span>Dostavista, Yandex.Go</span><span>200&nbsp;₽</span></label>
            </div>
            <div>
              <input type="radio" id="postCdek" name="deliveryType" value="postCdek" onChange={onFieldChange}/>
              <label htmlFor="postCdek"><span>Почта России, СДЭК</span><span>150&nbsp;₽</span></label>
            </div>
          </fieldset>
          <div className={s.totalItem}>
            <span>Итог</span>
            <span className={s.total}>
            {total}&nbsp;₽
          </span>
          </div>
          <div className={s.paymentDetails}>
            После отправки заказа с вами свяжется менеджер для уточнения способа оплаты
          </div>
          <button onClick={submit}>send</button>
        </div>
      </>
    )
  },
)