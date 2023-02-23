import { render } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    },
  }
})

describe('ActiveLink component tests', () => {
  it('active link renders correctly', () => {
    const { debug } = render(
      <ActiveLink href={'/'} activeClassName="active">
        <span>Home</span>
      </ActiveLink>,
    )

    /* debuga e faz um console log de como o componente ficaria na tela */
    debug()
  })

  it('active link renders with correctly child', () => {
    const { getByText } = render(
      <ActiveLink href={'/'} activeClassName="active">
        <span>Home</span>
      </ActiveLink>,
    )

    expect(getByText('Home')).toBeInTheDocument()

  })

  it('active link is recivieng the correctly class', () => {
    const { getByText } = render(
      <ActiveLink href={'/'} activeClassName="active">
        <span>Home</span>
      </ActiveLink>,
    )

    expect(getByText('Home')).toHaveClass('active')

  })
})
