import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import {useEffect} from 'react'

export let tg = null

export default function App({Component, pageProps}: AppProps) {
  useEffect(() => {
    tg = window.Telegram.WebApp
  }, [])

  return <Component {...pageProps} />
}
