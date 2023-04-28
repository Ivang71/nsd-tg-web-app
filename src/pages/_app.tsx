import '@/styles/globals.scss'
import type {AppProps} from 'next/app'
import {observer} from 'mobx-react'


export default observer(({Component, pageProps}: AppProps) => <Component {...pageProps} />)
