import {makeAutoObservable, toJS} from 'mobx'
import ps, {Product} from '@/stores/ProductStore'
import {structuredClone} from 'next/dist/compiled/@edge-runtime/primitives/structured-clone'

// used for storing cart products. Products from here displayed in cart
class CartStore {
  cart: Product[] = []

  constructor() {
    makeAutoObservable(this)
  }

  isInCart({id}: { id: number }) {
    return !!this.cart.find(p => p.id === id)
  }

  getById(id: number) {
    return this.cart.find(p => p.id === id)
  }

  add({id}: { id: number }) {
    const inCart = this.getById(id)
    const psProduct = ps.getById(id)
    if (!inCart) {
      const p = psProduct as Product
      p.quantity++
      this.cart.push(structuredClone(toJS(p)))
    } else {
      inCart.quantity++
      psProduct && psProduct.quantity++
    }
  }

  remove({id}: { id: number }) {
    const inCart = this.getById(id)
    const psProduct = ps.getById(id)
    if (!inCart) return
    inCart.quantity--
    psProduct && psProduct.quantity--
    if (inCart.quantity < 1) {
      this.cart = this.cart.filter(p => p.id !== id)
    }
  }
}

export default new CartStore()
