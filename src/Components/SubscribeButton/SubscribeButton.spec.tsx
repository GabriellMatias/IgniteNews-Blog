import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SubscribeButton } from '.'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

jest.mock('next-auth/react')

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

describe('SubscribeButton component tests', () => {
  it('SubscribeButton renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: 'loading' })

    const { getByText } = render(<SubscribeButton />)

    expect(getByText('Subscribe Now')).toBeInTheDocument()
  })

  it('redirect user to signIn when not authenticated', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({ data: null, status: 'loading' })

    const signInMocked = jest.mocked(signIn)

    render(<SubscribeButton />)

    /* Melhor utilizar o getbyRole sempre
     */
    const subscribeButton = screen.getByRole('button', {
      name: 'Subscribe Now',
    })

    fireEvent.click(subscribeButton)

    waitFor(() => expect(signInMocked).toHaveBeenCalled(), {
      timeout: 2000,
    })
  })

  it('redirect user to posts when has a active subscription', () => {
    const useRouterMocked = jest.mocked(useRouter)
    const useSessionMocked = jest.mocked(useSession)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'john.doe@exemple.com',
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires',
      },
    } as any)
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    render(<SubscribeButton />)

    /* Disparando evento para simular click do usuario no botao de signIn */
    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalled()
  })
})
