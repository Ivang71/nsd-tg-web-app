import {makeAutoObservable, toJS} from 'mobx'
import {baseApiUrl} from '@/lib/telegram'

interface Product {
  id: number
  name: string
  price: string
  quantity?: number
  images: any[]
  [x: string]: any
}

class CartStore {
  products: Product[] = []
  firstFetch: 'none' | 'fetching' | 'done' = 'none'
  cart: Product[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async getInitialProducts() {
    if (this.firstFetch === 'none') {
      this.firstFetch = 'fetching'
      this.products = await fetch(baseApiUrl + '/products?per_page=33').then((res) => res.json())
      this.firstFetch = 'done'
    }
  }

  isInCart({ id }: { id: number }) {
    return !!this.cart.find(p => p.id === id)
  }

  add({ id }: { id: number }) {
    const p = this.products.find(p => p.id === id)
    if (!p) return
    const inCart = !!this.cart.find(p => p.id === id)
    if (!inCart) {
      this.cart.push(p)
    }
    if (!p.quantity) {
      p.quantity = 1
    } else {
      p.quantity++
    }

  }

  remove({ id }: { id: number }) {
    const p = this.products.find(p => p.id === id)
    if (!p) return
    const inCart = this.cart.find(p => p.id === id)
    if (!inCart || !p.quantity) return
    if (p.quantity > 1) {
      p.quantity--
    } else {
      delete p.quantity
      this.cart = this.cart.filter(p => p.id !== id)
    }
  }
}

export default new CartStore()
