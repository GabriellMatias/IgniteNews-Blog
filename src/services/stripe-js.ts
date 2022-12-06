import { loadStripe } from '@stripe/stripe-js'

export async function getStripeJS() {
  /* sintaxe NEXPUBLIC significa que a chave e publica, assim nosso front end
  pode acessar ela, pelo contrario apenas o back end pode utilizar dessas
  chaves */
  const stripejs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

  return stripejs
}
