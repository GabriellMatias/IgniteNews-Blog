import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function SignInButton() {
  const isUserLogged = true
  return (
    <button type="button" className={styles.signinButton}>
      {isUserLogged ? (
        <>
          <FaGithub color="#eba417" />
          Sign in with Github{' '}
        </>
      ) : (
        <>
          <FaGithub color="#04d361" />
          Name User{' '}
        </>
      )}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  )
}
