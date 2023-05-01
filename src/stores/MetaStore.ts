import {makeAutoObservable} from 'mobx'
import {baseApiUrl} from '@/lib/telegram'
import {debounce} from 'lodash'
import productStore from '@/stores/ProductStore'
import {structuredClone} from 'next/dist/compiled/@edge-runtime/primitives/structured-clone'

interface Meta {
  id: number
  name: string
  slug: string
  description: string
  count: number
  '_links': Object
}

interface CategoryImage {
  alt: string
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: number
  id: number
  name: string
  src: string
}

interface Category extends Meta {
  display: string
  image: CategoryImage
  menu_order: number
  selected: boolean
}

// interface Tag extends Meta {
//   strength: number
// }

export interface Filters {
  category: number[] // brands
  page: number
  per_page: number
  search: string
  orderby: string
  status: string
  min_price: number
  max_price: number | string

  [x: string]: any
}

interface Coupon {
  id: number
  code: string
  amount: number // discount percentage
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  discount_type: string
  description: string
  date_expires: string
  date_expires_gmt: string
  usage_count: number
  individual_use: boolean
  product_ids: number[]
  excluded_product_ids: number[]
  usage_limit: number
  usage_limit_per_user: number
  limit_usage_to_x_items: number
  free_shipping: boolean
  product_categories: number[]
  excluded_product_categories: number[]
  exclude_sale_items: boolean
  minimum_amount: string
  maximum_amount: string
  email_restrictions: string
  used_by: string[]
  meta_data: {
    id: number
    key: string
    value: string
  }[]
}

interface DeliveryMethod {
  enabled: boolean
  id: number
  instance_id: number
  method_description: string
  method_id: string
  method_title: string
  order: number
  settings: {
    cost: {
      value: string
    }
  }
}

const initialFilters: Filters = {
  category: [],
  page: 1,
  per_page: 33,
  search: '',
  orderby: 'popularity',
  status: 'publish',
  min_price: 0,
  max_price: '',
}

class MetaStore {
  categories: Category[] = [] // brands
  // tags: Tag[] = [] // strengths
  coupons: Coupon[] = []
  deliveryMethods: DeliveryMethod[] = []
  orderNote = ''
  fetchStatus: 'none' | 'fetching' | 'done' = 'none'
  filters: Filters = structuredClone(initialFilters)

  constructor() {
    makeAutoObservable(this)
    this.getFilteredProducts = debounce(() => productStore.getProducts(), 400)
  }

  getFilteredProducts: Function

  filtersOn() {
    return Object.keys(this.filters).length > 0
  }

  resetFilters() {
    this.filters = structuredClone(initialFilters)
    this.getFilteredProducts()
  }

  async getInitialData() {
    if (this.fetchStatus !== 'none') return
    this.fetchStatus = 'fetching'
    let categories: Category[], coupons: Coupon[], deliveryMethods: DeliveryMethod[]
    const p = [
      fetch(baseApiUrl + '/products/categories?per_page=100').then((r) => r.json()).then((c) => categories = c),
      fetch(baseApiUrl + '/coupons?per_page=100').then((r) => r.json()).then((c) => coupons = c),
      fetch(baseApiUrl + '/shipping/zones/1/methods?per_page=100').then((r) => r.json()).then((c) => deliveryMethods = c),
    ]
    // for (let i = 1 i < 4 i++) {
    //   p.push(fetch(baseApiUrl + `/products/tags?page=${i}&per_page=100`).then((r) => r.json()).then((t) => this.tags.push(...t)))
    // }
    await Promise.all(p) // @ts-ignore
    this.categories = (categories).filter((c: Category) => c.name !== 'Снюс' && c.name !== 'Misc')
      .map((c: Category) => ({...c, selected: false})) // @ts-ignore
    this.coupons = coupons.map(c => ({...c, amount: Number(c.amount)})) // @ts-ignore
    this.deliveryMethods = deliveryMethods.filter(m => m.enabled)
    // this.tags = this.tags
    //   .map(t => ({...t, strength: Number(t.name.replace(/[^0-9]/g, ''))}))
    //   .filter(t => t.strength > 10)
    //   .sort((a, b) => b.strength - a.strength)
    this.fetchStatus = 'done'
  }

  toggleCategory({id}: { id: number }) {
    if (this.filters.category.includes(id)) {
      this.filters.category = this.filters.category.filter(cid => cid !== id)
    } else {
      this.filters.category.push(id)
    }
    this.getFilteredProducts()
  }

  search(search: string) {
    this.filters.search = search
    this.getFilteredProducts()
  }

  categorySelected({id}: { id: number }) {
    return this.filters.category.includes(id)
  }

}

export default new MetaStore()
