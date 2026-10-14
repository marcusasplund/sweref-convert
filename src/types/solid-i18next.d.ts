declare module "@jellybrick/solid-i18next" {
  import type { JSX } from "solid-js"
  import type { i18n, TFunction } from "i18next"

  export function TransProvider(props: {
    instance?: i18n
    lng?: string
    children: JSX.Element
  }): JSX.Element

  export function useTransContext(): [
    t: TFunction,
    actions: {
      changeLanguage: (lng: string) => Promise<TFunction>
      getI18next: () => i18n
    },
  ]

  export function Trans(props: {
    key: string
    options?: Record<string, unknown>
    children?: JSX.Element
  }): JSX.Element
}
