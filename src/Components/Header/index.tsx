import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'
/* utilizando conceito SPA, reaproveitando core da aplicacao */
import { ActiveLink } from '../ActiveLink'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        {/* imagens sempre na pasta public */}
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/" legacyBehavior>
            <a>Home</a>
          </ActiveLink>
          {/* prefetch ja deixa a pagina pre carregada para quando o usuario
          tiver que ser redirecionada para ela   */}
          <ActiveLink
            activeClassName={styles.active}
            href="/posts"
            legacyBehavior
            prefetch
          >
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}
