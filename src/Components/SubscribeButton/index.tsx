import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJS } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    /* validando se ele esta logado para se inscrever */
    if (!session) {
      signIn('github')
    }
    /* se ja tiver uma inscricao ativa ele nao pode fazer outra, entao
    redireciono ele para a pagina de postss */
    if (session?.activeSubscription) {
      router.push('/posts')
      return
    }

    /* a requisicao para se inscrever pelo stripe deve ser feita na API routes
    para nao realizar chamadas no banco pelo front end seco para seguranca */
    try {
      const response = await api.post('/subscribe')
      const { sessionId } = response.data
      const stripe = await getStripeJS()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      alert(error)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe Now
    </button>
  )
}
