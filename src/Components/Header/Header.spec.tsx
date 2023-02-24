import { render, screen } from '@testing-library/react'
import { Header } from '.'
/* NESSE TESTE UTILIZEI SCREEN PARA LIMPAR MAIS A TELA E NAO NECESSITAR DE 
DESESTRUTURACAO */
jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    },
  }
})
/* Fazendo um retorno ficticio para as funcoes que so funcionam com o codigo rodando
 */
jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return [null, false]
    },
  }
})

describe('Header component tests', () => {
  it('Header Component renders correctly', () => {
    render(<Header></Header>)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })
})
