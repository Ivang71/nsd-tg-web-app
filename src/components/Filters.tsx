import s from '@/styles/Filters.module.scss'
import ms from '@/stores/MetaStore'
import Image from 'next/image'
import {useEffect} from 'react'
import {observer} from 'mobx-react'

export default observer(({open}: { open: boolean }) => {

    useEffect(() => {
      ms.getInitialData()
    }, [])

    return (
      <div className={`${s.filters} ${open && s.open}`}>
        <div className={s.brandList}>
          {ms.categories.map(c => (
            <div
              key={c.id}
              className={`${s.imageContainer} ${ms.categorySelected(c) ? s.selected : ''}`}
              onClick={() => ms.toggleCategory(c)}
            >
              <Image src={c.image.src} alt={c.image.alt} width={120} height={120}/>
              <span className={s.brandName}>{c.name}</span>
            </div>
          ))}
        </div>
        {ms.filtersOn() && (
          <div className={s.resetButtonContainer}>
            <button onClick={() => ms.resetFilters()} className={s.resetsButton}>Сбросить фильтры</button>
          </div>
        )}
      </div>
    )
  },
)