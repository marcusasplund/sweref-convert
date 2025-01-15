import { JSX } from 'solid-js';
import { SolidLeafletMap } from 'solidjs-leaflet';
import { ConvertedRow } from '../types';

interface LeafletMapProps {
    rows: () => ConvertedRow[];
    center?: [number, number];
    zoom?: number;
    limit?: number;
}

export function LeafletMap(props: LeafletMapProps): JSX.Element {
    const { rows } = props;
    const center: [number, number] =
        props.center ?? (rows().length ? [rows()[0].lat, rows()[0].lng] : [0, 0]);
    const zoom = props.zoom ?? 10;
    const limit = props.limit ?? 100;

    return (
        <SolidLeafletMap
            center={center}
            width="100%"
            height="300px"
            id="map"
            zoom={zoom}
            onMapReady={(l, m) => {
                const mapIcon = l.divIcon({ className: 'map-icon' });
                rows()
                    .slice(0, limit)
                    .forEach((location: ConvertedRow) => {
                        l.marker([location.lat, location.lng], { icon: mapIcon })
                            .addTo(m)
                            .bindPopup(`${location.lat}, ${location.lng}`);
                    });
            }}
        />
    );
}
