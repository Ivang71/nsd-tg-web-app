import './App.css'
import {useEffect} from "react";
import {useTelegram} from "./components/hooks/useTelegram";
import {Header} from "./components/Heaader/Header";

export const App = () => {
    const {tg, toggleMainButton} = useTelegram()

    useEffect(() => {
        tg.ready()
    }, [])

    const onClose = () => {
        tg.close()
    }

  return (
    <div className="App">
      <Header/>
      <button onClick={toggleMainButton}>toggle</button>
    </div>
  )
}

