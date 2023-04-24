import {makeAutoObservable} from 'mobx'
import ps, {Product} from '@/stores/ProductStore'

// used for storing cart products. Products from here displayed in cart
class CartStore {
  cart: Product[] = []

  constructor() {
    makeAutoObservable(this)
  }

  isInCart({id}: { id: number }) {
    return !!this.cart.find(p => p.id === id)
  }

  add({id}: { id: number }) {
    const inCart = this.cart.find(p => p.id === id)
    if (inCart) { // @ts-ignore
      inCart.quantity++
      return
    }
    const psProduct = ps.products.find(p => p.id === id)
    if (!psProduct) return
    this.cart.push(psProduct)
    psProduct.quantity++
  }

  remove({id}: { id: number }) {
    const p = this.cart.find(p => p.id === id)
    if (!p) return
    p.quantity--
    if (p.quantity < 1) {
      this.cart = this.cart.filter(p => p.id !== id)
    }
  }
}

export default new CartStore()
