import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { stripe } from '../../services/stripe'
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, response: NextApiResponse) => {
  /* verificando se e post pois quero criar algo dentro da API */
  if (req.method === 'POST') {
    /* criar o usuario no STRIPE com as infos do banco de dados */

    const session = await getSession({ req })

    if (!session?.user?.email || !session?.user?.name) {
      return response.status(400).json({
        message: 'Logged user does not have an e-mail',
      })
    }

    const user = await fauna.query<User>(
      q.Get(
        q.Match(q.Index('user_by_email'), q.Casefold(session?.user?.email)),
      ),
    )

    let customerId = user.data.stripe_customer_id
    if (!customerId) {
      const stripeCostumer = await stripe.customers.create({
        name: session?.user?.name,
        email: session?.user?.email,
      })
      /* atualizando dados do usuario no faunaDB */
      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: { stripe_customer_id: stripeCostumer.id },
        }),
      )
      customerId = stripeCostumer.id
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      /* pega o id do faunaDB do usuario e cria esse usuario no STRIPE pelo id */
      customer: customerId,

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
