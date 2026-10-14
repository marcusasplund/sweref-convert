import { vi } from 'vitest'

vi.mock('solidjs-leaflet', () => ({
  SolidLeafletMap: (props: { id?: string }) => (
    <div
      data-testid='solid-leaflet-map'
      id={props.id}
    />
  )
}))