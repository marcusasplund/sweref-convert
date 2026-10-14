import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, screen, waitFor } from '@solidjs/testing-library'
import { render } from './test-render'
import i18next, { createTranslations } from './i18n'
import App from './index/App'
import sv from './locales/sv.json'
import en from './locales/en.json'

afterEach(async () => {
  cleanup()
  vi.restoreAllMocks()
  window.history.replaceState({}, '', '/')
  await i18next.changeLanguage('sv')
  localStorage.removeItem('i18nextLng')
})

describe('translations', () => {
  it('provides every translation in both languages', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(sv).sort())
    expect(Object.values(en).every(value => value.length > 0)).toBe(true)
  })

  it('detects and remembers language, with URL precedence', () => {
    localStorage.setItem('i18nextLng', 'en')
    expect(createTranslations().resolvedLanguage).toBe('en')
    window.history.replaceState({}, '', '/?lng=sv')
    expect(createTranslations().resolvedLanguage).toBe('sv')
    expect(localStorage.getItem('i18nextLng')).toBe('sv')
  })

  it('falls back to Swedish for an unsupported language and tolerates blocked storage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    window.history.replaceState({}, '', '/?lng=fr')
    const instance = createTranslations()
    await instance.changeLanguage('fr')
    expect(instance.resolvedLanguage).toBe('sv')
    await instance.changeLanguage('en')
    expect(instance.t('help')).toBe('Help')
  })

  it('switches the conversion screen and help dialog without losing input or results', async () => {
    render(() => <App />)
    const input = screen.getByLabelText('Klistra in koordinater i två kolumner')
    fireEvent.input(input, { target: { value: 'x,y\n6373105,1316400' } })
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(2))
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    await screen.findByText('Convert between SWEREF99, RT90, and WGS84')
    expect(screen.getByLabelText('Paste coordinates in two columns')).toHaveValue('x,y\n6373105,1316400')
    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(screen.getByText('1 row loaded')).toBeDefined()
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('SWEREF RT90 Converter')
    expect(localStorage.getItem('i18nextLng')).toBe('en')
    fireEvent.click(screen.getByRole('button', { name: 'Help' }))
    expect(await screen.findByText('Example data for RT90')).toBeDefined()
    fireEvent.click(screen.getByText('Close', { selector: 'button' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Svenska' }))
    expect(await screen.findByText('Konvertera mellan SWEREF99, RT90 och WGS84')).toBeDefined()
    expect(document.documentElement.lang).toBe('sv')
  })
})
