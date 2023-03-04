import { render, screen } from '@testing-library/react'
import Home, { getStaticProps } from '../../pages'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { stripe } from '../../services/stripe'

jest.mock('next-auth/react')
jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    },
  }
})
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

jest.mock('../../services/stripe')

describe('Home Page', () => {
  it('renders correctly', () => {
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

    render(<Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }} />)

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
  })
  it('loads initial data', async () => {
    const retrievePriceStripeMocked = jest.mocked(stripe.prices.retrieve)
    retrievePriceStripeMocked.mockResolvedValueOnce({
      id: 'fake-price',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})
    console.log(response)
    expect(response).toEqual(
      expect.objectContaining({
        props: { product: { priceId: 'fake-price', amount: '$10.00' } },
      }),
    )
  })
})
