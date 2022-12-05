import Stripe from 'stripe'
import { version } from '../../package.json'

/* ponto de exclamacao no final e para falar para o TS 
"CONFIA EM MIM QUE ESSE OBJETO NAO VAII VIM NULO" */
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'Ignews',
    version,
  },
})
