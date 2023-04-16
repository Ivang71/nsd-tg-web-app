import './App.css'
import {useEffect} from "react";

const tg = window.Telegram.WebApp

export const App = () => {

    useEffect(() => {
        tg.ready()
    }, [])

    const onClose = () => {
        tg.close()
    }

  return (
    <div className="App">
      works
        <button onClick={onClose}>Закрыть</button>
    </div>
  )
}

