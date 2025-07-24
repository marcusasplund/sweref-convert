import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@solidjs/testing-library'
import TopBar from './TopBar'

describe('<TopBar />', () => {
  it('alerts when share fails', async () => {
    const shareError = new Error('fail')
    const mockShare = vi.fn().mockRejectedValue(shareError)

    // Mock global.navigator
    Object.defineProperty(global, 'navigator', {
      value: { share: mockShare },
      configurable: true
    })

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(() => <TopBar handleClickOpen={() => {}} />)

    const shareBtn = await screen.findByRole('button', { name: /share/i })
    await fireEvent.click(shareBtn)

    expect(mockShare).toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalledWith(
      'Sharing failed. Please try again or check your browser support.'
    )
  })
})
