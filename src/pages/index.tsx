import Head from 'next/head'
import { SubscribeButton } from '../Components/SubscribeButton'
import styles from './home.module.scss'
import { GetStaticProps } from 'next'
import { stripe } from '../services/stripe'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

// client side
// server side
// static site generation

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ig News</title>
      </Head>
      <main className={styles.mainContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>
            News about the <span>React</span>
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  )
}

/* executado no servidor node que roda junto com o next */

/* com o static props ele gera um arquivo html statico, assim toda vez que o user 
for acessar uma pagina que ele ja acessou antes, ele nao precisa fazer toda a requisicao para 
o servidor renderizando a pagina com SSR */
/* SSG static site generation */
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1MBeWdIalT8mgftd3kYlGED8', {
    expand: ['product'],
  })

  const product = {
    priceId: price.id,
    amount:
      price.unit_amount &&
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price.unit_amount / 100),
  }
  return {
    props: {
      product,
    },
    /* time em segundos que a pagina mantenha sem precisar ser reconstruida novamente
    ficar usando o html estatico */
    revalidate: 60 * 60 * 24, // 24 horas
  }
}
