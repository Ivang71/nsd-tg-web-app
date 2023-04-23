import s from '@/styles/StoreHeader.module.scss'
import {TfiAngleDown, TfiShoppingCart} from 'react-icons/tfi'
import {useState} from 'react'

export default ({ toggleCart }: { toggleCart: Function }) => {
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

  return (
    <div className={s.header}>
      <button
        onClick={() => setFiltersVisible(!filtersVisible)}
        className={s.arrowButton}
        name={filtersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}
      >
        <TfiAngleDown transform={`rotate(${filtersVisible ? '180' : '0'})`} size={27} title="Стрелка вниз"/>
      </button>
      <input role="searchbox" type="text" className={s.searchBar} placeholder="Поиск.."/>
      <button className={s.cartButton} onClick={() => toggleCart()}>
        <TfiShoppingCart size={27} title="Корзина"/>
      </button>
    </div>
  )
}
