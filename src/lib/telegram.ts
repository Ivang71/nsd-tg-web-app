declare global {
  interface Window {
    Telegram: any;
  }
}

export const tg = window.Telegram.WebApp