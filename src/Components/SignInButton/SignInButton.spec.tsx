import { render, screen } from '@testing-library/react'
import { SignInButton } from '.'
import { useSession } from 'next-auth/react'

/* Fazendo um retorno ficticio para as funcoes que so funcionam com o codigo rodando
 */
jest.mock('next-auth/react')

describe('SignInButton component tests', () => {
  it('SignInButton Component renders correctly when user is not logged', () => {
    const useSessionMocked = jest.mocked(useSession)
    /** vai mockar apenas o proximo retorno dessa funcao com esses valores
     * pois aqui eu quero que o mock seja nulo, mas no outro teste espero
     * que venha algo diferente de nulo
     */

    useSessionMocked.mockReturnValueOnce({ data: null, status: 'loading' })

    render(<SignInButton />)

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it('SignInButton Component renders correctly when user is logged in', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'Jhon Doe',
          email: 'jhon.doe@example.com',
        },
        expires: 'fake-expires',
      },
      status: 'authenticated',
    })
    render(<SignInButton />)

    expect(screen.getByText('Jhon Doe')).toBeInTheDocument()
  })
})
