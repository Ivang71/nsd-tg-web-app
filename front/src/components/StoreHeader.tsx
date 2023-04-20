import s from '../styles/StoreHeader.module.scss'
import {TfiAngleDown, TfiShoppingCart} from 'react-icons/tfi'
import {useState} from 'react'

export default () => {
  const [filtersVisible, setFiltersVisible] = useState(false)

  return (
    <div className={s.header}>
      <button
        onClick={() => setFiltersVisible(!filtersVisible)}
        className={s.arrowButton}
        name={filtersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}
      >
        <TfiAngleDown transform={`rotate(${filtersVisible ? '180' : '0'})`} size={30} title="Стрелка вниз"/>
      </button>
      <input role="searchbox" type="text" className={s.searchBar}/>
      <button className={s.cartButton}>
        <TfiShoppingCart size={30} title="Корзина"/>
      </button>
    </div>
  )
}
