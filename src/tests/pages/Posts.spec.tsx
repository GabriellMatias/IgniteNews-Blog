import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { stripe } from '../../services/stripe'

const posts = [
  {
    slug: 'my new Post',
    title: 'my new post',
    excerpt: 'Post excerpt',
    updatedAt: 'march 10, 2021',
    resume: 'resumee',
  },
]

describe('Posts Page', () => {
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

    render(<Posts post={posts} />)

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
  })
  // it('loads initial data', async () => {
  //   const retrievePriceStripeMocked = jest.mocked(stripe.prices.retrieve)
  //   retrievePriceStripeMocked.mockResolvedValueOnce({
  //     id: 'fake-price',
  //     unit_amount: 1000,
  //   } as any)

  //   const response = await getStaticProps({})
  //   console.log(response)
  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: { product: { priceId: 'fake-price', amount: '$10.00' } },
  //     }),
  //   )
  // })
})
