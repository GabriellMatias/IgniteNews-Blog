import { render, screen } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

const post = {
  slug: 'my new Post',
  title: 'my new post',
  content: '<p>Post excerpt</p>',
  updatedAt: 'march 10, 2021',
  resume: 'resumee',
}

describe('Post Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: 'loading' })

    render(<Post post={post} />)

    expect(screen.getByText('my new post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
  })
  it('it redirects user when no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession)
    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: { slug: 'my new Post' },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: `/posts/preview/my new Post`,
        }),
      }),
    )
  })
  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession)
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-subscription',
    } as any)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockReturnValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My New Post' }],
          content: [
            {
              type: 'paragraph',
              text: 'Post Excerpt',
            },
          ],
        },
        last_publication_date: '2021-03-10',
      }),
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'my new Post' },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my new Post',
            title: 'My New Post',
            content: '<p>Post Excerpt</p>',
            updatedAt: '09 de março de 2021',
          },
        },
      }),
    )
  })
})
