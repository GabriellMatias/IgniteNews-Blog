import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/react')

const posts = [
  {
    slug: 'my new Post',
    title: 'my new post',
    excerpt: 'Post excerpt',
    updatedAt: 'march 10, 2021',
    resume: 'resumee',
  },
]

jest.mock('../../services/prismic')

describe('Posts Page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: 'loading' })

    render(<Posts post={posts} />)

    expect(screen.getByText('my new post')).toBeInTheDocument()
  })
  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [{ type: 'heading', text: 'My New Post' }],
              content: [
                {
                  type: 'paragraph',
                  text: 'Post Excerpt',
                },
              ],
            },
            last_publication_date: '04-01-2021',
          },
        ],
      }),
    } as any)

    const response = await getStaticProps({})
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: [
            {
              slug: 'my-new-post',
              title: 'My New Post',
              resume: 'Post Excerpt',
              updatedAt: '01 de abril de 2021',
            },
          ],
        },
      }),
    )
  })
})
