import { render as solidRender } from '@solidjs/testing-library'
import { TransProvider } from '@jellybrick/solid-i18next'
import type { JSX } from 'solid-js'
import i18next from './i18n'

export const render = (component: () => JSX.Element) => solidRender(() => (
  <TransProvider instance={i18next} lng='sv'>
    {component()}
  </TransProvider>
))
