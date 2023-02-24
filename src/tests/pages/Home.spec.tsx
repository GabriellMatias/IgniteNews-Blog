import { render, screen } from '@testing-library/react'
import Home from '../../pages'

describe('Home Page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: 10 }} />)
  })
})
