import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@solidjs/testing-library'
import InfoDialog from './InfoDialog'

vi.mock('@suid/material/Portal', () => ({
  default: (props: { children: any }) => props.children
}))

afterEach(() => {
  cleanup()
})

describe('<InfoDialog />', () => {
  it('does not render when open is false', () => {
    render(() => <InfoDialog open={() => false} onClose={() => {}} />)
    expect(screen.queryByText('Hjälp')).toBeNull()
  })

  it('renders when open is true and shows expected content', () => {
    render(() => <InfoDialog open={() => true} onClose={() => {}} />)
    expect(screen.getByText('Hjälp')).toBeDefined()
    expect(screen.getByText(/Exempeldata/)).toBeDefined()
    expect(screen.getByText('Stäng', { selector: 'button' })).toBeDefined()
  })

  it('calls onClose when "Stäng" button is clicked', async () => {
    const onClose = vi.fn()
    render(() => <InfoDialog open={() => true} onClose={onClose} />)
    const button = screen.getByText('Stäng', { selector: 'button' })
    await fireEvent.click(button)
    expect(onClose).toHaveBeenCalledOnce()
  })
})
