import { SolidLeafletMap } from 'solidjs-leaflet'
import { JSX } from 'solid-js'
// note the markerIcon lines: to address known issue (with webpack?) where Leaflet won't
// be able to find the marker icon in production
// https://stackoverflow.com/questions/60174040/marker-icon-isnt-showing-in-leaflet
import markerIcon from '../node_modules/leaflet/dist/images/marker-icon.png'
import { ConvertedRow } from './App'

interface Props {
  rows: () => ConvertedRow[]
}

export function LeafletMap (props: Props): JSX.Element {
  const { rows } = props
  const center: [number, number] = [+rows()[0].lat, +rows()[0].lng]
  return (
    <SolidLeafletMap
      center={center}
      width='100%'
      height='300px'
      id='map'
      zoom={10}
      onMapReady={(l, m) => {
        l.Marker.prototype.setIcon(l.icon({
          iconUrl: markerIcon
        }))
        rows().map((location: any) => {
          return l.marker([location.lat, location.lng]).addTo(m)
        })
      }}
    />
  )
};
