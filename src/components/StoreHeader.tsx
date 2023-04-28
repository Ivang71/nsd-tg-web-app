import s from '@/styles/StoreHeader.module.scss'
import {TfiAngleDown} from 'react-icons/tfi'
import {useState} from 'react'
import ms from '@/stores/MetaStore'
import Filters from '@/components/Filters'
import {observer} from 'mobx-react'

export default observer(() => {
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

  return (
    <>
      <div className={s.header}>
        <button
          onClick={() => setFiltersVisible(!filtersVisible)}
          className={s.arrowButton}
          name={filtersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}
        >
          <TfiAngleDown transform={`rotate(${filtersVisible ? '180' : '0'})`} size={27} title="Стрелка вниз"/>
        </button>
        <input
          role="searchbox"
          type="text"
          className={s.searchBar}
          placeholder="Поиск.."
          value={ms.filters.search}
          onChange={e => ms.search(e.target.value)}
        />
      </div>
      <Filters open={filtersVisible}/>
    </>
  )
})
