/* e o index.html do next, para importar fontes e etc necessita fazer esse arquivo */
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      /* notar as tags HTML com a primeira letra maiuscula, essas
      vem importadas do next/document */

      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap"
            rel="stylesheet"
          />

          <link rel="shortcut icon" href="/favicon.png" type="image/png" />

          {/* tira o title daqui e coloca em cada componente para que cada pagina
      tenha um titulo diferente */}
        </Head>
        <body>
          {/*  conteudo vai ser renderizado aqui */}
          <Main />

          {/* onde vai vim os arquivos JS */}
          <NextScript />
        </body>
      </Html>
    )
  }
}
