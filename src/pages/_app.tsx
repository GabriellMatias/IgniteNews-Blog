import type { AppProps } from 'next/app'
import { Header } from '../Components/Header'
import '../styles/global.scss'

/* cada arquivo criado na pasta pages, ele cria uma rota para esse componente 
automaticamente. beneficios do NEXT */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}
