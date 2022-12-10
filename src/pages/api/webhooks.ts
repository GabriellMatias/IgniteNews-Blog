import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { stripe } from '../../services/stripe'
import { saveSubscription } from './_lib/manageSubscription'

/* webhook -> aplicacao terceira (como Stripe) avisa nossa aplicacao que alguma coisa
ocorreu. Nesse caso o cartao nao esta mais com limite para renovar a assinatura, entao o stripe
avisa nossa aplicacao */

/* funcao pronta da net para fazer a resposta da CLI do stripe ser legivel
pois vem varias respostas baguncadas */
async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

/* desabilita o entendimento padrao do next do que esta vindo na requisicao
ele acha que sempre vai vim um objeto ou algo assim, mas nesse caso recebemos uma stream
que ele nao espera, entao desativamos isso */
export const config = {
  api: {
    bodyParser: false,
  },
}

/* filtrando quais eventos queremos ouvir do webhook, quais sao relevantes */
const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async (req: NextApiRequest, resp: NextApiResponse) => {
  if (req.method === 'POST') {
    const buff = await buffer(req)
    /* pegando o campo da chave secreta que esta vindo no header para que outros
    usuarios nao facam requisicoes indesejadas */
    const secret = req.headers['stripe-signature']
    let event: Stripe.Event
    if (!secret) {
      return resp.status(400).send('invalid secret code')
    }

    try {
      event = stripe.webhooks.constructEvent(
        buff,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET!,
      )
    } catch (error) {
      return resp.status(400).send(`Webhook Error: ${error}`)
    }
    const { type } = event
    if (relevantEvents.has(type)) {
      try {
        /* tipagem generica do stripe, reformulando para pegar apenas a tipagem e dados
            que vem do SESSION.COMPLETED */
        const checkoutSession = event.data.object as Stripe.Checkout.Session
        /* pegando a subscription pra fazer um crud nela */
        const subscription = event.data.object as Stripe.Subscription

        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false,
            )

            break
          case 'checkout.session.completed':
            await saveSubscription(
              checkoutSession.subscription!.toString(),
              checkoutSession.customer!.toString(),
              true,
            )

            break

          default:
            throw new Error('Unhandle event')
        }
      } catch (error) {
        /* nao retornou um erro de status pois isso vai para o sttripe
        se mandar o status o stripe vai ficar tentando refazer a conexao,
        mas no caso isso e um erro de desenvolvimento */
        return resp.json({ error: 'Webhook handle failed' })
      }
    }

    resp.json({ recived: true })
  } else {
    resp.setHeader('Allow', 'POST')
    resp.status(405).end('Method not allowed')
  }
}
