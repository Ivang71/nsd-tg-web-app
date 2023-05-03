import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import {observer} from 'mobx-react'
import cs from '@/stores/CartStore'
import {useCallback, useState} from 'react'
import Script from 'next/script'

export let tg: any = null

export default observer(({Component, pageProps}: AppProps) => {
  const [tgLoaded, setTgLoaded] = useState(false)

  const onTgLoaded = useCallback(() => {
    tg = window.Telegram.WebApp
    tg.ready && tg.ready()
    setTgLoaded(true)
    const s = (a: string, b: string) => document.documentElement.style.setProperty(a, b)
    if (tg.colorScheme === 'light') {
      s('--bg-color', '#fff')
      s('--secondary-bg-color', '#f3f2f8')
      s('--hint-color', '#8f8f8f')
      s('--text-color', '#000')
    } else {
      s('--bg-color', '#181818')
      s('--secondary-bg-color', '#000')
      s('--hint-color', '#8b97a3')
      s('--text-color', '#fafafa')
    }
    tg.MainButton.color = '#31b545'
    tg.MainButton.textColor = '#fff'
  }, [])

  if (cs.cart.length > 0) {
    tg.enableClosingConfirmation()
    tg.MainButton.show()
  } else {
    tg && tg.disableClosingConfirmation()
    tg && tg.MainButton.hide()
  }

  return (
    <>
      <Script id="tgScript" src="https://telegram.org/js/telegram-web-app.js" onLoad={onTgLoaded}/>
      {tgLoaded ? <Component {...pageProps}/> : null}
    </>
  )
})
