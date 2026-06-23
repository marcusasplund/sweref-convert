import { vi } from 'vitest'

vi.mock('solidjs-leaflet', () => ({
  SolidLeafletMap: (props: Record<string, any>) => (
    <div
      data-testid='solid-leaflet-map'
      id={props.id}
    />
  )
}))