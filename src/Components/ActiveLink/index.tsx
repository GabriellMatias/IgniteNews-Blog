import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, cloneElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  activeClassName: string
}

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  /* basicamente retorna o roota da pagina em tempo real */
  const { asPath } = useRouter()
  const className = asPath === rest.href ? activeClassName : ''

  return (
    <Link {...rest}>
      {/*  clone element serve para passar os valores de uma propriedade
      pai para a filha, nesse caso tem q estilizar o A, nao o link, entao
      clona o A e joga a estilizacao nele */}
      {cloneElement(children, {
        className,
      })}
    </Link>
  )
}
