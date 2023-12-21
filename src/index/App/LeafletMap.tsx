import { JSX } from 'solid-js'
import { SolidLeafletMap } from 'solidjs-leaflet'
import { ConvertedRow } from '../types'

interface LeafletMapProps {
  rows: () => ConvertedRow[]
}

export function LeafletMap (props: LeafletMapProps): JSX.Element {
  const { rows } = props
  const center: [number, number] = [rows()[0].lat, rows()[0].lng]
  return (
    <SolidLeafletMap
      center={center}
      width='100%'
      height='300px'
      id='map'
      zoom={10}
      onMapReady={(l, m) => {
        const mapIcon = l.divIcon({ className: 'map-icon' })
        rows().slice(0, 100).map((location: ConvertedRow) => {
          return l.marker([location.lat, location.lng], { icon: mapIcon })
            .addTo(m)
            .bindPopup(`${location.lat}, ${location.lng}`)
        })
      }}
    />
  )
};
