import s from '@/styles/Cart.module.scss'
import sHeader from '@/styles/StoreHeader.module.scss'
import {MdOutlineArrowBackIosNew} from 'react-icons/md'
import {observer} from 'mobx-react'

interface CartProps {
  isOpen: boolean
  close: () => void
}

export default observer(({isOpen, close}: CartProps) => {

  return (
    <div className={`${s.cart} ${isOpen && s.open}`}>
      <button className={sHeader.cartBackButton} onClick={() => close()}>
        <MdOutlineArrowBackIosNew size={27}/>
      </button>
    </div>
  )
})
