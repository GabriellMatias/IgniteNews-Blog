// import { render, screen } from '@testing-library/react'
// import Home from '../../pages'
// import { useRouter } from 'next/router'
// import { useSession } from 'next-auth/react'

// jest.mock('next-auth/react')
// jest.mock('next/router', () => {
//   return {
//     useRouter() {
//       return {
//         asPath: '/',
//       }
//     },
//   }
// })
// jest.mock('next/router', () => ({
//   useRouter: jest.fn().mockReturnValue({
//     push: jest.fn(),
//   }),
// }))
// describe('Home Page', () => {
//   it('renders correctly', () => {
//     const useRouterMocked = jest.mocked(useRouter)
//     const useSessionMocked = jest.mocked(useSession)
//     const pushMocked = jest.fn()
//     useSessionMocked.mockReturnValueOnce({
//       data: {
//         user: {
//           name: 'John Doe',
//           email: 'john.doe@exemple.com',
//         },
//         activeSubscription: 'fake-active-subscription',
//         expires: 'fake-expires',
//       },
//     } as any)
//     useRouterMocked.mockReturnValueOnce({
//       push: pushMocked,
//     } as any)

//     render(<Home product={{ priceId: 'fake-price-id', amount: 'R$ 10,00' }} />)

//     expect(screen.getByText(/R\\$ 10,00/i)).toBeInTheDocument()
//   })
// })
