import { fireEvent, render, screen } from '@testing-library/react'
import { SubscribeButton } from '.'
import { signIn } from 'next-auth/react'
import push from 'next/router'

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return [null, false]
    },
    signIn: jest.fn(),
  }
})

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    },
    push: jest.fn(),
  }
})

describe('SubscribeButton component tests', () => {
  it('SubscribeButton renders correctly', () => {
    const { getByText } = render(<SubscribeButton />)

    expect(getByText('Subscribe Now')).toBeInTheDocument()
  })

  it('redirects user to signIn when not authenticated', () => {
    render(<SubscribeButton />)

    /* Disparando evento para simular click do usuario no botao de signIn */
    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    const signInMocked = jest.mocked(signIn)
    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirect user to posts when has a active subscription', () => {
    const pushMocked = jest.mocked(push)

    render(<SubscribeButton />)

    /* Disparando evento para simular click do usuario no botao de signIn */
    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalled()
  })
})
