import { fauna } from '../../../services/fauna'
import { query as q } from 'faunadb'
import { stripe } from '../../../services/stripe'

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction: boolean,
) {
  const useRef = await fauna.query(
    /* selecionando apenas o campo que eu quero que venha, nesse caso o REF */
    q.Select(
      'ref',
      q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId)),
    ),
  )

  /* retrieve quer dizer que so quero uma subscription recebe como parametro
  o id da subscription que esta procurando */
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  /* filtrando quais dados quer que venha na subscription */
  const subscriptionData = {
    id: subscription.id,
    userId: useRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  /* substitui ter que fazer case por case no switch no webhook,
  eu particulamente opto por fazer la pela legitibilidade do codigo.. */
  if (createAction) {
    await fauna.query(
      q.Create(q.Collection('subscriptions'), { data: subscriptionData }),
    )
  } else {
    await fauna.query(
      /* update so muda um dado, replace substitui todos os dados */
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('subscription_by_id'), subscription.id)),
        ),
        { data: subscriptionData },
      ),
    )
  }
}
