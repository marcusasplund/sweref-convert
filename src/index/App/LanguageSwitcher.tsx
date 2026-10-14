import { createSignal, onCleanup } from 'solid-js'
import { useTransContext } from '@jellybrick/solid-i18next'
import { IconButton } from '@suid/material'
import { Languages } from 'lucide-solid'

export default function LanguageSwitcher () {
  const [, { changeLanguage, getI18next }] = useTransContext()
  const instance = getI18next()
  const [language, setLanguage] = createSignal(instance.language)
  instance.on('languageChanged', setLanguage)
  onCleanup(() => instance.off('languageChanged', setLanguage))
  const isEnglish = () => language().startsWith('en')
  const nextLabel = () => isEnglish() ? 'Svenska' : 'English'

  return (
    <IconButton
      color='inherit'
      size='large'
      aria-label={nextLabel()}
      title={nextLabel()}
      onClick={() => { void changeLanguage(isEnglish() ? 'sv' : 'en') }}
    >
      <Languages aria-hidden='true' />
    </IconButton>
  )
}
