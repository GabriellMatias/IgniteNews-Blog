import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { stripe } from '../../services/stripe'

export default async (req: NextApiRequest, response: NextApiResponse) => {
  /* verificando se e post pois quero criar algo dentro da API */
  if (req.method === 'POST') {
    /* criar o usuario no STRIPE com as infos do banco de dados */

    const session = await getSession({ req })
    const stripeCostumer = await stripe.customers.create({
      email: session?.user?.email,
      metadata: 'asd',
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      /* pega o id do faunaDB do usuario e cria esse usuario no STRIPE pelo id */
      customer: stripeCostumer.id,

      /* metodo de pagamento, se vai pedir endereco e quais items vao ser
      vendidos(pega o id preco do site da stripe) */
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [{ price: 'price_1MBeWdIalT8mgftd3kYlGED8', quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      /* para onde o user vai ser direcionado se dar erro ou sucesso */
      success_url: process.env.STRIPE_SUCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
    })
    return response.status(201).json({ sessionId: checkoutSession.id })
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Method not allowed')
  }
}
