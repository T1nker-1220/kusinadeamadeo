import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies default variant styles correctly', () => {
    render(<Button>Default Button</Button>)
    const button = screen.getByRole('button')
    // Check for base classes
    expect(button.className).toContain('inline-flex')
    expect(button.className).toContain('items-center')
    expect(button.className).toContain('justify-center')
    // Check for default variant classes
    expect(button.className).toContain('bg-brand-orange')
    expect(button.className).toContain('text-white')
  })

  it('disables the button when loading', () => {
    render(<Button disabled>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('disabled')
  })
}) 