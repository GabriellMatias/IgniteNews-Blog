import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react'

export function SignInButton() {
  /* retorna se o user ta logado ou nao automaticamente */
  const { data: session } = useSession()

  return session ? (
    <button
      type="button"
      className={styles.signinButton}
      onClick={(e) => signOut()}
    >
      <FaGithub color="#04d361" />
      {session.user?.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signinButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eba417" />
      Sign in with Github <FiX color="#737380" className={styles.closeIcon} />
    </button>
  )
}
