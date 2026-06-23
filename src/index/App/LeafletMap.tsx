import { JSX } from 'solid-js'
import { SolidLeafletMap } from 'solidjs-leaflet'
import { ConvertedRow } from '../types'

interface LeafletMapProps {
  rows: () => ConvertedRow[]
  center?: [number, number]
  zoom?: number
  limit?: number
}

export function LeafletMap (props: LeafletMapProps): JSX.Element {
  const { rows } = props
  const center: [number, number] =
        props.center ?? ((rows().length > 0) ? [rows()[0].lat, rows()[0].lng] : [0, 0])
  const zoom = props.zoom ?? 10
  const limit = props.limit ?? 100

  return (
    <SolidLeafletMap
      center={center}
      width='100%'
      height='300px'
      id='map'
      zoom={zoom}
      onMapReady={(l, m) => {
        const mapIcon = l.divIcon({
          className: '',
          html: '<span style="display:block;width:1rem;height:1rem;border-radius:999px;background:#1d4ed8;border:3px solid rgba(255,255,255,0.95);box-shadow:0 0 0 4px rgba(29,78,216,0.15)"></span>'
        })
        rows()
          .slice(0, limit)
          .forEach((location: ConvertedRow) => {
            l.marker([location.lat, location.lng], { icon: mapIcon })
              .addTo(m)
              .bindPopup(`${location.lat}, ${location.lng}`)
          })
      }}
    />
  )
}
