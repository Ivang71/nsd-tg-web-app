import {makeAutoObservable, runInAction} from 'mobx'
import {baseApiUrl} from '@/lib/telegram'
import metaStore from '@/stores/MetaStore'

// used for fetching, storing, filtering products. Products from here displayed on the main page
export interface Product {
  id: number
  name: string
  slug: string
  permalink: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  quantity: number
  images: { id: number, src: string, name: string, alt: string }[]
  categories: { id: number, name: string, slug: string }[]
  tags: any[]

  [x: string]: any
}

class ProductStore {
  products: Product[] = []
  didFirstFetch = false
  fetching = false
  abortController: AbortController | null = null

  constructor() {
    makeAutoObservable(this)
  }

  private async fetchProducts() {
    const url = new URLSearchParams(metaStore.filters).toString()
    let products: Product[] = []
    const controller = new AbortController()
    this.abortController = controller
    try {
      products = await
        fetch(baseApiUrl + '/products?' + url, {signal: controller.signal})
          .then((res) => res.json())
    } finally {
      this.abortController = null
    }
    runInAction(() => {
      this.products = products.map(p => ({...p, quantity: 0}))
      !this.didFirstFetch && (this.didFirstFetch = true)
      this.fetching = false
    })
  }

  async getProducts() {
    if (this.abortController) {
      this.abortController.abort() // abort previous request if it exists
    }
    this.fetching = true
    await this.fetchProducts()
  }
}

export default new ProductStore()
